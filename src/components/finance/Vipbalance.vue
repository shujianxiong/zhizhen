<!-- 会员余额 -->
<template>
    <div class="balance">
        <el-menu :default-active="activeIndex2" class="el-menu-demo" mode="horizontal" @select="handleSelect"
            background-color="white" text-color="#f999" active-text-color="rgb(18,42,136)">
            <el-menu-item index="1">会员余额</el-menu-item>
        </el-menu>

        <div class="bamain">
            <div class="bafind">
                <el-form :inline="true" :model="formInline" class="demo-form-inline" size="small"
                    style="margin-left: 10px">

                    <el-form-item>
                        <el-input v-model="formInline.nick" placeholder="请输入会员昵称"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model="formInline.phone" placeholder="请输入会员手机号"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button style="background-color: rgb(54, 116, 255); color: white" icon="el-icon-search"
                            @click='getfind'>查询
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="badata">
                <el-row style="margin-bottom: 12px">
                    <el-button size="small" class="commonbtn" icon="iconfont iconinport" @click='getexport'>导出
                    </el-button>
                </el-row>

                <el-table ref="multipleTable" border :data="tableData" style="margin-bottom: 15px; font-size: 14px"
                    class="table" :header-cell-style="getRowClass" @selection-change="handleSelectionChange">
                    <el-table-column label="id" width="45">
                        <template slot-scope="scope">
                            {{ scope.$index + 1 }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="nick_name" label="会员昵称"> </el-table-column>
                    <el-table-column prop="phone" label="会员手机号"> </el-table-column>
                    <el-table-column prop="balance" label="总余额"> </el-table-column>
                    <el-table-column prop="sum_income" label="总收入"> </el-table-column>
                    <el-table-column prop="sum_expenditure" label="总支出"> </el-table-column>
                    <el-table-column label="操作" width="405">
                        <template slot-scope="scope">
                            <el-button size="mini" type="primary" @click="profit(scope.$index, scope.row)">收益记录
                            </el-button>
                            <el-button size="mini" type="primary" @click="consume(scope.$index, scope.row)">消费记录
                            </el-button>
                            <el-button size="mini" type="primary" @click="refund(scope.$index, scope.row)">退款记录
                            </el-button>
                            <el-button size="mini" type="primary" @click="withdraw(scope.$index, scope.row)">提现记录
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="bafoot" style="display: flex; ">
                    <div  class="bafootspan">
                        <span>总余额：{{sumBalance | numFilter}}元</span>
                        <span>总收入：{{sumCurrentAmount | numFilter}}元</span>
                        <span>总支出：{{sumExpenditure | numFilter}}元</span>
                    </div>

                    <div class="page" style="margin-left: auto;">
                        <div class="grid-content bg-purple-light">
                            <el-pagination background @size-change="handleSizeChange"
                                @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize"
                                layout="total, sizes, prev, pager, next, jumper" :total="pagetotal">
                            </el-pagination>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 收益记录 -->
        <el-dialog title="收益记录" :visible.sync="profitVisible" width="48%">
            <div class="information">
                <div style="width: 100%; margin: 0 auto; ">
                    <div class="profind">
                        <el-form :inline="true" :model="profitform" class="demo-form-inline" size="small"
                            style="margin-left: 10px">
                            <el-date-picker v-model="profitform.time" type="daterange" range-separator="-"
                                start-placeholder="日期" end-placeholder="日期" value-format="yyyy-MM-dd">
                            </el-date-picker>
                            <el-form-item>
                                <el-input v-model="profitform.nick" placeholder="请输入电站名称"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-select v-model="profitform.attribute" placeholder="请选择属性" @change='getporType'>
                                    <el-option label="请选择属性" value=""></el-option>
                                    <el-option label="自购瓦数" value="1"></el-option>
                                    <el-option label="返利瓦数" value="2"></el-option>
                                    <el-option label="奖励瓦数" value="12"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item>
                                <el-button style="background-color: rgb(54, 116, 255); color: white"
                                    icon="el-icon-search">查询
                                </el-button>
                                <el-button size="small" style="background-color: rgb(54, 116, 255); color: white" icon="iconfont iconinport" @click='getprofit'>导出
                                </el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                    <el-table ref="multipleTable" border :data="proData" style="margin-bottom: 15px; font-size: 14px"
                        class="table" :header-cell-style="getRowClass" @selection-change="handleSelectionChange">
                        <el-table-column label="id" width="40">
                            <template slot-scope="scope">
                                {{ scope.$index + 1 }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="peroid" label="日期区间"></el-table-column>
                        <el-table-column prop="stationName" label="电站名称"> </el-table-column>
                        <el-table-column prop="watt" label="瓦数" width='70'> </el-table-column>
                        <el-table-column label="属性" width='70'>
                            <template slot-scope="scope">
                                <p v-show='scope.row.refType == 1'>自购瓦数</p>
                                <p v-show='scope.row.refType == 2'>返利瓦数</p>
                                <p v-show='scope.row.refType == 12'>奖励瓦数</p>
                            </template>
                        </el-table-column>
                        <el-table-column prop="syYearRate" label="年收益百分比" width='120'> </el-table-column>
                        <el-table-column prop="currentAmount" label="收益金额" width='80'> </el-table-column>
                    </el-table>
                    <div class="page" style="position: relative;">
                        <div class="grid-content bg-purple-light" style="position: absolute; right: 0;">
                            <el-pagination background @size-change="proSizeChange" @current-change="proCurrentChange"
                                :current-page="profitform.pageNum" :page-size="profitform.pageSize"
                                layout="total, sizes, prev, pager, next, jumper" :total="profitform.pagetotal">
                            </el-pagination>
                        </div>
                    </div>
                </div>
            </div>
        </el-dialog>


        <!-- 消费记录 -->
        <el-dialog title="消费记录" :visible.sync="consumeVisible">
            <div class="information">
                <div style="width: 100%; margin: 0 auto; ">
                    <div class="profind">
                        <el-form :inline="true" :model="conform" class="demo-form-inline" size="small"
                            style="margin-left: 10px">
                            <el-date-picker v-model="conform.time" type="daterange" range-separator="-"
                                start-placeholder="日期" end-placeholder="日期" value-format="yyyy-MM-dd">
                            </el-date-picker>
                            <el-form-item>
                                <el-input v-model="conform.orderno" placeholder="请输入订单编号"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button style="background-color: rgb(54, 116, 255); color: white"
                                    icon="el-icon-search" @click='getConfind'>查询
                                </el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                    <el-table ref="multipleTable" border :data="conData" style="margin-bottom: 15px; font-size: 14px"
                        class="table" :header-cell-style="getRowClass" @selection-change="handleSelectionChange">
                        <el-table-column prop='oid' label="id" width="40">
                            <!-- <template slot-scope="scope">
                                {{ scope.$index + 1 }}
                            </template> -->
                        </el-table-column>
                        <el-table-column prop="orderNo" label="订单编号"> </el-table-column>
                        <el-table-column label="付款时间">
                            <template slot-scope="scope">
                                {{scope.row.payTime | timeFiler}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="orderAmount" label="订单金额"> </el-table-column>

                    </el-table>
                    <div class="page" style="position: relative;">
                        <div class="grid-content bg-purple-light" style="position: absolute; right: 0;">
                            <el-pagination background @size-change="conSizeChange" @current-change="conCurrentChange"
                                :current-page="conPage.currentPage" :page-size="conPage.pageSize"
                                layout="total, sizes, prev, pager, next, jumper" :total="conPage.pagetotal">
                            </el-pagination>
                        </div>
                    </div>
                </div>
            </div>
        </el-dialog>

        <!-- 退款记录 -->
        <el-dialog title="退款记录" :visible.sync="refundVisible" width="40%">
            <div class="information">
                <div style="width: 100%; margin: 0 auto; ">
                    <div class="profind">
                        <el-form :inline="true" :model="refundform" class="demo-form-inline" size="small"
                            style="margin-left: 10px">
                            <el-date-picker v-model="refundform.time" type="daterange" range-separator="-"
                                start-placeholder="日期" end-placeholder="日期" value-format="yyyy-MM-dd">
                            </el-date-picker>
                            <el-form-item>
                                <el-input v-model="refundform.orderno" placeholder="请输入退款编号"></el-input>
                            </el-form-item>


                            <el-form-item>
                                <el-button style="background-color: rgb(54, 116, 255); color: white"
                                    icon="el-icon-search" @click='getReffind'>查询
                                </el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                    <el-table ref="multipleTable" border :data="refundData" style="margin-bottom: 15px; font-size: 14px"
                        class="table" :header-cell-style="getRowClass" @selection-change="handleSelectionChange">
                        <el-table-column label="id" width="40">
                            <template slot-scope="scope">
                                {{ scope.$index + 1 }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="refundNo" label="退款编号"> </el-table-column>
                        <el-table-column label="退款时间">
                            <template slot-scope="scope">
                                {{scope.row.createTime | timeFiler}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="refundAmount" label="退款金额"> </el-table-column>

                    </el-table>
                    <div class="page" style="position: relative;">
                        <div class="grid-content bg-purple-light" style="position: absolute; right: 0;">
                            <el-pagination background @size-change="refSizeChange" @current-change="refCurrentChange"
                                :current-page="refundPage.currentPage" :page-size="refundPage.pageSize"
                                layout="total, sizes, prev, pager, next, jumper" :total="refundPage.pagetotal">
                            </el-pagination>
                        </div>
                    </div>
                </div>
            </div>
        </el-dialog>

        <!-- 提现记录 -->
        <el-dialog title="提现记录" :visible.sync="withdrawVisible" width="50%">
            <div class="information">
                <div style="width: 100%; margin: 0 auto; ">
                    <div class="profind">
                        <el-form :inline="true" :model="withform" class="demo-form-inline" size="small"
                            style="margin-left: 10px">
                            <el-form-item>
                                <el-input v-model="withform.no" placeholder="请输入提现编号"></el-input>
                            </el-form-item>
                            <el-date-picker v-model="withform.time" type="daterange" range-separator="-"
                                start-placeholder="日期" end-placeholder="日期" value-format="yyyy-MM-dd">
                            </el-date-picker>
                            <el-form-item>
                                <el-select v-model="withform.type" placeholder="请选择提现方式" @change='getapplyType'>
                                    <el-option label="微信" value="2"></el-option>
                                    <el-option label="支付宝" value="1"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item>
                                <el-input v-model="withform.number" placeholder="请输入提现账号"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button style="background-color: rgb(54, 116, 255); color: white"
                                    icon="el-icon-search" @click="getWithfind">查询
                                </el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                    <el-table ref="multipleTable" border :data="withData" style="margin-bottom: 15px; font-size: 14px"
                        class="table" :header-cell-style="getRowClass" @selection-change="handleSelectionChange">
                        <el-table-column label="id" width="40">
                            <template slot-scope="scope">
                                {{ scope.$index + 1 }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="applyNo" label="提现编号"> </el-table-column>
                        <el-table-column prop="applyAmount" label="提现金额"> </el-table-column>
                        <el-table-column label="提现方式">
                            <template slot-scope="scope">
                                <p v-show='scope.row.applyType == 1'>支付宝</p>
                                <p v-show='scope.row.applyType == 2'>微信</p>
                            </template>
                        </el-table-column>
                        <el-table-column prop="account" label="提现账号"> </el-table-column>
                        <el-table-column prop="createTime" label="提现时间"> </el-table-column>
                        <el-table-column label="提现状态">
                            <template slot-scope="scope">
                                <p v-show='scope.row.applyStatus == 1'>提现成功</p>
                                <p v-show='scope.row.applyStatus == 2'>提现失败</p>
                                <p v-show='scope.row.applyStatus == 3'>提现中</p>
                            </template>
                        </el-table-column>

                    </el-table>
                    <div class="page" style="position: relative;">
                        <div class="grid-content bg-purple-light" style="position: absolute; right: 0;">
                            <el-pagination background @size-change="withSizeChange" @current-change="withCurrentChange"
                                :current-page="withPage.currentPage" :page-size="withPage.pageSize"
                                layout="total, sizes, prev, pager, next, jumper" :total="withPage.pagetotal">
                            </el-pagination>
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
                currentPage: 1,
                pagetotal: 0,
                pageSize: 10,

                token: localStorage.getItem('token'),

                formInline: {
                    nick: '',
                    phone: ''
                },
                tableData: [],

                profitVisible: false,//收益记录
                profitform: {
                    uid: '',
                    time: '',
                    nick: '',
                    state: '',
                    attribute: '',
                    pageNum: 1,
                    pageSize: 10,
                    pagetotal: ''
                },
                proData: [],

                consumeVisible: false,//消费记录

                conPage: {
                    currentPage: 1,
                    pagetotal: 0,
                    pageSize: 10,
                },

                conform: {
                    time: '',
                    orderno: '',
                    uid: ''
                },
                conData: [],

                refundVisible: false,//退款记录

                refundPage: {
                    currentPage: 1,
                    pagetotal: 0,
                    pageSize: 10,
                },

                refundform: {
                    time: '',
                    orderno: '',
                    uid: ''
                },
                refundData: [],

                withdrawVisible: false,//提现记录
                withform: {
                    no: '',
                    time: '',
                    type: '',
                    number: '',
                    uid: ''
                },
                withPage: {
                    currentPage: 1,
                    pagetotal: 0,
                    pageSize: 10,
                },
                withData: [],

                sumBalance: 0,//总余额
                sumCurrentAmount: 0,//总收入
                sumExpenditure: 0,//总支出


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


            // 会员余额列表
            // getVipList() {
            //     this.$api.post({
            //         path: '/manage/getVipList',
            //         params: {
            //             token: this.token,
            //             nickName: '',
            //             phone: '',
            //             pageNum: this.currentPage,
            //             pageSize: this.pageSize
            //         }, success: (data) => {
            //             console.log(data)
            //             this.tableData = data.data.list
            //             this.pagetotal = data.data.total
            //             this.totalP()
            //         }
            //     })
            // },

            // 搜索
            getfind() {
                this.$api.post({
                    path: '/manage/getVipList',
                    params: {
                        token: this.token,
                        nickName: this.formInline.nick,
                        phone: this.formInline.phone,
                        pageNum: this.currentPage,
                        pageSize: this.pageSize
                    }, success: (data) => {
                        console.log(data)
                        this.tableData = data.data.list
                        this.pagetotal = data.data.total
                        this.sumBalance = data.data.sumBalance
                        this.sumCurrentAmount = data.data.sumCurrentAmount
                        this.sumExpenditure = data.data.sumExpenditure
                    }
                })
            },

            // 分页
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
                this.pageSize = val
                this.getfind()
            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
                this.currentPage = val
                this.getfind()
            },

            // 收益记录
            profit(index, row) {
                console.log(index, row);
                this.profitVisible = true
                this.profitform.uid = row.uid

                this.getpro()
            },

            getporType(val) {
                this.profitform.attribute = val
            },
            getpro() {
                this.$api.post({
                    path: '/manage/getUserFinance',
                    params: {
                        token: this.token,
                        uid: this.profitform.uid,
                        starTime: this.profitform.time[0],
                        endTime: this.profitform.time[1],
                        refType: this.profitform.attribute,
                        stationName: this.profitform.nick,
                        pageNum: this.profitform.pageNum,
                        pageSize: this.profitform.pageSize
                    }, success: (data) => {
                        console.log(data)
                        this.profitform.pagetotal = data.data.total
                        this.proData = data.data.list
                    }
                })
            },
            proSizeChange(val) {
                console.log(`每页 ${val} 条`);
                this.profitform.pageSize = val
                this.getpro()
            },
            proCurrentChange(val) {
                console.log(`当前页: ${val}`);
                this.profitform.pageNum = val
                this.getpro()
            },

            // 消费记录
            consume(index, row) {
                console.log(index, row);
                this.consumeVisible = true
                this.conform.uid = row.uid

                this.getConfind()
            },

            getConfind() {
                this.$api.post({
                    path: '/manage/getUserOrder',
                    params: {
                        token: this.token,
                        uid: this.conform.uid,
                        orderNo: this.conform.orderno,
                        starTime: this.conform.time[0],
                        endTime: this.conform.time[1],
                        pageNum: this.conPage.currentPage,
                        pageSize: this.conPage.pageSize
                    }, success: (data) => {
                        console.log(data.data.list)
                        this.conPage.pagetotal = data.data.total
                        this.conData = data.data.list
                    }
                })
            },
            conSizeChange(val) {
                console.log(`每页 ${val} 条`);
                this.conPage.pageSize = val
                this.getConfind()
            },
            conCurrentChange(val) {
                console.log(`当前页: ${val}`);
                this.conPage.currentPage = val
                this.getConfind()
            },

            // 退款记录
            refund(index, row) {
                console.log(index, row);
                this.refundVisible = true

                this.refundform.uid = row.uid
                this.getReffind()
            },

            getReffind() {
                this.$api.post({
                    path: '/manage/getUserRefund',
                    params: {
                        token: this.token,
                        uid: this.refundform.uid,
                        refundNo: this.refundform.orderno,
                        starTime: this.refundform.time[0],
                        endTime: this.refundform.time[1],
                        pageNum: this.refundPage.currentPage,
                        pageSize: this.refundPage.pageSize
                    }, success: (data) => {
                        console.log(data)
                        this.refundPage.pagetotal = data.data.total
                        this.refundData = data.data.list
                    }
                })
            },
            refSizeChange(val) {
                console.log(`每页 ${val} 条`);
                this.refundPage.pageSize = val
                this.getReffind()
            },
            refCurrentChange(val) {
                console.log(`当前页: ${val}`);
                this.refundPage.currentPage = val
                this.getReffind()
            },

            // 提现记录
            withdraw(index, row) {
                console.log(index, row);
                this.withdrawVisible = true
                this.withform.uid = row.uid
                this.getWithfind()
            },
            getapplyType(val) {
                this.withform.applyType = val
            },
            getWithfind() {
                this.$api.post({
                    path: '/manage/getUserFinanceApply',
                    params: {
                        token: this.token,
                        uid: this.withform.uid,
                        applyNo: this.withform.no,
                        applyType: this.withform.applyType,
                        account: this.withform.number,
                        startTime: this.withform.time[0],
                        endTime: this.withform.time[1],
                        pageNum: this.withPage.currentPage,
                        pageSize: this.withPage.pageSize
                    }, success: (data) => {
                        console.log(data)
                        this.withData = data.data.list
                        this.withPage.pagetotal = data.data.total
                        // if (data.code == 1) {
                        //     this.$message({
                        //         message: data.msg,
                        //         type: 'success'
                        //     });

                        // }

                    }
                })
            },

            withSizeChange(val) {
                console.log(`每页 ${val} 条`);
                this.withPage.pageSize = val
                this.getWithfind()
            },
            withCurrentChange(val) {
                console.log(`当前页: ${val}`);
                this.withPage.currentPage = val
                this.getWithfind()
            },

            // 导出
            getexport() {
                let params = {
                    token: this.token,
                    type: 9
                }
                // params.is_export = 1
                this.$download('http://manager.zhizhennengyuan.com:8000/manage/export', params, '会员余额').then(res => {
                    // this.$download('http://10.77.10.90:8080/manage/export', params, '会员余额').then(res => {
                    console.log(res, 'res1')
                })
            },

            getprofit() {
                let params = {
                    token: this.token,
                    uid: this.profitform.uid,
                    type: 100
                }

                this.$download('http://manager.zhizhennengyuan.com:8000/manage/export', params, '收益记录').then(res => {
                    // this.$download('http://10.77.10.90:8004/manage/export', params, '收益记录').then(res => {
                    console.log(res, 'res1')
                })

            }



        },
        mounted() {
            this.getfind()
        },
        created() {
            // this.getconsume()
        },
        filters: {
            timeFiler(value) {
                let times = /\d{4}-\d{1,2}-\d{1,2}/g.exec(value)
                return times[0]
            },
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

    .balance {
        width: 100%;
        height: 100%;
    }

    .balance .el-dialog__header {
        padding: 12px 20px 10px
    }

    .balance .el-dialog__title {
        color: #606266;
        font-size: 14px;
    }

    .balance .el-dialog__body {

        padding-top: 20px;
        padding-bottom: 100px;
        border-top: 1px solid #ccc;
    }

    .bamain {
        /* width: 98%;
        height: 80%; */
        padding: 10px 10px 0px 10px;
    }

    .bafind {
        width: 100%;
        /* height: 40px; */
        padding-top: 10px;
        background-color: white;
        margin-bottom: 10px;
    }

    .bafind .el-form-item__content {
        width: 160px;
    }

    /* 日期 */
    .bafind .el-date-editor--daterange.el-input__inner {
        width: 200px;
        height: 32px;
        margin-right: 10px;
    }

    .bafind .el-date-editor .el-range-input {
        font-size: 12px;
    }

    .bafind .el-date-editor .el-range__icon {
        line-height: 25px;

    }

    .bafind .el-date-editor .el-range-separator {
        color: #C0C4CC;
        line-height: 21px;
    }

    .badata {
        /* width: 98%;
        height: 100%; */
        padding: 10px 20px;
        background-color: white;
    }

    .badata .iconfont {
        font-size: 12px;
    }

    .badata .recovery {
        background-color: rgb(48, 216, 192);
        color: white;
        border: 0px;
    }

    .badata .disable {
        background-color: rgb(255, 102, 0);
        color: white;
        border: 0px;
    }

    .badata .delete {
        background-color: rgb(234, 74, 92);
        color: white;
        border: 0px;
    }

    .badata .commonbtn {
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

    .table th>.cell {
        padding-top: 12px;
        padding-bottom: 12px;
    }

    .bafoot {
        font-size: 14px;
    }

    .bafootspan span {
        display: inline-block;
        margin-right: 15px;
    }

    /* 日期 */
    .profind .el-date-editor--daterange.el-input__inner {
        width: 185px;
        height: 32px;
        margin-right: 10px;
    }

    .profind .el-date-editor .el-range-input {
        font-size: 12px;
    }

    .profind .el-date-editor .el-range__icon {
        line-height: 25px;

    }

    .profind .el-date-editor .el-range-separator {
        color: #C0C4CC;
        line-height: 21px;
    }

    .profind .el-input {
        width: 160px;
    }
    .iconfont{
        font-size: 12px !important;
    }
</style>