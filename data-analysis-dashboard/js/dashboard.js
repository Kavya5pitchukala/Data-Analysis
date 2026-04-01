// ============================================================
// dashboard.js — UI Controller
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  const data = SALES_DATA;
  const kpis = getKPIs(data);

  // ─── KPI Cards ─────────────────────────────────────────────
  document.getElementById('kpi-revenue').textContent  = '₹' + (kpis.totalRevenue / 1e6).toFixed(2) + 'M';
  document.getElementById('kpi-units').textContent    = kpis.totalUnits.toLocaleString();
  document.getElementById('kpi-profit').textContent   = '₹' + (kpis.totalProfit / 1e6).toFixed(2) + 'M';
  document.getElementById('kpi-avg').textContent      = '₹' + kpis.avgOrder.toLocaleString();

  // ─── Charts ────────────────────────────────────────────────
  const byCat   = revenueByCategory(data);
  const byMonth = revenueByMonth(data);
  const byCity  = revenueByCity(data);

  drawBarChart('chart-category', byCat.map(r => r[0]), byCat.map(r => r[1]), 'Revenue by Category');
  drawLineChart('chart-trend',   byMonth.map(r => r[0]), byMonth.map(r => r[1]), 'Monthly Revenue Trend');
  drawPieChart('chart-city',     byCity.map(r => r[0]),  byCity.map(r => r[1]),  'Revenue by City');

  // ─── Top Products Table ────────────────────────────────────
  const tbody = document.getElementById('table-body');
  tbody.innerHTML = byCat.map((r, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>${r[0]}</td>
      <td>₹${r[1].toLocaleString()}</td>
      <td>${((r[1] / kpis.totalRevenue) * 100).toFixed(1)}%</td>
    </tr>
  `).join('');

  // ─── Filter by Category ────────────────────────────────────
  document.getElementById('cat-filter').addEventListener('change', e => {
    const val = e.target.value;
    const filtered = val === 'all' ? data : data.filter(r => r.category === val);
    const byM = revenueByMonth(filtered);
    drawLineChart('chart-trend', byM.map(r => r[0]), byM.map(r => r[1]),
      `Monthly Trend — ${val === 'all' ? 'All Categories' : val}`);
  });
});
