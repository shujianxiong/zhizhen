<!-- 电站支出 -->
<template>
    <div class="expenditure">
        <el-menu :default-active="activeIndex2" class="el-menu-demo" mode="horizontal" @select="handleSelect"
            background-color="white" text-color="#f999" active-text-color="rgb(18,42,136)">
            <el-menu-item index="1">电站支出</el-menu-item>
        </el-menu>
        <div class="expendmain">
            <div class="expendfind">
                <el-form :inline="true" :model="formInline" class="demo-form-inline" size="small"
                    style="margin-left: 10px">
                    <el-date-picker v-model="formInline.time" type="daterange" range-separator="-"
                        start-placeholder="日期" end-placeholder="日期" value-format="yyyy-MM-dd">
                    </el-date-picker>

                    <el-form-item>
                        <el-input v-model="formInline.name" placeholder="请输入电站名称"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model="formInline.no" placeholder="请输入订单编号"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model="formInline.nick" placeholder="请输入收益人昵称"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model="formInline.phone" placeholder="请输入收益人手机号"></el-input>
                    </el-form-item>

                    <el-form-item>
                        <el-select v-model="formInline.attribute" placeholder="请选择属性" @change='getchange'>
                            <el-option label="请选择属性" value=""></el-option>
                            <el-option label="自购瓦数" value="1"></el-option>
                            <el-option label="返利瓦数" value="2"></el-option>
                            <el-option label="奖励瓦数" value="12"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button style="background-color: rgb(54, 116, 255); color: white" icon="el-icon-search"
                            @click='getStationExpenditure'>查询
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="expenddata">
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
                    <el-table-column prop="peroid" label="日期区间"></el-table-column>
                    <el-table-column prop="station_name" label="电站名称"> </el-table-column>
                    <el-table-column prop="watt" label="瓦数"> </el-table-column>
                    <el-table-column prop="attribute" label="属性">
                        <template slot-scope="scope">
                            <p v-show='scope.row.ref_type == 1'>自购瓦数</p>
                            <p v-show='scope.row.ref_type == 2'>返利瓦数</p>
                            <p v-show='scope.row.ref_type == 12'>奖励瓦数</p>
                        </template>
                    </el-table-column>
                    <el-table-column prop="order_no" label="对应订单编号"> </el-table-column>
                    <el-table-column prop="sy_year_rate" label="年收益百分比"> </el-table-column>
                    <el-table-column prop="current_amount" label="收益金额"> </el-table-column>
                    <el-table-column prop="nick_name" label="收益人昵称"> </el-table-column>
                    <el-table-column prop="phone" label="收益人手机号"> </el-table-column>
                </el-table>

                <div class="expendfoot" style="display: flex;">
                    <div>
                        <span>收益金额：{{totalProfit | numFilter}}元</span>
                    </div>

                    <div style="margin-left: auto;">
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

                formInline: {
                    time: '',
                    name: '',
                    no: '',
                    nick: '',
                    phone: '',
                    attribute: ''
                },
                tableData: [],
                totalProfit: 0,//收益金额

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


            getchange(val) {
                this.formInline.attribute = val
            },

            getStationExpenditure() {
                this.$api.post({
                    path: '/manage/getStationExpenditure',
                    params: {
                        token: this.token,
                        startTime: this.formInline.time[0],
                        endTime: this.formInline.time[0],
                        stationName: this.formInline.name,
                        orderNo: this.formInline.no,
                        nickName: this.formInline.nick,
                        phone: this.formInline.phone,
                        refType: this.formInline.attribute,
                        pageSize: this.pageSize,
                        pageNum: this.pageNum,
                    }, success: (data) => {
                        console.log(data)
                        this.tableData = data.data.list
                        this.pagetotal = data.data.total
                        this.totalP()
                    }
                })
            },

            // 分页
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
                this.pageSize = val
                this.getStationExpenditure()
            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
                this.pageNum = val
                this.getStationExpenditure()
            },



            // 导出
            getexport() {
                let params = {
                    token: this.token,
                    type: 8
                }
                // params.is_export = 1
                this.$download('http://manager.zhizhennengyuan.com:8000/manage/export', params, '电站支出').then(res => {
                    console.log(res, 'res1')
                })
            },

            totalP() {
                let total = 0

                this.tableData.forEach(e => {
                    total += e.current_amount
                });

                this.totalProfit = total

            }
        },
        mounted() {
            this.getStationExpenditure()

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

    .expenditure {
        width: 100%;
        height: 100%;
    }

    .expendmain {
        width: 98%;
        height: 80%;
        padding: 10px 10px 0px 10px;

    }

    .expendfind {
        /* width: 100%; */

        padding-top: 10px;
        background-color: white;
        margin-bottom: 10px;
    }

    .expendfind .el-form-item__content {
        width: 160px;
    }

    /* 日期 */
    .expendfind .el-date-editor--daterange.el-input__inner {
        width: 200px;
        height: 32px;
        margin-right: 10px;
    }

    .expendfind .el-date-editor .el-range-input {
        font-size: 12px;
    }

    .expendfind .el-date-editor .el-range__icon {
        line-height: 25px;

    }

    .expendfind .el-date-editor .el-range-separator {
        color: #C0C4CC;
        line-height: 21px;
    }

    .expenddata {
        /* width: 98%;
        height: 100%; */
        padding: 10px 20px;
        background-color: white;
    }

    .expenddata .iconfont {
        font-size: 12px;
    }

    .expenddata .recovery {
        background-color: rgb(48, 216, 192);
        color: white;
        border: 0px;
    }

    .expenddata .disable {
        background-color: rgb(255, 102, 0);
        color: white;
        border: 0px;
    }

    .expenddata .delete {
        background-color: rgb(234, 74, 92);
        color: white;
        border: 0px;
    }

    .expenddata .commonbtn {
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

    .expendfoot {
        font-size: 14px;
    }

    .expendfoot span:first-child {
        display: inline-block;
        margin-right: 15px;
    }
</style>