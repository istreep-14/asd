// Main Google Apps Script file - Code.gs

// Configuration
const CONFIG = {
  SPREADSHEET_ID: 'your_spreadsheet_id_here',
  SHEETS: {
    SHIFTS: 'Shifts',
    TIP_DETAILS: 'Tip_Details',
    SHIFT_COWORKERS: 'Shift_Coworkers',
    PARTIES: 'Parties',
    CHUMP_LOG: 'Chump_Log',
    BETS: 'Bets',
    TIP_ADJUSTMENTS: 'Tip_Adjustments',
    PERSONAL_LOG: 'Personal_Log',
    COWORKERS: 'Coworkers',
    LOCATIONS: 'Locations',
    POSITIONS: 'Positions',
    EVENTS: 'Events',
    TIP_CALC: 'Tip_Calc'
  }
};

// Initialize web app
function doGet(e) {
  const page = e.parameter.page || 'main';
  const template = HtmlService.createTemplateFromFile('index');
  template.page = page;
  
  return template.evaluate()
    .setTitle('Bartending Shift Manager')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

// Include HTML files
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

// Database Manager Class
class DatabaseManager {
  constructor() {
    this.spreadsheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    this.cache = CacheService.getScriptCache();
  }
  
  getSheet(sheetName) {
    return this.spreadsheet.getSheetByName(sheetName);
  }
  
  // Generic data retrieval
  getData(sheetName, range = null) {
    const cacheKey = `${sheetName}_${range || 'all'}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached) {
      return JSON.parse(cached);
    }
    
    const sheet = this.getSheet(sheetName);
    const data = range ? sheet.getRange(range).getValues() : sheet.getDataRange().getValues();
    
    // Cache for 10 minutes
    this.cache.put(cacheKey, JSON.stringify(data), 600);
    return data;
  }
  
  // Generic data insertion
  insertData(sheetName, data) {
    const sheet = this.getSheet(sheetName);
    const lastRow = sheet.getLastRow();
    
    // Generate ID if not provided
    if (!data.id) {
      data.id = this.generateId();
    }
    
    const values = Object.values(data);
    sheet.getRange(lastRow + 1, 1, 1, values.length).setValues([values]);
    
    // Clear related cache
    this.clearCache(sheetName);
    return data.id;
  }
  
  // Update existing data
  updateData(sheetName, id, data) {
    const sheet = this.getSheet(sheetName);
    const allData = sheet.getDataRange().getValues();
    const headers = allData[0];
    const idIndex = headers.indexOf('id');
    
    for (let i = 1; i < allData.length; i++) {
      if (allData[i][idIndex] === id) {
        const updatedRow = headers.map(header => data[header] || allData[i][headers.indexOf(header)]);
        sheet.getRange(i + 1, 1, 1, updatedRow.length).setValues([updatedRow]);
        break;
      }
    }
    
    this.clearCache(sheetName);
    return true;
  }
  
  generateId() {
    return 'ID_' + new Date().getTime() + '_' + Math.random().toString(36).substr(2, 9);
  }
  
  clearCache(pattern = null) {
    // Clear specific cache or all cache
    if (pattern) {
      // Google Apps Script doesn't support pattern-based cache clearing
      // So we'll implement a simple version tracking system
      const version = (parseInt(this.cache.get('cache_version') || '0') + 1).toString();
      this.cache.put('cache_version', version);
    }
  }
}

// Initialize database manager
const db = new DatabaseManager();

// API Functions for client-side calls

// Shift Management
function saveShift(shiftData) {
  try {
    // Validate data
    const validation = validateShiftData(shiftData);
    if (!validation.valid) {
      return { success: false, errors: validation.errors };
    }
    
    // Calculate derived fields
    shiftData.total_hours = calculateShiftHours(shiftData.start_time, shiftData.end_time);
    shiftData.shift_type = determineShiftType(shiftData.start_time, shiftData.end_time);
    shiftData.hourly_rate = shiftData.total_tips / shiftData.total_hours;
    shiftData.created_date = new Date();
    
    const shiftId = db.insertData(CONFIG.SHEETS.SHIFTS, shiftData);
    
    return { success: true, shift_id: shiftId };
  } catch (error) {
    console.error('Error saving shift:', error);
    return { success: false, error: error.toString() };
  }
}

function updateShift(shiftId, shiftData) {
  try {
    shiftData.total_hours = calculateShiftHours(shiftData.start_time, shiftData.end_time);
    shiftData.shift_type = determineShiftType(shiftData.start_time, shiftData.end_time);
    shiftData.hourly_rate = shiftData.total_tips / shiftData.total_hours;
    shiftData.updated_date = new Date();
    
    db.updateData(CONFIG.SHEETS.SHIFTS, shiftId, shiftData);
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

function getShifts(limit = 50, offset = 0) {
  try {
    const data = db.getData(CONFIG.SHEETS.SHIFTS);
    const headers = data[0];
    const rows = data.slice(1 + offset, 1 + offset + limit);
    
    const shifts = rows.map(row => {
      const shift = {};
      headers.forEach((header, index) => {
        shift[header] = row[index];
      });
      return shift;
    });
    
    return { success: true, data: shifts };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

// Coworker Management
function saveCoworker(coworkerData) {
  try {
    const coworkerId = db.insertData(CONFIG.SHEETS.COWORKERS, coworkerData);
    return { success: true, coworker_id: coworkerId };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

function getCoworkers() {
  try {
    const data = db.getData(CONFIG.SHEETS.COWORKERS);
    const headers = data[0];
    const coworkers = data.slice(1).map(row => {
      const coworker = {};
      headers.forEach((header, index) => {
        coworker[header] = row[index];
      });
      return coworker;
    });
    
    return { success: true, data: coworkers };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

// Shift Coworkers
function saveShiftCoworkers(shiftId, coworkers) {
  try {
    coworkers.forEach(coworker => {
      const shiftCoworkerData = {
        shift_id: shiftId,
        coworker_id: coworker.coworker_id,
        coworker_name: coworker.name,
        position: coworker.position,
        start_time: coworker.start_time,
        end_time: coworker.end_time,
        location: coworker.location,
        rating: coworker.rating,
        notes: coworker.notes
      };
      
      db.insertData(CONFIG.SHEETS.SHIFT_COWORKERS, shiftCoworkerData);
    });
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

// Party Management
function saveParty(shiftId, partyData) {
  try {
    partyData.shift_id = shiftId;
    partyData.party_duration = calculatePartyDuration(partyData.start_time, partyData.end_time);
    
    const partyId = db.insertData(CONFIG.SHEETS.PARTIES, partyData);
    return { success: true, party_id: partyId };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

// Tip Details
function saveTipDetails(shiftId, tipData) {
  try {
    tipData.shift_id = shiftId;
    tipData.calculated_tips = (tipData.total_cash_tips || 0) + (tipData.total_cc_tips || 0);
    
    const tipId = db.insertData(CONFIG.SHEETS.TIP_DETAILS, tipData);
    return { success: true, tip_id: tipId };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

// Bets Management
function saveBet(shiftId, betData) {
  try {
    betData.shift_id = shiftId;
    betData.profit_loss = calculateBetProfitLoss(betData);
    
    const betId = db.insertData(CONFIG.SHEETS.BETS, betData);
    return { success: true, bet_id: betId };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

// Chump Change Management
function saveChumpChange(shiftId, chumpData) {
  try {
    chumpData.shift_id = shiftId;
    
    const chumpId = db.insertData(CONFIG.SHEETS.CHUMP_LOG, chumpData);
    return { success: true, chump_id: chumpId };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

// Analytics Functions
function getSeasonalAnalytics() {
  try {
    const shifts = db.getData(CONFIG.SHEETS.SHIFTS);
    const analytics = analyzeSeasonalPatterns(shifts);
    return { success: true, data: analytics };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

function getCoworkerAnalytics() {
  try {
    const shifts = db.getData(CONFIG.SHEETS.SHIFTS);
    const shiftCoworkers = db.getData(CONFIG.SHEETS.SHIFT_COWORKERS);
    const analytics = analyzeCoworkerImpact(shifts, shiftCoworkers);
    return { success: true, data: analytics };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

// Utility Functions
function calculateShiftHours(startTime, endTime) {
  const start = new Date(`1970-01-01 ${startTime}`);
  const end = new Date(`1970-01-01 ${endTime}`);
  
  // Handle overnight shifts
  if (end < start) {
    end.setDate(end.getDate() + 1);
  }
  
  return (end - start) / (1000 * 60 * 60); // Convert to hours
}

function determineShiftType(startTime, endTime) {
  const startHour = parseInt(startTime.split(':')[0]);
  const endHour = parseInt(endTime.split(':')[0]);
  
  if (startHour >= 6 && endHour <= 14) return 'Day';
  if (startHour >= 14 && endHour <= 22) return 'Evening';
  if (startHour >= 22 || endHour <= 6) return 'Night';
  return 'Mixed';
}

function calculatePartyDuration(startTime, endTime) {
  const start = new Date(`1970-01-01 ${startTime}`);
  const end = new Date(`1970-01-01 ${endTime}`);
  
  if (end < start) {
    end.setDate(end.getDate() + 1);
  }
  
  return (end - start) / (1000 * 60 * 60);
}

function calculateBetProfitLoss(betData) {
  const amount = parseFloat(betData.bet_amount) || 0;
  const odds = parseFloat(betData.odds) || 1;
  const won = betData.result === 'won';
  
  if (won) {
    return amount * odds - amount;
  } else {
    return -amount;
  }
}

function validateShiftData(data) {
  const errors = [];
  
  if (!data.shift_date) errors.push('Shift date is required');
  if (!data.start_time) errors.push('Start time is required');
  if (!data.end_time) errors.push('End time is required');
  if (!data.total_tips || data.total_tips < 0) errors.push('Valid total tips amount is required');
  if (!data.location) errors.push('Location is required');
  
  return {
    valid: errors.length === 0,
    errors: errors
  };
}

// Analytics Helper Functions
function analyzeSeasonalPatterns(shifts) {
  const monthlyData = {};
  const dayOfWeekData = {};
  
  shifts.slice(1).forEach(shift => {
    const date = new Date(shift[0]); // Assuming first column is shift_date
    const month = date.getMonth();
    const dayOfWeek = date.getDay();
    const tips = parseFloat(shift[3]) || 0; // Assuming 4th column is total_tips
    
    // Monthly analysis
    if (!monthlyData[month]) {
      monthlyData[month] = { total: 0, count: 0, tips: [] };
    }
    monthlyData[month].total += tips;
    monthlyData[month].count++;
    monthlyData[month].tips.push(tips);
    
    // Day of week analysis
    if (!dayOfWeekData[dayOfWeek]) {
      dayOfWeekData[dayOfWeek] = { total: 0, count: 0, tips: [] };
    }
    dayOfWeekData[dayOfWeek].total += tips;
    dayOfWeekData[dayOfWeek].count++;
    dayOfWeekData[dayOfWeek].tips.push(tips);
  });
  
  // Calculate averages
  const monthlyAverages = Object.keys(monthlyData).map(month => ({
    month: parseInt(month),
    average: monthlyData[month].total / monthlyData[month].count,
    count: monthlyData[month].count
  }));
  
  const dayAverages = Object.keys(dayOfWeekData).map(day => ({
    day: parseInt(day),
    average: dayOfWeekData[day].total / dayOfWeekData[day].count,
    count: dayOfWeekData[day].count
  }));
  
  return {
    monthly: monthlyAverages,
    daily: dayAverages,
    best_month: monthlyAverages.reduce((prev, current) => prev.average > current.average ? prev : current),
    best_day: dayAverages.reduce((prev, current) => prev.average > current.average ? prev : current)
  };
}

function analyzeCoworkerImpact(shifts, shiftCoworkers) {
  // Implementation for coworker impact analysis
  const coworkerImpact = {};
  
  // This would involve complex analysis of shifts with different coworker combinations
  // For brevity, returning a simplified structure
  
  return {
    top_performers: [],
    team_compositions: [],
    individual_ratings: {}
  };
}

// Setup and initialization functions
function onInstall() {
  createTriggers();
  initializeSheets();
}

function createTriggers() {
  // Create time-based triggers for analytics and backups
  ScriptApp.newTrigger('runDailyAnalytics')
    .timeBased()
    .everyDays(1)
    .atHour(2)
    .create();
}

function initializeSheets() {
  // Create sheets if they don't exist
  const spreadsheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  
  Object.values(CONFIG.SHEETS).forEach(sheetName => {
    if (!spreadsheet.getSheetByName(sheetName)) {
      const sheet = spreadsheet.insertSheet(sheetName);
      initializeSheetHeaders(sheet, sheetName);
    }
  });
}

function initializeSheetHeaders(sheet, sheetName) {
  const headers = getSheetHeaders(sheetName);
  if (headers.length > 0) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  }
}

function getSheetHeaders(sheetName) {
  const headerMap = {
    [CONFIG.SHEETS.SHIFTS]: ['id', 'shift_date', 'start_time', 'end_time', 'total_tips', 'location', 'notes', 'weather', 'shift_mood', 'total_hours', 'shift_type', 'hourly_rate', 'created_date', 'updated_date'],
    [CONFIG.SHEETS.TIP_DETAILS]: ['id', 'shift_id', 'total_cash_tips', 'total_cc_tips', 'calculated_tips', 'total_tips_manual', 'day_cut', 'mid_cut', 'night_cut', 'hourly_tips'],
    [CONFIG.SHEETS.SHIFT_COWORKERS]: ['id', 'shift_id', 'coworker_id', 'coworker_name', 'position', 'start_time', 'end_time', 'location', 'rating', 'notes'],
    [CONFIG.SHEETS.PARTIES]: ['id', 'shift_id', 'party_type', 'total_people', 'total_party_tip', 'start_time', 'end_time', 'party_duration', 'notes'],
    [CONFIG.SHEETS.CHUMP_LOG]: ['id', 'shift_id', 'chump_amount_total', 'chump_winner', 'participants', 'notes'],
    [CONFIG.SHEETS.BETS]: ['id', 'shift_id', 'bet_type', 'bet_amount', 'odds', 'opponent', 'result', 'profit_loss', 'notes'],
    [CONFIG.SHEETS.TIP_ADJUSTMENTS]: ['id', 'shift_id', 'adjustment_type', 'amount', 'reason', 'notes'],
    [CONFIG.SHEETS.PERSONAL_LOG]: ['id', 'shift_id', 'log_type', 'entry', 'timestamp'],
    [CONFIG.SHEETS.COWORKERS]: ['id', 'coworker_name', 'position', 'phone', 'email', 'hire_date', 'notes'],
    [CONFIG.SHEETS.LOCATIONS]: ['id', 'location_name', 'address', 'type', 'notes'],
    [CONFIG.SHEETS.POSITIONS]: ['id', 'position_name', 'description'],
    [CONFIG.SHEETS.EVENTS]: ['id', 'event_name', 'event_date', 'event_type', 'description'],
    [CONFIG.SHEETS.TIP_CALC]: ['id', 'shift_id', 'bartender_name', 'hours_worked', 'tip_share', 'excluded']
  };
  
  return headerMap[sheetName] || [];
}
