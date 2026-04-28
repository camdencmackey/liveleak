// lib/time.js
export function timeAgo(dateValue) {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "unknown";
  }

  const seconds = Math.max(1, Math.floor((Date.now() - date.getTime()) / 1000));

  const units = [
    ["year", 31536000],
    ["month", 2592000],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
    ["second", 1]
  ];

  for (const [unit, size] of units) {
    const amount = Math.floor(seconds / size);

    if (amount >= 1) {
      return `${amount} ${unit}${amount === 1 ? "" : "s"} ago`;
    }
  }

  return "just now";
}