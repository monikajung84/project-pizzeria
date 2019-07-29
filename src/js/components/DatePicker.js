import {BaseWidget} from './BaseWidget.js';
import {utils} from '../utils.js';
import {select,settings} from '../settings.js';

export class DatePicker extends BaseWidget{
  constructor(wrapper){
    super(wrapper, utils.dateToStr(new Date()));
    const thisWidget = this;
    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.datePicker.input);

    thisWidget.initPlugin();
  }
  initPlugin(){
    const thisWidget = this;
    thisWidget.minDate = new Date(thisWidget.value);
    console.log('new date:',new Date );
    thisWidget.maxDate = utils.addDays(thisWidget.minDate, settings.datePicker.maxDaysInFuture);
    flatpickr(thisWidget.dom.input, {
      dateFormat: 'Y-m-d',
      defaultDate: thisWidget.minDate,
      minDate : thisWidget.minDate,
      maxDate : thisWidget.maxDate,
      'locate':{
        firstDayOfWeek: 1
      },
      'disable': [
        function(date){
          return(date.getDay() ===1);
        }
      ],
      onChange: function(selectedDates, dateStr, instance){
        thisWidget.value = dateStr;
      },
    });
  }
  parseValue(newValue){
    const thisWidget = this;
    return newValue;
  }
  isValid(newValue){
    const thisWidget = this;
    return true;
  }
  rednerValue(){
    const thisWidget = this;
    //console.log('widget value:', thisWidget.value);
  }
}