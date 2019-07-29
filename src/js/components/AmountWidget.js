import {select, settings} from '../settings.js';
import {BaseWidget} from './BaseWidget.js';

export class AmountWidget extends BaseWidget{
  constructor(wrapper){
    super (wrapper, settings.amountWidget.defaultValue);
    const thisWidget = this;
    thisWidget.getElements();
    thisWidget.value = settings.amountWidget.defaultValue;
    //thisWidget.setValue(thisWidget.input.value);
    //console.log('AmountWidget: ', thisWidget);
    //console.log('constructor arguments: ', element);
    thisWidget.initActions();
  }
  getElements(){
    const thisWidget = this;
    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.amount.input);
    thisWidget.linkDecrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkDecrease);
    thisWidget.linkIncrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkIncrease);
  }
  /*setValue(value){
    const thisWidget = this;
    const newValue = parseInt(value);
    if((value >= settings.amountWidget.defaultMin) && (value <=settings.amountWidget.defaultMax) && (thisWidget.value != value)){
      thisWidget.value = newValue;
      thisWidget.announce();
    }
    thisWidget.input.value = thisWidget.value;
  }*/
  isValid(newValue){
    return !isNaN(newValue) && newValue >= settings.amountWidget.defaultMin && newValue <= settings.amountWidget.defaultMax;
  }
  initActions(){
    const thisWidget = this;
    thisWidget.dom.input.addEventListener('change', function(){
      event.preventDefault();
      thisWidget.value = thisWidget.dom.input.value;
    });
    thisWidget.linkDecrease.addEventListener('click', function(){
      event.preventDefault();
      thisWidget.value = -- thisWidget.dom.input.value;
    });
    thisWidget.linkIncrease.addEventListener('click', function(){
      event.preventDefault();
      thisWidget.value = ++ thisWidget.dom.input.value;
    });
  }
  rednerValue(){
    const thisWidget = this;
    thisWidget.dom.input.value = thisWidget.value;
  }
}