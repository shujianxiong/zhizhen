(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-05995244"],{"0e84":function(t,e,a){},c41f:function(t,e,a){"use strict";var o=a("0e84"),n=a.n(o);n.a},fd2d:function(t,e,a){"use strict";a.r(e);var o=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"nopowerbox"},[a("el-menu",{staticClass:"el-menu-demo",attrs:{"default-active":t.activeIndex2,mode:"horizontal","background-color":"white","text-color":"#f999","active-text-color":"rgb(18,42,136)"},on:{select:t.handleSelect}},[a("el-menu-item",{attrs:{index:"1"}},[t._v("非电站产品收入")])],1),a("div",{staticClass:"powermain"},[a("div",{staticClass:"powerfind"},[a("el-form",{staticClass:"demo-form-inline",staticStyle:{"margin-left":"10px"},attrs:{inline:!0,model:t.formInline,size:"small"}},[a("el-form-item",[a("el-input",{attrs:{placeholder:"请输入订单编号"},model:{value:t.formInline.no,callback:function(e){t.$set(t.formInline,"no",e)},expression:"formInline.no"}})],1),a("el-date-picker",{attrs:{type:"daterange","range-separator":"-","start-placeholder":"日期","end-placeholder":"日期","value-format":"yyyy-MM-dd"},model:{value:t.formInline.time,callback:function(e){t.$set(t.formInline,"time",e)},expression:"formInline.time"}}),a("el-form-item",[a("el-button",{staticStyle:{"background-color":"rgb(54, 116, 255)",color:"white"},attrs:{icon:"el-icon-search"},on:{click:t.getWrongStationGoods}},[t._v("查询\n                    ")])],1)],1)],1),a("div",{staticClass:"powerdata"},[a("el-row",{staticStyle:{"margin-bottom":"12px"}},[a("el-button",{staticClass:"commonbtn",attrs:{size:"small",icon:"iconfont iconinport"},on:{click:t.getexport}},[t._v("导出\n                ")])],1),a("el-table",{ref:"multipleTable",staticClass:"table",staticStyle:{"margin-bottom":"15px","font-size":"14px"},attrs:{border:"",data:t.tableData,"tooltip-effect":"dark","header-cell-style":t.getRowClass},on:{"selection-change":t.handleSelectionChange}},[a("el-table-column",{attrs:{label:"id",width:"45"},scopedSlots:t._u([{key:"default",fn:function(e){return[t._v("\n                        "+t._s(e.$index+1)+"\n                    ")]}}])}),a("el-table-column",{attrs:{prop:"orderNo",label:"订单编号",width:"155"}}),a("el-table-column",{attrs:{prop:"createTime",label:"入账时间"}}),a("el-table-column",{attrs:{prop:"orderAmount",label:"订单金额"}}),a("el-table-column",{attrs:{prop:"nickName",label:"购买人昵称"}}),a("el-table-column",{attrs:{prop:"phone",label:"购买人手机号"}}),a("el-table-column",{attrs:{prop:"mlAmount",label:"订单毛利"}}),a("el-table-column",{attrs:{prop:"cbAmount",label:"商品运营成本"}}),a("el-table-column",{attrs:{prop:"flAmount",label:"返利金额"}}),a("el-table-column",{attrs:{prop:"jlAmount",label:"奖励金额"}}),a("el-table-column",{attrs:{prop:"lrAmount",label:"团队收益(返佣后剩余)"}}),a("el-table-column",{attrs:{prop:"platformRevenue",label:"平台收益"}})],1),a("div",{staticClass:"powerfoot",staticStyle:{width:"100%"}},[a("div",{staticClass:"powerfoot-top"},[a("span",[t._v("订单数量："+t._s(t.pagetotal))]),a("span",[t._v("订单金额："+t._s(t._f("numFilter")(t.totalorderpay))+"元")]),a("span",[t._v("返利金额："+t._s(t._f("numFilter")(t.totalrebate)))]),a("span",[t._v("奖励金额："+t._s(t._f("numFilter")(t.totalreward)))]),a("span",[t._v("团队收益："+t._s(t._f("numFilter")(t.totalsurplus)))]),a("span",[t._v("平台收益："+t._s(t._f("numFilter")(t.totalprofit)))])]),a("div",{staticClass:"page",staticStyle:{float:"right"}},[a("div",{staticClass:"grid-content bg-purple-light"},[a("el-pagination",{attrs:{background:"","current-page":t.pageNum,"page-size":t.pageSize,layout:"total, sizes, prev, pager, next, jumper",total:t.pagetotal},on:{"size-change":t.handleSizeChange,"current-change":t.handleCurrentChange}})],1)])])],1)])],1)},n=[],l=(a("ac6a"),{data:function(){return{activeIndex2:"1",pageNum:1,pagetotal:0,pageSize:10,token:localStorage.getItem("token"),formInline:{orderno:"",time:""},tableData:[],totalorderpay:0,totalrebate:0,totalreward:0,totalsurplus:0,totalprofit:0}},methods:{handleSelect:function(t,e){console.log(t,e)},handleSelectionChange:function(t){this.multipleSelection=t},getRowClass:function(t){var e=t.rowIndex;return 0==e?"background:RGB(242,242,242)":""},handleSizeChange:function(t){console.log("每页 ".concat(t," 条")),this.pageNum=1,this.pageSize=t,this.getWrongStationGoods()},handleCurrentChange:function(t){console.log("当前页: ".concat(t)),this.pageNum=t,this.getWrongStationGoods()},getWrongStationGoods:function(){var t=this;this.$api.post({path:"/manage/getWrongStationGoods",params:{token:this.token,orderNo:this.formInline.no,startTime:this.formInline.time[0],endTime:this.formInline.time[1],pageSize:this.pageSize,pageNum:this.pageNum},success:function(e){console.log(e),t.tableData=e.data.list,t.pagetotal=e.data.total,t.totalP()}})},getexport:function(){var t={token:this.token,type:7};this.$download("http://manager.zhizhennengyuan.com:8000/manage/export",t,"非电站产品收入").then((function(t){console.log(t,"res1")}))},totalP:function(){var t=0,e=0,a=0,o=0,n=0;this.tableData.forEach((function(l){t+=l.orderAmount,e+=l.flAmount,a+=l.jlAmount,o+=l.lrAmount,n+=l.platformRevenue})),this.totalorderpay=t,this.totalrebate=e,this.totalreward=a,this.totalsurplus=o,this.totalprofit=n}},mounted:function(){this.getWrongStationGoods()},filters:{numFilter:function(t){var e=parseFloat(t).toFixed(2);return e}},watch:{"formInline.time":function(t){null==t&&(this.formInline.time=[])}}}),r=l,i=(a("c41f"),a("2877")),s=Object(i["a"])(r,o,n,!1,null,null,null);e["default"]=s.exports}}]);