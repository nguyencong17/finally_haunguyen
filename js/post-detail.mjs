import dayjs from "dayjs";
import postApi from "./api/postApi";
import { RegisterLightBox, setTextContent } from './utils'

function renderPostDetail(post) {
  if(!post) return;
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
    RegisterLightBox({
      modalId: 'lightbox',
      imgSelector: 'img[data-id="lightboxImg"]',
      prevSelector: 'button[data-id="lightboxPrev"]',
      nextSelector: 'button[data-id="lightboxNext"]',
    }
    );
    // get query params
    const queryParams = new URLSearchParams(window.location.search);
    // fetch data post by id
    const postId = queryParams.get('id');
    if(!postId) {
      console.log("404 Not Found");
      return;
    }
    const post = await postApi.getById(postId);
    renderPostDetail(post);
  } catch (error) {
    console.log("Failed to fetch post detail", error);
  }


})();