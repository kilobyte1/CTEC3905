"use strict";

async function loadObject(id) {
  const url = `https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`;
  const response = await fetch(url);
  return response.json();
}
//loadObject(10000).then(obj => console.log(obj));

function buildArticleFromData(obj) {
  const article = document.createElement("article");
  const title = document.createElement("h3");
  const primaryImageSmall = document.createElement("img");
  const modal = document.createElement('div');
  const primaryImage = document.createElement("img");
  const objectInfo = document.createElement("p");
  const objectName = document.createElement("span");
  const objectDate = document.createElement("span");
  const medium = document.createElement("p");

  title.textContent = obj.title;
  primaryImageSmall.src = obj.primaryImageSmall;
  primaryImageSmall.alt = `${obj.title} (small image)`;
  primaryImage.src = obj.primaryImage;
  primaryImage.alt = obj.title;
  modal.className = "modal";
  objectName.textContent = obj.objectName;
  objectDate.textContent = `, ${obj.objectDate}`;
  medium.textContent = obj.medium;

  article.addEventListener('click', ev => {
    modal.classList.toggle('on');
  });

  article.appendChild(title);
  article.appendChild(modal);
  modal.appendChild(primaryImage);
  article.appendChild(primaryImageSmall);
  article.appendChild(objectInfo);
  article.appendChild(medium);

  objectInfo.appendChild(objectName);
  if(obj.objectDate) {
    objectInfo.appendChild(objectDate);
  }

  return article;
}


  async function insertArticles(objIds) {
    const objects = await Promise.all(objIds.map(loadObject))
    const articles = objects.map(buildArticleFromData);
    articles.forEach(a => results.appendChild(a));
  }


  //serch 
  async function loadSearch(query) {
    let baseURL = `https://collectionapi.metmuseum.org/public/collection/v1/search`;
    const response = await fetch(`${baseURL}?hasImages=true&q=${query}`);
    return response.json();
  }

  function clearResults() {
    while(results.firstChild) {
      results.firstChild.remove();
    }
  }

  let pageSize = 12;
  let currentPage;
  let objectIDs;

  function loadPage() {
    clearResults();
    const myObjects = objectIDs.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    loader.classList.add("waiting");
    //myObjects.forEach(insertArticle);
    insertArticles(myObjects); 
    loader.classList.remove("waiting");
    pageIndicator.textContent = currentPage;
  }

  async function doSearch() {
    clearResults();
    loader.classList.add("waiting");
    const result = await loadSearch(query.value);
    objectIDs = result.objectIDs || []
    count.textContent = `found ${result.objectIDs.length} results for "${query.value}"`;
    nPages.textContent = Math.ceil(objectIDs.length / pageSize);
    currentPage=1;
    loadPage();
  }

  query.addEventListener('change', doSearch);

  function nextPage() {
    currentPage += 1;
    const nPages = Math.ceil(objectIDs.length / pageSize);
    if(currentPage > nPages) { currentPage = 1;}
    loadPage();
  }

  function prevPage() {
    currentPage -= 1;
    const nPages = Math.ceil(objectIDs.length / pageSize);
    if(currentPage < 1) { currentPage = nPages;}
    loadPage();
  }
  prev.addEventListener('click', prevPage);
  next.addEventListener('click', nextPage);