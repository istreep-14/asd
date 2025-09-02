/**
 * The special onOpen function runs automatically when the spreadsheet is opened.
 * It creates a custom menu to make it easy to set up the sheets.
 */
function onOpen() {
  SpreadsheetApp.getUi()
      .createMenu('Shift Tracker')
      .addItem('Set Up Sheets', 'setupSheets')
      .addToUi();
}

/**
 * Serves the HTML file for the web app.
 * This is the entry point for the web app deployment.
 */
function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
      .setSandboxMode(HtmlService.SandboxMode.IFRAME)
      .setTitle('Shift Tracker');
}

/**
 * Retrieves all shift data from the spreadsheet and returns it as a JSON-like object.
 * This function handles fetching all related coworker and party data as well.
 */
function getAllShifts() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const shiftSheet = spreadsheet.getSheetByName('Shifts');
  const coworkerSheet = spreadsheet.getSheetByName('Coworkers');
  const partySheet = spreadsheet.getSheetByName('Parties');

  const shiftData = getSheetData(shiftSheet);
  const coworkerData = getSheetData(coworkerSheet);
  const partyData = getSheetData(partySheet);

  // Group coworker and party data by ShiftID
  const coworkersByShift = groupDataById(coworkerData, 'ShiftID');
  const partiesByShift = groupDataById(partyData, 'ShiftID');

  // Combine all data into a single object for the web app
  const combinedShifts = shiftData.map(shift => {
    return {
      ...shift,
      coworkers: coworkersByShift[shift.ID] || [],
      parties: partiesByShift[shift.ID] || []
    };
  });

  return combinedShifts;
}

/**
 * Saves a single shift, including its associated coworkers and parties.
 * It handles both creating new shifts and updating existing ones.
 * @param {Object} shiftData The shift object sent from the web app.
 */
function saveShift(shiftData) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const shiftSheet = spreadsheet.getSheetByName('Shifts');
  const coworkerSheet = spreadsheet.getSheetByName('Coworkers');
  const partySheet = spreadsheet.getSheetByName('Parties');

  let shiftId = shiftData.ID;

  if (shiftId) {
    // This is an existing shift, update the existing rows
    const allShifts = shiftSheet.getDataRange().getValues();
    const headers = allShifts[0];
    const dataRows = allShifts.slice(1);
    const idIndex = headers.indexOf('ID');

    for (let i = 0; i < dataRows.length; i++) {
      if (dataRows[i][idIndex] === shiftId) {
        const rowToUpdate = i + 2; // +1 for 0-index, +1 for header row
        const rowData = [
          shiftData.ID,
          shiftData.Date,
          shiftData.StartTime,
          shiftData.EndTime,
          shiftData.Location,
          shiftData.Tips,
          shiftData.Notes,
          shiftData.Tags.join(','),
          shiftData.Hours,
          shiftData.HourlyRate
        ];
        shiftSheet.getRange(rowToUpdate, 1, 1, rowData.length).setValues([rowData]);
        break;
      }
    }
    
    // Delete old coworker and party data before writing new
    deleteRelatedData(coworkerSheet, shiftId);
    deleteRelatedData(partySheet, shiftId);
    
  } else {
    // This is a new shift, add a new row
    shiftId = `shift-${new Date().getTime()}`; // Create a unique ID
    const newShiftRow = [
      shiftId,
      shiftData.Date,
      shiftData.StartTime,
      shiftData.EndTime,
      shiftData.Location,
      shiftData.Tips,
      shiftData.Notes,
      shiftData.Tags.join(','),
      shiftData.Hours,
      shiftData.HourlyRate
    ];
    shiftSheet.appendRow(newShiftRow);
  }

  // Save coworkers and parties
  saveRelatedData(coworkerSheet, shiftId, shiftData.coworkers);
  saveRelatedData(partySheet, shiftId, shiftData.parties);
}

/**
 * Deletes a shift and all its related data.
 * @param {string} shiftId The ID of the shift to delete.
 */
function deleteShift(shiftId) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const shiftSheet = spreadsheet.getSheetByName('Shifts');
  const coworkerSheet = spreadsheet.getSheetByName('Coworkers');
  const partySheet = spreadsheet.getSheetByName('Parties');

  // Delete the main shift row
  const shiftData = shiftSheet.getDataRange().getValues();
  const idIndex = shiftData[0].indexOf('ID');
  for (let i = 1; i < shiftData.length; i++) {
    if (shiftData[i][idIndex] === shiftId) {
      shiftSheet.deleteRow(i + 1);
      break;
    }
  }

  // Delete related coworker and party data
  deleteRelatedData(coworkerSheet, shiftId);
  deleteRelatedData(partySheet, shiftId);
}

/**
 * Helper function to read data from a sheet and return it as an array of objects.
 * @param {Sheet} sheet The sheet to read from.
 * @returns {Array<Object>} An array of objects, where each object represents a row.
 */
function getSheetData(sheet) {
  if (!sheet) return [];
  const range = sheet.getDataRange();
  const values = range.getValues();
  if (values.length <= 1) return [];

  const headers = values[0];
  const data = values.slice(1);

  return data.map(row => {
    const rowObject = {};
    headers.forEach((header, index) => {
      rowObject[header] = row[index];
    });
    return rowObject;
  });
}

/**
 * Helper function to group an array of objects by a specified key.
 * @param {Array<Object>} data The data to group.
 * @param {string} key The key to group by.
 * @returns {Object} An object where keys are the grouped values.
 */
function groupDataById(data, key) {
  return data.reduce((acc, obj) => {
    const groupKey = obj[key];
    if (!acc[groupKey]) {
      acc[groupKey] = [];
    }
    acc[groupKey].push(obj);
    return acc;
  }, {});
}

/**
 * Helper function to save related data to a sheet.
 * @param {Sheet} sheet The sheet to save to.
 * @param {string} shiftId The ID of the related shift.
 * @param {Array<Object>} relatedData The data to save.
 */
function saveRelatedData(sheet, shiftId, relatedData) {
  if (!sheet || !relatedData || relatedData.length === 0) return;
  
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const newRows = relatedData.map(item => {
    const row = [];
    headers.forEach(header => {
      if (header === 'ShiftID') {
        row.push(shiftId);
      } else if (header === 'Bartenders') {
        row.push(item[header].join(','));
      } else {
        row.push(item[header]);
      }
    });
    return row;
  });
  
  sheet.getRange(sheet.getLastRow() + 1, 1, newRows.length, newRows[0].length).setValues(newRows);
}

/**
 * Helper function to delete related data from a sheet.
 * @param {Sheet} sheet The sheet to delete from.
 * @param {string} shiftId The ID of the related shift.
 */
function deleteRelatedData(sheet, shiftId) {
  if (!sheet) return;
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return;
  
  const idIndex = data[0].indexOf('ShiftID');
  const rowsToDelete = [];
  for (let i = data.length - 1; i >= 1; i--) {
    if (data[i][idIndex] === shiftId) {
      rowsToDelete.push(i + 1); // +1 for 1-based indexing
    }
  }
  
  rowsToDelete.forEach(row => sheet.deleteRow(row));
}
