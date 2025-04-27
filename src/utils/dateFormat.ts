/**
 * Format a date string into a readable format for messages
 */
export const format = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  
  // Check if date is today
  const isToday = date.getDate() === now.getDate() && 
                  date.getMonth() === now.getMonth() && 
                  date.getFullYear() === now.getFullYear();
  
  // Format the time part (HH:MM)
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const timeString = `${hours}:${minutes}`;
  
  if (isToday) {
    return timeString;
  }
  
  // Check if date is yesterday
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday = date.getDate() === yesterday.getDate() && 
                      date.getMonth() === yesterday.getMonth() && 
                      date.getFullYear() === yesterday.getFullYear();
  
  if (isYesterday) {
    return `Yesterday, ${timeString}`;
  }
  
  // Format the date part (MM/DD/YY)
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const year = date.getFullYear().toString().slice(-2);
  
  return `${month}/${day}/${year}, ${timeString}`;
};