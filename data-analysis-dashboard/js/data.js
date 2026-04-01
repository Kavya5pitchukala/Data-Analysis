// ============================================================
// data.js — Dataset and SQL-style Aggregation Functions
// ============================================================

const CATEGORIES = ['Electronics', 'Clothing', 'Books', 'Home & Kitchen', 'Sports'];
const CITIES     = ['Hyderabad', 'Mumbai', 'Delhi', 'Bangalore', 'Chennai'];
const MONTHS     = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

// Synthetic sales dataset
function generateSalesData(count = 2000) {
  const data = [];
  for (let i = 0; i < count; i++) {
    const month = Math.floor(Math.random() * 12);
    data.push({
      id:       i + 1,
      category: CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)],
      city:     CITIES[Math.floor(Math.random() * CITIES.length)],
      month,
      monthName: MONTHS[month],
      revenue:  Math.floor(Math.random() * 50000) + 500,
      units:    Math.floor(Math.random() * 100) + 1,
      profit:   Math.floor(Math.random() * 15000) + 100,
    });
  }
  return data;
}

// GROUP BY category → SUM revenue
function revenueByCategory(data) {
  const map = {};
  data.forEach(r => {
    map[r.category] = (map[r.category] || 0) + r.revenue;
  });
  return Object.entries(map).sort((a, b) => b[1] - a[1]);
}

// GROUP BY month → SUM revenue (ordered)
function revenueByMonth(data) {
  const map = Array(12).fill(0);
  data.forEach(r => { map[r.month] += r.revenue; });
  return MONTHS.map((m, i) => [m, map[i]]);
}

// GROUP BY city → SUM revenue
function revenueByCity(data) {
  const map = {};
  data.forEach(r => { map[r.city] = (map[r.city] || 0) + r.revenue; });
  return Object.entries(map).sort((a, b) => b[1] - a[1]);
}

// KPI summary
function getKPIs(data) {
  const totalRevenue = data.reduce((s, r) => s + r.revenue, 0);
  const totalUnits   = data.reduce((s, r) => s + r.units, 0);
  const totalProfit  = data.reduce((s, r) => s + r.profit, 0);
  const avgOrder     = Math.round(totalRevenue / data.length);
  return { totalRevenue, totalUnits, totalProfit, avgOrder, count: data.length };
}

const SALES_DATA = generateSalesData(2000);
