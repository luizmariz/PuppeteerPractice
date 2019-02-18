function scrapItem() {
  return item = ({ 
    url: document.getElementsByClassName(article)[index].childNodes[1].firstElementChild.href,
    title: document.getElementsByClassName(article)[index].getElementsByClassName('postArticle-content')[0].firstElementChild.firstElementChild.lastElementChild.firstElementChild.getElementsByClassName('graf--title')[0] || document.getElementsByClassName(ARTICLE_ITEM_CLASS)[index].getElementsByClassName('postArticle-content')[0].firstElementChild.firstElementChild.lastElementChild.firstElementChild.getElementsByClassName('graf--trailing') || { textContent: "" },
    subtitle: document.getElementsByClassName(article)[index].getElementsByClassName('postArticle-content')[0].firstElementChild.firstElementChild.lastElementChild.firstElementChild.getElementsByClassName('graf--trailing')[0] || { textContent: "" },
  });
};