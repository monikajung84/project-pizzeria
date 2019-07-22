import {select, templates, classNames} from '../settings.js';
import {AmountWidget} from './AmountWidget.js';

export class Booking {
  constructor(bookingContainer){
    const thisBooking = this;
    thisBooking.bookingContainer = bookingContainer;
    thisBooking.render(bookingContainer);
    thisBooking.initWidges();
  }
  render(){
    const thisBooking = this;
    const generatedHTML = templates.bookingWidget();
    thisBooking.dom ={};
    thisBooking.dom.wrapper = thisBooking.bookingContainer;
    thisBooking.dom.wrapper.innerHTML = generatedHTML;
    thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(select.booking.peopleAmount);
    thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(select.booking.hoursAmount);

  }
  initWidges(){
    const thisBooking = this;
    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
  }
}