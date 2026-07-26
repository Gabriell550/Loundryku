import type { Order } from '../types';

function formatRupiah(n: number) {
  return 'Rp ' + n.toLocaleString('id-ID');
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function generateReceiptHtml(order: Order): string {
  const itemsHtml = order.items
    .map(
      (item) => `
      <tr>
        <td style="font-size:12px;padding:4px 0">
          ${item.serviceTypeName}
          <br/><span style="color:#666;font-size:10px">${item.qty} kg x ${formatRupiah(item.price)}</span>
        </td>
        <td style="font-size:12px;padding:4px 0;text-align:right;vertical-align:bottom">${formatRupiah(item.subtotal)}</td>
      </tr>`
    )
    .join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Struk Pembayaran</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Courier New', monospace;
      font-size: 12px;
      color: #222;
      width: 280px;
      margin: 0 auto;
      padding: 16px;
    }
    .header { text-align: center; margin-bottom: 16px; }
    .header h1 { font-size: 16px; font-weight: bold; margin-bottom: 4px; }
    .header p { font-size: 10px; color: #666; }
    .divider { border-top: 1px dashed #222; margin: 12px 0; }
    .info-row { display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px; }
    .info-label { color: #666; }
    .info-value { font-weight: bold; text-align: right; }
    table { width: 100%; border-collapse: collapse; }
    th { font-size: 11px; text-align: left; padding-bottom: 6px; border-bottom: 1px solid #222; }
    th:last-child { text-align: right; }
    .total-row { display: flex; justify-content: space-between; font-size: 14px; font-weight: bold; padding-top: 8px; }
    .footer { text-align: center; margin-top: 16px; font-size: 10px; color: #666; }
    .status-badge {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 10px;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>LAUNDRY</h1>
    <p>Digital Laundry Kasir</p>
    <p style="margin-top:8px;font-size:14px;font-weight:bold">STRUK PEMBAYARAN</p>
  </div>

  <div class="divider"></div>

  <div class="info-row">
    <span class="info-label">No. Invoice</span>
    <span class="info-value">${order.invoiceNumber}</span>
  </div>
  <div class="info-row">
    <span class="info-label">Pelanggan</span>
    <span class="info-value">${order.customerName}</span>
  </div>
  <div class="info-row">
    <span class="info-label">Tanggal</span>
    <span class="info-value">${formatDate(order.updatedAt || order.createdAt)}</span>
  </div>
  <div class="info-row">
    <span class="info-label">Pembayaran</span>
    <span class="info-value">${order.paymentMethod === 'CASH' ? 'Tunai' : 'Transfer'}</span>
  </div>
  <div class="info-row">
    <span class="info-label">Status</span>
    <span class="info-value" style="color:#009977">LUNAS</span>
  </div>

  <div class="divider"></div>

  <table>
    <thead>
      <tr>
        <th>Layanan</th>
        <th style="text-align:right">Subtotal</th>
      </tr>
    </thead>
    <tbody>
      ${itemsHtml}
    </tbody>
  </table>

  <div class="divider"></div>

  <div class="total-row">
    <span>TOTAL</span>
    <span>${formatRupiah(order.totalPrice)}</span>
  </div>

  <div class="footer">
    <p>Terima kasih telah menggunakan layanan kami</p>
    <p style="margin-top:4px">-- Loundryku --</p>
  </div>
</body>
</html>`;
}
