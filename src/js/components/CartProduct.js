import {select} from '../settings.js';
import{AmountWidget} from './AmountWidget.js';
export class CartProduct{
  constructor(menuProduct, element){
    const thisCartProduct = this;
    thisCartProduct.option = menuProduct.id;
    thisCartProduct.name = menuProduct.name;
    thisCartProduct.basePrice = menuProduct.basePrice;
    thisCartProduct.priceSingle = menuProduct.priceSingle;
    thisCartProduct.amount = menuProduct.amount;
    thisCartProduct.params = JSON.parse(JSON.stringify(menuProduct.params));
    thisCartProduct.getElements(element);
    thisCartProduct.initAmountWidget();
    thisCartProduct.countsAndDisplaysPrice();
    thisCartProduct.initActions();
    //console.log('new CartProduct', thisCartProduct);
    //console.log('productData', menuProduct);
  }
  getElements(element){
    const thisCartProduct = this;
    thisCartProduct.dom = {};
    thisCartProduct.dom.wrapper = element;
    thisCartProduct.dom.amountWidget = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.amountWidget);
    thisCartProduct.dom.price = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.price);
    thisCartProduct.dom.edit = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.edit);
    thisCartProduct.dom.remove = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.remove);
  }
  initAmountWidget(){
    const thisCartProduct = this;
    thisCartProduct.amountWidgetElem = thisCartProduct.dom.wrapper.querySelector(select.menuProduct.amountWidget);
    thisCartProduct.amountWidget = new AmountWidget(thisCartProduct.amountWidgetElem, thisCartProduct.amount);
    thisCartProduct.amountWidgetElem.addEventListener('updated', function(){
      thisCartProduct.countsAndDisplaysPrice();
    });
  }
  countsAndDisplaysPrice(){
    const thisCartProduct = this;
    thisCartProduct.amount = thisCartProduct.amountWidget.value ;
    thisCartProduct.basePrice= (thisCartProduct.amount * thisCartProduct.priceSingle);
    thisCartProduct.dom.price.innerHTML = thisCartProduct.basePrice;
  }
  remove(){
    const thisCartProduct =this;
    const event = new CustomEvent('remove', {
      bubbles: true,
      detail: {
        cartProduct: thisCartProduct,
      },
    });
    thisCartProduct.dom.wrapper.dispatchEvent(event);
  }
  initActions(){
    const thisCartProduct = this;
    thisCartProduct.dom.edit.addEventListener('click', function(event){
      event.preventDefault();
    });
    thisCartProduct.dom.remove.addEventListener('click', function(event){
      event.preventDefault();
      thisCartProduct.remove();
    });
  }
  getData(){
    const thisCartProduct = this;
    const product = thisCartProduct;
    return product;
  }
}