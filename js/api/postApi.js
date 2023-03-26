import axiosClient from "./axiosClient";

const postApi = {

  // Get All Post
  getAll(params) {
    const url = '/posts';
    return axiosClient.get(url, { params });
  },

  // Get Post By Id
  getById(id) {
    const url = `/posts/${id}`;
    return axiosClient.get(url);
  },

  // Add Post 
  add(data) {
    const url = '/posts';
    return axiosClient.post(url, data);
  },

  // Update Post
  update(data) {
    const url = `/posts/${data.id}`;
    return axiosClient.patch(url, data);
  },

  // Remove Post
  remove(id) {
    const url = `/posts/${id}`;
    return axiosClient.delete(url);
  }
}

export default postApi;