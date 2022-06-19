const path = require('path');
const fs = require('fs');
const moment = require('moment');

// For PDF require This library
const { jsPDF } = require('jspdf/dist/jspdf.node.min')
require('jspdf-autotable')
global.window = { document: { createElementNS: () => { return {} } } };
global.navigator = {};
global.btoa = () => { };
// For PDF require This library End

module.exports = {
  generatePDF: async (req, res, next) => {
    try {
      let role = req.body.Role
      let { orderNo, custName, custNo, OrdDate, delDate, stamp, melting, ortype, priority, branch, supplier, ordWt, createdby, approvedby, wastage, stncharges, diamondcharges, polkicharges, mozzcharges, kundancharges, advamount, advgold, advgoldtype, remakrks, itemWt, itempcs, itemsize, rhodium, screw, earings, itemremarks, imagedate } = req.body.pdfDetails

      var doc = new jsPDF();

      let pageWidth = doc.internal.pageSize.getWidth();
      let pageHeight = doc.internal.pageSize.getHeight();

      let finalY = pageHeight * 0.05;
      doc.setFontSize(10);
      doc.text(`Order No: ${orderNo}`, 10, finalY, 'left');
      // doc.text('Order Form', pageWidth / 2, finalY, 'center');
      doc.text(`Cust Name: ${custName}`, pageWidth - 50, finalY)
      let head = []
      if (role.toLowerCase() === 'admin') {
        head = [
          ["Order No", orderNo, "Cust Name", custName, "Cust No", custNo],
          ["Order Date", OrdDate, "Delivery Date", delDate, "Stamp", stamp],
          ["Melting", melting, "Order Type", ortype, "Priority", priority],
          ["Branch", branch, "Supplier", supplier, "Order Wt", ordWt],
          ["Created By", createdby, "Passed By", approvedby, "Wastage", wastage],
          ["Stone Charges", stncharges, "Dia Charges", diamondcharges, "Polki Charges", polkicharges],
          ["Mozz Charges", mozzcharges, "Kundan Charges", kundancharges, "Adv Amt", advamount],
          ["Adv Gold", advgold, "Ad Gold Purity", advgoldtype],
        ];
      } else if (role.toLowerCase() === 'operator') {
        head = [
          ["Order No", orderNo, "Cust Name", custName, "Cust No", custNo],
          ["Order Date", OrdDate, "Delivery Date", delDate, "Stamp", stamp],
          ["Melting", melting, "Order Type", ortype, "Priority", priority],
          ["Branch", branch, "", "", "Order Wt", ordWt],
          ["Created By", createdby, "Passed By", approvedby, "Wastage", wastage],
          ["Stone Charges", stncharges, "Dia Charges", diamondcharges, "Polki Charges", polkicharges],
          ["Mozz Charges", mozzcharges, "Kundan Charges", kundancharges, "Adv Amt", advamount],
          ["Adv Gold", advgold, "Ad Gold Purity", advgoldtype],
        ];
      } else if (role.toLowerCase() === 'supplier') {
        head = [
          ["Order No", orderNo, "Cust Name", custName, "Order Date", OrdDate,],
          [ "Delivery Date", delDate, "Stamp", stamp, "Melting", melting],
          [ "Order Type", ortype, "Priority", priority, "Branch", branch],
          ["Order Wt", ordWt, "Created By", createdby, "Passed By", approvedby],
        ];
      }

      doc.autoTable({
        body: head,
        bodyStyles: { minCellHeight: 10, fontSize: 10, lineColor: [0, 0, 0], halign: 'center', valign: 'middle', fontStyle: 'normal', },
        headStyles: {
          lineColor: [0, 0, 0],
          fillColor: [192, 192, 192],
          textColor: 0,
          fontSize: 10,
          fontStyle: 'normal',
          lineWidth: 0.2,
          halign: 'center',
          valign: 'middle'
        },
        startY: finalY + 5,
        rowStyles: {
          0: { cellWidth: 10 },
          1: { "overflow": "linebreak" },
        },
        rowPageBreak: 'avoid',
        theme: 'grid',
        tableLineColor: [0, 0, 0],
        columnStyles: {
          0: { fontStyle: 'bold',  cellWidth : 32 },
          2: { fontStyle: 'bold' },
          4: { fontStyle: 'bold' }
        }
      });

      finalY = doc.lastAutoTable.finalY + 0
      doc.autoTable({
        body: [["Remarks", remakrks]],
        bodyStyles: { minCellHeight: 10, fontSize: 10, lineColor: [0, 0, 0], halign: 'center', valign: 'middle', fontStyle: 'normal', },
        headStyles: {
          lineColor: [0, 0, 0],
          fillColor: [192, 192, 192],
          textColor: 0,
          fontSize: 10,
          fontStyle: 'normal',
          lineWidth: 0.2,
          halign: 'center',
          valign: 'middle'
        },
        startY: finalY,
        rowStyles: {
          0: { cellWidth: 10 },
          1: { "overflow": "linebreak" },
        },
        rowPageBreak: 'avoid',
        theme: 'grid',
        tableLineColor: [0, 0, 0],
        columnStyles: {
          0: { fontStyle: 'bold', cellWidth : 32 },
        }
      });

      // Adding image
      doc.addPage()
      pageWidth = doc.internal.pageSize.getWidth();
      pageHeight = doc.internal.pageSize.getHeight();
      doc.text(`Order No: ${orderNo}`, 10, pageHeight * 0.05 ,'left' )
      // doc.text(`Order Form`, pageWidth / 2, pageHeight * 0.05, 'center')
      doc.text(`Cust Name: ${custName}`, pageWidth - 50, pageHeight * 0.05 )
      doc.addImage(imagedate, "JPEG", 10, pageHeight * 0.09, pageWidth * 0.9, pageHeight * 0.75);
      // Adding Item table

      let itemColumns = [["Weight", "Pcs", "Size", "Rhoduim", "Screw", "Earings", "Remarks"]];
      let itemRows = [[itemWt, itempcs, itemsize, rhodium, screw, earings, itemremarks]];
      doc.autoTable({
        head: itemColumns,
        body: itemRows,
        bodyStyles: { minCellHeight: 10, fontSize: 10, lineColor: [0, 0, 0], halign: 'center', valign: 'middle', fontStyle: 'normal', },
        headStyles: {
          lineColor: [0, 0, 0],
          fillColor: [192, 192, 192],
          textColor: 0,
          fontSize: 10,
          fontStyle: 'normal',
          lineWidth: 0.2,
          halign: 'center',
          valign: 'middle'
        },
        startY: pageHeight * 0.88,
        columnStyles: {
          0: { cellWidth: "auto" },
          1: { "overflow": "linebreak", cellWidth: "auto", },
          2: { "overflow": "linebreak" },
          3: { "overflow": "linebreak" },
          4: { "overflow": "linebreak" },
          5: { "overflow": "linebreak" },
          6: { "overflow": "linebreak" },
        },
        rowPageBreak: 'avoid',
        theme: 'grid',
        tableLineColor: [0, 0, 0],
        didDrawCell: async (data) => {
          if (data.column.index === 1 && data.cell.section === 'body') {
          }
        },
      });

      let fileName = Date.now() + '.pdf';
      let dir = path.join(process.cwd(), '/pdf')
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, 0777);
      }
      assetspath = path.join(process.cwd(), "/pdf/" + fileName);

      fs.appendFileSync(assetspath, new Buffer.from(doc.output('arraybuffer')));
      res.sendFile(assetspath, fileName)

      if (fs.existsSync(assetspath)) {
        setTimeout(() => {
          fs.unlinkSync(assetspath, () => {
            console.log('File Deleted')
          })
        }, 1000)
      }

    } catch (error) {
      console.log(error)
      return res.status(500).json({ status: 500, message: 'Internal Server Error', error: error });
    } finally {
      delete global.window;
      delete global.navigator;
      delete global.btoa;
    }
  }
}