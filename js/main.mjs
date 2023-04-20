import postApi from './api/postApi';
import {setTextContent, truncateText} from './utils';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

//to use dayjs
dayjs.extend(relativeTime)
function createPostElement(post) {
  if(!post) return;

  // find tempalte
  const postTemplate = document.getElementById('postItemTemplate');
  if(!postTemplate) return;

  const liElement = postTemplate.content.firstElementChild.cloneNode(true);
  if(!liElement) return;
  // update title, content, thumbnail
  setTextContent(liElement, '[data-id="title"]', post.title);
  setTextContent(liElement, '[data-id="description"', truncateText(post.description, 100));
  setTextContent(liElement, '[data-id="author"]', post.author);
  setTextContent(liElement, '[data-id="timeSpan"]', dayjs(post.updateAt).fromNow());

  const thumbnailElement = liElement.querySelector('[data-id="thumbnail"]');
  if(thumbnailElement) {
    thumbnailElement.src = post.imageUrl

    thumbnailElement.addEventListener('error', () => {
      thumbnailElement.src = 'https://placehold.jp/450x450.png';
    })
  }
  
  return liElement;
}

function renderPostList(postList) {
  if(!Array.isArray(postList) || postList.length === 0) return;
  
  const ulElement = document.getElementById('postsList');
  if(!ulElement) return;
  postList.forEach((post) => {
    const liElement = createPostElement(post);

    ulElement.appendChild(liElement);
  })
};

function handleFilterChange(filterName, filterValue) {
  const url = new URL(window.location);
  url.searchParams.set(filterName, filterValue);
  history.pushState({}, '', url);
}

function handlePrevClick(e) {
  e.preventDefault();
  console.log('Prev Click');
}

function handleNextClick(e) {
  e.preventDefault();
  console.log('Next Click');
}

function initPagination() {
  // bind event to button Next/Prev
  const ulPagination = document.getElementById('pagination');
  if(!ulPagination) return;
  
  const prevLink = ulPagination.firstElementChild?.firstElementChild;
  if(prevLink) {
    prevLink.addEventListener('click', handlePrevClick)
  }

  const nextLink = ulPagination.lastElementChild?.firstElementChild;
  if(nextLink) {
    nextLink.addEventListener('click', handleNextClick)
  }
}

function initURL() {
  const url = new URL(window.location);
  if(!url.searchParams.get('_page')) url.searchParams.set('_page', 1);
  if(!url.searchParams.get('_limit')) url.searchParams.set('_limit', 6);
  history.pushState({}, '' , url);
}

(async () => {
  try {
    initURL();
    const queryParams = new URLSearchParams(window.location.search);
    console.log(queryParams);
    const { data, pagination } = await postApi.getAll(queryParams);
    renderPostList(data);
  } catch (error) {
    console.log('get all error', error); 
  }

  initPagination();
})();