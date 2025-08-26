const PDFDocument = require('pdfkit');

class ProfessionalPDFService {
  constructor() {
    // =================
    // DESIGN SYSTEM
    // =================
    this.designSystem = {
      // Professional black and white color palette
      colors: {
        primary: '#000000',        // Pure black
        primaryLight: '#333333',   // Dark gray
        secondary: '#666666',      // Medium gray
        accent: '#000000',         // Black accent
        success: '#000000',        // Black for consistency
        warning: '#000000',        // Black for consistency
        error: '#000000',          // Black for consistency
        text: {
          primary: '#000000',      // Pure black text
          secondary: '#333333',    // Dark gray
          light: '#666666',        // Medium gray
          inverse: '#ffffff'       // White text
        },
        background: {
          primary: '#ffffff',      // Pure white
          secondary: '#f8f9fa',    // Very light gray
          accent: '#f1f3f4',       // Light gray
          border: '#000000'        // Black borders
        }
      },

      // Professional typography system
      typography: {
        fonts: {
          primary: 'Times-Roman',
          bold: 'Times-Bold',
          italic: 'Times-Italic',
          boldItalic: 'Times-BoldItalic'
        },
        sizes: {
          h1: 24,      // Main title
          h2: 18,      // Section headers
          h3: 14,      // Subsection headers
          h4: 12,      // Small headers
          body: 10,    // Regular text
          small: 8,    // Small text
          tiny: 7      // Very small text
        },
        lineHeights: {
          tight: 1.2,
          normal: 1.4,
          loose: 1.6
        }
      },

      // Layout system - all measurements in points
      layout: {
        page: {
          margin: 40,
          width: 595.28,  // A4 width
          height: 841.89, // A4 height
          contentWidth: 515.28 // width - (margin * 2)
        },
        sections: {
          header: {
            height: 120,
            padding: 20,
            marginBottom: 30
          },
          info: {
            height: 90,
            marginBottom: 25,
            boxPadding: 10,
            columnGap: 20
          },
          table: {
            headerHeight: 35,
            rowPadding: 12,
            minRowHeight: 40,
            marginBottom: 25,
            columnWidths: {
              item: 60,      // Item number column
              description: 320, // Description column
              price: 80      // Price column
            }
          },
          totals: {
            width: 200,
            rowHeight: 20,
            padding: 15,
            marginBottom: 30
          },
          footer: {
            height: 100,
            marginTop: 40
          }
        },
        spacing: {
          xs: 4,
          sm: 8,
          md: 12,
          lg: 20,
          xl: 30
        }
      }
    };

    // Page tracking for multi-page documents
    this.pageState = {
      currentY: 0,
      pageNumber: 1,
      availableHeight: 0
    };
  }

  // =================
  // MAIN GENERATION METHOD
  // =================
  async generateReceiptBuffer(orderData) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({
          size: 'A4',
          margin: this.designSystem.layout.page.margin,
          info: {
            Title: `Receipt - ${orderData.orderId}`,
            Author: '2020 OPTIX',
            Subject: 'Purchase Receipt',
            CreationDate: new Date()
          }
        });

        const chunks = [];
        doc.on('data', chunk => chunks.push(chunk));
        doc.on('end', () => {
          const buffer = Buffer.concat(chunks);
          resolve(buffer);
        });
        doc.on('error', reject);

        // Initialize page state
        this.initializePageState(doc);

        // Build document sections with proper spacing
        this.buildDocument(doc, orderData);

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  // =================
  // PAGE MANAGEMENT
  // =================
  initializePageState(doc) {
    const layout = this.designSystem.layout.page;
    this.pageState = {
      currentY: layout.margin,
      pageNumber: 1,
      availableHeight: layout.height - (layout.margin * 2),
      doc: doc
    };
  }

  checkPageBreak(requiredHeight, addMargin = true) {
    const { doc } = this.pageState;
    const margin = addMargin ? this.designSystem.layout.spacing.xl : 0;
    const totalRequired = requiredHeight + margin;

    if (this.pageState.currentY + totalRequired > doc.page.height - this.designSystem.layout.page.margin) {
      this.addNewPage();
      return true;
    }
    return false;
  }

  addNewPage() {
    const { doc } = this.pageState;
    doc.addPage();
    this.pageState.currentY = this.designSystem.layout.page.margin;
    this.pageState.pageNumber++;
  }

  moveY(distance) {
    this.pageState.currentY += distance;
    return this.pageState.currentY;
  }

  // =================
  // DOCUMENT BUILDER
  // =================
  buildDocument(doc, orderData) {
    // Header section
    this.pageState.currentY = this.renderHeader(doc, orderData, this.pageState.currentY);
    this.moveY(this.designSystem.layout.sections.header.marginBottom);

    // Info section (customer + order details)
    this.pageState.currentY = this.renderInfoSection(doc, orderData, this.pageState.currentY);
    this.moveY(this.designSystem.layout.sections.info.marginBottom);

    // Items table
    this.pageState.currentY = this.renderItemsTable(doc, orderData, this.pageState.currentY);
    
    // Add extra spacing between table and totals to prevent overlap
    this.moveY(this.designSystem.layout.spacing.xl);

    // Totals section
    this.pageState.currentY = this.renderTotalsSection(doc, orderData, this.pageState.currentY);
    this.moveY(this.designSystem.layout.sections.totals.marginBottom);

    // Footer
    this.renderFooter(doc, orderData, this.pageState.currentY);
  }

  // =================
  // HEADER SECTION
  // =================
  renderHeader(doc, orderData, startY) {
    const { colors, typography, layout } = this.designSystem;
    const headerConfig = layout.sections.header;
    const pageWidth = layout.page.contentWidth;

    // Check if header fits on current page
    this.checkPageBreak(headerConfig.height);
    const actualY = this.pageState.currentY;

    // Clean header with border instead of background
    doc.rect(layout.page.margin, actualY, pageWidth, headerConfig.height)
      .stroke(colors.background.border)
      .lineWidth(2);

    // Company branding
    const brandingX = layout.page.margin + headerConfig.padding;
    const brandingY = actualY + headerConfig.padding;

    doc.fillColor(colors.text.primary)
      .fontSize(typography.sizes.h1)
      .font(typography.fonts.bold)
      .text('2020 OPTIX', brandingX, brandingY);

    doc.fontSize(typography.sizes.body)
      .font(typography.fonts.primary)
      .text('Professional Eyewear Solutions', brandingX, brandingY + 32);

    // doc.fontSize(typography.sizes.small)
    //   .text('Quality Vision Care Since 2020', brandingX, brandingY + 48);

    // Receipt info box
    const receiptBoxWidth = 140;
    const receiptBoxX = layout.page.margin + pageWidth - receiptBoxWidth - headerConfig.padding;
    const receiptBoxHeight = headerConfig.height - (headerConfig.padding * 2);

    doc.rect(receiptBoxX, brandingY, receiptBoxWidth, receiptBoxHeight)
      .stroke(colors.background.border)
      .lineWidth(1);

    // Receipt details
    const receiptContentX = receiptBoxX + 15;
    let receiptY = brandingY + 10;

    doc.fillColor(colors.primary)
      .fontSize(typography.sizes.h4)
      .font(typography.fonts.bold)
      .text('RECEIPT', receiptContentX, receiptY, {
        width: receiptBoxWidth - 30,
        align: 'center'
      });

    receiptY += 25;
    doc.fontSize(typography.sizes.small)
      .font(typography.fonts.primary)
      .fillColor(colors.text.secondary);

    // Order details in receipt box
    const receiptDetails = [
      { label: 'Order ID:', value: orderData.orderId },
      { label: 'Date:', value: new Date(orderData.orderDate).toLocaleDateString() },
      { label: 'Time:', value: new Date(orderData.orderDate).toLocaleTimeString() }
    ];

    receiptDetails.forEach((detail, index) => {
      doc.text(detail.label, receiptContentX, receiptY, { width: 50 })
        .text(detail.value, receiptContentX + 50, receiptY, { width: receiptBoxWidth - 80 });
      receiptY += 14;
    });

    return actualY + headerConfig.height;
  }

  // =================
  // INFO SECTION
  // =================
  renderInfoSection(doc, orderData, startY) {
    const { colors, typography, layout } = this.designSystem;
    const infoConfig = layout.sections.info;

    this.checkPageBreak(infoConfig.height);
    const actualY = this.pageState.currentY;

    const columnWidth = (layout.page.contentWidth - infoConfig.columnGap) / 2;
    const leftColumnX = layout.page.margin;
    const rightColumnX = leftColumnX + columnWidth + infoConfig.columnGap;

    // Customer Information Box
    this.renderInfoBox(doc, {
      x: leftColumnX,
      y: actualY,
      width: columnWidth,
      height: infoConfig.height,
      title: 'CUSTOMER INFORMATION',
      content: this.formatCustomerInfo(orderData.customer)
    });

    // Order Details Box
    this.renderInfoBox(doc, {
      x: rightColumnX,
      y: actualY,
      width: columnWidth,
      height: infoConfig.height,
      title: 'ORDER DETAILS',
      content: this.formatOrderInfo(orderData)
    });

    return actualY + infoConfig.height;
  }

  renderInfoBox(doc, config) {
    const { colors, typography, layout } = this.designSystem;
    const padding = layout.sections.info.boxPadding;

    // Box border
    doc.rect(config.x, config.y, config.width, config.height)
      .stroke(colors.background.border);

    // Clean header with border
    const headerHeight = 28;
    doc.rect(config.x, config.y, config.width, headerHeight)
      .stroke(colors.background.border)
      .lineWidth(1);

    // Title
    doc.fillColor(colors.primary)
      .fontSize(typography.sizes.h4)
      .font(typography.fonts.bold)
      .text(config.title, config.x + padding, config.y + 8);

    // Content
    let contentY = config.y + headerHeight + padding;
    doc.fillColor(colors.text.primary)
      .fontSize(typography.sizes.small)
      .font(typography.fonts.primary);

    config.content.forEach(line => {
      if (line.label && line.value) {
        doc.font(typography.fonts.primary)
          .text(`${line.label}`, config.x + padding, contentY);

        doc.font(typography.fonts.primary)
          .text(line.value, config.x + padding + 60, contentY, {
            width: config.width - padding - 80
          });
      } else if (line.text) {
        doc.text(line.text, config.x + padding, contentY, {
          width: config.width - (padding * 2)
        });
      }
      contentY += line.height || 14;
    });
  }

  formatCustomerInfo(customer) {
    const info = [];

    if (customer.name) info.push({ label: 'Name:', value: customer.name });
    if (customer.email) info.push({ label: 'Email:', value: customer.email });
    if (customer.phone) info.push({ label: 'Phone:', value: customer.phone });

    if (customer.address) {
      const addressParts = [
        customer.address.street,
        customer.address.city,
        customer.address.postalCode,
        customer.address.country
      ].filter(Boolean);

      if (addressParts.length > 0) {
        info.push({
          label: 'Address:',
          value: addressParts.join(', '),
          height: 20 // Extra height for potentially long address
        });
      }
    }

    return info;
  }

  formatOrderInfo(orderData) {
    const info = [
      { label: 'Payment:', value: orderData.payment.method },
      { label: 'Status:', value: orderData.status.toUpperCase() }
    ];

    // Add additional order details if available
    if (orderData.deliveryMethod) {
      info.push({ label: 'Delivery:', value: orderData.deliveryMethod });
    }

    if (orderData.estimatedDelivery) {
      info.push({
        label: 'Est. Delivery:',
        value: new Date(orderData.estimatedDelivery).toLocaleDateString()
      });
    }

    return info;
  }

  // =================
  // ITEMS TABLE
  // =================
  renderItemsTable(doc, orderData, startY) {
    const { colors, typography, layout } = this.designSystem;
    const tableConfig = layout.sections.table;

    // Calculate minimum required height for table header
    this.checkPageBreak(tableConfig.headerHeight + 50); // Header + at least one row
    let currentY = this.pageState.currentY;

    // Table header
    currentY = this.renderTableHeader(doc, currentY);

    // Table rows
    orderData.selections.forEach((selection, index) => {
      const rowHeight = this.calculateRowHeight(doc, selection);

      // Check if row fits on current page
      if (this.checkPageBreak(rowHeight, false)) {
        currentY = this.pageState.currentY;
        // Re-render header on new page
        currentY = this.renderTableHeader(doc, currentY);
      }

      currentY = this.renderTableRow(doc, selection, index, currentY, rowHeight);
    });

    // Table border
    const tableHeight = currentY - this.pageState.currentY + tableConfig.headerHeight;
    doc.rect(layout.page.margin, this.pageState.currentY, layout.page.contentWidth, tableHeight)
      .stroke(colors.background.border);

    // Add some bottom padding to the table
    const finalY = currentY + this.designSystem.layout.spacing.md;
    return finalY;
  }

  renderTableHeader(doc, startY) {
    const { colors, typography, layout } = this.designSystem;
    const tableConfig = layout.sections.table;
    const headerHeight = tableConfig.headerHeight;

    // Clean header with border
    doc.rect(layout.page.margin, startY, layout.page.contentWidth, headerHeight)
      .stroke(colors.background.border)
      .lineWidth(1);

    // Column headers
    const itemX = layout.page.margin + 15;
    const descX = itemX + tableConfig.columnWidths.item;
    const priceX = layout.page.margin + layout.page.contentWidth - tableConfig.columnWidths.price;

    doc.fillColor(colors.text.primary)
      .fontSize(typography.sizes.h4)
      .font(typography.fonts.bold)
      .text('ITEM', itemX, startY + 12)
      .text('DESCRIPTION', descX, startY + 12)
      .text('PRICE', priceX, startY + 12);

    return startY + headerHeight;
  }

  renderTableRow(doc, selection, index, startY, rowHeight) {
    const { colors, typography, layout } = this.designSystem;
    const tableConfig = layout.sections.table;

    // Alternating row background
    const bgColor = colors.background.primary
    doc.rect(layout.page.margin, startY, layout.page.contentWidth, rowHeight)
      .fill(bgColor);

    // Column positions
    const itemX = layout.page.margin + 15;
    const descX = itemX + tableConfig.columnWidths.item;
    const priceX = layout.page.margin + layout.page.contentWidth - tableConfig.columnWidths.price;
    const contentY = startY + tableConfig.rowPadding;

    // Item number and name
    doc.fillColor(colors.text.primary)
      .fontSize(typography.sizes.body)
      .font(typography.fonts.bold)
      .text(`${index + 1}.`, itemX, contentY);

    // doc.fontSize(typography.sizes.small)
    //   .font(typography.fonts.primary)
    //   .text(selection.name || `Frame ${index + 1}`, itemX, contentY + 16, {
    //     width: tableConfig.columnWidths.item - 10
    //   });

    // Description section
    let descY = contentY;
    descY = this.renderItemDescription(doc, selection, descX, descY);

    // Price
    doc.fillColor(colors.primary)
      .fontSize(typography.sizes.h3)
      .font(typography.fonts.bold)
      .text(`£${selection.selectionPrice.toFixed(2)}`, priceX, contentY, {
        width: tableConfig.columnWidths.price - 15,
        align: 'right'
      });

    // Row separator
    doc.moveTo(layout.page.margin, startY + rowHeight)
      .lineTo(layout.page.margin + layout.page.contentWidth, startY + rowHeight)
      .stroke(colors.background.border);

    return startY + rowHeight;
  }

  renderItemDescription(doc, selection, startX, startY) {
    const { colors, typography, layout } = this.designSystem;
    const descWidth = layout.sections.table.columnWidths.description;
    let currentY = startY;

    // Main specifications
    const specs = this.buildSpecsArray(selection, 'main');
    if (specs.length > 0) {
      doc.fillColor(colors.text.primary)
        .fontSize(typography.sizes.small)
        .font(typography.fonts.primary);

      const specsText = specs.join(' - ');
      const textHeight = doc.heightOfString(specsText, { width: descWidth });
      doc.text(specsText, startX, currentY, { width: descWidth });
      currentY += textHeight + 6;
    }

    // Additional features
    const features = this.buildSpecsArray(selection, 'features');
    if (features.length > 0) {
      doc.fillColor(colors.text.secondary)
        .fontSize(typography.sizes.tiny)
        .font(typography.fonts.primary);

      const featuresText = features.join(' - ');
      const textHeight = doc.heightOfString(featuresText, { width: descWidth });
      doc.text(featuresText, startX, currentY, { width: descWidth });
      currentY += textHeight + 8;
    }

    // Frame details box
    if (selection.frameData && Object.keys(selection.frameData).length > 0) {
      console.log("frame: ", selection.frameData)
      const frameBoxHeight = 24;
      doc.rect(startX, currentY, descWidth, frameBoxHeight)
        .fill(colors.background.primary)
        .stroke(colors.background.border);

      doc.fillColor(colors.text.secondary)
        .fontSize(typography.sizes.tiny)
        .font(typography.fonts.primary)
        .text('Frame Details:', startX, currentY + 4);

      const frameDetails = Object.entries(selection.frameData)
        .filter(([key, value]) => key && value !== undefined && value !== null)
        .map(([key, value]) => `${value.name}: ${value.value}`)
        .join(' - ');

      if (frameDetails) {
        doc.text(frameDetails, startX, currentY + 14, {
          width: descWidth - 16
        });
      }

      currentY += frameBoxHeight;
    }

    return currentY;
  }

  buildSpecsArray(selection, type) {
    if (type === 'main') {
      const specs = [];
      if (selection.ageGroup?.name) specs.push(`${selection.ageGroup.name}`);
      if (selection.lensType?.name) specs.push(`${selection.lensType.name}`);
      if (selection.lensSubtype?.name) specs.push(`${selection.lensSubtype.name}`);
      if (selection.recommendedLens?.name) specs.push(`${selection.recommendedLens.name}`);
      return specs;
    } else if (type === 'features') {
      const features = [];
      if (selection.design?.isVisible && selection.design?.name) features.push(`${selection.design.name}`);
      if (selection.coatings?.name) features.push(`${selection.coatings.name}`);
      if (selection.extras?.name) features.push(`${selection.extras.name}`);
      if (selection.color?.name) features.push(`${selection.color.name}`);
      return features;
    }
    return [];
  }

  calculateRowHeight(doc, selection) {
    const { typography, layout } = this.designSystem;
    const tableConfig = layout.sections.table;
    const descWidth = tableConfig.columnWidths.description;
    let totalHeight = tableConfig.minRowHeight;

    // Calculate main specs height
    const specs = this.buildSpecsArray(selection, 'main');
    if (specs.length > 0) {
      doc.fontSize(typography.sizes.small).font(typography.fonts.primary);
      const specsText = specs.join(' • ');
      totalHeight += doc.heightOfString(specsText, { width: descWidth }) + 6;
    }

    // Calculate features height
    const features = this.buildSpecsArray(selection, 'features');
    if (features.length > 0) {
      doc.fontSize(typography.sizes.tiny).font(typography.fonts.primary);
      const featuresText = features.join(' • ');
      totalHeight += doc.heightOfString(featuresText, { width: descWidth }) + 8;
    }

    // Add frame details box height
    if (selection.frameData && Object.keys(selection.frameData).length > 0) {
      totalHeight += 24;
    }

    return Math.max(totalHeight, tableConfig.minRowHeight);
  }

  // =================
  // TOTALS SECTION
  // =================
  renderTotalsSection(doc, orderData, startY) {
    const { colors, typography, layout } = this.designSystem;
    const totalsConfig = layout.sections.totals;

    // Calculate total section height - properly account for all elements
    const totalLines = this.getTotalLines(orderData.pricing);
    const lineHeight = totalLines.length * totalsConfig.rowHeight;
    const padding = totalsConfig.padding * 2;
    const separatorSpace = 8;
    const finalTotalBoxHeight = 32;
    const finalTotalMargin = 12;
    
    const sectionHeight = lineHeight + padding + separatorSpace + finalTotalMargin + finalTotalBoxHeight;

    // Ensure we have enough space and add a small buffer
    this.checkPageBreak(sectionHeight + this.designSystem.layout.spacing.md);
    const actualY = this.pageState.currentY;

    const totalsX = layout.page.margin + layout.page.contentWidth - totalsConfig.width;

    // Clean totals section with border - cover the entire section
    doc.rect(totalsX, actualY, totalsConfig.width, sectionHeight)
      .stroke(colors.background.border)
      .lineWidth(1);

    let currentY = actualY + totalsConfig.padding;

    // Individual total lines
    totalLines.forEach(line => {
      this.renderTotalLine(doc, line, totalsX + totalsConfig.padding, currentY, totalsConfig.width - (totalsConfig.padding * 2));
      currentY += totalsConfig.rowHeight;
    });

    // Separator line
    currentY += 8;
    doc.moveTo(totalsX + totalsConfig.padding, currentY)
      .lineTo(totalsX + totalsConfig.width - totalsConfig.padding, currentY)
      .lineWidth(2)
      .stroke(colors.primary);

    // Final total box
    currentY += 12;
    doc.rect(totalsX + 8, currentY, totalsConfig.width - 16, finalTotalBoxHeight)
      .stroke(colors.background.border)
      .lineWidth(2);

    doc.fillColor(colors.text.primary)
      .fontSize(typography.sizes.h3)
      .font(typography.fonts.bold)
      .text('TOTAL:', totalsX + 20, currentY + 10);

    doc.fontSize(typography.sizes.h2)
      .text(`£${orderData.pricing.totalPrice.toFixed(2)}`, totalsX + 20, currentY + 10, {
        width: totalsConfig.width - 40,
        align: 'right'
      });

    return actualY + sectionHeight;
  }

  getTotalLines(pricing) {
    const lines = [
      { label: 'Subtotal:', amount: pricing.subtotal, color: null }
    ];

    if (pricing.discount > 0) {
      lines.push({ label: 'Discount:', amount: -pricing.discount, color: 'success' });
    }
    if (pricing.tax > 0) {
      lines.push({ label: 'Tax:', amount: pricing.tax, color: null });
    }
    if (pricing.shipping > 0) {
      lines.push({ label: 'Shipping:', amount: pricing.shipping, color: null });
    }

    return lines;
  }

  renderTotalLine(doc, line, x, y, width) {
    const { colors, typography } = this.designSystem;
    const textColor = line.color === 'success' ? colors.success : colors.text.primary;

    doc.fillColor(textColor)
      .fontSize(typography.sizes.body)
      .font(typography.fonts.primary)
      .text(line.label, x, y)
      .text(`£${Math.abs(line.amount).toFixed(2)}`, x, y, {
        width: width - 20,
        align: 'right'
      });
  }

  // =================
  // FOOTER SECTION
  // =================
  renderFooter(doc, orderData, startY) {
    const { colors, typography, layout } = this.designSystem;
    const footerConfig = layout.sections.footer;

    this.checkPageBreak(footerConfig.height);
    const actualY = this.pageState.currentY;

    // Separator line
    doc.moveTo(layout.page.margin, actualY)
      .lineTo(layout.page.margin + layout.page.contentWidth, actualY)
      .stroke(colors.background.border);

    let contentY = actualY + 20;

    // Thank you message
    doc.fillColor(colors.primary)
      .fontSize(typography.sizes.h2)
      .font(typography.fonts.bold)
      .text('Thank you for choosing 2020 OPTIX!', layout.page.margin, contentY, {
        width: layout.page.contentWidth,
        align: 'center'
      });

    contentY += 35;

    // Contact information
    doc.fillColor(colors.text.secondary)
      .fontSize(typography.sizes.body)
      .font(typography.fonts.primary)
      .text('For questions or support, please contact our customer service team.', layout.page.margin, contentY, {
        width: layout.page.contentWidth,
        align: 'center'
      });

    contentY += 25;

    // Legal notice
    doc.fontSize(typography.sizes.small)
      .font(typography.fonts.italic)
      .text('This receipt serves as proof of purchase. Please retain for your records.', layout.page.margin, contentY, {
        width: layout.page.contentWidth,
        align: 'center'
      });

    // Decorative footer bar
    doc.rect(layout.page.margin, contentY + 30, layout.page.contentWidth, 3)
      .fill(colors.primary);

    return actualY + footerConfig.height;
  }

  // =================
  // UTILITY METHODS
  // =================

  // Easy access to design system for external tweaking
  getDesignSystem() {
    return this.designSystem;
  }

  // Update specific design values
  updateColors(colorUpdates) {
    Object.assign(this.designSystem.colors, colorUpdates);
    return this;
  }

  updateTypography(typographyUpdates) {
    Object.assign(this.designSystem.typography, typographyUpdates);
    return this;
  }

  updateLayout(layoutUpdates) {
    Object.assign(this.designSystem.layout, layoutUpdates);
    return this;
  }

  // Legacy methods for compatibility
  serveReceipt(fileName) {
    console.log('PDFService: serveReceipt - Receipts are generated on-demand, not stored.');
    return null;
  }

  cleanupOldReceipts(daysToKeep = 30) {
    console.log('PDFService: cleanupOldReceipts - No cleanup needed for on-demand generation.');
  }
}

module.exports = new ProfessionalPDFService();