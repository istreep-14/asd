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
    
    // Check if sheet has any data beyond headers
    const lastRow = sheet.getLastRow();
    if (lastRow <= 1) {
      Logger.log('No shifts found, returning empty array');
      return [];
    }
    
    // Get all data including headers
    const data = sheet.getRange(1, 1, lastRow, 10).getValues();
    Logger.log('Raw data from sheet: ' + JSON.stringify(data.slice(0, 3))); // Log first 3 rows for debugging
    
    const shifts = [];
    // Start from row 2 (index 1) to skip headers
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      
      // Skip completely empty rows
      if (!row[0] && !row[1] && !row[2]) continue;
      
      // Handle date conversion properly
      let dateValue = row[1];
      if (dateValue instanceof Date) {
        // Format date as YYYY-MM-DD
        const year = dateValue.getFullYear();
        const month = String(dateValue.getMonth() + 1).padStart(2, '0');
        const day = String(dateValue.getDate()).padStart(2, '0');
        dateValue = `${year}-${month}-${day}`;
      } else if (typeof dateValue === 'string') {
        // If it's already a string, ensure it's in the right format
        dateValue = dateValue.split('T')[0]; // Remove time part if present
      }
      
      // Handle time values - ensure they're strings
      let startTime = row[2];
      let endTime = row[3];
      
      if (startTime instanceof Date) {
        startTime = startTime.toTimeString().substring(0, 5); // HH:MM format
      }
      if (endTime instanceof Date) {
        endTime = endTime.toTimeString().substring(0, 5); // HH:MM format
      }
      
      shifts.push({
        id: String(row[0] || ''),
        date: dateValue,
        startTime: String(startTime || ''),
        endTime: String(endTime || ''),
        hours: parseFloat(row[4]) || 0,
        location: String(row[5] || ''),
        tips: parseFloat(row[6]) || 0,
        tipsPerHour: parseFloat(row[7]) || 0,
        notes: String(row[8] || ''),
        created: row[9]
      });
    }
    
    // Sort by date and start time (most recent first)
    shifts.sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.startTime}`);
      const dateB = new Date(`${b.date}T${b.startTime}`);
      return dateB - dateA;
    });
    
    Logger.log('Processed shifts count: ' + shifts.length);
    Logger.log('First shift: ' + JSON.stringify(shifts[0]));
    return shifts;
  } catch (error) {
    Logger.log('Error getting shifts: ' + error.toString());
    Logger.log('Error stack: ' + error.stack);
    throw new Error('Failed to retrieve shifts: ' + error.message);
  }
}

/**
 * Adds a new shift to the spreadsheet
 */
function addShift(shiftData) {
  try {
    Logger.log('Adding shift: ' + JSON.stringify(shiftData));
    
    // Validate required fields
    if (!shiftData.date || !shiftData.startTime || !shiftData.endTime) {
      throw new Error('Missing required fields: date, startTime, or endTime');
    }
    
    const sheet = getShiftsSheet();
    const hours = calculateHours(shiftData.date, shiftData.startTime, shiftData.endTime);
    const tipsPerHour = hours > 0 ? (shiftData.tips / hours) : 0;
    
    // Convert date string to Date object for proper storage
    const dateObj = new Date(shiftData.date + 'T00:00:00');
    
    const rowData = [
      shiftData.id || generateId(),
      dateObj,
      shiftData.startTime,
      shiftData.endTime,
      parseFloat(hours.toFixed(2)),
      shiftData.location || '',
      parseFloat(shiftData.tips) || 0,
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
    return { success: true, id: shiftData.id };
  } catch (error) {
    Logger.log('Error adding shift: ' + error.toString());
    Logger.log('Error stack: ' + error.stack);
    throw new Error('Failed to add shift: ' + error.message);
  }
}

/**
 * Updates an existing shift in the spreadsheet
 */
function updateShift(shiftData) {
  try {
    Logger.log('Updating shift: ' + JSON.stringify(shiftData));
    
    if (!shiftData.id) {
      throw new Error('Shift ID is required for updates');
    }
    
    const sheet = getShiftsSheet();
    const data = sheet.getDataRange().getValues();
    
    // Find the row with the matching ID
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][0]) === String(shiftData.id)) {
        const hours = calculateHours(shiftData.date, shiftData.startTime, shiftData.endTime);
        const tipsPerHour = hours > 0 ? (shiftData.tips / hours) : 0;
        
        // Convert date string to Date object for proper storage
        const dateObj = new Date(shiftData.date + 'T00:00:00');
        
        const rowData = [
          shiftData.id,
          dateObj,
          shiftData.startTime,
          shiftData.endTime,
          parseFloat(hours.toFixed(2)),
          shiftData.location || '',
          parseFloat(shiftData.tips) || 0,
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
    
    throw new Error('Shift not found with ID: ' + shiftData.id);
  } catch (error) {
    Logger.log('Error updating shift: ' + error.toString());
    Logger.log('Error stack: ' + error.stack);
    throw new Error('Failed to update shift: ' + error.message);
  }
}

/**
 * Deletes a shift from the spreadsheet
 */
function deleteShift(shiftId) {
  try {
    Logger.log('Deleting shift: ' + shiftId);
    
    if (!shiftId) {
      throw new Error('Shift ID is required for deletion');
    }
    
    const sheet = getShiftsSheet();
    const data = sheet.getDataRange().getValues();
    
    // Find the row with the matching ID
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][0]) === String(shiftId)) {
        sheet.deleteRow(i + 1);
        Logger.log('Successfully deleted shift: ' + shiftId);
        return { success: true };
      }
    }
    
    throw new Error('Shift not found with ID: ' + shiftId);
  } catch (error) {
    Logger.log('Error deleting shift: ' + error.toString());
    Logger.log('Error stack: ' + error.stack);
    throw new Error('Failed to delete shift: ' + error.message);
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
    
    const totalTips = shifts.reduce((sum, shift) => sum + parseFloat(shift.tips || 0), 0);
    const totalHours = shifts.reduce((sum, shift) => sum + parseFloat(shift.hours || 0), 0);
    const averageTipsPerHour = totalHours > 0 ? (totalTips / totalHours) : 0;
    
    return {
      totalShifts: shifts.length,
      totalHours: parseFloat(totalHours.toFixed(2)),
      totalTips: parseFloat(totalTips.toFixed(2)),
      averageTipsPerHour: parseFloat(averageTipsPerHour.toFixed(2))
    };
  } catch (error) {
    Logger.log('Error getting stats: ' + error.toString());
    throw new Error('Failed to get statistics: ' + error.message);
  }
}

/**
 * Generate a unique ID for new shifts
 */
function generateId() {
  return 'shift_' + Date.now().toString() + '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * Test function to add sample data for debugging
 */
function addSampleShift() {
  try {
    const sampleShift = {
      id: generateId(),
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
 * Test function to verify the setup and add sample data
 */
function testSetup() {
  try {
    const sheet = getShiftsSheet();
    Logger.log('Sheet setup successful. Sheet ID: ' + sheet.getParent().getId());
    Logger.log('Sheet URL: ' + sheet.getParent().getUrl());
    
    // Add a sample shift if none exist
    const shifts = getAllShifts();
    Logger.log('Current shifts count: ' + shifts.length);
    
    if (shifts.length === 0) {
      Logger.log('No shifts found, adding sample shift...');
      addSampleShift();
      Logger.log('Sample shift added');
    }
    
    // Test getting shifts again
    const updatedShifts = getAllShifts();
    Logger.log('Updated shifts count: ' + updatedShifts.length);
    
    return {
      success: true,
      message: 'Setup successful',
      shiftCount: updatedShifts.length,
      spreadsheetUrl: sheet.getParent().getUrl()
    };
  } catch (error) {
    Logger.log('Setup error: ' + error.toString());
    Logger.log('Error stack: ' + error.stack);
    throw error;
  }
}
