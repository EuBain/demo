
function coubtDown({ start, end }: { start?: any; end: any }) {
  const endTime = new Date(end);
  const now = start ? new Date(start) : new Date();

  let yearDiff = endTime.getFullYear() - now.getFullYear();
  let monthDiff = endTime.getMonth() - now.getMonth();
  let dayDiff = endTime.getDate() - now.getDate();
  let hourDiff = endTime.getHours() - now.getHours();
  let minDiff = endTime.getMinutes() - now.getMinutes();
  let sceDiff = endTime.getSeconds() - now.getSeconds();

  if (sceDiff < 0) {
    minDiff--;
    sceDiff += 60;
  }
  if (minDiff < 0) {
    hourDiff--;
    minDiff += 60;
  }
  if (hourDiff < 0) {
    dayDiff--;
    hourDiff += 24;
  }
  if (dayDiff < 0) {
    monthDiff--;
    // 向后面借一个月，按当月天数计算
    const nowMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    dayDiff += nowMonth.getDate();
  }
  if (monthDiff < 0) {
    yearDiff--;
    monthDiff += 12;
  }

  return {
    years: yearDiff,
    months: monthDiff,
    days: dayDiff,
    hour: hourDiff,
    min: minDiff,
    sec: sceDiff,
  };
}

console.time("a");
console.log(coubtDown({ end: "2026.8.1 10:00:00" }));
console.timeEnd("a");
