import debounce from 'lodash.debounce';
import postApi from './api/postApi';
import {getUlPagination, setTextContent, truncateText} from './utils';
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
  if(!Array.isArray(postList)) return;
  
  const ulElement = document.getElementById('postsList');
  if(!ulElement) return;

  ulElement.textContent = '';

  postList.forEach((post) => {
    const liElement = createPostElement(post);

    ulElement.appendChild(liElement);
  })
};

function renderPagination(pagination) {
  const ulPagination = getUlPagination();

  if(!pagination || !ulPagination) return;

  // calculate totalpage 
  const {_page, _limit , _totalRows } = pagination;
  const totalPages = Math.ceil(_totalRows / _limit);
  console.log(totalPages);
  
  // Set information to tag ul 
  ulPagination.dataset.page = _page;
  ulPagination.dataset.totalPages = totalPages;

  // Check Disable / Enable of Button Prev / Next
  if(_page <= 1)  ulPagination.firstElementChild?.classList.add('disabled')
  else ulPagination.firstElementChild?.classList.remove('disabled')

  if(_page >= totalPages)  ulPagination.lastElementChild?.classList.add('disabled')
  else ulPagination.lastElementChild?.classList.remove('disabled')
}

async function handleFilterChange(filterName, filterValue) {
  try {
    const url = new URL(window.location);
    url.searchParams.set(filterName, filterValue);

    if(filterName === "title_like") url.searchParams.set('_page', 1);
    history.pushState({}, '', url);
  
    const { data, pagination } = await postApi.getAll(url.searchParams);
    renderPostList(data);
    renderPagination(pagination);
  } catch (error) {
    console.log("Error render pagination", error);
  }

}

function handlePrevClick(e) {
  e.preventDefault();
  const ulPagination = getUlPagination();
  if(!ulPagination) return;

  const page = Number.parseInt(ulPagination.dataset.page) || 1;
  if(page <= 1) return;

  handleFilterChange('_page', page - 1);
}

function handleNextClick(e) {
  e.preventDefault();
  const ulPagination = getUlPagination();
  if(!ulPagination) return;

  const page = Number.parseInt(ulPagination.dataset.page) || 1;
  const totalPages = ulPagination.dataset.totalPages;
  if(page >= totalPages) return;

  handleFilterChange('_page', page + 1);
}

function initPagination() {
  // bind event to button Next/Prev
  const ulPagination = getUlPagination();
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

function initSearch() {
  const searchInput = document.getElementById('searchInput');
  if(!searchInput) return;

  //set default searchinput from queryparams
  const queryParams = new URLSearchParams(window.location.search);
  if(queryParams.get('title_like')) {
    searchInput.value = queryParams.get('title_like');
  }
  const debounceSearch = debounce((event) => handleFilterChange('title_like', event.target.value), 500)
  searchInput.addEventListener('input', debounceSearch)
}

(async () => {
  try {
    initSearch();
    initURL();
    const queryParams = new URLSearchParams(window.location.search);
    console.log(queryParams);
    const { data, pagination } = await postApi.getAll(queryParams);
    renderPostList(data);
    renderPagination(pagination);
  } catch (error) {
    console.log('get all error', error); 
  }

  initPagination();
})();