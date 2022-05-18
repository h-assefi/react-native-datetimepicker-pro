import {DatePicker} from './datePicker/DatePicker';
import {utils} from './utils';

export const {getFormatedDateTime,getFormatedDate, getToday, getTime} = new utils({isGregorian: true});
export default DatePicker;
