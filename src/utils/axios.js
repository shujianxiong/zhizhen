import router from '../router'
import {
  Message
} from 'element-ui'
// let root = 'http://10.77.10.100:8004'
let root = 'http://manager.zhizhennengyuan.com:8000'
// let root = 'http://localhost:8004'

let axios = require("axios");

//这里设置请求头
axios.defaults.headers['Content-Type'] = 'application/json'


function toType(obj) {
  return {}.toString
    .call(obj)
    .match(/\s([a-zA-Z]+)/)[1]
    .toLowerCase();
}

function filterNull(o) {
  for (var key in o) {
    if (o[key] === null) {
      delete o[key];
    }
    if (toType(o[key]) === "string") {
      o[key] = o[key].trim();
    } else if (toType(o[key]) === "object") {
      o[key] = filterNull(o[key]);
    } else if (toType(o[key]) === "array") {
      o[key] = filterNull(o[key]);
    }
  }
  return o;
}

// axios.interceptors.request.use(
//   config => {
//     if (localStorage.getItem("token")) {
//       config.headers.token = `${localStorage.getItem("token")}`;
//     }
//     return config;
//   },
//   err => {
//     return Promise.reject(err);
//   }
// );

axios.interceptors.response.use(
  response => {
    if (response.data.code == -1 && response.data.msg == '无效的token!') {
      // Message.error({
      //   message: response.data.msg
      // });
      localStorage.removeItem('token');
      localStorage.removeItem('uid');
      setTimeout(function () {
        this.$router.push('/login');
        this.$message.error(response.data.msg);
      }, 1000)
    }
    return response
  },
);

function apiAxios(method, url, params, success) {
  if (params) {
    params = filterNull(params)
  }

  axios({
    method: method,
    url: url,
    data: method === "POST" || method === "PUT" || method === "DELETE" ? params : null,
    params: method === "GET" ? params : null,
    baseURL: root,
    withCredentials: false
  }).then(function (res) {
    if (success) success(res.data)

    // console.log(res.data);
  })

}

// 返回在vue模板中的调用接口
export default {
  get: function ({ path, success, params = null }) {
    return apiAxios("GET", path, params, success)
  },
  post: function ({ path, success, params = null }) {
    return apiAxios("POST", path, params, success)
  },
  put: function ({ path, success, params = null }) {
    return apiAxios("PUT", path, params, success)
  },
  delete: function ({ path, success, params = null }) {
    return apiAxios("DELETE", path, params, success)
  },

}