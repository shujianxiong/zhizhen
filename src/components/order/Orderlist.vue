<!-- 订单列表 -->
<template>
    <div class="orderlist">
        <el-menu :default-active="activeIndex2" class="el-menu-demo" mode="horizontal" @select="handleSelect"
            background-color="white" text-color="#f999" active-text-color="rgb(18,42,136)">
            <el-menu-item index="1">订单列表</el-menu-item>
        </el-menu>
        <div class="ordermain">
            <div class="orderfind">
                <el-form :inline="true" :model="formInline" class="demo-form-inline" size="small"
                    style="margin-left: 10px">
                    <el-form-item>
                        <el-input v-model="formInline.orderno" placeholder="请输入订单编号"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model="formInline.nick" placeholder="请输入下单用户昵称"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model="formInline.phone" placeholder="请输入下单用户手机号"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model="formInline.goodsname" placeholder="请输入商品名称"></el-input>
                    </el-form-item>
                    <el-date-picker v-model="formInline.time" type="daterange" range-separator="-"
                        start-placeholder="付款时间" end-placeholder="付款时间" value-format="yyyy-MM-dd">
                    </el-date-picker>
                    <el-form-item>
                        <el-select v-model="formInline.paytype" clearable placeholder="请选择付款方式">
                            <el-option label="支付宝支付" :value="1"></el-option>
                            <el-option label="微信支付" :value="2"></el-option>
                            <el-option label="余额支付" :value="3"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-select v-model="formInline.orderstate" clearable  placeholder="请选择订单状态">
                            <el-option label="待发货" :value="'待发货'"></el-option>
                            <el-option label="待收货" :value="'待收货'"></el-option>
                            <el-option label="待评价" :value="'待评价'"></el-option>
                            <el-option label="待支付" :value="'待支付'"></el-option>
                            <el-option label="已完成" :value="'已完成'"></el-option>
                            <el-option label="已取消" :value="'已取消'"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button style="background-color: rgb(54, 116, 255); color: white" icon="el-icon-search"
                            @click='getfind'>查询
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>

            <div class="orderdata">
                <el-row style="margin-bottom: 12px">
                    <el-button size="small" class="commonbtn" icon="iconfont iconinport" @click='getexport'>导出
                    </el-button>
                </el-row>

                <el-table ref="multipleTable" border :data="tableData" tooltip-effect="dark"
                    style="margin-bottom: 15px; font-size: 14px" class="table"  :header-cell-style="getRowClass"
                    @selection-change="handleSelectionChange">
                    <el-table-column label="id" width="45">
                        <template slot-scope="scope">
                            {{scope.$index+1}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="orderNo" label="订单编号"> </el-table-column>
                    <el-table-column prop="createTime" label="下单时间"> </el-table-column>
                    <el-table-column prop="payTime" label="付款时间"> </el-table-column>
                    <el-table-column prop="nickName" label="下单用户昵称"> </el-table-column>
                    <el-table-column prop="phone" label="下单用户手机号"> </el-table-column>
                    <el-table-column prop="goodsName" label="商品名称"> </el-table-column>
                    <el-table-column prop="orderAmount" label="订单金额"> </el-table-column>
                    <el-table-column label="支付方式">
                        <template slot-scope="scope">
                            <p v-show="scope.row.payType == 1">支付宝</p>
                            <p v-show="scope.row.payType == 2">微信</p>
                            <p v-show="scope.row.payType == 3">余额支付</p>
                        </template>
                    </el-table-column>
                    <el-table-column prop="status" label="订单状态"></el-table-column>
                    <el-table-column label="操作" width="200">
                        <template slot-scope="scope">
                            <el-button size="mini" type="primary" @click="details(scope.$index, scope.row)">详情
                            </el-button>
                            <el-button size="mini" type="primary" v-show="scope.row.status == '待发货'"
                                @click="deliver(scope.$index, scope.row)">发货
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <div class="orderfoot" style="display: flex;">
                    <div>
                        <span>订单数量：{{pagetotal}}</span>
                        <span>订单金额：{{sum | numFilter}}元</span>
                    </div>

                    <div class="page" style="margin-left: auto;">
                        <div class="grid-content bg-purple-light">
                            <el-pagination background @size-change="handleSizeChange"
                                @current-change="handleCurrentChange" :current-page="pageNum" :page-size="pageSize"
                                layout="total, sizes, prev, pager, next, jumper" :total="pagetotal">
                            </el-pagination>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 订单详情 -->
        <el-dialog title="详情" :visible.sync="detailsVisible" width="45%">
            <div class="information">
                <div style="width: 100%; margin: 0 auto; ">
                    <div class="ordermessage">
                        <P><i class="iconfont iconjinqi"></i>订单信息</P>
                        <div class="ordernews">
                            <div>订单编号：{{detailsdata.orderNo}}</div>
                            <div>下单时间：{{detailsdata.createTime}}</div>
                            <div>付款时间：{{detailsdata.payTime}}</div>
                            <div>订单状态：<span style="color:  rgb(56, 118, 255);">{{detailsdata.status}}</span></div>
                            <div>支付反方式：
                                <span v-show='detailsdata.payType == 1'>支付宝支付</span>
                                <span v-show='detailsdata.payType == 2'>微信支付</span>
                                <span v-show='detailsdata.payType == 3'>余额支付</span>
                            </div>
                            <div>实付金额：{{detailsdata.orderAmount}}元</div>
                            <div>订单备注：{{detailsdata.note}}</div>
                        </div>
                        <el-table ref="multipleTable" border :data="message" tooltip-effect="dark"
                            style="margin-bottom: 15px; font-size: 14px" class="table" :header-cell-style="getRowClass"
                            @selection-change="handleSelectionChange">
                            <el-table-column label="id" width="45">
                                <template slot-scope="scope">
                                    {{scope.$index+1}}
                                </template>
                            </el-table-column>
                            <el-table-column label="商品封面图">
                                <template slot-scope="scope">
                                    <img :src="scope.row.coverImg" height="50" width="50" />
                                </template>
                            </el-table-column>
                            <el-table-column prop="goodsName" label="商品名称"></el-table-column>
                            <el-table-column prop="goodsclass" label="商品分类">
                                <template slot-scope="scope">
                                    {{scope.row.firstCateName}}-{{scope.row.secondCateName}}
                                </template>
                            </el-table-column>
                            <el-table-column prop="num" label="数量"> </el-table-column>
                            <el-table-column prop="specsSeal" label="规格"> </el-table-column>
                            <el-table-column prop="price" label="单价"> </el-table-column>
                            <el-table-column prop="total" label="总价"> </el-table-column>
                            <el-table-column label="售后状态">
                                <template slot-scope="scope">
                                    <p v-show='scope.row.refundStatus == 1'>申请中</p>
                                    <p v-show='scope.row.refundStatus == 2'>退货中</p>
                                    <p v-show='scope.row.refundStatus == 3'>退款成功</p>
                                    <p v-show='scope.row.refundStatus == 4'>退款失败</p>
                                </template>
                            </el-table-column>
                            <el-table-column label="售后详情">
                                <template slot-scope="scope">
                                    <p style="color:rgb(56, 118, 255);" v-show="scope.row.refundStatus != ''"
                                        @click='afterSale=true,getRefundDetail(scope.row)'>售后详情</p>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <div class="ordermessage">
                        <P><i class="iconfont iconjinqi"></i>下单信息</P>
                        <div class="ordernews">
                            <div>用户昵称：{{detailsdata.nickName}}</div>
                            <div>用户手机号：{{detailsdata.phone}}</div>
                            <div>收货人姓名：{{detailsdata.receiver}}</div>
                            <div>收货人手机号：{{detailsdata.receiverPhone}}</div>
                            <div>收货地址：{{detailsdata.areaName}}{{detailsdata.addressDetail}}</div>
                        </div>
                    </div>
                    <div class="ordermessage">
                        <P><i class="iconfont iconjinqi"></i>发货信息</P>
                        <div class="ordernews">
                            <div>物流公司：{{detailsdata.logisticsComName}}</div>
                            <div>物流单号：{{detailsdata.logisticsNo}}</div>
                        </div>
                    </div>
                    <div class="ordermessage">
                        <P><i class="iconfont iconjinqi"></i>评价信息</P>
                        <div class="ordernews">
                            <div>评价时间：{{detailsdata.evalTime}}</div>
                            <div>评价内容：{{detailsdata.content}}</div>
                        </div>
                        <div class="evaluatebox">
                            <span>评价图片：</span>
                            <div class="evaluateimg">
                                <img v-for='item in evaluationImgList' :src="item.src" alt="" :key="item.evalImgId">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </el-dialog>

        <!-- 发货 -->
        <el-dialog title="发货" :visible.sync="deliverVisible" width="500px" :close-on-click-modal="false">
            <div class="information">
                <div style="width: 60%; margin: 0 auto; " class="deliverboxs">
                    <el-form :model="ruleForm" ref="ruleForm" label-width="80px" class="demo-ruleForm">
                        <el-form-item label="物流公司" required class='wuliu'>
                            <el-select v-model="ruleForm.region" placeholder="请选择物流公司" @change='getLogisticsId'>
                                <el-option v-for="item in logistics" :label="item.logisticsComName"
                                    :key="item.logisticsComId" :value="item.logisticsComId"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="物流单号" required class="logisticsNo">
                            <el-input v-model="ruleForm.logisticsNo" placeholder="请输入物流单号"></el-input>
                        </el-form-item>
                        <el-form-item label="">
                            <el-button style="background-color: rgb(54, 116, 255); color: white"
                                @click="getdeliverGoods">确定
                            </el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </el-dialog>

        <!-- 查看售后 -->
        <el-dialog title="查看售后" :visible.sync="afterSale" width="25%">
            <div class="information">
                <div style="width: 100%; margin: 0 auto; ">
                    <div class="salemessage">
                        <P><i class="iconfont iconjinqi"></i>申请信息</P>
                        <div class="salenews">
                            <div>退款编号：{{saledetails.refundNo}}</div>
                            <div>退款金额：{{saledetails.refundAmount}}元</div>
                            <div>申请时间：{{saledetails.createTime}}</div>
                            <div>退货理由：{{saledetails.refundReason}}</div>
                        </div>
                        <div class="evaluatebox">
                            <span>图片：</span>
                            <div class="evaluateimg">
                                <img v-for='item in refundImgList' :key='item.orderRefundImgId' :src="item.src" alt="">
                            </div>
                        </div>
                    </div>
                    <div class="salemessage">
                        <P><i class="iconfont iconjinqi"></i>审核信息</P>
                        <div>审核状态：
                            <span v-show='saledetails.refundStatus == 1'>待审核</span>
                            <span v-show='saledetails.refundStatus == 3'>审核通过</span>
                            <span v-show='saledetails.refundStatus == 4'>审核不通过</span>
                        </div>
                    </div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                activeIndex2: "1",
                pageNum: 1,
                pageSize: 10,
                pagetotal: 0,
                token: localStorage.getItem('token'),
                // 搜索
                formInline: {
                    orderno: '',
                    nick: '',
                    phone: '',
                    goodsname: '',
                    time: '',
                    paytype: '',
                    orderstate: ''
                },
                findTime: {//向后台传入的参数
                    startTime: '',
                    endTime: '',
                },
                tableData: [],


                // 订单详情
                detailsVisible: false,
                detailsdata: {},
                evaluationImgList: [],//评论图片

                totalPrice: 0,

                // 订单信息
                message: [],

                // 发货
                deliverVisible: false,
                oid: '',//订单编号
                ruleForm: {
                    logisticsNo: '',
                    region: '',
                },
                logistics: [],//快递公司
                rules: {
                    region: [
                        { required: true }
                    ],
                    logisticsNo: [
                        { required: true }
                    ]

                },

                afterSale: false,  //售后
                saledetails: {},//售后详情
                refundImgList: [],//退货图片

                sum: 0
            }
        },
        methods: {
            handleSelect(key, keyPath) {
                console.log(key, keyPath);
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            getRowClass({ rowIndex }) {
                if (rowIndex == 0) {
                    return 'background:RGB(242,242,242)'
                } else {
                    return ''
                }
            },



            // 分页
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
                this.pageSize = val
                this.getfind()
            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
                this.pageNum = val
                this.getfind()
            },

            // 订单列表
            // getOrderList() {
            //     this.$api.post({
            //         path: '/manage/getOrderList',
            //         params: {
            //             token: this.token,
            //             orderNo: '',
            //             nickName: '',
            //             phone: '',
            //             goodsName: '',
            //             startTime: '',
            //             endTime: '',
            //             payType: '',
            //             status: '',
            //             pageNum: this.pageNum,
            //             pageSize: this.pageSize
            //         }, success: (data) => {
            //             console.log(data)
            //             this.tableData = data.data.list
            //             this.pagetotal = data.data.total
            //             this.totalP()
            //         }
            //     })
            // },

            // 导出
            getexport() {
                let params = {
                    token: this.token,
                    type: 3
                }
                // params.is_export = 1
                this.$download('http://manager.zhizhennengyuan.com:8000/manage/export', params, '订单列表').then(res => {
                    console.log(res, 'res1')
                })
            },

            // 支付方式
            getPaytype(val) {
                console.log(val)
                this.formInline.paytype = val
                console.log(this.formInline.paytype)
            },

            //订单状态
            getOrderstate(val) {
                console.log(val)
                if (val == 1) {
                    this.formInline.orderstate = '待发货'
                } else if (val == 2) {
                    this.formInline.orderstate = '待收货'
                } else if (val == 3) {
                    this.formInline.orderstate = '待评价'
                } else if (val == 4) {
                    this.formInline.orderstate = '已完成'
                }
                console.log(this.formInline.orderstate)
            },

            getfind() {
                this.$api.post({
                    path: '/manage/getOrderList',
                    params: {
                        token: this.token,
                        orderNo: this.formInline.orderno,
                        nickName: this.formInline.nick,
                        phone: this.formInline.phone,
                        goodsName: this.formInline.goodsname,
                        startTime: this.formInline.time[0],
                        endTime: this.formInline.time[1],
                        payType: this.formInline.paytype,
                        status: this.formInline.orderstate,
                        pageNum: this.pageNum,
                        pageSize: this.pageSize
                    }, success: (data) => {
                        console.log(data)
                        this.tableData = data.data.list
                        this.sum = data.data.sum
                        this.pagetotal = data.data.total
                    }
                })
            },

            // 订单详情
            details(index, row) {
                console.log(index, row);
                this.detailsVisible = true;
                // this.oid = row.oid
                this.$api.post({
                    path: '/manage/getOrderDetails',
                    params: {
                        token: this.token,
                        oid: row.oid
                    }, success: (data) => {
                        console.log(data)
                        this.detailsdata = data.data
                        this.message = data.data.orderGoodsList
                        this.evaluationImgList = data.data.evaluationImgList
                    }
                })
            },



            // 发货
            deliver(index, row) {
                console.log(index, row);
                this.deliverVisible = true;
                this.oid = row.oid
            },
            // 快递公司
            getAllLogisticsCompany() {
                this.$api.post({
                    path: '/manage/getAllLogisticsCompany',
                    params: {
                        token: this.token
                    }, success: (data) => {
                        console.log(data)
                        this.logistics = data.data
                    }
                })
            },
            // 获取物流公司id
            getLogisticsId(val) {
                this.ruleForm.region = val
                console.log(this.ruleForm.region)
            },

            // 发货
            getdeliverGoods() {
                if (this.ruleForm.region == "" || this.ruleForm.logisticsNo == '') {
                    this.$message({
                        message: '请将信息填写完整',
                        type: 'warning'
                    });
                } else {
                    this.$api.post({
                        path: '/manage/deliverGoods',
                        params: {
                            token: this.token,
                            oid: this.oid,
                            logisticsComId: this.ruleForm.region,
                            logisticsNo: this.ruleForm.logisticsNo
                        }, success: (data) => {
                            console.log(data)
                            if (data.code == 1) {
                                this.$message({
                                    message: data.msg,
                                    type: 'success'
                                });
                                this.deliverVisible = false
                                this.ruleForm.region = ''
                                this.ruleForm.logisticsNo = ''
                                this.getfind()
                            }
                        }
                    })
                }

            },

            // 售后详情
            getRefundDetail(row) {
                console.log(row)
                this.$api.post({
                    path: '/manage/getRefundDetail',
                    params: {
                        token: this.token,
                        refundId: row.refundId
                    }, success: (data) => {
                        console.log(data)
                        this.saledetails = data.data
                        this.refundImgList = data.data.orderRefundImgList
                    }
                })
            },
            totalP() {
                let total = 0
                this.tableData.forEach(e => {
                    total += e.orderAmount
                    // console.log(e.orderAmount)
                });
                console.log(this.tableData)
                this.totalPrice = total

            }
        },
        mounted() {
            this.getfind()
            this.getAllLogisticsCompany()
        },
        filters: {
            numFilter(value) {
                // 截取当前数据到小数点后两位
                let realVal = parseFloat(value).toFixed(2)
                return realVal
            }
        }, watch: {
            "formInline.time"(newVal) {
                if (newVal == null) {
                    this.formInline.time = [];
                }
            }
        }

    }
</script>

<style>
    * {
        padding: 0;
        margin: 0;
        cursor: default;
    }

    .orderlist {
        width: 100%;
        height: 100%;
    }

    .ordermain {
        /* width: 98%;
        height: 80%; */
        padding: 10px 10px 0px 10px;

    }

    .orderfind {
        width: 100%;

        padding-top: 10px;
        background-color: white;
        margin-bottom: 10px;
    }

    .orderfind .el-form-item__content {
        width: 160px;
    }

    /* 日期 */
    .orderfind .el-date-editor--daterange.el-input__inner {
        width: 200px;
        height: 32px;
        margin-right: 10px;
    }

    .orderfind .el-date-editor .el-range-input {
        font-size: 12px;
    }

    .orderfind .el-date-editor .el-range__icon {
        line-height: 25px;

    }

    .orderfind .el-date-editor .el-range-separator {
        color: #C0C4CC;
        line-height: 21px;
    }

    .orderdata {
        /* width: 98%;
        height: 100%; */
        padding: 10px 20px;
        background-color: white;
    }

    .orderdata .iconfont {
        font-size: 12px;
    }

    .orderdata .recovery {
        background-color: rgb(48, 216, 192);
        color: white;
        border: 0px;
    }

    .orderdata .disable {
        background-color: rgb(255, 102, 0);
        color: white;
        border: 0px;
    }

    .orderdata .delete {
        background-color: rgb(234, 74, 92);
        color: white;
        border: 0px;
    }

    .orderdata .commonbtn {
        /* height: 30px; */
        background-color: rgb(54, 116, 255);
        color: white;
        border: 0px;
    }

    .table th,
    td {
        text-align: center !important;
        height: 30px;
        /* padding:0 */
    }

    .el-table td {
        font-size: 12px;
        /* height: 30px; */
    }

    .orderfoot span:first-child {
        display: inline-block;
        margin-right: 15px;
    }

    .ordermessage {
        width: 100%;
        margin-bottom: 10px;
    }

    .ordermessage p {
        color: rgb(56, 118, 255);
        font-weight: bold;
        /* line-height: 19px; */
    }

    .ordermessage p i {
        display: inline-block;
        margin-right: 5px;
        font-size: 15px;
        /* line-height: 18px; */
    }

    .ordernews {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
    }

    .ordernews>div {
        width: 50%;
        margin-bottom: 10px;
    }

    .evaluatebox {
        width: 100%;
        display: flex;
    }

    .evaluateimg {
        width: 80%;
        display: flex;
    }

    .evaluateimg img {
        width: 70px;
        height: 70px;
        margin-right: 10px;
    }


    /* 查看售后 */
    .orderlist .el-dialog__header {
        padding: 12px 20px 10px
    }

    .orderlist .el-dialog__title {
        color: #606266;
        font-size: 14px;
    }

    .orderlist .el-dialog__body {

        padding-top: 20px;
        padding-bottom: 100px;
        border-top: 1px solid #ccc;
    }

    .salemessage {
        width: 100%;
        margin-bottom: 10px;
    }

    .salemessage p {
        color: rgb(56, 118, 255);
        font-weight: bold;
        /* line-height: 19px; */
    }

    .salemessage p i {
        display: inline-block;
        margin-right: 5px;
        font-size: 15px;
        /* line-height: 18px; */
    }

    .salenews {
        width: 100%;
        /* display: flex;
        flex-wrap: wrap; */
    }

    .salenews>div {
        /* width: 50%; */
        margin-bottom: 10px;
    }

    .logisticsNo .el-input {
        width: 88%;
    }


    .wuliu .el-input--suffix .el-input__inner {
        padding-right: 25%;
    }

    .deliverbox .el-button {
        padding: 10px 25px;
        margin-top: 20px;
    }
</style>