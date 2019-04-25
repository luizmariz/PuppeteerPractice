const Reference = require('./Reference');
const lngDetector = new(require('languagedetect'));
const dotenv = require('dotenv'); dotenv.config();
const airtable = new(require('../api/AirtableAPI'))(process.env.AIRTABLE_KEY);
const ARTICLE_ITEM_CLASS = 'postArticle postArticle--short js-postArticle js-trackPostPresentation';

class Medium extends Reference {
  constructor(page, typeID, typeName, type) {
    super();
    this.page = page;
    this.typeID = typeID;
    this.typeName = typeName;
    this.type = type;
  }

  async initFuncs() {
    await this.page.exposeFunction('checkLng', string => lngDetector.detect(string, 1));
    await this.page.exposeFunction('register', (tit, desc, lin, typeID, type) => airtable.createArtigoRecord(tit, desc, lin, typeID, type));
  }

  async search() {
    await this.page.goto( `https://medium.com/search?q=${this.typeName}`, {timeout: 400000});
    await this.initFuncs();
    await this.scrollAndScrap();
  }

  async scrollAndScrap() {
    await this.page.evaluate( async ( article, typeID, type ) => {
      await new Promise((resolve, reject) => {
        const items = [];
        const distance = 2500;

        let index = 0;
        let exist = 0;
        let gotCheckBeforeSave = false;

        //Declare DOM exposed funcs here:

        checkIfExist = async url => {
          const res = await fetch('http://localhost:3000/exists', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              value: url,
            }),
          })

          const boolean = await res.json()
          gotCheckBeforeSave = true;
          return boolean.value;
        }

        //Use a boolean expression to filter data

        scheduleItem = async ( item, boolean) => {
          if (boolean && gotCheckBeforeSave) {
            gotCheckBeforeSave = false;

            await fetch('http://localhost:3000/create', {
                method: 'POST',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ value: item.url }),
            });

            const subtitle = item.subtitle.textContent.slice(-1) == '>' ? item.title.textContent : item.subtitle.textContent;
            await window.register(item.title.textContent, subtitle, item.url, typeID, type);
          }
        }

        const timer = setInterval( async () => {
          try {
            const item = ({
              url: document.getElementsByClassName(article)[index].childNodes[1].firstElementChild.href,
              title: document.getElementsByClassName(article)[index].getElementsByClassName('postArticle-content')[0].firstElementChild.firstElementChild.lastElementChild.firstElementChild.getElementsByClassName('graf--title')[0] || document.getElementsByClassName(article)[index].getElementsByClassName('postArticle-content')[0].firstElementChild.firstElementChild.lastElementChild.firstElementChild.getElementsByClassName('graf--trailing')[0] || { textContent: "" },
              subtitle: document.getElementsByClassName(article)[index].getElementsByClassName('postArticle-content')[0].firstElementChild.firstElementChild.lastElementChild.firstElementChild.getElementsByClassName('graf--trailing')[0] || { textContent: "" },
              claps: document.getElementsByClassName(article)[index].lastElementChild.firstElementChild.lastElementChild.lastElementChild.firstElementChild || { textContent: "" }
            })

            items.push(item);

            const urlIsOnBD = await checkIfExist(item.url);
            const language = await window.checkLng(item.title.textContent);

            if (urlIsOnBD === true) {
              exist++;
              console.log(exist);
            }

            const checkLng = language[0] && (language[0][0] === 'english' || language[0][0] === 'latin' || language[0][0] === 'portuguese' || language[0][0] === 'spanish' || language[0][0] == 'french');
            const checkClaps = item.title.textContent.slice(-1) !== '>' && urlIsOnBD === false && item.claps.textContent.slice(-1) === "K";
            const filter = checkLng && checkClaps;

            await scheduleItem(item, filter);

            window.scrollBy(0, distance);
            index++;

          } catch (error){
            console.log(error)

            if (exist < 20) {
              //Now if not able to get enougth articles that pass in filter params, just get anytype to fill the table
              let cont = exist;

              for (let i = 0; i < items.length; i++ ) {
                const alreadyInBD = await checkIfExist(items[i].url);
                const lng = await window.checkLng(items[i].title.textContent);
                const lngCheck = lng[0] && (lng[0][0] === 'english' || lng[0][0] === 'latin' || lng[0][0] === 'portuguese' || lng[0][0] === 'spanish' || lng[0][0] == 'french');
                const ContentCheck = items[i].title.textContent.slice(-1) !== '>' && alreadyInBD === false;
                const filt = lngCheck && ContentCheck

                await scheduleItem(items[i], filt);

                if (filt) {
                  cont++;
                }

                if (cont === 20) {
                  break;
                }
              }
            }

            clearInterval(timer);
            resolve();
          }
        }, 500);
      });
    }, ARTICLE_ITEM_CLASS, this.typeID, this.type);
  }
}

module.exports = Medium;

