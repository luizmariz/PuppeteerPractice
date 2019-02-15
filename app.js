const puppeteer = require('puppeteer');

const URL = 'https://medium.com/search?q=node';//working

const ARTICLE_ITEM_CLASS = 'postArticle postArticle--short js-postArticle js-trackPostPresentation';

const autoScrollAndScrap = async page => {
	await page.evaluate(async ARTICLE_ITEM_CLASS => {
		await new Promise((resolve, reject) => {
			const distance = 2000;
			let index = 0;
			this.erro = 0;
			const timer = setInterval(() => {
				try {
					console.log(index)
					console.log(document.getElementsByClassName(ARTICLE_ITEM_CLASS).length)
					const listItem = ({ 
						url: document.getElementsByClassName(ARTICLE_ITEM_CLASS)[index].childNodes[1].firstElementChild.href,
						title: document.getElementsByClassName(ARTICLE_ITEM_CLASS)[index].getElementsByClassName('postArticle-content')[0].firstElementChild.firstElementChild.lastElementChild.firstElementChild.getElementsByClassName('graf--title')[0] || document.getElementsByClassName(ARTICLE_ITEM_CLASS)[index].getElementsByClassName('postArticle-content')[0].firstElementChild.firstElementChild.lastElementChild.firstElementChild.getElementsByClassName('graf--trailing') || { textContent: "" },
						subtitle: document.getElementsByClassName(ARTICLE_ITEM_CLASS)[index].getElementsByClassName('postArticle-content')[0].firstElementChild.firstElementChild.lastElementChild.firstElementChild.getElementsByClassName('graf--trailing')[0] || { textContent: "" },
					});

					console.log(listItem.url,"\n",listItem.title.textContent,"\n",listItem.subtitle.textContent);

					window.scrollBy(0, distance);
					index++;

				} catch (error){
						this.erro++;
						if ( erro >= 10) {
							clearInterval(timer);
							resolve();
						}

				}
			}, 400);
		});
	}, ARTICLE_ITEM_CLASS);
};

(async () => {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
	await page.goto( URL );
  await autoScrollAndScrap(page);
  await browser.close();
})();
