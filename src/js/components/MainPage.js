import {templates, select, settings, classNames} from '../settings.js';
import {utils} from '../utils.js';

export class MainPage {
  constructor() {
    const thisPage = this;

    thisPage.renderPage();
    //thisPage.getElements();
    //thisPage.getData();
  }
  renderPage() {
    const thisPage = this;
    
    const generatedHTML = templates.mainPage();
    thisPage.element = utils.createDOMFromHTML(generatedHTML);
    const mainContainer = document.querySelector(select.containerOf.mainPage);
    //console.log(mainContainer);
    mainContainer.appendChild(thisPage.element);
  }
  getElements() {
    const thisPage = this;

    thisPage.imageList = document.querySelector(select.containerOf.image);
    thisPage.opinionsList = document.querySelector(select.containerOf.opinions);
  }
  getData() {
    const thisPage = this;
    
    thisPage.dataImage = {};
    const urlGallery = settings.db.url + '/' + settings.db.gallery;
    const urlOpinions = settings.db.url + '/' + settings.db.opinions;

    fetch(urlGallery)
      .then(function (rawResponse) {
        return rawResponse.json();
      })
      .then(function (parsedResponse) {
        thisPage.dataImages = parsedResponse;
        thisPage.renderImageList();
      });

    fetch(urlOpinions)
      .then(function (rawResponse) {
        return rawResponse.json();
      })
      .then(function (parsedResponse) {
        thisPage.dataOpinions = parsedResponse;
        thisPage.renderOpinionsList();
      });
  }
  renderImageList() {
    const thisPage = this;
    const mappedImages = thisPage.dataImages.map(function(imageObject) {
      return imageObject.image;
    });
    const arrayConvertedToObject = Object.assign({}, mappedImages);
    const generatedHTML = templates.image({image: arrayConvertedToObject});
    thisPage.element = utils.createDOMFromHTML(generatedHTML);
    thisPage.imageList.appendChild(thisPage.element);
  }
  renderOpinionsList() {
    const thisPage = this;

    const mappedOpinons = thisPage.dataOpinions.map(function(opinionObject) {
      return opinionObject.opinion;
    });
    const mappedOptions = thisPage.dataOpinions.map(function(opinionObject) {
      return opinionObject.options;
    });

    const opinionsConvertedToObject = Object.assign({}, mappedOpinons);
    const optionsConvertedToObject = Object.assign({}, mappedOptions);

    const opinionHTML = templates.opinions({opinion: opinionsConvertedToObject});
    const optionsHTML = templates.options({options: optionsConvertedToObject});

    thisPage.opinions = utils.createDOMFromHTML(opinionHTML);
    thisPage.options = utils.createDOMFromHTML(optionsHTML);

    thisPage.opinionsList.appendChild(thisPage.opinions);
    thisPage.opinionsList.appendChild(thisPage.options);

    thisPage.initSlider();
  }
  initSlider() {
    const thisPage = this;

    thisPage.circleList = document.querySelectorAll(select.main.circles);
    
    for (let circle of thisPage.circleList) {
      circle.addEventListener('click', function(event) {
        event.preventDefault();
        thisPage.changeOpinion();
        thisPage.changeCircle();
      });
    }
    thisPage.opinions = document.querySelectorAll(select.main.opinions);
    
    let opinionNumber = 0;
    
    setInterval(function(){ 
      
      let selectOpinion = thisPage.opinions[opinionNumber];
      let selectCircle = thisPage.circleList[opinionNumber];

      selectOpinion.classList.remove(classNames.main.carusel);
      selectCircle.classList.remove(classNames.main.carusel);

      if (opinionNumber >= thisPage.opinions.length - 1 ) {
        opinionNumber = 0; 
      } 
      else { 
        opinionNumber += 1;
      }
      
      selectOpinion = thisPage.opinions[opinionNumber];
      selectCircle = thisPage.circleList[opinionNumber];

      selectOpinion.classList.add(classNames.main.carusel);
      selectCircle.classList.add(classNames.main.carusel);
    }, 3000);
  }
  changeOpinion() {
    const clickedElement = event.target;
    const opinonClass = clickedElement.getAttribute(settings.main.dataOpinion);
    const selectOpinon = document.querySelector('.' + opinonClass);
    const activeOpinion = document.querySelector(select.main.activeOpinion);
    activeOpinion.classList.remove(classNames.main.carusel);
    selectOpinon.classList.add(classNames.main.carusel);
  }
  changeCircle() {
    const clickedElement = event.target;
    const activeCircle = document.querySelector(select.main.activeCircle);
    activeCircle.classList.remove(classNames.main.carusel);
    clickedElement.classList.add(classNames.main.carusel);
  }
}