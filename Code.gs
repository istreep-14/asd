/**
 * Bartending Shift Tracker - Google Apps Script Backend
 * Manages shift data in Google Sheets
 */

// Configuration
const SHEET_NAME = 'Shifts';

/**
 * Serves the HTML web app
 */
function doGet() {
  return HtmlService.createTemplateFromFile('index')
    .evaluate()
    .setTitle('Bartending Shift Tracker')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Gets or creates the spreadsheet for storing shift data
 */
function getOrCreateSpreadsheet() {
  const scriptProperties = PropertiesService.getScriptProperties();
  let spreadsheetId = scriptProperties.getProperty('SPREADSHEET_ID');
  
  if (!spreadsheetId) {
    // Create new spreadsheet
    const ss = SpreadsheetApp.create('Bartending Shift Tracker Data');
    spreadsheetId = ss.getId();
    scriptProperties.setProperty('SPREADSHEET_ID', spreadsheetId);
    
    // Set up the sheet with headers
    const sheet = ss.getActiveSheet();
    sheet.setName(SHEET_NAME);
    sheet.getRange(1, 1, 1, 10).setValues([[
      'ID', 'Date', 'Start Time', 'End Time', 'Hours', 'Location', 'Tips', 'Tips/Hour', 'Notes', 'Created'
    ]]);
    
    // Format headers
    const headerRange = sheet.getRange(1, 1, 1, 10);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#34495e');
    headerRange.setFontColor('white');
    
    Logger.log('Created new spreadsheet: ' + ss.getUrl());
  }
  
  return SpreadsheetApp.openById(spreadsheetId);
}

/**
 * Gets the shifts sheet, creating it if it doesn't exist
 */
function getShiftsSheet() {
  const ss = getOrCreateSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.getRange(1, 1, 1, 10).setValues([[
      'ID', 'Date', 'Start Time', 'End Time', 'Hours', 'Location', 'Tips', 'Tips/Hour', 'Notes', 'Created'
    ]]);
    
    // Format headers
    const headerRange = sheet.getRange(1, 1, 1, 10);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#34495e');
    headerRange.setFontColor('white');
  }
  
  return sheet;
}

/**
 * Calculates hours worked between start and end time
 */
function calculateHours(date, startTime, endTime) {
  const startDateTime = new Date(`${date}T${startTime}`);
  const endDateTime = new Date(`${date}T${endTime}`);
  
  // Handle shifts that end past midnight
  if (endDateTime < startDateTime) {
    endDateTime.setDate(endDateTime.getDate() + 1);
  }
  
  return (endDateTime - startDateTime) / (1000 * 60 * 60);
}

/**
 * Retrieves all shifts from the spreadsheet
 */
function getAllShifts() {
  try {
    Logger.log('Getting all shifts...');
    const sheet = getShiftsSheet();
    const data = sheet.getDataRange().getValues();
    
    Logger.log('Raw data from sheet: ' + JSON.stringify(data));
    
    if (data.length <= 1) {
      Logger.log('No shifts found, returning empty array');
      return [];
    }
    
    const shifts = [];
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (!row[0]) continue; // Skip empty rows
      
      // Handle date conversion properly
      let dateValue = row[1];
      if (dateValue instanceof Date) {
        dateValue = Utilities.formatDate(dateValue, Session.getScriptTimeZone(), 'yyyy-MM-dd');
      }
      
      shifts.push({
        id: row[0],
        date: dateValue,
        startTime: row[2],
        endTime: row[3],
        hours: parseFloat(row[4]) || 0,
        location: row[5],
        tips: parseFloat(row[6]) || 0,
        tipsPerHour: parseFloat(row[7]) || 0,
        notes: row[8],
        created: row[9]
      });
    }
    
    // Sort by date and start time (most recent first)
    shifts.sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.startTime}`);
      const dateB = new Date(`${b.date}T${b.startTime}`);
      return dateB - dateA;
    });
    
    Logger.log('Processed shifts: ' + JSON.stringify(shifts));
    return shifts;
  } catch (error) {
    Logger.log('Error getting shifts: ' + error.toString());
    throw error;
  }
}

/**
 * Adds a new shift to the spreadsheet
 */
function addShift(shiftData) {
  try {
    Logger.log('Adding shift: ' + JSON.stringify(shiftData));
    const sheet = getShiftsSheet();
    const hours = calculateHours(shiftData.date, shiftData.startTime, shiftData.endTime);
    const tipsPerHour = hours > 0 ? (shiftData.tips / hours) : 0;
    
    // Convert date string to Date object for proper storage
    const dateObj = new Date(shiftData.date);
    
    const rowData = [
      shiftData.id,
      dateObj,
      shiftData.startTime,
      shiftData.endTime,
      parseFloat(hours.toFixed(2)),
      shiftData.location,
      parseFloat(shiftData.tips),
      parseFloat(tipsPerHour.toFixed(2)),
      shiftData.notes || '',
      new Date()
    ];
    
    Logger.log('Row data to insert: ' + JSON.stringify(rowData));
    sheet.appendRow(rowData);
    
    // Format the new row
    const lastRow = sheet.getLastRow();
    const tipsRange = sheet.getRange(lastRow, 7);
    const tipsPerHourRange = sheet.getRange(lastRow, 8);
    const dateRange = sheet.getRange(lastRow, 2);
    
    tipsRange.setNumberFormat('$#,##0.00');
    tipsPerHourRange.setNumberFormat('$#,##0.00');
    dateRange.setNumberFormat('yyyy-mm-dd');
    
    Logger.log('Successfully added shift: ' + shiftData.id);
    return { success: true };
  } catch (error) {
    Logger.log('Error adding shift: ' + error.toString());
    throw error;
  }
}

/**
 * Updates an existing shift in the spreadsheet
 */
function updateShift(shiftData) {
  try {
    Logger.log('Updating shift: ' + JSON.stringify(shiftData));
    const sheet = getShiftsSheet();
    const data = sheet.getDataRange().getValues();
    
    // Find the row with the matching ID
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === shiftData.id) {
        const hours = calculateHours(shiftData.date, shiftData.startTime, shiftData.endTime);
        const tipsPerHour = hours > 0 ? (shiftData.tips / hours) : 0;
        
        // Convert date string to Date object for proper storage
        const dateObj = new Date(shiftData.date);
        
        const rowData = [
          shiftData.id,
          dateObj,
          shiftData.startTime,
          shiftData.endTime,
          parseFloat(hours.toFixed(2)),
          shiftData.location,
          parseFloat(shiftData.tips),
          parseFloat(tipsPerHour.toFixed(2)),
          shiftData.notes || '',
          data[i][9] // Keep original created date
        ];
        
        sheet.getRange(i + 1, 1, 1, 10).setValues([rowData]);
        
        // Format currency columns
        const tipsRange = sheet.getRange(i + 1, 7);
        const tipsPerHourRange = sheet.getRange(i + 1, 8);
        const dateRange = sheet.getRange(i + 1, 2);
        
        tipsRange.setNumberFormat('$#,##0.00');
        tipsPerHourRange.setNumberFormat('$#,##0.00');
        dateRange.setNumberFormat('yyyy-mm-dd');
        
        Logger.log('Successfully updated shift: ' + shiftData.id);
        return { success: true };
      }
    }
    
    throw new Error('Shift not found');
  } catch (error) {
    Logger.log('Error updating shift: ' + error.toString());
    throw error;
  }
}

/**
 * Deletes a shift from the spreadsheet
 */
function deleteShift(shiftId) {
  try {
    Logger.log('Deleting shift: ' + shiftId);
    const sheet = getShiftsSheet();
    const data = sheet.getDataRange().getValues();
    
    // Find the row with the matching ID
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === shiftId) {
        sheet.deleteRow(i + 1);
        Logger.log('Successfully deleted shift: ' + shiftId);
        return { success: true };
      }
    }
    
    throw new Error('Shift not found');
  } catch (error) {
    Logger.log('Error deleting shift: ' + error.toString());
    throw error;
  }
}

/**
 * Gets shift statistics
 */
function getShiftStats() {
  try {
    const shifts = getAllShifts();
    
    if (shifts.length === 0) {
      return {
        totalShifts: 0,
        totalHours: 0,
        totalTips: 0,
        averageTipsPerHour: 0
      };
    }
    
    const totalTips = shifts.reduce((sum, shift) => sum + parseFloat(shift.tips), 0);
    const totalHours = shifts.reduce((sum, shift) => sum + parseFloat(shift.hours), 0);
    const averageTipsPerHour = totalHours > 0 ? (totalTips / totalHours) : 0;
    
    return {
      totalShifts: shifts.length,
      totalHours: totalHours,
      totalTips: totalTips,
      averageTipsPerHour: averageTipsPerHour
    };
  } catch (error) {
    Logger.log('Error getting stats: ' + error.toString());
    throw error;
  }
}

/**
 * Test function to add sample data for debugging
 */
function addSampleShift() {
  try {
    const sampleShift = {
      id: 'sample_' + new Date().getTime(),
      date: '2025-01-15',
      startTime: '18:00',
      endTime: '02:00',
      tips: 150.75,
      location: 'Downtown Bar',
      notes: 'Busy Friday night'
    };
    
    Logger.log('Adding sample shift: ' + JSON.stringify(sampleShift));
    return addShift(sampleShift);
  } catch (error) {
    Logger.log('Error adding sample shift: ' + error.toString());
    throw error;
  }
}

/**
 * Test function to verify the setup
 */
function testSetup() {
  try {
    const sheet = getShiftsSheet();
    Logger.log('Sheet setup successful. Sheet ID: ' + sheet.getParent().getId());
    Logger.log('Sheet URL: ' + sheet.getParent().getUrl());
    
    // Test data operations
    const shifts = getAllShifts();
    Logger.log('Current shifts count: ' + shifts.length);
    
    return 'Setup successful';
  } catch (error) {
    Logger.log('Setup error: ' + error.toString());
    throw error;
  }
}
