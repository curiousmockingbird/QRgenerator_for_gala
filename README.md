# Automatic QR Code Generation & Email (Google Apps Script)

This script automates creating QR codes in Google Sheets and sending them via email. It’s primarily designed for event registrations (e.g., a gala), where each row in the sheet represents a guest.

---

## How It Works

1. **Trigger**  
   The `onEdit(e)` function runs automatically whenever you edit the sheet.

2. **Processing**  
   - If a row contains an **email address** but **no QR code** (in the last column), the script will generate one.  
   - It uses a third-party API ([api.qrserver.com](https://goqr.me/api/)) to generate the QR code image URL.  
   - It writes an `=IMAGE("...")` formula into the **last column**, so the QR code image is displayed directly in the cell.

3. **Email**  
   - The script sends an **HTML email** (via `sendEmailWithQRCode`) embedding the newly generated QR code and providing relevant event details.

---

## Important Columns (Sheet Layout)

- **ID** (`Column A`, index **1**)  
- **Name** (`Column B`, index **2**)  
- **Last Name** (`Column D`, index **4**)  
- **Ticket** (`Column G`, index **7**)  
- **Email** (`Column K`, index **11**)  
- **QR Code** (last column in the sheet)

---

## Key Functions

### `onEdit(e)`
- A simple trigger that fires on every sheet edit.  
- Calls `processSheet()` whenever changes occur.

### `processSheet()`
- Loops through rows in the active sheet.  
- Checks if a row has an **email** but **no QR code**.  
- Generates the QR code (if needed) and calls `sendEmailWithQRCode()`.

### `generateQRCodeUrl(data)`
- Constructs a QR code URL using the **api.qrserver.com** service.  
- Returns the image link to be embedded into the sheet cell or email.

### `sendEmailWithQRCode(email, name, lastName, id, ticket, qrUrl)`
- Sends an HTML email (via `MailApp.sendEmail`)  
- Embeds the **QR code** image in the email body.  
- Includes relevant guest/event info.

