import { format } from 'date-fns';

export const formatDate = (dateString: string | undefined): string => {
  if (!dateString) {
    return 'Cargando...';
  }

  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) {
    return 'Fecha inválida'; 
  }

  return format(date, "dd MMM 'a las' HH:mm");
};
