// scripts/migratePaymentsToTransactions.js
//
// Converts legacy order documents with a single payment object
// ({ method, amount, transactionId, paymentDate, notes })
// into the new transaction-ledger shape:
// { transactions: [...], amountPaid, balanceDue, paymentStatus }
//
// Usage:
//   node scripts/migratePaymentsToTransactions.js            # runs the migration
//   node scripts/migratePaymentsToTransactions.js --dry-run  # logs what would change, no writes

require('dotenv').config();
const mongoose = require('mongoose');

const DRY_RUN = process.argv.includes('--dry-run');

async function migrate() {
  await mongoose.connect(process.env.MONGODB_URL);
  console.log(`Connected. Mode: ${DRY_RUN ? 'DRY RUN (no writes)' : 'LIVE'}`);

  // Work directly against the raw collection to inspect documents
  // exactly as stored, without Mongoose casting old shapes through
  // the current (new) schema before we've decided how to convert them.
  const collection = mongoose.connection.collection('orders');

  const cursor = collection.find({
    // Only touch documents that don't already have a transactions array.
    'payment.transactions': { $exists: false }
  });

  let scanned = 0;
  let migrated = 0;
  let skippedNoPayment = 0;
  let skippedNoAmount = 0;
  let failed = 0;

  for await (const doc of cursor) {
    scanned++;
    const legacy = doc.payment;
    const total = doc.pricing?.totalPrice || 0;

    if (!legacy) {
      console.warn(`[SKIP] Order ${doc.orderId || doc._id} — no payment field at all`);
      skippedNoPayment++;
      continue;
    }

    if (typeof legacy.amount !== 'number') {
      console.warn(`[SKIP] Order ${doc.orderId || doc._id} — legacy payment.amount is not a number:`, legacy.amount);
      skippedNoAmount++;
      continue;
    }

    // Legacy orders were always paid in a single transaction. Label it
    // 'full' if it covered the total, otherwise 'partial' (we can't know
    // whether it was intended as a deposit, so 'partial' is the honest
    // catch-all rather than guessing 'deposit').
    const inferredType = legacy.amount >= total ? 'full' : 'partial';

    const newPayment = {
      transactions: [
        {
          _id: new mongoose.Types.ObjectId(),
          type: inferredType,
          method: legacy.method || 'Other',
          amount: legacy.amount,
          transactionId: legacy.transactionId,
          paymentDate: legacy.paymentDate || doc.orderDate || doc.createdAt || new Date(),
          notes: legacy.notes
        }
      ],
      amountPaid: legacy.amount,
      balanceDue: Math.max(total - legacy.amount, 0),
      paymentStatus: legacy.amount >= total ? 'paid' : 'partially_paid',
      balanceDueDate: undefined
    };

    console.log(
      `[${DRY_RUN ? 'DRY' : 'MIGRATE'}] Order ${doc.orderId || doc._id}: ` +
      `£${legacy.amount} / £${total} -> type=${inferredType}, status=${newPayment.paymentStatus}`
    );

    if (!DRY_RUN) {
      try {
        await collection.updateOne(
          { _id: doc._id },
          { $set: { payment: newPayment } }
        );
        migrated++;
      } catch (err) {
        console.error(`[FAIL] Order ${doc.orderId || doc._id}:`, err.message);
        failed++;
      }
    } else {
      migrated++; // counted as "would migrate"
    }
  }

  console.log('\n--- Migration summary ---');
  console.log(`Scanned:              ${scanned}`);
  console.log(`Migrated:              ${migrated}${DRY_RUN ? ' (dry run, no writes)' : ''}`);
  console.log(`Skipped (no payment):  ${skippedNoPayment}`);
  console.log(`Skipped (bad amount):  ${skippedNoAmount}`);
  console.log(`Failed:                ${failed}`);

  await mongoose.disconnect();
}

migrate().catch(err => {
  console.error('Migration crashed:', err);
  process.exit(1);
});