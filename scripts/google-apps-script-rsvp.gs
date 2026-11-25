/**
 * Google Apps Script Web App nhận Xác nhận tham dự (RSVP) & Lời chúc từ thiệp cưới.
 *
 * Cách cài đặt:
 * 1. Mở Google Sheet bạn muốn dùng để lưu danh sách khách.
 * 2. Vào menu Tiện ích mở rộng (Extensions) -> Apps Script.
 * 3. Xóa code mặc định, dán toàn bộ file này vào và Lưu (Ctrl+S).
 * 4. Nhấn Triển khai (Deploy) -> Tùy chọn triển khai mới (New deployment) -> Loại: Ứng dụng web (Web app):
 *    - Thực thi dưới dạng (Execute as): Tôi (Me)
 *    - Người có quyền truy cập (Who has access): Bất kỳ ai (Anyone)
 * 5. Cấp quyền cho script (kể cả quyền gửi Gmail để tự động báo RSVP mới) rồi copy URL /exec dán vào VITE_GOOGLE_SHEETS_URL trong file .env.
 */

var SHEET_NAME = 'RSVP';
var TIMEZONE = 'Asia/Ho_Chi_Minh';
// Để trống '' để tự động gửi thông báo về chính Gmail của bạn (chủ sở hữu file Sheet),
// hoặc điền email cụ thể (có thể cách nhau bằng dấu phẩy, VD: 'a@gmail.com,b@gmail.com').
var NOTIFY_EMAIL = '';
var DUPLICATE_WINDOW_MS = 10000;
var DEFAULT_MESSAGE = 'Chúc hai bạn trăm năm hạnh phúc viên mãn!';
var WISHES_CACHE_KEY = 'rsvp_wishes_v1';
var WISHES_CACHE_TTL_SEC = 60;

var HEADERS = [
  'ID',
  'Thời gian (VN)',
  'Họ và tên',
  'Trạng thái',
  'Số người',
  'Lời chúc',
  'Hiển thị',
  'createdAt',
];

var ATTENDANCE_TO_VI = {
  attending: 'Tham dự',
  'not-attending': 'Không tham dự',
  maybe: 'Chưa chắc chắn',
};

var VI_TO_ATTENDANCE = {
  'Tham dự': 'attending',
  'Không tham dự': 'not-attending',
  'Chưa chắc chắn': 'maybe',
};

function doGet() {
  try {
    var cache = CacheService.getScriptCache();
    var cachedJson = cache.get(WISHES_CACHE_KEY);
    if (cachedJson) {
      return ContentService
        .createTextOutput(cachedJson)
        .setMimeType(ContentService.MimeType.JSON);
    }

    var sheet = getOrCreateRsvpSheet();
    var lastRow = sheet.getLastRow();
    var wishes = [];

    if (lastRow >= 2) {
      var rows = sheet.getRange(2, 1, lastRow - 1, 8).getValues();
      for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        var isVisible = row[6] === true || String(row[6]).toUpperCase() === 'TRUE';
        var guestName = String(row[2] || '').trim();
        if (!isVisible || !guestName) continue;

        var attendance = VI_TO_ATTENDANCE[String(row[3] || '').trim()] || 'attending';
        var rawCount = Number(row[4]);
        var guestCount = attendance === 'attending'
          ? Math.max(1, isNaN(rawCount) ? 1 : rawCount)
          : 1;

        var createdAtRaw = row[7] instanceof Date
          ? row[7].toISOString()
          : String(row[7] || '').trim() || new Date().toISOString();

        wishes.push({
          id: String(row[0] || ('sheet-' + (i + 2))),
          guestName: guestName,
          side: 'both',
          attendance: attendance,
          guestCount: guestCount,
          message: String(row[5] || '').trim() || DEFAULT_MESSAGE,
          createdAt: createdAtRaw,
        });
      }
    }

    wishes.sort(function (a, b) {
      return Date.parse(b.createdAt) - Date.parse(a.createdAt);
    });

    var jsonPayload = JSON.stringify({ ok: true, wishes: wishes });
    try {
      if (jsonPayload.length < 95000) {
        cache.put(WISHES_CACHE_KEY, jsonPayload, WISHES_CACHE_TTL_SEC);
      }
    } catch (cacheErr) {
      // Bỏ qua nếu vượt giới hạn kích thước cache của Apps Script
    }

    return ContentService
      .createTextOutput(jsonPayload)
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return jsonResponse({
      ok: false,
      error: err && err.message ? err.message : 'Không thể đọc dữ liệu Google Sheet.',
    });
  }
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    var payload = parseRequestPayload(e);
    var guestName = String(payload.guestName || '').trim();
    if (!guestName) {
      return jsonResponse({ ok: false, error: 'Vui lòng nhập tên của bạn.' });
    }

    var attendance = ATTENDANCE_TO_VI[payload.attendance]
      ? String(payload.attendance)
      : 'attending';
    var attendanceLabel = ATTENDANCE_TO_VI[attendance];

    var rawCount = Number(payload.sheetGuestCount !== undefined ? payload.sheetGuestCount : payload.guestCount);
    var sheetGuestCount = attendance === 'attending'
      ? Math.max(1, isNaN(rawCount) ? 1 : Math.round(rawCount))
      : 0;
    var clientGuestCount = attendance === 'attending' ? sheetGuestCount : 1;

    var message = String(payload.message || '').trim() || DEFAULT_MESSAGE;
    var now = new Date();
    var createdAtIso = String(payload.createdAt || '').trim() || now.toISOString();
    var id = String(payload.id || '').trim() || ('wish-' + now.getTime());
    var formattedTimeVn = Utilities.formatDate(now, TIMEZONE, 'dd/MM/yyyy HH:mm:ss');

    var sheet = getOrCreateRsvpSheet();
    var duplicateWish = findRecentDuplicate(sheet, guestName, attendanceLabel, message, now.getTime());
    if (duplicateWish) {
      return jsonResponse({ ok: true, duplicate: true, wish: duplicateWish });
    }

    var targetRow = sheet.getLastRow() + 1;
    sheet.getRange(targetRow, 1, 1, 8).setValues([[
      id,
      formattedTimeVn,
      guestName,
      attendanceLabel,
      sheetGuestCount,
      message,
      true,
      createdAtIso,
    ]]);
    SpreadsheetApp.flush();
    try {
      CacheService.getScriptCache().remove(WISHES_CACHE_KEY);
    } catch (cacheErr) {
      // Bỏ qua lỗi xóa cache
    }

    sendNotificationEmail({
      guestName: guestName,
      attendanceLabel: attendanceLabel,
      sheetGuestCount: sheetGuestCount,
      message: message,
      formattedTimeVn: formattedTimeVn,
      sheetUrl: SpreadsheetApp.getActiveSpreadsheet().getUrl(),
    });

    return jsonResponse({
      ok: true,
      wish: {
        id: id,
        guestName: guestName,
        side: 'both',
        attendance: attendance,
        guestCount: clientGuestCount,
        message: message,
        createdAt: createdAtIso,
      },
    });
  } catch (err) {
    return jsonResponse({
      ok: false,
      error: err && err.message ? err.message : 'Không thể lưu xác nhận vào Google Sheet.',
    });
  } finally {
    lock.releaseLock();
  }
}

function getOrCreateRsvpSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold').setBackground('#eef5ec');
    sheet.setFrozenRows(1);

    // Thống kê nhanh đặt ở dòng 1 (cột J-M) để không làm lệch chỉ số dòng append dữ liệu
    sheet.getRange(1, 10, 1, 4).setValues([[
      'Tổng khách tham dự:',
      '=SUMIF(D2:D,"Tham dự",E2:E)',
      'Tổng phản hồi:',
      '=COUNTA(C2:C)',
    ]]);
    sheet.getRange(1, 10, 1, 4).setFontWeight('bold');
  }

  return sheet;
}

function parseRequestPayload(e) {
  if (e && e.postData && e.postData.contents) {
    return JSON.parse(e.postData.contents);
  }
  return (e && e.parameter) ? e.parameter : {};
}

function findRecentDuplicate(sheet, guestName, attendanceLabel, message, nowMs) {
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return null;

  var startRow = Math.max(2, lastRow - 9);
  var numRows = lastRow - startRow + 1;
  var recentRows = sheet.getRange(startRow, 1, numRows, 8).getValues();

  for (var i = recentRows.length - 1; i >= 0; i--) {
    var row = recentRows[i];
    var rowName = String(row[2] || '').trim();
    var rowStatus = String(row[3] || '').trim();
    var rowMsg = String(row[5] || '').trim();
    var rowCreatedAt = row[7] instanceof Date ? row[7].toISOString() : String(row[7] || '').trim();
    var rowTimeMs = Date.parse(rowCreatedAt);

    if (
      rowName === guestName &&
      rowStatus === attendanceLabel &&
      rowMsg === message &&
      !isNaN(rowTimeMs) &&
      nowMs - rowTimeMs <= DUPLICATE_WINDOW_MS
    ) {
      var attendanceKey = VI_TO_ATTENDANCE[rowStatus] || 'attending';
      var count = Number(row[4]);
      return {
        id: String(row[0] || ''),
        guestName: rowName,
        side: 'both',
        attendance: attendanceKey,
        guestCount: attendanceKey === 'attending' ? Math.max(1, isNaN(count) ? 1 : count) : 1,
        message: rowMsg,
        createdAt: rowCreatedAt,
      };
    }
  }

  return null;
}

function sendNotificationEmail(info) {
  try {
    var recipient = String(NOTIFY_EMAIL || '').trim() || Session.getEffectiveUser().getEmail();
    if (!recipient) return;

    var subject = '[Thiệp Cưới] Xác nhận mới từ ' + info.guestName + ' (' + info.attendanceLabel + ')';
    var body = [
      'Bạn vừa nhận được phản hồi xác nhận tham dự mới trên thiệp cưới:',
      '',
      '- Họ và tên: ' + info.guestName,
      '- Trạng thái: ' + info.attendanceLabel,
      '- Số người tham dự: ' + info.sheetGuestCount,
      '- Lời chúc: ' + info.message,
      '- Thời gian (VN): ' + info.formattedTimeVn,
      '',
      'Xem danh sách đầy đủ trên Google Sheets:',
      info.sheetUrl,
    ].join('\n');

    MailApp.sendEmail(recipient, subject, body);
  } catch (mailErr) {
    // Bỏ qua lỗi gửi email để không làm gián đoạn việc lưu RSVP vào Sheet
  }
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * (Tùy chọn) Gắn Trigger theo thời gian (mỗi 5 hoặc 10 phút) gọi hàm này
 * để giữ Apps Script luôn nóng và làm mới cache trước khi khách mở thiệp.
 */
function warmup() {
  doGet();
}
