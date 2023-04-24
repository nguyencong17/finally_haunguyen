import postApi from './api/postApi';
import {initPagination, initSearch, renderPostList, renderPagination} from './utils'

async function handleFilterChange(filterName, filterValue) {
  try {
    const url = new URL(window.location);
    url.searchParams.set(filterName, filterValue);

    if(filterName === "title_like") url.searchParams.set('_page', 1);
    history.pushState({}, '', url);
  
    const { data, pagination } = await postApi.getAll(url.searchParams);
    renderPostList(data);
    renderPagination('pagination', pagination);
  } catch (error) {
    console.log("Error render pagination", error);
  }

}

(async () => {
  try {
    const url = new URL(window.location);

    // update search params if needed 
    if(!url.searchParams.get('_page')) url.searchParams.set('_page', 1);
    if(!url.searchParams.get('_limit')) url.searchParams.set('_limit', 6);
    history.pushState({}, '' , url);

    const queryParams = url.searchParams;
    console.log(queryParams);

    // attack click event for links
    initPagination({
      elementId: 'pagination',
      defaultParams: queryParams,
      onChange: (page) => handleFilterChange('_page', page)
    });
    
    initSearch({
      elementId: 'searchInput',
      defaultParams: queryParams,
      onChange: (value) => handleFilterChange('title_like', value)
    });

    // fetch api
    const { data, pagination } = await postApi.getAll(queryParams);

    // render post list
    renderPostList(data);

    // render pagination
    renderPagination('pagination', pagination);

  } catch (error) {
    console.log('get all error', error); 
  }

})();