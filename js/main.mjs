import postApi from "./api/postApi";

async function getAll() {
  const queryParams = {
    _page: 1,
    _limit: 3
  }
  const response = await postApi.getAll(queryParams);
  console.log(response);
}

getAll();