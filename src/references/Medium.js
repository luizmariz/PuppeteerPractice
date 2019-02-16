const Reference = require('./Reference');

const ARTICLE_ITEM_CLASS = 'postArticle postArticle--short js-postArticle js-trackPostPresentation';

class Medium extends Reference {
  //@Override
  async search(page, query) {
    await page.goto( `https://medium.com/search?q=${query}`);
  }
  
  async scrollAndScrap(page) {
    await page.evaluate(async article => {
      await new Promise((resolve, reject) => {
        const distance = 2000; 
        let index = 0;
      
        const timer = setInterval(() => {
          try {
            const item = ({ 
              url: document.getElementsByClassName(article)[index].childNodes[1].firstElementChild.href,
              title: document.getElementsByClassName(article)[index].getElementsByClassName('postArticle-content')[0].firstElementChild.firstElementChild.lastElementChild.firstElementChild.getElementsByClassName('graf--title')[0] || document.getElementsByClassName(ARTICLE_ITEM_CLASS)[index].getElementsByClassName('postArticle-content')[0].firstElementChild.firstElementChild.lastElementChild.firstElementChild.getElementsByClassName('graf--trailing') || { textContent: "" },
              subtitle: document.getElementsByClassName(article)[index].getElementsByClassName('postArticle-content')[0].firstElementChild.firstElementChild.lastElementChild.firstElementChild.getElementsByClassName('graf--trailing')[0] || { textContent: "" },
            });

            console.log(item.url,"\n",item.title.textContent,"\n",item.subtitle.textContent);

            window.scrollBy(0, distance);
            index++;

          } catch (error){
              clearInterval(timer);
              resolve();
          }
        }, 400);
      });
    }, ARTICLE_ITEM_CLASS);
  }
}

module.exports = Medium;