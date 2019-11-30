/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';
  const select = {
    templateOf: {
      menuProduct: '#template-menu-product',
      cartProduct: '#template-cart-product', // CODE ADDED
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
        input: 'input.amount', // CODE CHANGED
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]',
      },
    },
    // CODE ADDED START
    cart: {
      productList: '.cart__order-summary',
      toggleTrigger: '.cart__summary',
      totalNumber: `.cart__total-number`,
      totalPrice: '.cart__total-price strong, .cart__order-total .cart__order-price-sum strong',
      subtotalPrice: '.cart__order-subtotal .cart__order-price-sum strong',
      deliveryFee: '.cart__order-delivery .cart__order-price-sum strong',
      form: '.cart__order',
      formSubmit: '.cart__order [type="submit"]',
      phone: '[name="phone"]',
      address: '[name="address"]',
    },
    cartProduct: {
      amountWidget: '.widget-amount',
      price: '.cart__product-price',
      edit: '[href="#edit"]',
      remove: '[href="#remove"]',
    },
    // CODE ADDED END
  };
  
  const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active',
    },
    // CODE ADDED START
    cart: {
      wrapperActive: 'active',
    },
    // CODE ADDED END
  };
  
  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 1,
      defaultMax: 9,
    }, // CODE CHANGED
    // CODE ADDED START
    cart: {
      defaultDeliveryFee: 20,
    },
    // CODE ADDED END
  };
  
  const templates = {
    menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
    // CODE ADDED START
    cartProduct: Handlebars.compile(document.querySelector(select.templateOf.cartProduct).innerHTML),
    // CODE ADDED END
  };
 
  class Product {
    constructor(id, data){
      const thisProduct = this;
      thisProduct.id = id;
      thisProduct.data = data;
      thisProduct.renderInMenu();
      thisProduct.getElements();
      thisProduct.initAccordion();
      thisProduct.initOrderForm();
      thisProduct.initAmountWidget();
    }
    renderInMenu() {
      const thisProduct = this;
      const generatedHTML = templates.menuProduct(thisProduct.data);
      thisProduct.element = utils.createDOMFromHTML(generatedHTML);
      const menuContainer = document.querySelector(select.containerOf.menu);
      menuContainer.appendChild(thisProduct.element);
    }
    getElements(){
      const thisProduct = this;
 
      thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
      thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
      thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);
      thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
      thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
      thisProduct.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);
      thisProduct.amountWidgetElem = thisProduct.element.querySelector(select.menuProduct.amountWidget);
    }
    initAccordion() {
      const thisProduct = this;
      const accordionTrigger = thisProduct.element.querySelectorAll(select.menuProduct.clickable);
      //const clickableTriggers = document.querySelectorAll('.product__name');
      ////console.log(clickableTriggers);
      for (let clickableTrigger of accordionTrigger) {
        clickableTrigger.addEventListener('click', function(){
          event.preventDefault();
          const activeProducts = document.querySelectorAll('.product.active');
          for (let activeProduct of activeProducts) {
            activeProduct.classList.remove('active');
          }
          thisProduct.element.classList.toggle('active');
        });
      }
    }
    initOrderForm() { /*wklejone*/
      const thisProduct = this;
      thisProduct.form.addEventListener('submit', function(event){
        event.preventDefault();
        thisProduct.processOrder();
      });
      
      for(let input of thisProduct.formInputs){
        input.addEventListener('change', function(){
          thisProduct.processOrder();
        });
      }
      
      thisProduct.cartButton.addEventListener('click', function(event){
        event.preventDefault();
        thisProduct.processOrder();
        thisProduct.addToCart();

      });
    }
    processOrder(){
      const thisProduct = this;
      //console.log(thisProduct);
      const formData = utils.serializeFormToObject(thisProduct.form);
      thisProduct.params = {};
      let price = thisProduct.data.price;
      thisProduct.priceSingle = price;
      thisProduct.price = thisProduct.priceSingle; 
      for (let paramId in thisProduct.data.params) {
        const param = thisProduct.data.params[paramId];
        for (let optionId in param.options){
          const option = param.options[optionId];
          const optionSelected = formData.hasOwnProperty(paramId) && formData[paramId].indexOf(optionId) > -1;
          if (optionSelected && !option.default){
            price = price + option.price;
          } else if (!optionSelected && option.default) {
            price = price - option.price;
          }
          const optionImages = thisProduct.imageWrapper.querySelectorAll('.'+paramId+'-'+optionId);
          if (optionSelected) {
            if(!thisProduct.params[paramId]){
              thisProduct.params[paramId]= {
                label: param.label,
                options: {},
              };
            }
            thisProduct.params[paramId].options[optionId]=option.label;
            for (let optionImage of optionImages) {
              optionImage.classList.add('active');
            }
          } else {
            for (let optionImage of optionImages) {
              optionImage.classList.remove('active');
            }
          }
        }
      }
      price*=thisProduct.amountWidget.value;
      thisProduct.price = thisProduct.priceSingle * thisProduct.amountWidget.value;
      thisProduct.priceElem.innerHTML = price;
      console.log(thisProduct.params);
    }
    initAmountWidget() {
      const thisProduct = this;
      thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem);
      thisProduct.amountWidgetElem.addEventListener('updated', function() {
        thisProduct.processOrder();
      });
    }
    addToCart(){
      const thisProduct = this;
       thisProduct.name = thisProduct.data.name;
       thisProduct.amount = thisProduct.amountWidget.value;
      app.cart.add(thisProduct);
    }
  }
  class AmountWidget {
    constructor (element){
      const thisWidget = this;

      thisWidget.getElements(element);
      thisWidget.value = settings.amountWidget.defaultValue;
      thisWidget.setValue(thisWidget.input.value);
      thisWidget.initActions();
    }
    getElements(element) {
      const thisWidget = this;
      thisWidget.element = element;
      thisWidget.input = thisWidget.element.querySelector(select.widgets.amount.input);
      thisWidget.linkDecrease = thisWidget.element.querySelector(select.widgets.amount.linkDecrease);
      thisWidget.linkIncrease = thisWidget.element.querySelector(select.widgets.amount.linkIncrease);
    }
    setValue(value) {
      const thisWidget = this;
      const newValue = parseInt(value);
      if(newValue>=settings.amountWidget.defaultMin){
        thisWidget.value = newValue;
        thisWidget.announce();
      }  else if(newValue<=settings.amountWidget.defaultMax) {
        thisWidget.value = newValue;
        thisWidget.announce();
      } else {
        return thisWidget.value;
      }      
      thisWidget.input.value = thisWidget.value;
    }
    initActions() {
      const thisWidget = this;
      thisWidget.input.addEventListener('change', function(){
        thisWidget.setValue(parseInt(thisWidget.input.value));
      });
      thisWidget.linkDecrease.addEventListener('click', function(event){
        event.preventDefault();
        thisWidget.setValue(thisWidget.value -1);
      });
      thisWidget.linkIncrease.addEventListener('click', function(event){
        event.preventDefault();
        thisWidget.setValue(thisWidget.value +1);
      });
    }
    announce() {
      const thisWidget = this;
 
      const event = new Event('updated');
      thisWidget.element.dispatchEvent(event);
    }
  }
  class Cart {
    constructor(element){
      const thisCart = this;
      console.log('this cart', thisCart);

      thisCart.products = [];
      thisCart.getElements(element);
      console.log('new cart', thisCart);
      thisCart.initActions();
    }

    getElements(element){
      const thisCart = this;
      thisCart.dom = {};
      thisCart.dom.wrapper = element;
      //console.log(thisCart.dom.wrapper);
      thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(select.cart.toggleTrigger);
      thisCart.dom.productList = thisCart.dom.wrapper.querySelector(select.cart.productList);
      console.log('thisCart.dom.productList', thisCart.dom.productList);
      console.log(thisCart.dom.wrapper);
    }
    initActions() {
      const thisCart = this;
      thisCart.dom.toggleTrigger.addEventListener('click', function(){
        thisCart.dom.wrapper.classList.toggle('active');
      });
    }
    add(menuProduct){
      const thisCart = this;
      const generatedHTML = templates.cartProduct(thisCart.products);
      console.log('html',generatedHTML);
      thisCart.element = utils.createDOMFromHTML(generatedHTML);
      console.log('cart elem',thisCart.element);
      const generatedDOM = thisCart.element;
      thisCart.dom.productList.appendChild(generatedDOM);
      console.log('adding prod', menuProduct);
    }
  }
  const app = {
    initMenu: function(){
      const thisApp = this;
      const testProduct = new Product ();
      console.log('testProduct', testProduct);
 
      for (let productData in thisApp.data.products) {
        new Product(productData, thisApp.data.products[productData]);
      }
    },
    initData: function () {
      const thisApp = this;
      thisApp.data = dataSource;
      //console.log('data s', dataSource);
    },
    init: function () {
      const thisApp = this;
      //console.log('*** App starting ***');
      //console.log('thisApp:', thisApp);
      console.log('classNames:', classNames);
      //console.log('settings:', settings);
      //console.log('templates:', templates);
 
      thisApp.initData();
      thisApp.initMenu();
    },
    initCart: function () {
      const thisApp = this;
      const cartElem = document.querySelector(select.containerOf.cart);
      thisApp.cart = new Cart(cartElem);
    }
  };
  app.init();
  app.initCart();
}