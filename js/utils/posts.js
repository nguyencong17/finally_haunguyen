
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { setTextContent, truncateText } from './common';

//to use dayjs
dayjs.extend(relativeTime)
export function createPostElement(post) {
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

export function renderPostList(postList) {
  if(!Array.isArray(postList)) return;
  
  const ulElement = document.getElementById('postsList');
  if(!ulElement) return;

  ulElement.textContent = '';

  postList.forEach((post) => {
    const liElement = createPostElement(post);

    ulElement.appendChild(liElement);
  })
};