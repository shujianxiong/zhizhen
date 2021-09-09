import Vue from 'vue';
import Router from 'vue-router';
import store from '@/store'

Vue.use(Router);

  //1. 导入 Vue
 //import Vue from "vue";

  //2. 导入vue-router
 import VueRouter from 'vue-router';

  //3. 注册 Vue.use()
 //Vue.use(VueRouter);

  //登录
/* import login from './components/login/login.vue'

 //首页
 import index from './components/index/index.vue'

  //角色管理
 import roles from './components/roles/roles.vue'

  //后台用户
 import backgroundUser from './components/backgroundUser/backgroundUser.vue'

  //用户列表
 import user from './components/user/user.vue'

 //商品分类
 import goodsclass from './components/goodsclass/goodsclass.vue' 

  //商品列表
 import goodslist from './components/goodslist/goodslist.vue'

  //热卖商品
 import hotgoods from './components/hotgoods/hotgoods.vue'

  //vip
 import vip from './components/vip/vip.vue'

  //订单列表
 import orderlist from './components/order/orderlist.vue'

  //售后列表
 import salelist from './components/order/salelist.vue'

  //评价列表
 import appraise from './components/order/appraise.vue'

  //热点资讯
 import information from './components/information/information.vue'

  //光伏电站
 import pv from './components/powerStation/pv.vue'

  //项目电站
 import project from './components/powerStation/project-powerstation.vue'

  //电站交易情况
 import transaction from './components/powerStation/transaction.vue'

 // 服务电站
 import service from './components/powerStation/service.vue'


 /!*======================财务管理===========================*!/
  //出入帐统计
 import bill from './components/finance/bill.vue'

  //电站产品收入
 import powerIncome from './components/finance/powerIncome.vue'

  //非电站产品收入
 import nopowerIncome from './components/finance/nopowerIncome.vue'

  //电站支出
 import expenditure from './components/finance/expenditure.vue'

  //会员余额
 import vipbalance from './components/finance/vipbalance.vue'

  //提现管理
 import withdrawal from './components/finance/withdrawal.vue'



 /!*====================基础设置=====================*!/
  //banner图
 import banner from './components/basics/banner.vue' 

  //关于我们
 import aboutUs from './components/basics/aboutUs.vue'

  //有问有答
 import questions from './components/basics/questions.vue'

  //物流公司
 import logistics from './components/basics/logistics.vue'

 const routes = [{
     path: "/login", //登录
     component: login,
 }, {
     path: "/",
     component: index,
     children: [{
         path: "",
         redirect: '/roles' //角色管理
     }, {
         path: "/roles",
         component: roles
     }, {
         path: "/backgroundUser",  //后台用户
         component: backgroundUser
     }, {
         path: "/user",  //用户列表
         component: user
     }, {
         path: "/goodsclass", //商品分类
         component: goodsclass
     }, {
         path: "/goodslist", //商品列表
         component: goodslist
     }, {
         path: "/hotgoods",  //热卖商品
         component: hotgoods
     }, {
         path: "/vip",   //vip
         component: vip
     }, {
         path: "/orderlist",  //订单列表
         component: orderlist
     }, {
         path: "/salelist",  //售后列表
         component: salelist
     }, {
         path: "/appraise",  //评价列表
         component: appraise
     }, {
         path: "/information",  //热点资讯
         component: information
     }, {
         path: "/pv",  //光伏电站
         component: pv
     },{
         path:'/project',   //项目电站
         component:project
     },{
         path:'/transaction',  //电站交易情况
         component:transaction
     },{
         path:'/service',  //服务电站
         component:service
     },{
         path:'/bill',  //出入帐统计
         component:bill
     },{
         path:'/powerIncome', //电站产品收入
         component:powerIncome
     },{
         path:'/nopowerIncome', //非电站产品收入
         component:nopowerIncome
     },{
         path:'/expenditure',  //电站支出
         component:expenditure
     },{
         path:'/vipbalance',  //会员余额
         component:vipbalance
     },{
         path:'/withdrawal',  //提现管理
         component:withdrawal
     },{
         path:'/banner', //banner图
         component:banner
     },{
         path:'/aboutUs',  //关于我们
         component:aboutUs
     },{
         path:'/questions',  //有问有答
         component:questions
     },{
         path:'/logistics',  //物流公司
         component:logistics
     }]
 },
 {
     path: "/",
     redirect: "/index",
 }]*/


 // 6. 创建vue-router的实例化对象
/* const router = new VueRouter({
      mode: 'history',
     routes
 })*/

let router = new Router({
    routes: [
        {
            path: '/',
            redirect: '/index'
        },
        {
            path: '/index',
            component: () =>
                import('./components/index/index.vue'),
            meta: { title: '首页' },
            children: [
                {
                    path: '/welcome',
                    component: () =>
                        import('./components/common/Welcome.vue'),
                    meta: { title: '首页' }
                },
            ]
        },
        {
            path: '/login',
            component: () =>
                import('./components/login/Login.vue'),
            meta: { title: '登录' }
        },
    ]
});

 console.log(router);
router.options.routes[1].children = router.options.routes[1].children.concat(store.getters.menuRouters)
router.addRoutes(router.options.routes)
/* const originalPush = Router.prototype.push
 //修改原型对象中的push方法
 Router.prototype.push = function push(location) {
   return originalPush.call(this, location).catch(err => err)
 }*/

 const originalPush = Router.prototype.push
 Router.prototype.push = function push(location, onResolve, onReject) {
     if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
     return originalPush.call(this, location).catch(err => err)
 }


 export default router

// 7. 暴露router对象
//export default router;