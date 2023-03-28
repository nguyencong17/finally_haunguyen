import postApi from "./api/postApi";

function createPostElement(post) {
  if(!post) return;

  try {
    // find tempalte
    const postTemplate = document.getElementById('postItemTemplate');
    if(!postTemplate) return;

    const liElement = postTemplate.content.firstElementChild.cloneNode(true);
    if(!liElement) return;
    // update title, content, thumbnail
    const titleElement = liElement.querySelector('[data-id="title"]');
    if(titleElement) titleElement.textContent = post.title;

    const descriptionElement = liElement.querySelector('[data-id="description"]');
    if(descriptionElement) descriptionElement.textContent = post.description;

    const authorElement = liElement.querySelector('[data-id="author"]');
    if(authorElement) authorElement.textContent = post.author;


    const thumbnailElement = liElement.querySelector('[data-id="thumbnail"]');
    if(thumbnailElement) thumbnailElement.src = post.imageUrl;

    return liElement;
  } catch (error) {
    console.log("failed to create post item",error)
  }
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

(async () => {
  try {
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