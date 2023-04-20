import postApi from './api/postApi';
import {setTextContent, truncateText} from './utils';
import dayjs from 'dayjs';
import relativeTime from '/dayjs/plugin/relativeTime';

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
  console.log({postList})
  if(!Array.isArray(postList) || postList.length === 0) return;
  
  const ulElement = document.getElementById('postsList');
  if(!ulElement) return;
  postList.forEach((post) => {
    const liElement = createPostElement(post);
    console.log(liElement);

    ulElement.appendChild(liElement);
  })
};

function handlePrevClick() {
  console.log('Prev Click');
}

function handleNextClick() {
  console.log('Next Click');
}

function initPagination() {
  // bind event to button Next/Prev 
  const ulPagination = getElementById('pagination');
  if(!ulPagination) return;
  
  const prevLink = ulPagination.firstElementChild?.firstElementChild;
  if(prevLink) {
    prevLink.addEventListener('click', handlePrevClick)
  }

  if(nextLink) {
    nextLink.addEventListener('click', handleNextClick)
  }
}

(async () => {
  try {

    initPagination();

    const queryParams = {
      _page: 1,
      _limit: 6
    }
    const { data , pagination} = await postApi.getAll(queryParams);
    renderPostList(data);
  } catch (error) {
    console.log('get all error', error); 
  }
})();