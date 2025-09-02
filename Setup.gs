/**
 * @OnlyCurrentDoc
 *
 * The above tag tells Google Apps Script to only grant access to the
 * current document, not all of the user's documents.
 */

// Global variables for spreadsheet access
const SPREADSHEET = SpreadsheetApp.getActiveSpreadsheet();
const SHIFTS_SHEET_NAME = 'Shifts';
const COWORKERS_SHEET_NAME = 'Coworkers';
const PARTIES_SHEET_NAME = 'Parties';

/**
 * Creates a custom menu in the Google Sheet for the user to set up sheets.
 */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Shift Tracker')
    .addItem('Set Up Sheets', 'setupSheets')
    .addToUi();
}

/**
 * Sets up the necessary sheets and headers if they don't already exist.
 */
function setupSheets() {
  createSheetWithHeaders(SHIFTS_SHEET_NAME, ['ID', 'Date', 'StartTime', 'EndTime', 'Location', 'Tips', 'Notes', 'Tags', 'Hours', 'HourlyRate']);
  createSheetWithHeaders(COWORKERS_SHEET_NAME, ['ShiftID', 'Name', 'Position', 'Location', 'StartTime', 'EndTime']);
  createSheetWithHeaders(PARTIES_SHEET_NAME, ['ShiftID', 'Name', 'Type', 'Details', 'StartTime', 'EndTime', 'Bartenders']);
  
  SpreadsheetApp.getUi().alert('Shift Tracker sheets and headers have been set up!');
}

/**
 * Helper function to create a sheet with headers if it doesn't exist.
 * @param {string} sheetName The name of the sheet to create.
 * @param {Array<string>} headers The array of header names.
 */
function createSheetWithHeaders(sheetName, headers) {
  let sheet = SPREADSHEET.getSheetByName(sheetName);
  if (!sheet) {
    sheet = SPREADSHEET.insertSheet(sheetName);
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  }
}
