<!-- 电站产品收入 -->
<template>
    <div class="powerbox">
        <el-menu :default-active="activeIndex2" class="el-menu-demo" mode="horizontal" @select="handleSelect"
            background-color="white" text-color="#f999" active-text-color="rgb(18,42,136)">
            <el-menu-item index="1">电站产品收入</el-menu-item>
        </el-menu>

        <div class="powermain">
            <div class="powerfind">
                <el-form :inline="true" :model="formInline" class="demo-form-inline" size="small"
                    style="margin-left: 10px">
                    <el-form-item>
                        <el-input v-model="formInline.no" placeholder="请输入订单编号"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model="formInline.name" placeholder="请输入电站名称"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model="formInline.nick" placeholder="请输入购买人昵称"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model="formInline.phone" placeholder="请输入购买人手机号"></el-input>
                    </el-form-item>
                    <el-date-picker v-model="formInline.time" type="daterange" range-separator="-"
                        start-placeholder="购买时间" end-placeholder="购买时间" value-format="yyyy-MM-dd">
                    </el-date-picker>
                    <el-form-item>
                        <el-select v-model="formInline.paytype" clearable placeholder="请选择付款方式" >
                            <el-option label="微信支付" value="2"></el-option>
                            <el-option label="支付宝支付" value="1"></el-option>
                            <el-option label="余额支付" value="3"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button style="background-color: rgb(54, 116, 255); color: white" icon="el-icon-search" @click='getStationGoods()'>查询
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>

            <div class="powerdata">
                <el-row style="margin-bottom: 12px">
                    <el-button size="small" class="commonbtn" icon="iconfont iconinport" @click='getexport'>导出</el-button>
                </el-row>

                <el-table ref="multipleTable" border
                    :data="tableData" tooltip-effect="dark"
                    style="margin-bottom: 15px; font-size: 14px" class="table" :header-cell-style="getRowClass"
                    @selection-change="handleSelectionChange">
                    <el-table-column label="id" width="45">
                        <template slot-scope="scope">
                            {{ scope.$index + 1 }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="orderNo" label="订单编号"> </el-table-column>
                    <el-table-column prop="payTime" label="购买时间"> </el-table-column>
                    <el-table-column prop="stationName" label="电站名称"> </el-table-column>
                    <el-table-column prop="syYearRate" label="年收益百分比"> </el-table-column>
                    <el-table-column prop="price" label="产品单价(元/瓦)"> </el-table-column>
                    <el-table-column prop="nickName" label="购买人昵称"> </el-table-column>
                    <el-table-column prop="phone" label="购买人手机号"> </el-table-column>
                    <el-table-column prop="currentWatt" label="购买瓦数"> </el-table-column>
                    <el-table-column prop="payAmount" label="实付金额"> </el-table-column>
                    <el-table-column label="支付方式">
                        <template slot-scope="scope">
                            <p v-show='scope.row.payType == 1'>支付宝支付</p>
                            <p v-show='scope.row.payType == 2'>微信支付</p>
                            <p v-show='scope.row.payType == 3'>余额支付</p>
                        </template>
                    </el-table-column>
                </el-table>

                <div class="powerfoot" style="display: flex;">
                    <div>
                        <span>订单数量：{{pagetotal}}</span>
                        <span>订单金额：{{sum | numFilter}}元</span>
                    </div>

                    <div class="page" style="margin-left: auto;">
                        <div class="grid-content bg-purple-light">
                            <el-pagination background @size-change="handleSizeChange"
                                @current-change="handleCurrentChange" :current-page="pageNum"
                                :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
                                :total="pagetotal">
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
                SumPayAmount:0,
                // 搜索
                formInline: {
                    no: '',
                    name: '',
                    nick: '',
                    phone: '',
                    time: '',
                    paytype: ''
                },
                tableData: [],
                totalPayment: 0,
                sum:0,
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
                this.getStationGoods()
            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
                this.pageNum = val
                this.getStationGoods()
            },


            // 列表
            // getStationGoods() {
            //     this.$api.post({
            //         path: '/manage/getStationGoods',
            //         params: {
            //             token: this.token,
            //             orderNo: '',
            //             stationName: '',
            //             nickName: '',
            //             phone: '',
            //             startTime: '',
            //             endTime: '',
            //             payType: '',
            //             pageSize: this.pageSize,
            //             pageNum:this.pageNum,
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
                    type: 6
                }
                // params.is_export = 1
                // this.$download('http://10.77.10.90:8080/manage/export', params, '电站产品收入').then(res => {
                this.$download('http://manager.zhizhennengyuan.com:8000/manage/export', params, '电站产品收入').then(res => {
                    console.log(res, 'res1')
                })
            },

            // getchange(val){
            //     this.formInline.paytype = val
            // },

            // 搜索
            getStationGoods(){
                this.$api.post({
                    path: '/manage/getStationGoods',
                    params: {
                        token: this.token,
                        orderNo: this.formInline.no,
                        stationName: this.formInline.name,
                        nickName: this.formInline.nick,
                        phone: this.formInline.phone,
                        startTime: this.formInline.time[0],
                        endTime: this.formInline.time[1],
                        payType: this.formInline.paytype,
                        pageSize: this.pageSize,
                        pageNum:this.pageNum,
                    }, success: (data) => {
                        console.log(data)
                        this.tableData = data.data.list
                        this.pagetotal = data.data.total
                        // this.totalP()
                        this.sum = data.data.sum
                    }
                })
            },

            totalP() {
                let total = 0

                this.tableData.forEach(e => {
                    total += e.payAmount
                });

                this.totalPayment = total

            }
        },
        mounted() {
            
            this.getStationGoods()
        },
        filters: {
            numFilter(value) {
                // 截取当前数据到小数点后两位
                let realVal = parseFloat(value).toFixed(2)
                return realVal
            }
        },watch: {
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

    .powerbox {
        width: 100%;
        height: 100%;
    }

    .powermain {
        /* width: 98%;
        height: 85%; */
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
        /* width: 98%;
        height: 100%; */
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

    .powerfoot span:first-child {
        display: inline-block;
        margin-right: 15px;
    }
</style>