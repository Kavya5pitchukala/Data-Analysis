// ============================================================
// charts.js — Chart Rendering using Canvas API
// ============================================================

const COLORS = ['#e94560', '#3498db', '#2ecc71', '#f1c40f', '#9b59b6'];

function clearCanvas(id) {
  const canvas = document.getElementById(id);
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  return { canvas, ctx };
}

// ─── Bar Chart ───────────────────────────────────────────────
function drawBarChart(canvasId, labels, values, title = '') {
  const { canvas, ctx } = clearCanvas(canvasId);
  const W = canvas.width, H = canvas.height;
  const pad = { top: 40, right: 20, bottom: 60, left: 70 };
  const chartW = W - pad.left - pad.right;
  const chartH = H - pad.top - pad.bottom;
  const max = Math.max(...values) * 1.1;
  const barW = chartW / labels.length * 0.6;
  const gap  = chartW / labels.length;

  // Title
  ctx.fillStyle = '#ccc'; ctx.font = 'bold 13px Segoe UI';
  ctx.textAlign = 'center';
  ctx.fillText(title, W / 2, 22);

  // Y axis grid
  ctx.strokeStyle = '#2a2a3e'; ctx.lineWidth = 1;
  for (let i = 0; i <= 5; i++) {
    const y = pad.top + chartH - (i / 5) * chartH;
    ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(W - pad.right, y); ctx.stroke();
    ctx.fillStyle = '#666'; ctx.font = '10px Segoe UI'; ctx.textAlign = 'right';
    ctx.fillText('₹' + ((max * i / 5) / 1000).toFixed(0) + 'k', pad.left - 6, y + 4);
  }

  // Bars
  labels.forEach((label, i) => {
    const x = pad.left + i * gap + gap / 2 - barW / 2;
    const barH = (values[i] / max) * chartH;
    const y = pad.top + chartH - barH;

    // Gradient
    const grad = ctx.createLinearGradient(x, y, x, y + barH);
    grad.addColorStop(0, COLORS[i % COLORS.length]);
    grad.addColorStop(1, COLORS[i % COLORS.length] + '66');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(x, y, barW, barH, 4);
    ctx.fill();

    // Label
    ctx.fillStyle = '#aaa'; ctx.font = '10px Segoe UI'; ctx.textAlign = 'center';
    ctx.fillText(label, pad.left + i * gap + gap / 2, H - pad.bottom + 16);
  });
}

// ─── Line Chart ──────────────────────────────────────────────
function drawLineChart(canvasId, labels, values, title = '') {
  const { canvas, ctx } = clearCanvas(canvasId);
  const W = canvas.width, H = canvas.height;
  const pad = { top: 40, right: 20, bottom: 50, left: 70 };
  const chartW = W - pad.left - pad.right;
  const chartH = H - pad.top - pad.bottom;
  const max = Math.max(...values) * 1.1;

  ctx.fillStyle = '#ccc'; ctx.font = 'bold 13px Segoe UI'; ctx.textAlign = 'center';
  ctx.fillText(title, W / 2, 22);

  // Grid
  ctx.strokeStyle = '#2a2a3e';
  for (let i = 0; i <= 5; i++) {
    const y = pad.top + chartH - (i / 5) * chartH;
    ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(W - pad.right, y); ctx.stroke();
    ctx.fillStyle = '#666'; ctx.font = '10px Segoe UI'; ctx.textAlign = 'right';
    ctx.fillText('₹' + ((max * i / 5) / 1000).toFixed(0) + 'k', pad.left - 6, y + 4);
  }

  const pts = values.map((v, i) => ({
    x: pad.left + (i / (values.length - 1)) * chartW,
    y: pad.top + chartH - (v / max) * chartH
  }));

  // Area fill
  ctx.beginPath();
  ctx.moveTo(pts[0].x, pad.top + chartH);
  pts.forEach(p => ctx.lineTo(p.x, p.y));
  ctx.lineTo(pts[pts.length - 1].x, pad.top + chartH);
  ctx.closePath();
  const areaGrad = ctx.createLinearGradient(0, pad.top, 0, pad.top + chartH);
  areaGrad.addColorStop(0, '#e9456033');
  areaGrad.addColorStop(1, '#e9456000');
  ctx.fillStyle = areaGrad; ctx.fill();

  // Line
  ctx.beginPath(); ctx.strokeStyle = '#e94560'; ctx.lineWidth = 2.5;
  pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
  ctx.stroke();

  // Dots + labels
  pts.forEach((p, i) => {
    ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#e94560'; ctx.fill();
    ctx.fillStyle = '#aaa'; ctx.font = '9px Segoe UI'; ctx.textAlign = 'center';
    ctx.fillText(labels[i], p.x, H - pad.bottom + 14);
  });
}

// ─── Pie Chart ───────────────────────────────────────────────
function drawPieChart(canvasId, labels, values, title = '') {
  const { canvas, ctx } = clearCanvas(canvasId);
  const W = canvas.width, H = canvas.height;
  const cx = W / 2 - 40, cy = H / 2 + 10, r = Math.min(W, H) / 2.8;
  const total = values.reduce((s, v) => s + v, 0);

  ctx.fillStyle = '#ccc'; ctx.font = 'bold 13px Segoe UI'; ctx.textAlign = 'center';
  ctx.fillText(title, W / 2, 22);

  let angle = -Math.PI / 2;
  values.forEach((v, i) => {
    const slice = (v / total) * Math.PI * 2;
    ctx.beginPath(); ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, angle, angle + slice);
    ctx.closePath();
    ctx.fillStyle = COLORS[i % COLORS.length]; ctx.fill();
    ctx.strokeStyle = '#0f0f1a'; ctx.lineWidth = 2; ctx.stroke();
    angle += slice;
  });

  // Legend
  labels.forEach((label, i) => {
    const lx = W - 110, ly = 50 + i * 22;
    ctx.fillStyle = COLORS[i % COLORS.length];
    ctx.fillRect(lx, ly, 12, 12);
    ctx.fillStyle = '#ccc'; ctx.font = '11px Segoe UI'; ctx.textAlign = 'left';
    ctx.fillText(label, lx + 16, ly + 11);
  });
}
