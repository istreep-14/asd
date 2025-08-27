// Main Google Apps Script file - Code.gs
// Bartending Shift Entry Web App

const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID'; // Replace with your Google Sheets ID

// Initialize sheets and create if they don't exist
function initializeSheets() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheetNames = [
    'Shifts', 'Tip_Details', 'Shift_Coworkers', 'Parties', 
    'Chump_Log', 'Bets', 'Tip_Adjustments', 'Personal_Log',
    'Coworkers', 'Locations', 'Positions', 'Events', 'Tip_Calc'
  ];
  
  sheetNames.forEach(name => {
    if (!ss.getSheetByName(name)) {
      ss.insertSheet(name);
      setupSheetHeaders(name);
    }
  });
}

function setupSheetHeaders(sheetName) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(sheetName);
  
  const headers = {
    'Shifts': ['shift_id', 'shift_date', 'start_time', 'end_time', 'total_tips', 'location_id', 'notes', 'weather', 'shift_mood', 'total_hours', 'shift_type'],
    'Tip_Details': ['tip_detail_id', 'shift_id', 'total_cash_tips', 'total_cc_tips', 'total_tips_manual', 'day_cut', 'mid_cut', 'night_cut', 'calculated_tips', 'hourly_tips'],
    'Shift_Coworkers': ['id', 'shift_id', 'coworker_id', 'position', 'start_time', 'end_time', 'location_id', 'rating', 'notes'],
    'Parties': ['party_id', 'shift_id', 'party_name', 'start_time', 'end_time', 'people_count', 'party_tip', 'duration'],
    'Chump_Log': ['chump_id', 'shift_id', 'opponent_name', 'cash_added', 'flip_result', 'winner'],
    'Bets': ['bet_id', 'shift_id', 'bet_type', 'description', 'amount', 'opponent', 'outcome', 'profit_loss'],
    'Tip_Adjustments': ['adjustment_id', 'shift_id', 'adjustment_type', 'amount', 'reason', 'timestamp'],
    'Personal_Log': ['log_id', 'shift_id', 'log_type', 'description', 'timestamp'],
    'Coworkers': ['coworker_id', 'name', 'position', 'contact', 'hire_date', 'active'],
    'Locations': ['location_id', 'name', 'address', 'active'],
    'Positions': ['position_id', 'title', 'description'],
    'Events': ['event_id', 'name', 'date', 'description'],
    'Tip_Calc': ['calc_id', 'shift_id', 'bartender_name', 'hours', 'excluded', 'hourly_rate', 'share']
  };
  
  if (headers[sheetName]) {
    sheet.getRange(1, 1, 1, headers[sheetName].length).setValues([headers[sheetName]]);
  }
}

// Web app entry point
function doGet() {
  return HtmlService.createTemplateFromFile('index')
    .evaluate()
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .setTitle('Bartending Shift Tracker');
}

// Include HTML files
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

// Data retrieval functions
function getShiftData(shiftId = null) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName('Shifts');
  const data = sheet.getDataRange().getValues();
  
  if (shiftId) {
    return data.find(row => row[0] === shiftId);
  }
  return data.slice(1); // Return all except header
}

function getCoworkers() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName('Coworkers');
  const data = sheet.getDataRange().getValues();
  return data.slice(1).filter(row => row[5]); // Only active coworkers
}

function getLocations() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName('Locations');
  const data = sheet.getDataRange().getValues();
  return data.slice(1).filter(row => row[3]); // Only active locations
}

function getPositions() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName('Positions');
  const data = sheet.getDataRange().getValues();
  return data.slice(1);
}

// Save shift data
function saveShiftData(shiftData) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName('Shifts');
    
    // Generate new shift ID if not provided
    if (!shiftData.shift_id) {
      const lastRow = sheet.getLastRow();
      shiftData.shift_id = 'SHIFT_' + (lastRow + 1);
    }
    
    // Calculate total hours
    if (shiftData.start_time && shiftData.end_time) {
      shiftData.total_hours = calculateShiftHours(shiftData.start_time, shiftData.end_time);
      shiftData.shift_type = determineShiftType(shiftData.start_time, shiftData.end_time);
    }
    
    const values = [
      shiftData.shift_id,
      shiftData.shift_date || new Date(),
      shiftData.start_time || '',
      shiftData.end_time || '',
      shiftData.total_tips || 0,
      shiftData.location_id || '',
      shiftData.notes || '',
      shiftData.weather || '',
      shiftData.shift_mood || '',
      shiftData.total_hours || 0,
      shiftData.shift_type || ''
    ];
    
    sheet.appendRow(values);
    return { success: true, shift_id: shiftData.shift_id };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

// Save tip details
function saveTipDetails(tipData) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName('Tip_Details');
    
    const values = [
      'TIP_' + Date.now(),
      tipData.shift_id,
      tipData.total_cash_tips || 0,
      tipData.total_cc_tips || 0,
      tipData.total_tips_manual || 0,
      tipData.day_cut || 0,
      tipData.mid_cut || 0,
      tipData.night_cut || 0,
      tipData.calculated_tips || 0,
      tipData.hourly_tips || 0
    ];
    
    sheet.appendRow(values);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

// Save coworker data
function saveCoworkerShift(coworkerData) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName('Shift_Coworkers');
    
    const values = [
      'COWORKER_' + Date.now(),
      coworkerData.shift_id,
      coworkerData.coworker_id,
      coworkerData.position || '',
      coworkerData.start_time || '',
      coworkerData.end_time || '',
      coworkerData.location_id || '',
      coworkerData.rating || 0,
      coworkerData.notes || ''
    ];
    
    sheet.appendRow(values);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

// Save party data
function savePartyData(partyData) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName('Parties');
    
    const values = [
      'PARTY_' + Date.now(),
      partyData.shift_id,
      partyData.party_name || '',
      partyData.start_time || '',
      partyData.end_time || '',
      partyData.people_count || 0,
      partyData.party_tip || 0,
      partyData.duration || 0
    ];
    
    sheet.appendRow(values);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

// Save bet data
function saveBetData(betData) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName('Bets');
    
    const values = [
      'BET_' + Date.now(),
      betData.shift_id,
      betData.bet_type || '',
      betData.description || '',
      betData.amount || 0,
      betData.opponent || '',
      betData.outcome || '',
      betData.profit_loss || 0
    ];
    
    sheet.appendRow(values);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

// Helper functions
function calculateShiftHours(startTime, endTime) {
  try {
    const start = new Date('2024-01-01 ' + startTime);
    let end = new Date('2024-01-01 ' + endTime);
    
    // Handle overnight shifts
    if (end < start) {
      end = new Date('2024-01-02 ' + endTime);
    }
    
    const diffMs = end - start;
    return Math.round((diffMs / (1000 * 60 * 60)) * 100) / 100; // Round to 2 decimals
  } catch (error) {
    return 0;
  }
}

function determineShiftType(startTime, endTime) {
  try {
    const startHour = parseInt(startTime.split(':')[0]);
    const endHour = parseInt(endTime.split(':')[0]);
    
    if (startHour >= 6 && endHour <= 17) return 'Day';
    if (startHour >= 17 || endHour <= 6) return 'Night';
    return 'Day/Night';
  } catch (error) {
    return 'Unknown';
  }
}

// Get data for specific pages
function getPageData(page, shiftId) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet;
  
  switch(page) {
    case 'tips':
      sheet = ss.getSheetByName('Tip_Details');
      break;
    case 'coworkers':
      sheet = ss.getSheetByName('Shift_Coworkers');
      break;
    case 'parties':
      sheet = ss.getSheetByName('Parties');
      break;
    case 'bets':
      sheet = ss.getSheetByName('Bets');
      break;
    default:
      return [];
  }
  
  const data = sheet.getDataRange().getValues();
  return data.slice(1).filter(row => row[1] === shiftId); // Filter by shift_id
}

// Delete record
function deleteRecord(tableName, recordId) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(tableName);
    const data = sheet.getDataRange().getValues();
    
    const rowIndex = data.findIndex(row => row[0] === recordId);
    if (rowIndex > 0) { // Don't delete header row
      sheet.deleteRow(rowIndex + 1);
      return { success: true };
    }
    return { success: false, error: 'Record not found' };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}
