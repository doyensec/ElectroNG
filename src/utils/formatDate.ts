import dayjs from 'dayjs';
import { DateFormats } from '../constants/DateFormats';

export const formatDate = (date: Date, dateFormat: DateFormats): string =>
  date ? dayjs(date).format(dateFormat) : '';
