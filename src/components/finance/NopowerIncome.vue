<!-- 非电站产品收入 -->
<template>
    <div class="nopowerbox">
        <el-menu :default-active="activeIndex2" class="el-menu-demo" mode="horizontal" @select="handleSelect"
            background-color="white" text-color="#f999" active-text-color="rgb(18,42,136)">
            <el-menu-item index="1">非电站产品收入</el-menu-item>
        </el-menu>
        <div class="powermain">
            <div class="powerfind">
                <el-form :inline="true" :model="formInline" class="demo-form-inline" size="small"
                    style="margin-left: 10px">
                    <el-form-item>
                        <el-input v-model="formInline.no" placeholder="请输入订单编号"></el-input>
                    </el-form-item>
                    <el-date-picker v-model="formInline.time" type="daterange" range-separator="-"
                        start-placeholder="日期" end-placeholder="日期" value-format="yyyy-MM-dd">
                    </el-date-picker>
                    <el-form-item>
                        <el-button style="background-color: rgb(54, 116, 255); color: white" icon="el-icon-search"
                            @click="getWrongStationGoods">查询
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>

            <div class="powerdata">
                <el-row style="margin-bottom: 12px">
                    <el-button size="small" class="commonbtn" icon="iconfont iconinport" @click='getexport'>导出
                    </el-button>
                </el-row>

                <el-table ref="multipleTable" border :data="tableData" tooltip-effect="dark"
                    style="margin-bottom: 15px; font-size: 14px" class="table" :header-cell-style="getRowClass"
                    @selection-change="handleSelectionChange">
                    <el-table-column label="id" width="45">
                        <template slot-scope="scope">
                            {{ scope.$index + 1 }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="orderNo" label="订单编号" width='155'> </el-table-column>
                    <el-table-column prop="createTime" label="入账时间"> </el-table-column>
                    <el-table-column prop="orderAmount" label="订单金额"> </el-table-column>
                    <el-table-column prop="nickName" label="购买人昵称"> </el-table-column>
                    <el-table-column prop="phone" label="购买人手机号"> </el-table-column>
                    <el-table-column prop="mlAmount" label="订单毛利"> </el-table-column>
                    <el-table-column prop="cbAmount" label="商品运营成本"> </el-table-column>
                    <el-table-column prop="flAmount" label="返利金额"> </el-table-column>
                    <el-table-column prop="jlAmount" label="奖励金额"> </el-table-column>
                    <el-table-column prop="lrAmount" label="团队收益(返佣后剩余)"></el-table-column>
                    <el-table-column prop="platformRevenue" label="平台收益"></el-table-column>
                </el-table>

                <div class="powerfoot" style="width: 100%;">
                    <div class="powerfoot-top">
                        <span>订单数量：{{pagetotal}}</span>
                        <span>订单金额：{{totalorderpay | numFilter}}元</span>
                        <span>返利金额：{{totalrebate | numFilter}}</span>
                        <span>奖励金额：{{totalreward | numFilter}}</span>
                        <span>团队收益：{{totalsurplus | numFilter}}</span>
                        <span>平台收益：{{totalprofit | numFilter}}</span>
                    </div>

                    <div class="page" style="float: right;">
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
    </div>
</template>

<script>
    export default {
        data() {
            return {
                activeIndex2: "1",
                pageNum: 1,
                pagetotal: 0,
                pageSize: 10,
                token: localStorage.getItem('token'),

                // 搜索
                formInline: {
                    orderno: '',
                    time: '',
                },
                tableData: [],

                totalorderpay: 0,//订单金额
                totalrebate: 0,//返利金额
                totalreward: 0,//奖励金额
                totalsurplus: 0,//返佣后剩余金额
                totalprofit: 0//平台收益

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
                this.pageNum = 1
                this.pageSize = val
                this.getWrongStationGoods()
            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
                this.pageNum = val
                this.getWrongStationGoods()
                // this.getWrongStationGoods(val)
            },

            getWrongStationGoods() {
                this.$api.post({
                    path: '/manage/getWrongStationGoods',
                    params: {
                        token: this.token,
                        orderNo: this.formInline.no,
                        startTime: this.formInline.time[0],
                        endTime: this.formInline.time[1],
                        pageSize: this.pageSize,
                        pageNum: this.pageNum,
                    }, success: (data) => {
                        console.log(data)
                        this.tableData = data.data.list
                        this.pagetotal = data.data.total
                        // this.formInline.no = ''
                        // this.formInline.time = ''
                        this.totalP()
                    }
                })
            },

            // getfind() {
            //     this.$api.post({
            //         path: '/manage/getWrongStationGoods',
            //         params: {
            //             token: this.token,
            //             orderNo: this.formInline.no,
            //             startTime: this.formInline.time[0],
            //             endTime: this.formInline.time[1],
            //             pageSize: this.pageSize,
            //             pageNum: this.pageNum,
            //         }, success: (data) => {
            //             console.log(data)
            //             this.tableData = data.data.list
            //             this.pagetotal = data.data.total
            //             // this.formInline.no = ''
            //             // this.formInline.time = ''
            //             this.totalP()
            //         }
            //     })
            // },

            // 导出
            getexport() {
                let params = {
                    token: this.token,
                    type: 7
                }
                // params.is_export = 1
                // this.$download('http://10.77.10.90:8080/manage/export', params, '非电站产品收入').then(res => {
                this.$download('http://manager.zhizhennengyuan.com:8000/manage/export', params, '非电站产品收入').then(res => {

                    console.log(res, 'res1')
                })
            },


            totalP() {
                let total = 0
                let rebate = 0
                let reward = 0
                let surplus = 0
                let profit = 0
                this.tableData.forEach(e => {
                    total += e.orderAmount //订单金额
                    rebate += e.flAmount //返利金额
                    reward += e.jlAmount //奖励金额
                    surplus += e.lrAmount //返佣后剩余金额
                    profit += e.platformRevenue //平台收益
                });

                this.totalorderpay = total
                this.totalrebate = rebate
                this.totalreward = reward
                this.totalsurplus = surplus
                this.totalprofit = profit

            }
        },
        mounted() {

            this.getWrongStationGoods()
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

    .nopowerbox {
        width: 100%;
        height: 100%;
    }

    .powermain {
        width: 98%;
        height: 80%;
        padding: 10px 10px 0px 10px;

    }

    .powerfind {
        width: 100%;

        padding-top: 10px;
        background-color: white;
        margin-bottom: 10px;
    }

    .powerfind .el-form-item__content {
        width: 160px;
    }

    /* 日期 */
    .powerfind .el-date-editor--daterange.el-input__inner {
        width: 200px;
        height: 32px;
        margin-right: 10px;
    }

    .powerfind .el-date-editor .el-range-input {
        font-size: 12px;
    }

    .powerfind .el-date-editor .el-range__icon {
        line-height: 25px;

    }

    .powerfind .el-date-editor .el-range-separator {
        color: #C0C4CC;
        line-height: 21px;
    }

    .powerdata {
        width: 98%;
        height: 100%;
        padding: 10px 20px;
        background-color: white;
    }

    .powerdata .iconfont {
        font-size: 12px;
    }

    .powerdata .recovery {
        background-color: rgb(48, 216, 192);
        color: white;
        border: 0px;
    }

    .powerdata .disable {
        background-color: rgb(255, 102, 0);
        color: white;
        border: 0px;
    }

    .powerdata .delete {
        background-color: rgb(234, 74, 92);
        color: white;
        border: 0px;
    }

    .powerdata .commonbtn {
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

    .powerfoot {
        font-size: 14px;
    }

    .powerfoot-top span {
        display: inline-block;
        margin-right: 15px;
    }
</style>