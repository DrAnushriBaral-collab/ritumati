function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents || "{}");
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Join Responses") || ss.insertSheet("Join Responses");
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["submitted_at","name","email","phone","interest","message"]);
    }
    sheet.appendRow([
      data.submitted_at || new Date().toISOString(),
      data.name || "",
      data.email || "",
      data.phone || "",
      data.interest || "",
      data.message || ""
    ]);
    return ContentService.createTextOutput(JSON.stringify({ok:true}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ok:false,error:String(err)}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function setup() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Join Responses") || ss.insertSheet("Join Responses");
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["submitted_at","name","email","phone","interest","message"]);
  }
}
