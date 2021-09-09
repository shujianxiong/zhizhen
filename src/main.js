import Vue from 'vue'
import App from './App.vue'
import router from "./router"
import store from './store';
// import VueRouter from 'vue-router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/icon/index/iconfont.css'
import '@/assets/icon/import/iconfont.css'
import '@/assets/icon/order/iconfont.css'
// import 'element-ui/lib/theme-chalk/index.css'; // 默认主题 
// import tinymceEditor from '../tinymce/tinymce.vue'

// Vue.use(VueRouter)
Vue.use(ElementUI);

import api from './utils/axios.js'

// import stote from './store.js'
let axios = require("axios");


Vue.config.productionTip = false
Vue.prototype.$api = api

import mavonEditor from 'mavon-editor';     //markdown编辑器
import 'mavon-editor/dist/css/index.css';
Vue.use(mavonEditor)

// Vue.prototype.converter = new showdown.Converter()

//tinymce编辑器及相关插件
import tinymce from 'tinymce/tinymce'
import 'tinymce/themes/silver/theme'
import 'tinymce/icons/default/icons'
import Editor from '@tinymce/tinymce-vue'
import 'tinymce/plugins/image'
import 'tinymce/plugins/media'
import 'tinymce/plugins/imagetools'
import 'tinymce/plugins/link'
import 'tinymce/plugins/code'
import 'tinymce/plugins/table'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/contextmenu'
import 'tinymce/plugins/wordcount'
import 'tinymce/plugins/colorpicker'
import 'tinymce/plugins/textcolor'
Vue.component('tinymce-editor', Editor)

// 文件上传
Vue.prototype.$uploadFiles = function (url, file) {
    let formData = new FormData()
    formData.append('filename', file)
    return new Promise(function (resolve, reject) {
        axios.post(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            transformRequest: []
        }).then(res => {
            resolve(res.data);
        }).catch(err => {
            reject(err);
        });
    })
}
Vue.prototype.$upload = function (file) {
    let formData = new FormData()
    formData.append('filename', file)
    return new Promise(function (resolve, reject) {
        axios.post("http://manager.zhizhennengyuan.com:8000/mfxapi/multifileupload", formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            transformRequest: []
        }).then(res => {
            resolve(res.data);
        }).catch(err => {
            console.log(err);
        });
    })
}
// 导入文件
Vue.prototype.$ImportUserExcel = function (url, file) {
    let formData = new FormData()
    formData.append('file', file)
    return new Promise(function (resolve, reject) {
        axios.post(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            transformRequest: []
        }).then(res => {
            resolve(res.data);
        }).catch(err => {
            reject(err);
        });
    })
}
Vue.prototype.$ajax = function (port, params, method) {
    let that = this
    //获取缓存数据
    let token = localStorage.getItem('token') || ''
    params = params || {};
    params.token = token;
    method = method || 'post'
    return new Promise(function (resolve, reject) {
        axios({
            method: method,
            url: port,
            data: JSON.stringify(params)
        }).then(res => {
            // console.log(res, 'then')
            if (res.data.code == 1 || res.data.code == 0) {
                resolve(res.data)
            } else if (res.data.code == -1) {
                if (res.data.msg.indexOf('无效的token') > -1) {
                    that.$message.error('会话已过期，请重新登录')
                    localStorage.removeItem('token');
                    localStorage.removeItem('uid');
                    setTimeout(function () {
                        that.$router.push({ path: '/login' })
                    }, 1000)
                } else {
                    that.$message.error(res.data.msg)
                }
            }
        }).catch(error => {
            if (error.response.data.message.indexOf('无效的token') > -1) {
                that.$message.error('会话已过期，请重新登录')
                localStorage.removeItem('token');
                localStorage.removeItem('uid');
                setTimeout(function () {
                    that.$router.push({ path: '/login' })
                }, 1000)
            }
            // reject(res)
        })
    } /* executor */);
}
//下载请求
Vue.prototype.$download = function (port, params, fileName) {
    let self = this;
    let token = localStorage.getItem('token')
    token = token || "";
    params = params || {};
    if (token == "") {
        console.error("token为空")
    } else if (!port) {
        console.error("未定义接口名")
    } else {
        params.btoken = token;
        return new Promise(function (resolve, reject) {
            return axios.post(port, params, { responseType: 'blob' }).then(res => {
                console.log(res, 'down')
                if (res.data.status == 2) {
                    self.$message({
                        title: '提示',
                        message: res.data.message,
                        type: 'info'
                    });
                    if (res.data.message.indexOf('会话过期') > -1) {
                        setTimeout(function () {
                            self.$router.push({ path: '/login' })
                        }, 3000)
                    }
                } else if (res.data.status == 0) {
                    resolve(res.data)
                    // self.$message({
                    //     title: '错误',
                    //     message: res.data.message,
                    //     type: 'error'
                    // });
                } else {
                    var blob = new Blob([res.data])
                    console.log(blob, 'blob')
                    var downloadElement = document.createElement('a');
                    var href = window.URL.createObjectURL(blob); //创建下载的链接
                    downloadElement.href = href;
                    downloadElement.download = fileName + new Date().getTime() + '.xls'; //下载后文件名
                    document.body.appendChild(downloadElement);
                    downloadElement.click(); //点击下载
                    document.body.removeChild(downloadElement); //下载完成移除元素
                    window.URL.revokeObjectURL(href); //释放掉blob对象
                }
            }).catch(res => {
                reject(res)
            })
        } /* executor */);
    }
}
// 使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
    let token = localStorage.getItem('token')
    console.log(token, 'token')
    // 如果已经登录，放行
    if (token) {
        next()
    } else {
        // 如果没有登录，访问非登录页面,则跳转到登录页面
        if (to.path !== '/login') {
            next({
                path: '/login'
            })
        } else {
            // 如果没有登录，但访问的是登录页面,直接进入
            next()
        }
    }
})

new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app')


