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
    await this.page.exposeFunction('register', (tit, desc, lin, framID) => airtable.createArtigoRecord(tit, desc, lin, framID));
  }

  async search() {
    await this.page.goto( `https://medium.com/search?q=${this.frameworkName}`);
    await this.scrollAndScrap();
  }
  
  async scrollAndScrap() {
    await this.page.evaluate( async ( article, frameworkID ) => {
      await new Promise((resolve, reject) => {
        const distance = 1500; 
        let index = 0;
        
        const timer = setInterval( async () => {
          try {

            const item = ({ 
              url: document.getElementsByClassName(article)[index].childNodes[1].firstElementChild.href,
              title: document.getElementsByClassName(article)[index].getElementsByClassName('postArticle-content')[0].firstElementChild.firstElementChild.lastElementChild.firstElementChild.getElementsByClassName('graf--title')[0] || document.getElementsByClassName(article)[index].getElementsByClassName('postArticle-content')[0].firstElementChild.firstElementChild.lastElementChild.firstElementChild.getElementsByClassName('graf--trailing')[0] || { textContent: "" },
              subtitle: document.getElementsByClassName(article)[index].getElementsByClassName('postArticle-content')[0].firstElementChild.firstElementChild.lastElementChild.firstElementChild.getElementsByClassName('graf--trailing')[0] || { textContent: "" },
              claps: document.getElementsByClassName(article)[index].lastElementChild.firstElementChild.lastElementChild.lastElementChild.firstElementChild || { textContent: "" }
            })

            
            const res = await fetch('http://localhost:3000/exists', {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                value: item.url,
              }),
            });
            
            const urlIsOnBD = await res.json();
            const language = await window.checkLng(item.title.textContent);
           
            if (language[0][0] === 'english' || language[0][0] === 'latin' || language[0][0] === 'portuguese' || language[0][0] === 'spanish' || language[0][0] == 'french') {
              if ( item.title.textContent.slice(-1) !== '>' && urlIsOnBD.value === false && item.claps.textContent.slice(-1) === "K") {
                await fetch('http://localhost:3000/create', {
                  method: 'POST',
                  headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    value: item.url,
                  }),
                });

                const subtitle = item.subtitle.textContent.slice(-1) == '>' ? item.title.textContent : item.subtitle.textContent;
                await window.register(item.title.textContent, subtitle, item.url, frameworkID);
              }
            }

            window.scrollBy(0, distance);
            index++;

          } catch (error){
            console.log(error)
              clearInterval(timer);
              resolve();
          }
        }, 500);
      });
    }, ARTICLE_ITEM_CLASS, this.frameworkID);
  }
}

module.exports = Medium;

