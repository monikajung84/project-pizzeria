import {select, classNames, templates} from '../settings.js';
import {utils} from '../utils.js';
import {AmountWidget} from './AmountWidget.js';

export class Product{
  constructor(id, data){
    const thisProduct = this;

    thisProduct.id = id;
    thisProduct.data = data;

    thisProduct.renderInMenu();
    thisProduct.getElements();
    thisProduct.initAccordion();
    thisProduct.initOrderForm();
    thisProduct.initAmountWidget();
    thisProduct.processOrder();
    //console.log('new Product: ', thisProduct);
  }
  renderInMenu(){
    const thisProduct = this;

    /*generate HTML based on template*/
    const generatedHTML = templates.menuProduct(thisProduct.data);
    /*create element using utils.createElementFromHTML*/
    thisProduct.element = utils.createDOMFromHTML(generatedHTML);
    /*find menu container*/
    const menuContainer = document.querySelector(select.containerOf.menu);
    /*add element to menu*/
    menuContainer.appendChild(thisProduct.element);
  }

  getElements(){
    const thisProduct = this;
    thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
    thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
    //console.log('thisProduct.form: ', thisProduct.form);
    thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);
    //console.log('thisProduct.formInputs: ', thisProduct.formInputs);
    thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
    //console.log('thisProduct.cartButton: ', thisProduct.cartButton);
    thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
    //console.log('thisProduct.priceElem: ', thisProduct.priceElem);
    thisProduct.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);
    //console.log('thisProduct.imageWrapper: ', thisProduct.imageWrapper);
    thisProduct.amountWidgetElem = thisProduct.element.querySelector(select.menuProduct.amountWidget);
    //console.log('thisProduct.amountWidgetElem: ', thisProduct.amountWidgetElem);
  }

  initAccordion(){
    const thisProduct = this;
    /* find the clickable trigger (the element that should react to clicking) */
    thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
    //console.log('accordionTrigger: ', thisProduct.accordionTrigger);
    /* START: click event listener to trigger */
    thisProduct.accordionTrigger.addEventListener('click', function(event){
      /* prevent default action for event */
      event.preventDefault();
      /* toggle active class on element of thisProduct */
      thisProduct.element.classList.add(classNames.menuProduct.wrapperActive);
      /* find all active products */
      const activeProducts = document.querySelectorAll('.product.active');
      /* START LOOP: for each active product */
      for(let activeProduct of activeProducts){
        /* remove class active for the active product */
        activeProduct.classList.remove('active');
      } /* END LOOP: for each active product */
      thisProduct.element.classList.add('active');
    }); /* END: click event listener to trigger */
  }

  initOrderForm(){
    const thisProduct = this;
    thisProduct.form.addEventListener('submit',function(event){
      event.preventDefault();
      thisProduct.processOrder();
    });
    for (let input of thisProduct.formInputs) {
      input.addEventListener('change', function() {
        thisProduct.processOrder();
      });
    }
    thisProduct.cartButton.addEventListener('click', function(event) {
      event.preventDefault();
      thisProduct.processOrder();
      thisProduct.addToCart();
    });
  }

  processOrder(){
    const thisProduct = this;
    /* read all data from the form (using utils.serializeFormToObject) and save it to const formData */
    const formData = utils.serializeFormToObject(thisProduct.form);
    //console.log('formData : ', formData);
    thisProduct.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);
    thisProduct.params = {};
    /* set variable price to equal thisProduct.data.price */
    let basePrice = thisProduct.data.price;
    //console.log('price:',basePrice);
    /* START LOOP: for each paramId in thisProduct.data.params */
    const images = thisProduct.imageWrapper.querySelectorAll('.active');
    //console.log ('images: ', images);
    for (let image of images){
      image.classList.remove('active');
    }
    if (formData.ingredients){
      basePrice = countThePrice(basePrice, 'ingredients');
      setImages ('ingredients');
    }
    if (formData.coffee){
      basePrice = countThePrice(basePrice, 'coffee');
    }
    if (formData.sauce){
      basePrice = countThePrice(basePrice, 'sauce');
      setImages ('sauce');
    }
    if (formData.toppings){
      basePrice = countThePrice(basePrice, 'toppings');
      setImages ('toppings');
    }
    if (formData.crust){
      basePrice = countThePrice(basePrice, 'crust');
      setImages ('crust');
    }
    thisProduct.priceSingle = basePrice;
    thisProduct.basePrice = thisProduct.priceSingle * thisProduct.amountWidget.value;
    thisProduct.priceElem = thisProduct.basePrice;
    //
    thisProduct.element.querySelector(select.menuProduct.priceElem).innerHTML =thisProduct.priceElem;
    function countThePrice (price, option){
      formData[option].forEach(function(item){
        price+=thisProduct.data.params[option].options[item].price;
      });
      return price;
    }
    function setImages (option){
      formData[option].forEach(function(item){
        const images = thisProduct.imageWrapper.querySelectorAll('.'+ option +'-'+ item);
        const param = thisProduct.data.params[option];
        if (!thisProduct.params[option]){
          thisProduct.params[option] = {
            label: param.label,
            options: {},
          };
        }
        thisProduct.params[option].options[item] = option.label;
        //console.log ('images: ', images);
        for (let image of images){
          image.classList.add('active');
        }
      });
    }
    //console.log('thisProduct.params', thisProduct.params);
  }


  initAmountWidget(){
    const thisProduct = this;
    thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem);
    thisProduct.amountWidgetElem.addEventListener('updated', function(){
      thisProduct.processOrder();
    });
  }

  addToCart(){
    const thisProduct = this;
    thisProduct.name = thisProduct.data.name;
    thisProduct.amount = thisProduct.amountWidget.value;
    const event = new CustomEvent('add-to-cart',{
      bubbles: true,
      detail: {
        product: thisProduct,
      },
    });
    thisProduct.element.dispatchEvent(event);
  }
}