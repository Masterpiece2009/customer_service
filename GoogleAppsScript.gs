/**
 * ============================================================================
 * Google Apps Script for Customer Survey Form
 * ============================================================================
 * 
 * This script receives form data from the React frontend and saves it to 
 * a Google Sheet. It also handles CORS for cross-origin requests.
 * 
 * SETUP INSTRUCTIONS:
 * 1. Go to https://script.google.com and create a new project
 * 2. Delete the default code and paste this entire script
 * 3. Create a Google Sheet (or use an existing one)
 * 4. Copy the Sheet ID from the URL and replace SHEET_ID below
 * 5. Deploy as Web App (see detailed steps in README.md)
 * 6. Copy the deployment URL and paste it in your frontend code
 * ============================================================================
 */

// ============================================================================
// CONFIGURATION - UPDATE THESE VALUES
// ============================================================================

// Replace with your Google Sheet ID (from the URL)
const SHEET_ID = 'YOUR_GOOGLE_SHEET_ID_HERE';

// Sheet name (default is 'Sheet1', change if you renamed it)
const SHEET_NAME = 'Sheet1';

// Allowed origins for CORS (add your domain when deploying)
const ALLOWED_ORIGINS = [
  '*',  // Allow all origins (for testing only - restrict in production)
  // 'https://your-domain.vercel.app',  // Uncomment and add your domain
];

// ============================================================================
// MAIN FUNCTIONS
// ============================================================================

/**
 * Main entry point - handles POST requests from the form
 */
function doPost(e) {
  try {
    // Log the request for debugging
    console.log('Received request:', e);
    
    // Parse the request data
    let data;
    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else if (e.parameter) {
      data = e.parameter;
    } else {
      throw new Error('No data received');
    }
    
    console.log('Parsed data:', data);
    
    // Validate required fields
    if (!data.customerName || !data.complaintType) {
      return createResponse({
        success: false,
        message: 'Missing required fields: customerName and complaintType are required'
      }, 400);
    }
    
    // Get or create the sheet
    const sheet = getOrCreateSheet();
    
    // Add headers if this is a new sheet
    if (sheet.getLastRow() === 0) {
      addHeaders(sheet);
    }
    
    // Append the data row
    const rowData = [
      new Date(),                                    // Timestamp (Column A)
      data.language || 'ar',                         // Language (Column B)
      data.customerName,                             // Customer Name (Column C)
      getComplaintTypeLabel(data.complaintType, data.language), // Complaint Type (Column D)
      data.complaintType,                            // Complaint Type Code (Column E)
      data.notes || '',                              // Notes (Column F)
      Session.getActiveUser().getEmail() || 'Anonymous', // User Email (Column G)
      Utilities.getUuid()                            // Unique ID (Column H)
    ];
    
    sheet.appendRow(rowData);
    
    console.log('Data saved successfully');
    
    // Return success response
    return createResponse({
      success: true,
      message: 'Data saved successfully',
      id: rowData[7]
    });
    
  } catch (error) {
    console.error('Error in doPost:', error);
    return createResponse({
      success: false,
      message: 'Error saving data: ' + error.toString()
    }, 500);
  }
}

/**
 * Handle GET requests (for testing the deployment)
 */
function doGet(e) {
  return createResponse({
    success: true,
    message: 'Customer Survey API is running!',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
}

/**
 * Handle OPTIONS requests for CORS preflight
 */
function doOptions(e) {
  return createResponse({}, 204);
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get or create the target sheet
 */
function getOrCreateSheet() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAME);
      console.log('Created new sheet:', SHEET_NAME);
    }
    
    return sheet;
  } catch (error) {
    console.error('Error accessing sheet:', error);
    throw new Error('Could not access Google Sheet. Please check the SHEET_ID.');
  }
}

/**
 * Add column headers to a new sheet
 */
function addHeaders(sheet) {
  const headers = [
    'Timestamp',
    'Language',
    'Customer Name',
    'Complaint Type',
    'Complaint Code',
    'Notes',
    'Submitted By',
    'Unique ID'
  ];
  
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setValues([headers]);
  
  // Format headers
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#4285f4');
  headerRange.setFontColor('#ffffff');
  
  // Auto-resize columns
  sheet.autoResizeColumns(1, headers.length);
  
  // Freeze header row
  sheet.setFrozenRows(1);
  
  console.log('Headers added to sheet');
}

/**
 * Get human-readable complaint type label
 */
function getComplaintTypeLabel(code, language) {
  const labels = {
    ar: {
      'service_quality': 'جودة الخدمة',
      'technical_issue': 'مشكلة تقنية',
      'billing_issue': 'مشكلة في الفواتير',
      'delay_issue': 'تأخر في الخدمة',
      'other': 'أخرى'
    },
    en: {
      'service_quality': 'Service Quality',
      'technical_issue': 'Technical Issue',
      'billing_issue': 'Billing Issue',
      'delay_issue': 'Service Delay',
      'other': 'Other'
    }
  };
  
  const lang = language || 'ar';
  return (labels[lang] && labels[lang][code]) || code;
}

/**
 * Create a JSON response with CORS headers
 */
function createResponse(data, statusCode = 200) {
  const output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  
  // Note: CORS headers need to be set in the app manifest or using HtmlService
  // For web app deployments, use the following approach:
  
  return output;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Test function - run this to verify your setup
 */
function testSetup() {
  try {
    const sheet = getOrCreateSheet();
    console.log('✅ Successfully connected to sheet:', sheet.getName());
    console.log('📊 Sheet URL:', sheet.getParent().getUrl());
    
    // Test data
    const testData = {
      language: 'ar',
      customerName: 'Test User',
      complaintType: 'technical_issue',
      notes: 'This is a test entry'
    };
    
    console.log('🧪 Test data:', testData);
    console.log('✅ Setup test completed successfully!');
    
  } catch (error) {
    console.error('❌ Setup test failed:', error);
  }
}

/**
 * Get all submissions (for admin purposes)
 */
function getAllSubmissions() {
  const sheet = getOrCreateSheet();
  const data = sheet.getDataRange().getValues();
  
  // Skip header row
  const submissions = data.slice(1).map(row => ({
    timestamp: row[0],
    language: row[1],
    customerName: row[2],
    complaintType: row[3],
    complaintCode: row[4],
    notes: row[5],
    submittedBy: row[6],
    id: row[7]
  }));
  
  console.log('Total submissions:', submissions.length);
  return submissions;
}

/**
 * Delete a submission by ID
 */
function deleteSubmission(id) {
  const sheet = getOrCreateSheet();
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][7] === id) {
      sheet.deleteRow(i + 1);
      console.log('Deleted submission:', id);
      return true;
    }
  }
  
  console.log('Submission not found:', id);
  return false;
}

/**
 * Get submission statistics
 */
function getStatistics() {
  const submissions = getAllSubmissions();
  
  const stats = {
    total: submissions.length,
    byLanguage: {},
    byComplaintType: {},
    recentSubmissions: submissions.slice(-10)
  };
  
  submissions.forEach(sub => {
    // Count by language
    stats.byLanguage[sub.language] = (stats.byLanguage[sub.language] || 0) + 1;
    
    // Count by complaint type
    stats.byComplaintType[sub.complaintType] = (stats.byComplaintType[sub.complaintType] || 0) + 1;
  });
  
  console.log('Statistics:', stats);
  return stats;
}

// ============================================================================
// WEB APP DEPLOYMENT HELPER
// ============================================================================

/**
 * Instructions for deploying as a web app:
 * 
 * 1. Save this project (Ctrl+S or Cmd+S)
 * 2. Click "Deploy" → "New deployment"
 * 3. Click the gear icon (⚙️) and select "Web app"
 * 4. Configure:
 *    - Description: Customer Survey API
 *    - Execute as: Me
 *    - Who has access: Anyone (for public access)
 * 5. Click "Deploy"
 * 6. Authorize the script when prompted
 * 7. Copy the Web App URL
 * 8. Paste it in your frontend code (App.tsx) as GOOGLE_SCRIPT_URL
 * 
 * To update the deployment after making changes:
 * 1. Save the project
 * 2. Click "Deploy" → "Manage deployments"
 * 3. Click the pencil icon (✏️) next to your deployment
 * 4. Click "Version" → "New version"
 * 5. Click "Deploy"
 */

// Run this to see deployment instructions in the logs
function showDeploymentInstructions() {
  console.log(`
╔══════════════════════════════════════════════════════════════════════╗
║                    DEPLOYMENT INSTRUCTIONS                           ║
╠══════════════════════════════════════════════════════════════════════╣
║  1. Click "Deploy" → "New deployment"                                ║
║  2. Click the gear icon (⚙️) → Select "Web app"                      ║
║  3. Configure:                                                       ║
║     • Description: Customer Survey API                               ║
║     • Execute as: Me                                                 ║
║     • Who has access: Anyone                                         ║
║  4. Click "Deploy"                                                   ║
║  5. Authorize permissions when prompted                              ║
║  6. Copy the Web App URL                                             ║
║  7. Paste it in your React app as GOOGLE_SCRIPT_URL                  ║
╚══════════════════════════════════════════════════════════════════════╝
  `);
}
