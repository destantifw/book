const { GoogleSpreadsheet } = require('google-spreadsheet');

const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);

export default async function handler(req, res) {
  const guest = req.body

  try {
    await doc.useServiceAccountAuth({
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/gm, '\n')
    });
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    console.log(guest.id);
    if (guest.id == -1 || guest.id == undefined) {
      const lastRow = await sheet.getRows({ limit: 1, offset: sheet.rowCount - 2 });
      const lastID = lastRow.length > 0 ? parseInt(lastRow[0].id) : 0;
      const nextID = lastID + 1;

      // Update the guest object with the auto-incremented ID
      guest.id = nextID + 1;
      await sheet.addRow(guest);
    } else {
      await sheet.loadCells();

      // const rowList = await sheet.getRows();
      const rows = [];
      let found = false;
      let rowIndex = 0;
      while (!found && rowIndex < sheet.rowCount) {
        const cellValue = sheet.getCell(rowIndex, 0).value;
        if (cellValue === guest.id) {
          console.log(found);
          sheet.getCell(rowIndex, 1).value = guest.nama_tamu;
          sheet.getCell(rowIndex, 2).value = guest.asal_tamu;
          sheet.getCell(rowIndex, 4).value = guest.jumlah_datang;
          const rowNumber = parseInt(guest.id) + 1;
          sheet.getCell(rowIndex, 5).value = `=D${rowNumber}-E${rowNumber}`;
          console.log(found);
          found = true;
          await sheet.saveUpdatedCells();
        }
        rowIndex += 1;
      }
      console.log(`is found ${found}`);
      if (!found) {
        const lastRow = await sheet.getRows({ limit: 1, offset: sheet.rowCount - 3 });
        const lastID = lastRow.length > 0 ? parseInt(lastRow[0].id) : 0;
        const nextID = lastID + 1;

        // Update the guest object with the auto-incremented ID
        guest.id = nextID + 1;
        const rowNumber = parseInt(guest.id) + 1;
        guest.selisih = `=D${rowNumber}-E${rowNumber}`;
        await sheet.addRow(guest);
      }

    }

    res.status(200).json({ message: 'A ok!', total: 1, data: guest });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
}
