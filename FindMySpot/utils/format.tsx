import { format } from 'date-fns';

export const formatLastParkingDate = (dateString: string): string => {
  const date = new Date(dateString);
  return format(date, "dd MMM 'a las' HH:mm");
};