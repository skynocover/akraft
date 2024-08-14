import dayjs from 'dayjs';

import localizedFormat from 'dayjs/plugin/localizedFormat';

dayjs.extend(localizedFormat);

export const formateTime = (date: Date): string => {
  return dayjs(date).format('HH:mm:ss YYYY/MM/DD');
};
