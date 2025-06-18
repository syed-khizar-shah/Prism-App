const mongoose = require('mongoose');
const URL = "mongodb+srv://abdullahazambusiness:dzb7Dam6vfDMA4j7@cluster0.hrdfabx.mongodb.net/optixapp?retryWrites=true&w=majority&appName=Cluster0"
async function migrateCoatingToCoatings() {
    try {
    // Connect to your database
    await mongoose.connect(URL);
    console.log('Connected to database');
    
    // Rename the field from 'coating' to 'coatings' for all documents
    const result = await mongoose.connection.db.collection('designs').updateMany(
      { coating: { $exists: true } }, // Only update documents that have the 'coating' field
      { $rename: { coating: 'coatings' } }
    );
    
    console.log(`Migration completed. Modified ${result.modifiedCount} documents.`);
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the migration
migrateCoatingToCoatings();