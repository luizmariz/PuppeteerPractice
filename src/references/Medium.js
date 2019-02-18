const Reference = require('./Reference');
const lngDetector = new(require('languagedetect'));
const airtable = new(require('../api/AirtableAPI'))('');

const ARTICLE_ITEM_CLASS = 'postArticle postArticle--short js-postArticle js-trackPostPresentation';

class Medium extends Reference {
  constructor(page, frameworkID, frameworkName) {
    super();
    this.page = page;
    this.frameworkID = frameworkID;
    this.frameworkName = frameworkName;
    this.initFuncs();
  }

  async initFuncs() {
    await this.page.waitForNavigation();
    await this.page.exposeFunction('checkLng', string => lngDetector.detect(string, 1));
    await this.page.exposeFunction('register', (tit, desc, lin) => airtable.createArtigoRecord(tit, desc, lin, this.frameworkID));
  }

  async search() {
    await this.page.goto( `https://medium.com/search?q=${this.frameworkName}`);
    await this.scrollAndScrap();
  }
  
  async scrollAndScrap() {
    await this.page.evaluate( async article => {
      await new Promise((resolve, reject) => {
        const distance = 2000; 
        let index = 0;
        
        const timer = setInterval( async () => {
          try {

            const item = ({ 
              url: document.getElementsByClassName(article)[index].childNodes[1].firstElementChild.href,
              title: document.getElementsByClassName(article)[index].getElementsByClassName('postArticle-content')[0].firstElementChild.firstElementChild.lastElementChild.firstElementChild.getElementsByClassName('graf--title')[0] || document.getElementsByClassName(article)[index].getElementsByClassName('postArticle-content')[0].firstElementChild.firstElementChild.lastElementChild.firstElementChild.getElementsByClassName('graf--trailing')[0] || { textContent: "" },
              subtitle: document.getElementsByClassName(article)[index].getElementsByClassName('postArticle-content')[0].firstElementChild.firstElementChild.lastElementChild.firstElementChild.getElementsByClassName('graf--trailing')[0] || { textContent: "" },
              claps: document.getElementsByClassName(article)[index].lastElementChild.firstElementChild.lastElementChild.lastElementChild.firstElementChild || { textContent: "" }
            })

         
            await window.register(item.title.textContent, item.subtitle.textContent, item.url, "recx4hc8sOWcSrAPT");
            

            window.scrollBy(0, distance);
            index++;

          } catch (error){
            console.log(error)
              clearInterval(timer);
              resolve();
          }
        }, 400);
      });
    }, ARTICLE_ITEM_CLASS);
  }
}

module.exports = Medium;

