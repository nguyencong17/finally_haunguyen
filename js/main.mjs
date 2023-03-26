import axiosClient from "./api/axiosClient";

async function getAll() {
  const response = await axiosClient.get('/posts');
  console.log(response);
}

getAll();