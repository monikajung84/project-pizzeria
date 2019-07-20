import {CartProduct} from './CartProduct.js';
import {select, settings, templates} from '../settings.js';
import {utils} from '../utils.js';

export class Cart{
  constructor(element){
    const thisCart = this;
    thisCart.products = [];
    thisCart.getElements(element);
    thisCart.initActions();
    thisCart.deliveryFee = 20;
    thisCart.update();
    //console.log('new cart ', thisCart);
  }
  getElements(element){
    const thisCart = this;
    thisCart.dom = {};
    thisCart.dom.wrapper = element;
    thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(select.cart.toggleTrigger);
    thisCart.dom.productList = thisCart.dom.wrapper.querySelector(select.cart.productList);
    thisCart.dom.form = thisCart.dom.wrapper.querySelector(select.cart.form);
    thisCart.address = document.querySelector(select.cart.address);
    thisCart.phone = document.querySelector(select.cart.phone);
    thisCart.renderTotalsKeys = ['totalNumber', 'totalPrice', 'subtotalPrice', 'deliveryFee'];

    for (let key of thisCart.renderTotalsKeys){
      thisCart.dom[key] = thisCart.dom.wrapper.querySelectorAll(select.cart[key]);
    }
  }
  initActions(){
    const thisCart = this;
    thisCart.dom.toggleTrigger.addEventListener('click', function(){
      thisCart.dom.wrapper.classList.toggle('active');
    });
    thisCart.dom.productList.addEventListener('updated', function(){
      thisCart.update();
    });
    thisCart.dom.productList.addEventListener('remove', function(event){
      thisCart.remove(event.detail.cartProduct);
    });
    thisCart.dom.form.addEventListener('submit', function(event){
      event.preventDefault();
      thisCart.sendOrder();
    });
  }
  add(menuProduct){
    const thisCart = this;
    const generatedHTML = templates.cartProduct(menuProduct);
    const generatedDOM = utils.createDOMFromHTML(generatedHTML);
    thisCart.dom.productList.append(generatedDOM);
    //console.log('adding product ', menuProduct);
    thisCart.products.push(new CartProduct(menuProduct, generatedDOM));
    //console.log('thisCart.products',thisCart.products);
    thisCart.update();
  }
  update(){
    const thisCart = this;
    thisCart.totalNumber = 0;
    thisCart.subtotalPrice = 0;
    for (let product of thisCart.products){
      thisCart.subtotalPrice += product.basePrice;
      thisCart.totalNumber += product.amount;
    }
    thisCart.totalPrice = thisCart.subtotalPrice + thisCart.deliveryFee;
    console.log('thisCart.totalPrice',thisCart.totalPrice);
    console.log('thisCart.subtotalPrice',thisCart.subtotalPrice);
    console.log('thisCart.deliveryFee',thisCart.deliveryFee);
    for (let key of thisCart.renderTotalsKeys){
      for (let elem of thisCart.dom[key]){
        elem.innerHTML = thisCart[key];
      }
    }
  }
  remove(cartProduct){
    const thisCart = this;
    const index = thisCart.products.indexOf(cartProduct);
    const removeProduct = thisCart.products.splice(index, 1);
    cartProduct.dom.wrapper.remove();
    thisCart.update();
  }
  sendOrder(){
    const thisCart = this;
    const url = settings.db.url+'/'+settings.db.order;

    const payload = {
      address: thisCart.address.value,
      phone: thisCart.phone.value,
      totalPrice: thisCart.totalPrice,
      products: [],
    };
    for(let product of thisCart.products){
      product.getData();
      console.log('tablica-productu', product);
      payload.products.push(product);
    }
    const options = {
      method:'POST',
      headers: {
        'Content-Type':'application/json',
      },
      body: JSON.stringify(payload),
    };
    fetch(url, options)
      .then(function(response){
        return response.json();
      }).then(function(parsedResponse){
        console.log('parsedResponse', parsedResponse);
      });
  }
}