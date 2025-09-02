// Google Apps Script backend code
function doGet() {
  return HtmlService.createTemplateFromFile('index')
    .evaluate()
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

// Get or create the shifts spreadsheet
function getShiftsSheet() {
  const spreadsheetId = PropertiesService.getScriptProperties().getProperty('SHIFTS_SPREADSHEET_ID');
  
  if (spreadsheetId) {
    try {
      return SpreadsheetApp.openById(spreadsheetId).getActiveSheet();
    } catch (e) {
      // Spreadsheet doesn't exist, create new one
    }
  }
  
  // Create new spreadsheet
  const spreadsheet = SpreadsheetApp.create('Bartending Shifts');
  const sheet = spreadsheet.getActiveSheet();
  
  // Set up headers
  sheet.getRange(1, 1, 1, 12).setValues([[
    'ID', 'Date', 'Start Time', 'End Time', 'Location', 'Hours', 
    'Hourly Rate', 'Tips', 'Total Earnings', 'Notes', 'Tags', 'Coworkers'
  ]]);
  
  // Format header row
  sheet.getRange(1, 1, 1, 12).setFontWeight('bold').setBackground('#4285f4').setFontColor('white');
  
  // Save spreadsheet ID
  PropertiesService.getScriptProperties().setProperty('SHIFTS_SPREADSHEET_ID', spreadsheet.getId());
  
  return sheet;
}

// Save a new shift
function saveShift(shiftData) {
  const sheet = getShiftsSheet();
  
  // Calculate hours
  const hours = calculateHours(shiftData.startTime, shiftData.endTime);
  const totalEarnings = (hours * shiftData.hourlyRate) + shiftData.tips;
  
  const rowData = [
    shiftData.id || Utilities.getUuid(),
    shiftData.date,
    shiftData.startTime,
    shiftData.endTime,
    shiftData.location,
    hours,
    shiftData.hourlyRate,
    shiftData.tips,
    totalEarnings,
    shiftData.notes,
    shiftData.tags.join(', '),
    shiftData.coworkers.join(', ')
  ];
  
  if (shiftData.id) {
    // Update existing shift
    const data = sheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === shiftData.id) {
        sheet.getRange(i + 1, 1, 1, 12).setValues([rowData]);
        return { success: true, message: 'Shift updated successfully!' };
      }
    }
  } else {
    // Add new shift
    sheet.appendRow(rowData);
    return { success: true, message: 'Shift saved successfully!' };
  }
}

// Get all shifts
function getShifts() {
  const sheet = getShiftsSheet();
  const data = sheet.getDataRange().getValues();
  
  if (data.length <= 1) return [];
  
  const shifts = [];
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    shifts.push({
      id: row[0],
      date: row[1],
      startTime: row[2],
      endTime: row[3],
      location: row[4],
      hours: row[5],
      hourlyRate: row[6],
      tips: row[7],
      totalEarnings: row[8],
      notes: row[9],
      tags: row[10] ? row[10].split(', ').filter(tag => tag.trim()) : [],
      coworkers: row[11] ? row[11].split(', ').filter(name => name.trim()) : []
    });
  }
  
  return shifts.reverse(); // Most recent first
}

// Delete a shift
function deleteShift(shiftId) {
  const sheet = getShiftsSheet();
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === shiftId) {
      sheet.deleteRow(i + 1);
      return { success: true, message: 'Shift deleted successfully!' };
    }
  }
  
  return { success: false, message: 'Shift not found!' };
}

// Helper function to calculate hours
function calculateHours(startTime, endTime) {
  if (!startTime || !endTime) return 0;
  
  const start = new Date(`1970-01-01T${startTime}`);
  const end = new Date(`1970-01-01T${endTime}`);
  
  // Handle overnight shifts
  if (end < start) {
    end.setDate(end.getDate() + 1);
  }
  
  const diffMs = end.getTime() - start.getTime();
  return Math.round((diffMs / (1000 * 60 * 60)) * 100) / 100;
}

// Get spreadsheet URL for user
function getSpreadsheetUrl() {
  const spreadsheetId = PropertiesService.getScriptProperties().getProperty('SHIFTS_SPREADSHEET_ID');
  if (spreadsheetId) {
    return `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;
  }
  return null;
}