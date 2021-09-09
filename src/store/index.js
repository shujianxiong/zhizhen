import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
         menuData: [
             {
                 "menu_name": "角色列表",
                 "menu_url": "system",
                 "menu_level": 1,
                 "pid": 1,
                 "menu_id": 1,
                 "sub_menu": [
                     {
                         "menu_name": "角色管理",
                         "menu_url": "roles",
                         "menu_level": 2,
                         "pid": 1,
                         "menu_id": 3
                     },
                     {
                         "menu_name": "后台用户",
                         "menu_url": "backgroundUser",
                         "menu_level": 2,
                         "pid": 2,
                         "menu_id": 4
                     }
                 ],

             },
             {
                 "menu_name": "C端用户",
                 "menu_url": "user",
                 "menu_level": 1,
                 "pid": 1,
                 "menu_id": 2,
                 "sub_menu": [
                     {
                         "menu_name": "用户列表",
                         "menu_url": "user",
                         "menu_level": 2,
                         "pid": 1,
                         "menu_id": 3
                     },
                     {
                         "menu_name": "业主列表",
                         "menu_url": "owner",
                         "menu_level": 2,
                         "pid": 1,
                         "menu_id": 4
                     }
                 ],

             },
             {
                 "menu_name": "商品管理",
                 "menu_url": "goods",
                 "menu_level": 1,
                 "pid": 1,
                 "menu_id": 3,
                 "sub_menu": [
                     {
                         "menu_name": "商品分类",
                         "menu_url": "goodsClass",
                         "menu_level": 2,
                         "pid": 1,
                         "menu_id": 3
                     },
                     {
                         "menu_name": "商品列表",
                         "menu_url": "goodslist",
                         "menu_level": 2,
                         "pid": 2,
                         "menu_id": 4
                     },
                     {
                         "menu_name": "热卖商品",
                         "menu_url": "hotgoods",
                         "menu_level": 2,
                         "pid": 2,
                         "menu_id": 5
                     }
                 ],

             },
             {
                 "menu_name": "订单管理",
                 "menu_url": "order",
                 "menu_level": 1,
                 "pid": 1,
                 "menu_id": 4,
                 "sub_menu": [
                     {
                         "menu_name": "订单列表",
                         "menu_url": "orderlist",
                         "menu_level": 2,
                         "pid": 1,
                         "menu_id": 3
                     },
                     {
                         "menu_name": "售后列表",
                         "menu_url": "salelist",
                         "menu_level": 2,
                         "pid": 2,
                         "menu_id": 4
                     },
                     {
                         "menu_name": "评价列表",
                         "menu_url": "appraise",
                         "menu_level": 2,
                         "pid": 2,
                         "menu_id": 5
                     }
                 ],

             },
             {
                 "menu_name": "电站管理",
                 "menu_url": "powerStation",
                 "menu_level": 1,
                 "pid": 1,
                 "menu_id": 5,
                 "sub_menu": [
                     {
                         "menu_name": "光伏电站",
                         "menu_url": "pv",
                         "menu_level": 2,
                         "pid": 1,
                         "menu_id": 3
                     },
                     {
                         "menu_name": "项目电站",
                         "menu_url": "project-powerstation",
                         "menu_level": 2,
                         "pid": 2,
                         "menu_id": 4
                     },
                     {
                         "menu_name": "电站交易情况",
                         "menu_url": "transaction",
                         "menu_level": 2,
                         "pid": 2,
                         "menu_id": 5
                     },
                     {
                         "menu_name": "服务电站",
                         "menu_url": "service",
                         "menu_level": 2,
                         "pid": 2,
                         "menu_id": 6
                     }
                 ],

             },
             {
                 "menu_name": "会员效益",
                 "menu_url": "vip",
                 "menu_level": 1,
                 "pid": 1,
                 "menu_id": 6,
                 "sub_menu": [
                     {
                         "menu_name": "会员效益",
                         "menu_url": "vip",
                         "menu_level": 2,
                         "pid": 1,
                         "menu_id": 3
                     }
                 ],

             },
             {
                 "menu_name": "热点资讯",
                 "menu_url": "information",
                 "menu_level": 1,
                 "pid": 1,
                 "menu_id": 7,
                 "sub_menu": [
                     {
                         "menu_name": "热点资讯",
                         "menu_url": "information",
                         "menu_level": 2,
                         "pid": 1,
                         "menu_id": 3
                     }
                 ],

             },
             {
                 "menu_name": "财务管理",
                 "menu_url": "finance",
                 "menu_level": 1,
                 "pid": 1,
                 "menu_id": 8,
                 "sub_menu": [
                     {
                         "menu_name": "出入帐统计",
                         "menu_url": "bill",
                         "menu_level": 2,
                         "pid": 1,
                         "menu_id": 3
                     },
                     {
                         "menu_name": "电站产品收入",
                         "menu_url": "powerIncome",
                         "menu_level": 2,
                         "pid": 2,
                         "menu_id": 4
                     },
                     {
                         "menu_name": "非电站产品收入",
                         "menu_url": "nopowerIncome",
                         "menu_level": 2,
                         "pid": 2,
                         "menu_id": 5
                     },
                     {
                         "menu_name": "电站支出",
                         "menu_url": "expenditure",
                         "menu_level": 2,
                         "pid": 2,
                         "menu_id": 6
                     },
                     {
                         "menu_name": "会员余额",
                         "menu_url": "vipbalance",
                         "menu_level": 2,
                         "pid": 2,
                         "menu_id": 7
                     }
                     ,
                     {
                         "menu_name": "提现管理",
                         "menu_url": "withdrawal",
                         "menu_level": 2,
                         "pid": 2,
                         "menu_id": 8
                     },
                     {
                         "menu_name": "工单管理",
                         "menu_url": "workorder",
                         "menu_level": 2,
                         "pid": 2,
                         "menu_id": 9
                     }]
             }
             ,
             {
                 "menu_name": "基础设置",
                 "menu_url": "basics",
                 "menu_level": 1,
                 "pid": 1,
                 "menu_id": 9,
                 "sub_menu": [
                     {
                         "menu_name": "banner图",
                         "menu_url": "banner",
                         "menu_level": 2,
                         "pid": 1,
                         "menu_id": 3
                     },
                     {
                         "menu_name": "关于我们",
                         "menu_url": "aboutUs",
                         "menu_level": 2,
                         "pid": 2,
                         "menu_id": 4
                     },
                     {
                         "menu_name": "有问有答",
                         "menu_url": "questions",
                         "menu_level": 2,
                         "pid": 2,
                         "menu_id": 5
                     },
                     {
                         "menu_name": "物流公司",
                         "menu_url": "logistics",
                         "menu_level": 2,
                         "pid": 2,
                         "menu_id": 6
                     }

                 ],

             }
         ],
    },
    mutations: {
        setMenuData(state, list) {
            state.menuData = list
            localStorage.setItem('menuData', JSON.stringify(list))
        }
    },
    getters: {
        //根据菜单权限动态生成路由
        menuRouters(state) {
            let routes = []
            state.menuData.forEach(v => {
                v.sub_menu.forEach(item => {
                    let vueName = item.menu_url ? item.menu_url.replace(item.menu_url[0], item.menu_url[0].toUpperCase()) : ''
                    const obj = {
                        path: '/' + item.menu_url,
                        name: vueName,
                        component: () =>
                            import(`@/components/${v.menu_url}/${vueName}.vue`),
                        meta: { title: item.menu_name }
                    }
                    routes.push(obj)
                })
            })
            return routes
        },

    }
})

export default store