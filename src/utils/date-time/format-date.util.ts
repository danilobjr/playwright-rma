/**
Formats a date into a human-readable string using the user's locale settings.
The format used is: "MMM dd, yyyy" (e.g., "Jan 01, 2023").

@param date - The date to format.
@returns A formatted date string.
*/
function formatDate(date: Date) {
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

export { formatDate }
