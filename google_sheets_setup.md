# Setup Guide: Google Sheets Testimony Backend

Follow these steps to connect your website's testimony board to a free, shared Google Sheet backend. This allows submissions from any visitor to be shared and displayed to everyone automatically.

---

## Step 1: Create the Google Sheet
1. Open your web browser and go to [Google Sheets](https://sheets.google.com).
2. Create a new **Blank spreadsheet**.
3. Name the sheet something descriptive, like `My Father's Sheep Testimonies`.
4. In the first row (Row 1), add the following column headers in columns A, B, C, and D:
   - **Column A**: `Name`
   - **Column B**: `Testimony`
   - **Column C**: `Badges`
   - **Column D**: `Date`

---

## Step 2: Open Google Apps Script
1. In the Google Sheets menu bar, click on **Extensions** -> **Apps Script**.
2. Delete any default code in the editor (`Code.gs`).
3. Copy and paste the following Google Apps Script code into the editor:

```javascript
// Google Apps Script to handle Testimonies & Newsletter signups
function doGet(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Testimonies") || ss.getSheets()[0];
  var data = sheet.getDataRange().getValues();
  var testimonies = [];
  
  if (data.length <= 1) {
    return ContentService.createTextOutput(JSON.stringify([]))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  // Read rows starting from row 2 (skipping headers)
  for (var i = 1; i < data.length; i++) {
    var badgesList = [];
    try {
      badgesList = JSON.parse(data[i][2] || '[]');
    } catch (err) {
      badgesList = [data[i][2]];
    }
    
    testimonies.push({
      name: data[i][0],
      text: data[i][1],
      badges: badgesList,
      date: data[i][3]
    });
  }
  
  return ContentService.createTextOutput(JSON.stringify(testimonies))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    var item = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // Route based on submission type
    if (item.type === "newsletter") {
      var sheet = ss.getSheetByName("Newsletter");
      if (!sheet) {
        sheet = ss.insertSheet("Newsletter");
        sheet.appendRow(["Email", "Date"]);
      }
      sheet.appendRow([
        item.email,
        item.date
      ]);
    } else {
      // Default to testimonies
      var sheet = ss.getSheetByName("Testimonies") || ss.getSheets()[0];
      // Rename first sheet if it's default 'Sheet1' to make spreadsheet clean
      if (sheet.getName() === "Sheet1") {
        sheet.setName("Testimonies");
        sheet.clearContents();
        sheet.appendRow(["Name", "Testimony", "Badges", "Date"]);
      }
      sheet.appendRow([
        item.name,
        item.text,
        JSON.stringify(item.badges || []),
        item.date
      ]);
    }
    
    return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

4. Click the **Save** icon (disk icon) or press `Ctrl + S`.

---

## Step 3: Deploy as a Web App
1. At the top right of the Apps Script page, click **Deploy** -> **New deployment**.
2. Click the gear icon next to "Select type" and select **Web app**.
3. Fill out the configuration fields:
   - **Description**: `MFS Testimonies Sync API`
   - **Execute as**: `Me (your-email@gmail.com)`
   - **Who has access**: **`Anyone`** (Crucial: This allows your website front-end to communicate with the sheet).
4. Click **Deploy**.
5. Google will ask you to **Authorize Access**. Click "Authorize access", sign in with your Google account, click "Advanced", and then click "Go to Untitled project (unsafe)" / "Allow" to grant the necessary permissions.
6. Once deployed, copy the **Web app URL** shown on the screen (it will end with `/exec`).

---

## Step 4: Link to your Code
1. Open the [app.js](file:///c:/Users/hp/OneDrive/Desktop/My%20Father's%20Sheep/app.js) file.
2. Locate the line at the very top:
   ```javascript
   const GOOGLE_SHEETS_SCRIPT_URL = "";
   ```
3. Paste your copied Web App URL inside the quotation marks:
   ```javascript
   const GOOGLE_SHEETS_SCRIPT_URL = "https://script.google.com/macros/s/XXXXX/exec";
   ```
4. Save the file.

Your testimony board is now live and persistent! Submissions will be stored in your Google Sheet and loaded instantly for all users.
