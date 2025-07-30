// Google Apps Script integration service
interface GoogleSheetsResponse {
  success: boolean;
  data?: any;
  error?: string;
}

// This URL would be the deployed Google Apps Script web app URL
const GOOGLE_APPS_SCRIPT_URL = process.env.REACT_APP_GOOGLE_SCRIPT_URL || '';

export const googleSheetsService = {
  // Fetch runner data by phone or transaction ID
  async fetchRunner(searchValue: string): Promise<any> {
    try {
      const response = await fetch(`${GOOGLE_APPS_SCRIPT_URL}?action=getRunner&search=${encodeURIComponent(searchValue)}`);
      const result: GoogleSheetsResponse = await response.json();
      
      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.error || 'Failed to fetch runner data');
      }
    } catch (error) {
      console.error('Error fetching runner from Google Sheets:', error);
      throw error;
    }
  },

  // Update runner confirmation status
  async confirmRunner(phone: string): Promise<void> {
    try {
      const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'confirmRunner',
          phone: phone
        })
      });

      const result: GoogleSheetsResponse = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to confirm runner');
      }
    } catch (error) {
      console.error('Error confirming runner in Google Sheets:', error);
      throw error;
    }
  },

  // Update runner details (name and t-shirt size)
  async updateRunner(phone: string, updates: { fullName?: string; tshirtSize?: string }): Promise<void> {
    try {
      const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'updateRunner',
          phone: phone,
          updates: updates
        })
      });

      const result: GoogleSheetsResponse = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to update runner');
      }
    } catch (error) {
      console.error('Error updating runner in Google Sheets:', error);
      throw error;
    }
  },

  // Fetch all runners (for admin panel)
  async fetchAllRunners(): Promise<any[]> {
    try {
      const response = await fetch(`${GOOGLE_APPS_SCRIPT_URL}?action=getAllRunners`);
      const result: GoogleSheetsResponse = await response.json();
      
      if (result.success) {
        return result.data || [];
      } else {
        throw new Error(result.error || 'Failed to fetch all runners');
      }
    } catch (error) {
      console.error('Error fetching all runners from Google Sheets:', error);
      throw error;
    }
  }
};

// Google Apps Script code (to be deployed as a web app)
export const googleAppsScriptCode = `
// This code should be deployed as a Google Apps Script web app
// with "Execute as: Me" and "Who has access: Anyone"

function doGet(e) {
  const action = e.parameter.action;
  const search = e.parameter.search;
  
  try {
    switch (action) {
      case 'getRunner':
        return ContentService
          .createTextOutput(JSON.stringify(getRunner(search)))
          .setMimeType(ContentService.MimeType.JSON);
      
      case 'getAllRunners':
        return ContentService
          .createTextOutput(JSON.stringify(getAllRunners()))
          .setMimeType(ContentService.MimeType.JSON);
      
      default:
        return ContentService
          .createTextOutput(JSON.stringify({success: false, error: 'Invalid action'}))
          .setMimeType(ContentService.MimeType.JSON);
    }
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    
    switch (action) {
      case 'confirmRunner':
        return ContentService
          .createTextOutput(JSON.stringify(confirmRunner(data.phone)))
          .setMimeType(ContentService.MimeType.JSON);
      
      case 'updateRunner':
        return ContentService
          .createTextOutput(JSON.stringify(updateRunner(data.phone, data.updates)))
          .setMimeType(ContentService.MimeType.JSON);
      
      default:
        return ContentService
          .createTextOutput(JSON.stringify({success: false, error: 'Invalid action'}))
          .setMimeType(ContentService.MimeType.JSON);
    }
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function getRunner(searchValue) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  
  // Find phone column and transaction ID column
  const phoneCol = headers.indexOf('Phone Number');
  const transactionCol = headers.indexOf('Transaction ID');
  
  if (phoneCol === -1 || transactionCol === -1) {
    return {success: false, error: 'Required columns not found'};
  }
  
  // Search for runner
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (row[phoneCol] === searchValue || 
        row[transactionCol] === searchValue ||
        row[phoneCol].replace('+88', '') === searchValue.replace('+88', '')) {
      
      // Convert row to object
      const runner = {};
      headers.forEach((header, index) => {
        runner[header] = row[index];
      });
      
      return {success: true, data: runner};
    }
  }
  
  return {success: false, error: 'Runner not found'};
}

function confirmRunner(phone) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  
  const phoneCol = headers.indexOf('Phone Number');
  const confirmedCol = headers.indexOf('Confirmed');
  
  if (phoneCol === -1 || confirmedCol === -1) {
    return {success: false, error: 'Required columns not found'};
  }
  
  // Find and update runner
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (row[phoneCol] === phone || row[phoneCol].replace('+88', '') === phone.replace('+88', '')) {
      sheet.getRange(i + 1, confirmedCol + 1).setValue('Yes');
      return {success: true};
    }
  }
  
  return {success: false, error: 'Runner not found'};
}

function updateRunner(phone, updates) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  
  const phoneCol = headers.indexOf('Phone Number');
  const nameCol = headers.indexOf('Full Name');
  const tshirtCol = headers.indexOf('T-Shirt Size');
  
  if (phoneCol === -1) {
    return {success: false, error: 'Phone column not found'};
  }
  
  // Find and update runner
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (row[phoneCol] === phone || row[phoneCol].replace('+88', '') === phone.replace('+88', '')) {
      if (updates.fullName && nameCol !== -1) {
        sheet.getRange(i + 1, nameCol + 1).setValue(updates.fullName);
      }
      if (updates.tshirtSize && tshirtCol !== -1) {
        sheet.getRange(i + 1, tshirtCol + 1).setValue(updates.tshirtSize);
      }
      return {success: true};
    }
  }
  
  return {success: false, error: 'Runner not found'};
}

function getAllRunners() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  
  const runners = [];
  for (let i = 1; i < data.length; i++) {
    const runner = {};
    headers.forEach((header, index) => {
      runner[header] = data[i][index];
    });
    runners.push(runner);
  }
  
  return {success: true, data: runners};
}
`;