const path = require('path')
const fs = require('fs')
const moment = require('moment')

// For PDF require This library
const { jsPDF } = require('jspdf/dist/jspdf.node.min')
require('jspdf-autotable')
global.window = { document: { createElementNS: () => { return {} } } }
global.navigator = {}
global.btoa = () => { }
// For PDF require This library End

module.exports = {
  orderPDF: async (req, res, next) => {
    try {

      let { orderRefNo, clientName, itemType, melting, size, quantity, weightRange, deliveryDate, partyOrderNo, reference, narration, images, isClientName } = req.body

      var doc = new jsPDF()

      let pageWidth = doc.internal.pageSize.getWidth()
      let pageHeight = doc.internal.pageSize.getHeight()

      let finalY = pageHeight * 0.05;
      doc.setFontSize(10);
      doc.text(`Order No: ${orderRefNo}`, 10, finalY, 'left')

      let head = []

      if(isClientName) {
        head = [
          ["Order Ref No", orderRefNo, "Party Order No", partyOrderNo, "Delivery Date", deliveryDate],
          ["Client Name", clientName, "Item Type", itemType, "Quantity", quantity],
          ["Weight Range", weightRange, "Melting", melting, "Size", size],
          ["Reference", reference, "Narration", narration]
        ]
      } else {
        head = [
          ["Order Ref No", orderRefNo, "Party Order No", partyOrderNo, "Delivery Date", deliveryDate],
          ["Item Type", itemType, "Quantity", quantity, "Weight Range", weightRange ],
          ["Melting", melting, "Size", size, "Reference", reference],
          [ "Narration", narration]
        ]
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
          0: { fontStyle: 'bold', cellWidth: 32 },
          2: { fontStyle: 'bold' },
          4: { fontStyle: 'bold' }
        }
      });

      finalY = doc.previousAutoTable.finalY + 15

      for (let i = 0; i < images.length; i++) {
        doc.addImage(images[i], "JPEG", pageWidth / 6, finalY, 150, 100)
        finalY = finalY * 5
        if (finalY > 300 && i < images.length - 1) {
          doc.addPage()
          finalY = 30
        }
      }

      let fileName = Date.now() + '.pdf'
      let dir = path.join(process.cwd(), '/orderpdf')
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, 0777)
      }
      let assetspath = path.join(process.cwd(), "/orderpdf/" + fileName)

      fs.appendFileSync(assetspath, new Buffer.from(doc.output('arraybuffer')))
      res.sendFile(assetspath, fileName)

      if (fs.existsSync(assetspath)) {
        setTimeout(() => {
          fs.unlinkSync(assetspath, () => {
            console.log('File Deleted')
          })
        }, 2000)
      }

    } catch (error) {
      console.log(error)
      return res.status(500).json({ status: 500, message: 'Internal Server Error', error: error })
    } finally {
      delete global.window
      delete global.navigator
      delete global.btoa
    }
  }
}