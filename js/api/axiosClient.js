import axios from 'axios';


// Tạo 1 instance thay thế cho axios
const axiosClient = axios.create({
  baseURL: 'https://js-post-api.herokuapp.com/api',
  timeout: 1000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercepter

// Thêm một bộ đón chặn request
axiosClient.interceptors.request.use(function (config) {
    // Làm gì đó trước khi request dược gửi đi
    return config;
  }, function (error) {
    // Làm gì đó với lỗi request
    return Promise.reject(error);
  });

// Thêm một bộ đón chặn response
axiosClient.interceptors.response.use(function (response) {
    // Bất kì mã trạng thái nào nằm trong tầm 2xx đều khiến hàm này được trigger
    // Làm gì đó với dữ liệu response
    return response.data;
  }, function (error) {
    // Bất kì mã trạng thái nào lọt ra ngoài tầm 2xx đều khiến hàm này được trigger\
    // Làm gì đó với lỗi response
    return Promise.reject(error);
  });

export default axiosClient;