function formatDate(isoDateString) {
  const date = new Date(isoDateString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}.${month}.${day}.`;
}

function formatTime(isoDateString) {
  const date = new Date(isoDateString);

  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatDateTime(isoDateString) {
  const date = new Date(isoDateString);
  const today = new Date();

  if (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  ) {
    return formatTime(isoDateString);
  } else {
    return formatDate(isoDateString);
  }
}

export { formatDate, formatTime, formatDateTime };
