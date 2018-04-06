import moment from 'moment';

export function isToday(date) {
  return moment(date).isSame(moment().startOf('day'), 'd');
}
