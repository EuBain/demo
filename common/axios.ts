import axios from "axios";

const Instance = axios.create({
  // 请求头配置token 
  headers: {
    "token": localStorage.getItem("token") || ""
  },

  // 基础路径
  baseURL: "http://localhost:3000",

  // 超时时间
  timeout: 2 * 60 * 1000,

  // 跨域请求时是否使用cookie 
  withCredentials: false,

});


// request拦截器

Instance.interceptors.request.use(
  (config) => {
    // 请求前的处理
    return config;
  },
  (error) => {
    // 请求错误处理
    return Promise.reject(error);
  }
);


// response拦截器
Instance.interceptors.response.use(
  (response) => {
    // 请求成功的处理
    return response;
  },
  (error) => {
    // 请求失败的处理
    return Promise.reject(error);
  }
);



const get = (url: string, params?: any, headers?:any, options?:any) => {
  return new Promise((resolve, reject) => {
    Instance({
      method: "get",
      url,
      params,
      headers: {
        ...headers
      },
      ...options
    }).then((res) => {
      resolve(res);
    }).catch((err) => {
      reject(err);
    })
  })

}

const post = (url: string, data: any, headers?:any, options?:any) => {
  return new Promise((resolve, reject) => {
    Instance({
      method: "post",
      url,
      data,
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        ...headers
      },
      ...options
    }).then((res) => {
      resolve(res);
    }).catch((err) => {
      reject(err);
    })
  })
}