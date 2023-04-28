import dayjs from "dayjs";
import postApi from "./api/postApi";
import { setTextContent } from './utils'

// id="goToEditPageLink"
// id="postHeroImage"
// id="postDetailTitle"
// id="postDetailAuthor"
// id="postDetailTimeSpan"
// id="postDetailDescription"

// author
// : 
// "hoa dinh "
// createdAt
// : 
// 1682669081008
// description
// : 
// "runner top 1 sever trai dat "
// id
// : 
// "undefined"
// imageUrl
// : 
// "https://js-post-api.herokuapp.com/posts/hinh-nen-xe-o-to-audi-a8-2-1gwu8klh09q3bs.jpg"
// title
// : 
// "hoa dinh 1"
// updatedAt
// : 
// 1682669081008

function renderPostDetail(post) {
  if(!post) return;

  //render title
  // render description 
  //render author
  // render updateAt
  setTextContent(document, '#postDetailTitle', post.title);
  setTextContent(document, '#postDetailDescription', post.description);
  setTextContent(document, '#postDetailAuthor', post.author);
  setTextContent(document, '#postDetailTimeSpan', dayjs(post.updatedAt).format(' - DD/MM/YYYY HH:mm'));
  //render hero image

  const heroImage = document.getElementById('postHeroImage');
  if(heroImage) {
    heroImage.style.backgroundImage = `url("${post.imageUrl}")`;

    heroImage.addEventListener('error', () => {
      thumbnailElement.src = 'https://placehold.jp/1920x450.png';
    })
  }
  //render edit page link
  const editLink = document.getElementById('goToEditPageLink');
  if(editLink) {
    editLink.href = `/add-edit-post.html?id=${post.id}`
    editLink.textContent = 'Edit Page'
  }
}

( async () => {

  try {
    // get query params
    const queryParams = new URLSearchParams(window.location.search);
    console.log(queryParams); 
    // fetch data post by id
    const postId = queryParams.get('id');
    console.log(postId);
    if(!postId) {
      console.log("404 Not Found");
      return;
    }
    const post = await postApi.getById(postId);
    console.log(post);
    renderPostDetail(post);
  } catch (error) {
    console.log("Failed to fetch post detail", error);
  }


})();