function onEdit(e) {
  Logger.log('onEdit triggered');
  processSheet();
}

function processSheet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const lastRow = sheet.getLastRow();
  const lastColumn = sheet.getLastColumn();
  const emailColumn = 11; // Column K is the 11th column
  const nameColumn = 2;
  const lastNameColumn = 4;
  const idColumn = 1;
  const ticketColumn = 7;
  const qrCodeColumn = lastColumn; // Last column for QR code
  

  // Loop through all rows to find rows that need processing
  for (let row = 2; row <= lastRow; row++) { // Assuming row 1 is headers
    const emailAddress = sheet.getRange(row, emailColumn).getValue();
    const qrCodeCell = sheet.getRange(row, qrCodeColumn).getValue();
    const name = sheet.getRange(row, nameColumn).getValue();
    const lastName = sheet.getRange(row, lastNameColumn).getValue();
    const id = sheet.getRange(row, idColumn).getValue();
    const ticket = sheet.getRange(row, ticketColumn).getValue();

    if (emailAddress && !qrCodeCell) { // Process rows with an email address and without a QR code
      const rowData = getRowData(sheet, row, lastColumn - 1);
      const text = rowData.join(' '); // Combine all fields except the last one (QR code column)

      Logger.log(`Text: ${text}, Email Address: ${emailAddress}`);

      // Generate QR code URL
      const qrCodeUrl = generateQRCodeUrl(text);

      // Log the URL for debugging
      Logger.log(`QR Code URL: ${qrCodeUrl}`);

      // Set the QR code image using the IMAGE function in the last column of the row
      sheet.getRange(row, qrCodeColumn).setFormula(`=IMAGE("${qrCodeUrl}")`);

      // Send an email with the QR code
      sendEmailWithQRCode(emailAddress, name, lastName, id, ticket, qrCodeUrl);
    }
  }
}

function getRowData(sheet, row, columns) {
  Logger.log(`Retrieving data from row ${row} and ${columns} columns`);
  return sheet.getRange(row, 1, 1, columns).getValues()[0];
}

function generateQRCodeUrl(data) {
  const url = 'https://api.qrserver.com/v1/create-qr-code/?data=' + encodeURIComponent(data) + '&size=500x500';
  Logger.log(`Generated QR Code URL: ${url}`);
  return url;
}

function sendEmailWithQRCode(emailAddress, name, lastName, id, ticket, qrCodeUrl) {
  const subject = 'Registration QR Code (Voces de la Frontera Annual Gala 2024)';
  const body = `Dear ${name} ${lastName},<br><br>
  For a seamless registration experience, please present this QR code at our highly anticipated Annual Community Gala. Join us on Friday, September 13th at 5:00 PM at the Italian Community Center for an unforgettable evening! <br><br>
  ------------ <br><br>
  Para una experiencia de registro sin problemas, por favor presente este código QR en nuestra muy esperada Gala Anual Comunitaria. ¡Únase a nosotros el viernes 13 de septiembre a las 5:00 PM en el Italian Community Center para una noche inolvidable!<br><br>
  ------------ <br><br>
  <img src="${qrCodeUrl}" alt="QR Code" style="display:block; width:250px; height:250px;"> <br><br>
  Guest: ${name} ${lastName}<br>
  Ticket level: ${ticket}<br>
  Ticket ID: ${id}
  `;
  const options = {
    to: emailAddress,
    subject: subject,
    htmlBody: body,
    from: 'Danielle@voces-wi.org' // Replace with your alias email address
  };

  try {
    MailApp.sendEmail(options);
    Logger.log(`Email sent to ${emailAddress}`);
  } catch (error) {
    Logger.log(`Failed to send email to ${emailAddress}: ${error.message}`);
  }
}