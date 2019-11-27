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
    },
  };
 
  const templates = {
    menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
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
      });
    }
    processOrder(){
      const thisProduct = this;
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
            //console.log('opcja nie wybrana -', option.price, price);
            //const optionImages = document.querySelectorAll(thisProduct.imageWrapper);
            const optionImages = thisProduct.imageWrapper.querySelectorAll('.'+paramId+'-'+optionId);
            console.log(thisProduct.imageWrapper);
            if (optionSelected) {
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
      }
      price*=thisProduct.amountWidget.value;
      thisProduct.priceElem.innerHTML = price;
    }
    initAmountWidget() {
      const thisProduct = this;
      thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem);
      thisProduct.amountWidgetElem.addEventListener('updated', thisProduct.processOrder);
    }
  }
  class AmountWidget {
    constructor (element){
      const thisWidget = this;

      thisWidget.getElements(element);
      thisWidget.setValue(thisWidget.input.value);
      thisWidget.initActions();

      //console.log('AmountWidget', thisWidget);
      //console.log('constructor argu', element);
 
      
      //thisWidget.value = settings.amountWidget.defaultValue;
      
      
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
 
      /*if (newValue >= settings.amountWidget.defaultMin){
        thisWidget.value = newValue;
        thisWidget.announce();
      } else if (newValue <= settings.amountWidget.defaultMax){
        thisWidget.value = newValue;
        thisWidget.announce();
      } else {
        
        
      }*/
      thisWidget.announce();
      thisWidget.value = newValue;
      //console.log('widget value',thisWidget.value);
      thisWidget.input.value = thisWidget.value;
      //console.log('widget input value',thisWidget.input.value);
 
    }
    initActions() {
      const thisWidget = this;
      thisWidget.input.addEventListener('change', function(){
        console.log('change');
        thisWidget.setValue(parseInt(thisWidget.input.value));
      });
      thisWidget.linkDecrease.addEventListener('click', function(event){
        console.log('-');
        event.preventDefault();
        thisWidget.setValue(thisWidget.value -1);
      });
      thisWidget.linkIncrease.addEventListener('click', function(event){
        console.log('+');
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
  const app = {
    initMenu: function(){
      const thisApp = this;
      //const testProduct = new Product ();
      ////console.log('testProduct', testProduct);
 
      for (let productData in thisApp.data.products) {
        new Product(productData, thisApp.data.products[productData]);
      }
    },
    initData: function () {
      const thisApp = this;
      thisApp.data = dataSource;
      console.log('data s', dataSource);
    },
    init: function () {
      const thisApp = this;
      //console.log('*** App starting ***');
      //console.log('thisApp:', thisApp);
      console.log('classNames:', classNames);
      console.log('settings:', settings);
      //console.log('templates:', templates);
 
      thisApp.initData();
      thisApp.initMenu();
    },
  };
  app.init();
}