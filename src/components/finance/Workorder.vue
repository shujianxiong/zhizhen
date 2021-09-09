<!-- 提现管理 -->
<template>
    <div class="workorder">
        <el-menu :default-active="activeIndex2" class="el-menu-demo" mode="horizontal" @select="handleSelect"
            background-color="white" text-color="#f999" active-text-color="rgb(18,42,136)">
            <el-menu-item index="1">工单管理</el-menu-item>
        </el-menu>

        <div class="drawalmain">
            <div class="drawalfind">
                <el-form :inline="true" :model="formInline" class="demo-form-inline" size="small"
                    style="margin-left: 10px">
                    <el-form-item>
                        <el-input v-model="formInline.nick" placeholder="请输入会员昵称"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model="formInline.phone" placeholder="请输入会员手机号"></el-input>
                    </el-form-item>
                    <el-date-picker v-model="formInline.time" type="daterange" range-separator="-"
                        value-format="yyyy-MM-dd" start-placeholder="日期" end-placeholder="日期">
                    </el-date-picker>
                    <el-form-item>
                        <el-select v-model="formInline.state" clearable placeholder="请选择状态" @change='getapplyStatus'>
                            <el-option label="未审核" value="1"></el-option>
                            <el-option label="通过" value="2"></el-option>
                            <el-option label="未通过" value="3"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button style="background-color: rgb(54, 116, 255); color: white" icon="el-icon-search"
                            @click='getFinanceApply'>查询
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>

            <div class="drawaldata">
                <el-row style="margin-bottom: 12px">
                    <el-button size="small" class="commonbtn" icon="iconfont iconinport" @click='getexport'>导出
                    </el-button>
                </el-row>

                <el-table ref="multipleTable" border :data="withData" tooltip-effect="dark"
                    style="margin-bottom: 15px; font-size: 14px" class="table" :header-cell-style="getRowClass"
                    @selection-change="handleSelectionChange">
                    <el-table-column label="id" width="40">
                        <template slot-scope="scope">
                            {{ scope.$index + 1 }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="nickName" label="会员昵称"> </el-table-column>
                    <el-table-column prop="phone" label="会员手机号"> </el-table-column>
                    <el-table-column label="平台预支付方式">
                        <template slot-scope="scope">
                            <p v-show="scope.row.applyType == 1">支付宝</p>
                            <p v-show="scope.row.applyType == 2">微信</p>
                        </template>
                    </el-table-column>
                    <el-table-column prop="applyAmount" label="平台预支付金额"> </el-table-column>
                    <el-table-column label="审核状态">
                        <template slot-scope="scope">
                            <p v-show="scope.row.orderStatus == 1">未审核</p>
                            <p v-show="scope.row.orderStatus == 2">通过</p>
                            <p v-show="scope.row.orderStatus == 3">未通过</p>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="bafoot" style="display: flex;">
                    <div  class="bafootspan">
                        <span>总提现金额：{{totalPay | numFilter}}元</span>
                    </div>

                    <div class="page" style="margin-left: auto;">
                        <div class="grid-content bg-purple-light">
                            <el-pagination background @size-change="handleSizeChange"
                                @current-change="handleCurrentChange" :current-page="formInline.pageNum"
                                :page-size="formInline.pageSize" layout="total, sizes, prev, pager, next, jumper"
                                :total="formInline.pageTotal">
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
                currentPage: 1,

                token: localStorage.getItem("token"),

                formInline: {
                    no: '',
                    nick: '',
                    phone: '',
                    type: '',
                    number: '',
                    time: '',
                    state: '',
                    pageNum: 1,
                    pageSize: 10,
                    pageTotal: 0
                },
                withData: [],
                totalPay: 0,//总提现金额
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
                this.formInline.pageSize = val
                this.getFinanceApply()
            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
                this.formInline.pageNum = val
                this.getFinanceApply()
            },

            // getFinanceApply(){
            //     this.$api.post({
            //         path:'/manage/getFinanceApply',
            //         params:{
            //             token:this.token,
            //             applyNo:'',
            //             nickName:'',
            //             phone:'',
            //             applyType:'',
            //             account:'',
            //             startTime:'',
            //             endTime:'',
            //             applyStatus:'',
            //             pageNum:this.formInline.pageNum,
            //             pageSize:this.formInline.pageSize
            //         },success:(data)=>{
            //             console.log(data)
            //             this.withData = data.data.list
            //             this.totalP()
            //         }
            //     })
            // },
            getapplyType(val) {
                this.formInline.type = val
            },
            getapplyStatus(val) {
                this.formInline.state = val
            },
            getFinanceApply() {
                this.$api.post({
                    path: '/manage/getFinanceApply',
                    params: {
                        token: this.token,
                        applyNo: this.formInline.no,
                        nickName: this.formInline.nick,
                        phone: this.formInline.phone,
                        applyType: this.formInline.type,
                        account: this.formInline.number,
                        startTime: this.formInline.time[0],
                        endTime: this.formInline.time[1],
                        orderStatus: this.formInline.state,
                        pageNum: this.formInline.pageNum,
                        pageSize: this.formInline.pageSize
                    }, success: (data) => {
                        console.log(data)
                        this.withData = data.data.list
                        this.formInline.pageTotal = data.data.total
                        this.totalP()

                    }
                })
            },

            // 导出
            getexport() {
                let params = {
                    token: this.token,
                    type: 9
                }
                // params.is_export = 1
                this.$download('http://manager.zhizhennengyuan.com:8000/manage/export', params, '工单管理').then(res => {
                    console.log(res, 'res1')
                })
            },

            totalP() {
                let pay = 0
                this.withData.forEach(e => {
                    pay += e.applyAmount
                });

                this.totalPay = pay
            },
        },
        mounted() {

            this.getFinanceApply()
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

    .withdrawal {
        width: 100%;
        height: 100%;
    }

    .withdrawal .el-dialog__header {
        padding: 12px 20px 10px
    }

    .withdrawal .el-dialog__title {
        color: #606266;
        font-size: 14px;
    }

    .withdrawal .el-dialog__body {

        padding-top: 20px;
        padding-bottom: 100px;
        border-top: 1px solid #ccc;
    }

    .drawalmain {
        /* width: 98%;
        height: 80%; */
        padding: 10px 10px 0px 10px;

    }

    .drawalfind {
        width: 100%;

        padding-top: 10px;
        background-color: white;
        margin-bottom: 10px;
    }

    .drawalfind .el-form-item__content {
        width: 160px;
    }

    /* 日期 */
    .drawalfind .el-date-editor--daterange.el-input__inner {
        width: 200px;
        height: 32px;
        margin-right: 10px;
    }

    .drawalfind .el-date-editor .el-range-input {
        font-size: 12px;
    }

    .drawalfind .el-date-editor .el-range__icon {
        line-height: 25px;

    }

    .drawalfind .el-date-editor .el-range-separator {
        color: #C0C4CC;
        line-height: 21px;
    }

    .drawaldata {
        /* width: 98%;
        height: 100%; */
        padding: 10px 20px;
        background-color: white;
    }

    .drawaldata .iconfont {
        font-size: 12px;
    }

    .drawaldata .recovery {
        background-color: rgb(48, 216, 192);
        color: white;
        border: 0px;
    }

    .drawaldata .disable {
        background-color: rgb(255, 102, 0);
        color: white;
        border: 0px;
    }

    .drawaldata .delete {
        background-color: rgb(234, 74, 92);
        color: white;
        border: 0px;
    }

    .drawaldata .commonbtn {
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
</style>