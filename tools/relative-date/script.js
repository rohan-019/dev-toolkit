document.addEventListener("DOMContentLoaded", () => {
  const dateInput = document.getElementById("date-input");
  const formatBtn = document.getElementById("format-btn");
  const resultBox = document.getElementById("result");

  formatBtn.addEventListener("click", () => {
    const inputValue = dateInput.value;
    if (!inputValue) {
      resultBox.textContent = "❌ Please select a date/time";
      return;
    }

    const inputDate = new Date(inputValue);
    if (isNaN(inputDate.getTime())) {
      resultBox.textContent = "❌ Invalid date/time";
      return;
    }

    resultBox.textContent = getRelativeTime(inputDate);
  });

  function getRelativeTime(targetDate) {
    const now = new Date();
    const diffMs = targetDate - now;
    const diffSec = Math.round(diffMs / 1000);
    const diffMin = Math.round(diffSec / 60);
    const diffHrs = Math.round(diffMin / 60);
    const diffDays = Math.round(diffHrs / 24);
    const diffMonths = Math.round(diffDays / 30);
    const diffYears = Math.round(diffDays / 365);

    const isFuture = diffMs > 0;

    const formatter = (value, unit) =>
      isFuture
        ? `in ${value} ${unit}${value > 1 ? "s" : ""}`
        : `${value} ${unit}${value > 1 ? "s" : ""} ago`;

    if (Math.abs(diffSec) < 60) return formatter(Math.abs(diffSec), "second");
    if (Math.abs(diffMin) < 60) return formatter(Math.abs(diffMin), "minute");
    if (Math.abs(diffHrs) < 24) return formatter(Math.abs(diffHrs), "hour");
    if (Math.abs(diffDays) < 2)
      return diffDays === 0 ? "today" : formatter(1, "day");
    if (Math.abs(diffDays) < 30) return formatter(Math.abs(diffDays), "day");
    if (Math.abs(diffMonths) < 12)
      return formatter(Math.abs(diffMonths), "month");
    return formatter(Math.abs(diffYears), "year");
  }
});
