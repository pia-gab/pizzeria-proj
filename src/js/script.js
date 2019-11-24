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
      thisProduct.processOrder();
      console.log('newproj', thisProduct);
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
      //console.log(clickableTriggers);
      for (let clickableTrigger of accordionTrigger /*clickableTriggers*/) {
        clickableTrigger.addEventListener('click', function(){
          event.preventDefault();
          console.log('clicked');
        });
        thisProduct.element.classList.toggle('.active');
        const activeProducts = document.querySelectorAll('.product .active');
        for (let activeProduct of activeProducts) {
          if(!thisProduct.hasOwnProperty(activeProduct)){
            activeProducts.classList.remove('.active');
          }
        }
      }
    }
    initOrderForm() {
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
      console.log('formData',formData);
      //let price
      let price = thisProduct.data.price;
      //petla for each paramId in thisProduct.data
      for (let paramId in thisProduct.data.params) {
        //save the element in thisProduct.data.params with key paramId as const param 
        const param = paramId;
        //petla each optionId in param.options
        for (let optionId in param.options){
          //save the element in param.options with key optionId as const option
          const option = optionId;
          console.log(option);
          if (formData.hasOwnProperty(param)&&!option.default){
            //add price of option to variable price
            option.price+=price;
          } else if (!formData.hasOwnProperty(param)&&option.default) {
            price==option.price;
          } else {
            price==price;
          }
          const optionImages = document.option.querySelectorAll(thisProduct.imageWrapper);
          if (formData.hasOwnProperty(param)) {
            for (let optionImage of optionImages) {
              optionImage.classNames.add('.active');
            }
          } else {
            for (let optionImage of optionImages) {
              optionImage.classNames.remove('.active');
            }
          }
        }
      }
      price = thisProduct.amountWidget.value;
      //wstawic nowa wartosc price do thisprod.price.elem (ta przy guziku)
      thisProduct.priceElem = price;
    }
    initAmountWidget() {
      const thisProduct = this;
      thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem);
      thisProduct.amountWidgetElem.addEventListener('updated', thisProduct.processOrder());
    }
  }
  class AmountWidget {
    constructor(element){
      const thisWidget = this;

      thisWidget.element = element;
      thisWidget.input = thisWidget.element.querySelector(select.widgets.amount.input);
      thisWidget.linkDecrease = thisWidget.element.querySelector(select.widgets.amount.linkDecrease);
      thisWidget.linkIncrease = thisWidget.element.querySelector(select.widgets.amount.linkIncrease);
      
      thisWidget.getElements(element);
      thisWidget.value = settings.amountWidget.defaultValue;
      thisWidget.setValue(thisWidget.input.value);
      console.log('AmountWidget', thisWidget);
      console.log('constructor argu', element);
    }
    setValue(value) {
      const thisWidget = this;
      const newValue = parseInt(value);

      if (newValue >= settings.amountWidget.defaultMin){
        thisWidget.value = newValue;
        thisWidget.announce();
      } else if (newValue <= settings.amountWidget.defaultMax){
        thisWidget.value = newValue;
        thisWidget.announce();
      } else {
        thisWidget.value = newValue;
        thisWidget.announce();
      }

      thisWidget.input.value = thisWidget.value;

    }
    initActions() {
      thisWidget.input.addEventListener('change',setValue(thisWidget.input));
      thisWidget.linkDecrease.addEventListener('click', setValue(thisWidget.value -1));
      thisWidget.linkIncrease.addEventListener('click', setValue(thisWidget.value +1));
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
      //console.log('testProduct', testProduct); 
      //console.log('thisApp.data:', thisApp.data);

      for (let productData in thisApp.data) {
        new Product(productData, thisApp.data.products[productData]);
      }
    },
    initData: function () {
      const thisApp = this;
      thisApp.data = dataSource;
    },
    init: function () {
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