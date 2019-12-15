/* eslint-disable no-undef */

import {BaseWidget} from './BaseWidget.js';
import {utils} from '../utils.js';
import {select, settings} from '../settings.js';

export class DatePicker extends BaseWidget {
  constructor (wrapper){
    super(wrapper, utils.dateToStr(new Date()) );
    const thisWidget = this;
    
    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.datePicker.input);

    thisWidget.initPlugin();
  }
  initPlugin() {
    const thisWidget = this;
  
    thisWidget.minDate = new Date(thisWidget.value);
    thisWidget.maxDate = utils.addDays(thisWidget.minDate, settings.datePicker.maxDaysInFuture);
    
    const dateOpt = {
      defaultDate: thisWidget.minDate,
      minDate: thisWidget.minDate,
      maxDate: thisWidget.maxDate,
      'disable' : [
        function (date) {
          return (date.getDay() === 1);
        }
      ],
      'locale': {
        'firstDayOfWeek': 1
      },
      onChange: function (dateToStr) {
        thisWidget.value = dateToStr;
      }
    };
    flatpickr(thisWidget.dom.input, dateOpt);
  }
  parseValue(value){
    return value;
  }
  isValid(){
    return true;
  }
  renderValue (){
  }
   
    

  
}