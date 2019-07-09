/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';

  const select = {
    templateOf: {
      menuProduct: '#template-menu-product',
    },
    containerOf: {
      menu: '#product-list',
      cart: '#cart',
    },
    all: {
      menuProducts: '#product-list > .product',
      menuProductsActive: '#product-list > .product.active',
      formInputs: 'input, select',
    },
    menuProduct: {
      clickable: '.product__header',
      form: '.product__order',
      priceElem: '.product__total-price .price',
      imageWrapper: '.product__images',
      amountWidget: '.widget-amount',
      cartButton: '[href="#add-to-cart"]',
    },
    widgets: {
      amount: {
        input: 'input[name="amount"]',
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]',
      },
    },
  };

  const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active',
    },
  };

  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 1,
      defaultMax: 9,
    }
  };

  const templates = {
    menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
  };

  class Product{
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
      console.log('new Product: ', thisProduct);
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
      console.log('thisProduct.amountWidgetElem: ', thisProduct.amountWidgetElem);
    }

    initAccordion(){
      const thisProduct = this;
      /* find the clickable trigger (the element that should react to clicking) */
      thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
      console.log('accordionTrigger: ', thisProduct.accordionTrigger);
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
      for(let input of thisProduct.formInputs){
        input.addEventListener('change', function(){
          thisProduct.processOrder();
        });
        thisProduct.cartButton.addEventListener('click', function(event){
          event.preventDefault();
          thisProduct.processOrder();
        });
      }
    }

    processOrder(){
      const thisProduct = this;
      /* read all data from the form (using utils.serializeFormToObject) and save it to const formData */
      const formData = utils.serializeFormToObject(thisProduct.form);
      console.log('formData : ', formData);
      thisProduct.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);
      thisProduct.params = {};
      /* set variable price to equal thisProduct.data.price */
      let basePrice = thisProduct.data.price;
      console.log('price:',basePrice);
      /* START LOOP: for each paramId in thisProduct.data.params */
      const images = thisProduct.imageWrapper.querySelectorAll('.active');
      console.log ('images: ', images);
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
      thisProduct.priceElem = basePrice;
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
          console.log ('images: ', images);
          for (let image of images){
            image.classList.add('active');
          }
        });
      }
    }


    initAmountWidget(){
      const thisProduct = this;

      thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem);
    }
  }

  class AmountWidget{
    constructor(element){
      const thisWidget = this;
      thisWidget.getElements(element);
      thisWidget.setValue(thisWidget.input.value);
      console.log('AmountWidget: ', thisWidget);
      console.log('constructor arguments: ', element);
    }
    getElements(element){
      const thisWidget = this;

      thisWidget.element = element;
      thisWidget.input = thisWidget.element.querySelector(select.widgets.amount.input);
      thisWidget.linkDecrease = thisWidget.element.querySelector(select.widgets.amount.linkDecrease);
      thisWidget.linkIncrease = thisWidget.element.querySelector(select.widgets.amount.linkIncrease);
    }
    setValue(value){
      const thisWidget = this;

      const newValue = parseInt(value);
      /* TODO: Add validation*/
      thisWidget.value = newValue;
      thisWidget.input.value = thisWidget.value;
    }
  }
  const app = {
    initMenu: function(){
      const thisApp = this;
      console.log('thisApp.data: ', thisApp.data);
      for(let productData in thisApp.data.products){
        new Product(productData, thisApp.data.products[productData]);
      }
    },

    initData: function(){
      const thisApp = this;
      thisApp.data = dataSource;
    },

    init: function(){
      const thisApp = this;
      console.log('*** App starting ***');
      console.log('thisApp:', thisApp);
      console.log('classNames:', classNames);
      console.log('settings:', settings);
      console.log('templates:', templates);

      thisApp.initData();
      thisApp.initMenu();

    },
  };

  app.init();
}


