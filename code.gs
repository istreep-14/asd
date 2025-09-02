/**
 * @OnlyCurrentDoc
 *
 * The above tag tells Google Apps Script to only grant access to the
 * current document, not all of the user's documents.
 */

// Global variables for spreadsheet access
const SPREADSHEET = SpreadsheetApp.getActiveSpreadsheet();
const SHIFTS_SHEET = SPREADSHEET.getSheetByName('Shifts');
const COWORKERS_SHEET = SPREADSHEET.getSheetByName('Coworkers');
const PARTIES_SHEET = SPREADSHEET.getSheetByName('Parties');

/**
 * Serves the HTML file for the web app.
 * @returns {HtmlOutput} The HTML for the web app.
 */
function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('Bartending Shift Tracker')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Retrieves all shifts and their related data from the sheets.
 * @returns {Array} An array of objects, where each object represents a shift with its coworkers and parties.
 */
function getAllShifts() {
  const shiftsData = getSheetData(SHIFTS_SHEET);
  const coworkersData = getSheetData(COWORKERS_SHEET);
  const partiesData = getSheetData(PARTIES_SHEET);

  // Group coworkers and parties by ShiftID for efficient lookup
  const coworkersByShift = groupDataById(coworkersData, 'ShiftID');
  const partiesByShift = groupDataById(partiesData, 'ShiftID');

  // Combine data into a single, comprehensive array
  const combinedShifts = shiftsData.map(shift => {
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
 * Creates a new shift if no ID is provided, otherwise updates an existing one.
 * @param {Object} shiftData The data object for the shift.
 */
function saveShift(shiftData) {
  try {
    const shiftsHeaders = getSheetHeaders(SHIFTS_SHEET);
    const shiftValues = shiftsHeaders.map(header => {
      if (header === 'Tags') {
        return shiftData.Tags.join(','); // Convert tags array to comma-separated string
      }
      return shiftData[header];
    });

    if (!shiftData.ID) {
      // New shift - add a unique ID
      shiftData.ID = Utilities.getUuid();
      shiftValues[shiftsHeaders.indexOf('ID')] = shiftData.ID;
      SHIFTS_SHEET.appendRow(shiftValues);
    } else {
      // Existing shift - find and update the row
      const data = SHIFTS_SHEET.getDataRange().getValues();
      const rowIndex = data.findIndex(row => row[0] === shiftData.ID);
      if (rowIndex !== -1) {
        SHIFTS_SHEET.getRange(rowIndex + 1, 1, 1, shiftValues.length).setValues([shiftValues]);
      }
    }

    // Save associated data
    saveAssociatedData(COWORKERS_SHEET, shiftData.ID, shiftData.coworkers, ['ShiftID', 'Name', 'Position', 'Location', 'StartTime', 'EndTime']);
    saveAssociatedData(PARTIES_SHEET, shiftData.ID, shiftData.parties, ['ShiftID', 'Name', 'Type', 'Details', 'StartTime', 'EndTime', 'Bartenders']);

    SpreadsheetApp.flush(); // Ensure all pending spreadsheet operations are applied
  } catch (e) {
    // Log the error for debugging
    Logger.log(e.stack);
    throw new Error('An error occurred while saving the shift. Please check the logs.');
  }
}

/**
 * Deletes a shift and all associated data.
 * @param {string} shiftId The ID of the shift to delete.
 */
function deleteShift(shiftId) {
  try {
    // Delete from Shifts sheet
    deleteRow(SHIFTS_SHEET, shiftId);

    // Delete associated data from other sheets
    deleteAssociatedRows(COWORKERS_SHEET, shiftId);
    deleteAssociatedRows(PARTIES_SHEET, shiftId);

    SpreadsheetApp.flush();
  } catch (e) {
    Logger.log(e.stack);
    throw new Error('An error occurred while deleting the shift.');
  }
}

// --- Helper Functions ---

/**
 * Gets all data from a sheet and maps it to an array of objects.
 * @param {Sheet} sheet The sheet to retrieve data from.
 * @returns {Array} An array of objects.
 */
function getSheetData(sheet) {
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return []; // No data besides headers
  const headers = data[0];
  const rows = data.slice(1);
  return rows.map(row => {
    const obj = {};
    headers.forEach((header, i) => {
      obj[header] = row[i];
    });
    return obj;
  });
}

/**
 * Gets the headers from a sheet.
 * @param {Sheet} sheet The sheet to retrieve headers from.
 * @returns {Array} An array of header strings.
 */
function getSheetHeaders(sheet) {
  return sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
}

/**
 * Groups an array of objects by a specified key.
 * @param {Array} data The array of objects to group.
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
 * Deletes a row from a sheet based on a unique ID.
 * @param {Sheet} sheet The sheet to perform the deletion on.
 * @param {string} id The unique ID to find and delete.
 */
function deleteRow(sheet, id) {
  const data = sheet.getDataRange().getValues();
  const rowIndex = data.findIndex(row => row[0] === id);
  if (rowIndex !== -1) {
    sheet.deleteRow(rowIndex + 1);
  }
}

/**
 * Deletes multiple rows from a sheet based on a common ID.
 * @param {Sheet} sheet The sheet to perform the deletion on.
 * @param {string} id The common ID to find and delete.
 */
function deleteAssociatedRows(sheet, id) {
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return;

  let rowCount = data.length;
  // Iterate from bottom to top to handle row deletions without shifting issues
  for (let i = rowCount - 1; i >= 1; i--) {
    if (data[i][0] === id) {
      sheet.deleteRow(i + 1);
    }
  }
}

/**
 * Saves associated data (e.g., coworkers, parties) for a shift.
 * @param {Sheet} sheet The sheet to save data to.
 * @param {string} shiftId The ID of the parent shift.
 * @param {Array} associatedData The array of data objects to save.
 * @param {Array} headers The headers of the sheet.
 */
function saveAssociatedData(sheet, shiftId, associatedData, headers) {
  // First, clear old associated data for this shift
  deleteAssociatedRows(sheet, shiftId);

  // Then, append the new data
  if (associatedData && associatedData.length > 0) {
    const values = associatedData.map(item => {
      const row = headers.map(header => {
        // Handle Bartenders array conversion for parties
        if (header === 'Bartenders' && Array.isArray(item[header])) {
          return item[header].join(',');
        }
        // Special case for ShiftID
        if (header === 'ShiftID') {
          return shiftId;
        }
        return item[header];
      });
      return row;
    });
    sheet.getRange(sheet.getLastRow() + 1, 1, values.length, values[0].length).setValues(values);
  }
}
