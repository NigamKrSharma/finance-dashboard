export function formatMoney(amount) {
  return "₹" + Math.abs(Number(amount)).toLocaleString("en-IN");
}

export function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function getMonthLabel(date) {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return months[new Date(date).getMonth()];
}

export function generateId() {
  return Date.now() + Math.floor(Math.random() * 1000);
}

export function calcTotals(transactions) {
  let income = 0;
  let expense = 0;

  transactions.forEach((tx) => {
    if (tx.type === "income") income += tx.amount;
    else expense += tx.amount;
  });

  return {
    income,
    expense,
    balance: income - expense,
  };
}

export function getExpensesByCategory(transactions) {
  const map = {};
  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      map[t.category] = (map[t.category] || 0) + t.amount;
    });

  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .map(([name, amount]) => ({ name, amount }));
}

export function getMonthlyData(transactions) {
  const incomeMap = {};
  const expenseMap = {};
  const monthSet = new Set();

  transactions.forEach((tx) => {
    const label = getMonthLabel(tx.date);
    monthSet.add(label);
    if (tx.type === "income") {
      incomeMap[label] = (incomeMap[label] || 0) + tx.amount;
    } else {
      expenseMap[label] = (expenseMap[label] || 0) + tx.amount;
    }
  });

  const labels = [...monthSet];
  return {
    labels,
    income: labels.map((m) => incomeMap[m] || 0),
    expense: labels.map((m) => expenseMap[m] || 0),
  };
}

export function getCumulativeBalance(transactions) {
  const sorted = [...transactions].sort(
    (a, b) => new Date(a.date) - new Date(b.date),
  );

  const monthMap = {};
  sorted.forEach((tx) => {
    const label = getMonthLabel(tx.date);
    if (!monthMap[label]) monthMap[label] = 0;
    monthMap[label] += tx.type === "income" ? tx.amount : -tx.amount;
  });

  const labels = Object.keys(monthMap);
  let running = 0;
  const data = labels.map((m) => {
    running += monthMap[m];
    return running;
  });

  return { labels, data };
}
