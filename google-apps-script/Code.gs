const SHEET_NAME = 'Receipts';

const HEADERS = [
  'ID',
  'Receipt No',
  'Date',
  'Created At',
  'Donor Name',
  'Relation Type',
  'Relation Name',
  'Address',
  'Gotra',
  'ID Type',
  'ID Number',
  'Phone',
  'Email',
  'Amount',
  'Payment Mode',
  'Transaction ID',
  'Anudan',
  'Daan',
  'Anudan Purpose',
  'Custom Seva',
  'Seva Date',
  'Show UPI QR',
  'Total Amount'
];

function getSheet_() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = spreadsheet.insertSheet(SHEET_NAME);

  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.setFrozenRows(1);
  } else {
    ensureHeaders_(sheet);
  }
  return sheet;
}

function ensureHeaders_(sheet) {
  const currentHeaders = sheet
    .getRange(1, 1, 1, Math.max(sheet.getLastColumn(), HEADERS.length))
    .getValues()[0]
    .map(String);

  if (currentHeaders.join('|') === HEADERS.join('|')) return;

  // Migrate the previous format, which stored the entire receipt in recordJson.
  if (currentHeaders[4] === 'recordJson') {
    const oldRows = sheet.getLastRow() > 1
      ? sheet.getRange(2, 1, sheet.getLastRow() - 1, 5).getValues()
      : [];
    const migratedRows = oldRows
      .filter((row) => row[4])
      .map((row) => rowToValues_(JSON.parse(row[4])));
    sheet.clearContents();
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    if (migratedRows.length) {
      sheet.getRange(2, 1, migratedRows.length, HEADERS.length).setValues(migratedRows);
    }
    sheet.setFrozenRows(1);
    return;
  }

  sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  sheet.setFrozenRows(1);
}

function jsonResponse_(body) {
  return ContentService
    .createTextOutput(JSON.stringify(body))
    .setMimeType(ContentService.MimeType.JSON);
}

function valuesToRecord_(row) {
  const amount = Number(row[13]) || 0;
  const receiptNo = String(row[1] || '');
  const date = String(row[2] || '');

  return {
    id: String(row[0] || ''),
    receiptNo,
    date,
    createdAt: String(row[3] || ''),
    donor: {
      name: String(row[4] || ''),
      relationType: row[5] || null,
      relationName: String(row[6] || ''),
      address: String(row[7] || ''),
      gotra: String(row[8] || ''),
      idType: row[9] || 'ପ୍ୟାନ୍',
      idNumber: String(row[10] || ''),
      phone: String(row[11] || ''),
      email: String(row[12] || '')
    },
    transaction: {
      receiptNo,
      date,
      amount,
      mode: row[14] || '',
      txnId: String(row[15] || ''),
      selectedAnudan: splitList_(row[16]),
      selectedDaan: splitList_(row[17]),
      anudanPurpose: String(row[18] || ''),
      customSeva: String(row[19] || ''),
      sevaDate: String(row[20] || ''),
      showUpiQr: row[21] === true || String(row[21]).toLowerCase() === 'true'
    },
    totalAmount: Number(row[22]) || amount
  };
}

function splitList_(value) {
  return String(value || '')
    .split('|')
    .map((item) => item.trim())
    .filter(Boolean);
}

function rowToValues_(record) {
  const donor = record.donor || {};
  const transaction = record.transaction || {};
  return [
    record.id || '',
    record.receiptNo || transaction.receiptNo || '',
    record.date || transaction.date || '',
    record.createdAt || '',
    donor.name || '',
    donor.relationType || '',
    donor.relationName || '',
    donor.address || '',
    donor.gotra || '',
    donor.idType || '',
    donor.idNumber || '',
    donor.phone || '',
    donor.email || '',
    Number(transaction.amount) || 0,
    transaction.mode || '',
    transaction.txnId || '',
    (transaction.selectedAnudan || []).join('|'),
    (transaction.selectedDaan || []).join('|'),
    transaction.anudanPurpose || '',
    transaction.customSeva || '',
    transaction.sevaDate || '',
    transaction.showUpiQr === true,
    Number(record.totalAmount) || Number(transaction.amount) || 0
  ];
}

function doGet() {
  const sheet = getSheet_();
  const rows = sheet.getLastRow() > 1
    ? sheet.getRange(2, 1, sheet.getLastRow() - 1, HEADERS.length).getValues()
    : [];
  const records = rows.filter((row) => row[0]).map(valuesToRecord_);
  return jsonResponse_({ records });
}

function doPost(event) {
  try {
    const payload = JSON.parse(event.postData.contents || '{}');
    const sheet = getSheet_();
    const rows = sheet.getLastRow() > 1
      ? sheet.getRange(2, 1, sheet.getLastRow() - 1, HEADERS.length).getValues()
      : [];

    if (payload.action === 'save' && payload.record) {
      const values = rowToValues_(payload.record);
      const existingIndex = rows.findIndex((row) => String(row[0]) === String(payload.record.id));
      if (existingIndex >= 0) {
        sheet.getRange(existingIndex + 2, 1, 1, HEADERS.length).setValues([values]);
      } else {
        sheet.appendRow(values);
      }
      return jsonResponse_({ message: 'OK' });
    }

    if (payload.action === 'delete') {
      const rowIndex = rows.findIndex((row) => String(row[0]) === String(payload.id));
      if (rowIndex >= 0) sheet.deleteRow(rowIndex + 2);
      return jsonResponse_({ message: 'OK' });
    }

    if (payload.action === 'clear') {
      if (sheet.getLastRow() > 1) {
        sheet.deleteRows(2, sheet.getLastRow() - 1);
      }
      return jsonResponse_({ message: 'OK' });
    }

    return jsonResponse_({ message: 'Unsupported action.' });
  } catch (error) {
    return jsonResponse_({ message: String(error) });
  }
}
