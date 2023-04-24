
export function initPagination({elementId, defaultParams, onChange}) {
  // bind event to button Next/Prev
  const ulPagination = document.getElementById(elementId);
  if(!ulPagination) return;

  // set current active page

  // add click event for prev/next link 
  const prevLink = ulPagination.firstElementChild?.firstElementChild;
  if(prevLink) {
    prevLink.addEventListener('click', (e) => {
      e.preventDefault();
      console.log("Helo");
      const page = Number.parseInt(ulPagination.dataset.page) || 1;
      if(page >= 2) onChange?.(page - 1);
    })
  }

  const nextLink = ulPagination.lastElementChild?.firstElementChild;
  if(nextLink) {
    nextLink.addEventListener('click', (e) => {
      e.preventDefault();
      console.log("Helo");
      const page = Number.parseInt(ulPagination.dataset.page) || 1;
      const totalPages = ulPagination.dataset.totalPages;
      if(page < totalPages) onChange?.(page + 1);
    
    } )
  }
}

export function renderPagination(elementId, pagination) {
  const ulPagination = document.getElementById(elementId);
  if(!pagination || !ulPagination) return;

  // calculate totalpage 
  const {_page, _limit , _totalRows } = pagination;
  const totalPages = Math.ceil(_totalRows / _limit);
  
  // Set information to tag ul 
  ulPagination.dataset.page = _page;
  ulPagination.dataset.totalPages = totalPages;

  // Check Disable / Enable of Button Prev / Next
  if(_page <= 1)  ulPagination.firstElementChild?.classList.add('disabled')
  else ulPagination.firstElementChild?.classList.remove('disabled')

  if(_page >= totalPages)  ulPagination.lastElementChild?.classList.add('disabled')
  else ulPagination.lastElementChild?.classList.remove('disabled')
}