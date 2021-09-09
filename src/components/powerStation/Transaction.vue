<!-- 电站交易情况 -->
<template>
    <div class="transaction">
        <el-menu :default-active="activeIndex2" class="el-menu-demo" mode="horizontal" @select="handleSelect"
            background-color="white" text-color="#f999" active-text-color="rgb(18,42,136)">
            <el-menu-item index="1">电站交易情况</el-menu-item>
        </el-menu>

        <div class="tranmain">
            <div class="tranfind">
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
                        start-placeholder="入账时间" end-placeholder="入账时间">
                    </el-date-picker>
                    <el-form-item>
                        <el-button style="background-color: rgb(54, 116, 255); color: white" icon="el-icon-search"
                            @click='getfind'>查询
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="trandata">
                <el-row style="margin-bottom: 12px">
                    <el-button size="small" class="commonbtn" icon="iconfont iconinport" @click='getexport'>导出
                    </el-button>
                </el-row>

                <el-table ref="multipleTable" border :data="tableData" tooltip-effect="dark"
                    style="margin-bottom: 15px; font-size: 14px" class="table" :header-cell-style="getRowClass"
                    @selection-change="handleSelectionChange">
                    <el-table-column label="id" width="35">
                        <template slot-scope="scope">
                            {{ scope.$index + 1 }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="order_no" label="订单编号"> </el-table-column>
                    <el-table-column label="入账时间">
                        <template slot-scope="scope" v-if="scope.row.create_time">
                            {{ scope.row.create_time | timeFiler}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="order_amount" label="订单金额"> </el-table-column>
                    <el-table-column prop="nick_name" label="购买人昵称"> </el-table-column>
                    <el-table-column prop="phone" label="购买人手机号"> </el-table-column>
                    <el-table-column prop="current_watt" label="返利瓦数"> </el-table-column>
                    <el-table-column prop="station_name" label="返利瓦数对应电站"> </el-table-column>
                    <el-table-column prop="sy_year_rate" label="返利瓦数对应电站年收益百分比"> </el-table-column>
                    <el-table-column prop="super_nick_name" label="购买人上级昵称"> </el-table-column>
                    <el-table-column prop="super_phone" label="购买人上级手机号"> </el-table-column>
                    <el-table-column prop="super_current_watt" label="奖励瓦数"> </el-table-column>
                    <el-table-column prop="super_station_name" label="奖励瓦数对应电站"> </el-table-column>
                    <el-table-column prop="super_sy_year_rate" label="奖励瓦数对应电站年收益百分比"> </el-table-column>
                </el-table>
                <div class="tranfoot" style="display: flex;">
                    <div >
                        <span>总返利瓦数：{{totaRebate | numFilter}}瓦</span>
                        <span>总奖励瓦数：{{totaReward | numFilter}}瓦</span>
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
    </div>
</template>

<script>

    export default {
        data() {
            return {
                // token:localStorage.getItem('token'),
                activeIndex2: "1",
                pageNum: 1,
                pageSize: 10,
                pagetotal: 0,

                // 搜索
                formInline: {
                    no: '',
                    name: '',
                    nick: '',
                    phone: '',
                    time: ''
                },
                tableData: [],
                totaRebate: 0, //总返利瓦数
                totaReward: 0, //总奖励瓦数

                token: localStorage.getItem('token')
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
                // this.stationTransactions()
                this.getfind()
            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
                this.pageNum = val
                // this.stationTransactions()
                this.getfind()
            },

            // stationTransactions() {
            //     this.$api.post({
            //         path: '/manage/stationTransactions',
            //         params: {
            //             token: this.token,
            //             orderNo: '',
            //             stationName: '',
            //             nickName: '',
            //             phone: '',
            //             startTime: '',
            //             endTime: '',
            //             pageNum:this.pageNum,
            //             pageSize:this.pageSize
            //         }, success: (data) => {
            //             console.log(data)
            //             this.tableData = data.data.list
            //             this.pagetotal = data.data.total
            //             this.totalP()
            //         }
            //     })
            // },

            getfind() {
                this.$api.post({
                    path: '/manage/stationTransactions',
                    params: {
                        token: this.token,
                        orderNo: this.formInline.no,
                        stationName: this.formInline.name,
                        nickName: this.formInline.nick,
                        phone: this.formInline.phone,
                        startTime: this.formInline.time[0],
                        endTime: this.formInline.time[1],
                        pageNum: this.pageNum,
                        pageSize: this.pageSize
                    }, success: (data) => {
                        console.log(data)
                        this.tableData = data.data.list
                        this.pagetotal = data.data.total
                        this.totalP()
                    }
                })
            },


            // 导出
            getexport() {
                let params = {
                    token: this.token,
                    type: 5
                }
                // params.is_export = 1
                this.$download('http://manager.zhizhennengyuan.com:8000/manage/export', params, '电站交易情况').then(res => {
                    console.log(res, 'res1')
                })
            },

            totalP() {
                let totarebate = 0
                let totareward = 0
                this.tableData.forEach(e => {
                    totarebate += e.current_watt
                    totareward += e.super_current_watt
                });

                this.totaRebate = totarebate
                this.totaReward = totareward
            }
        },
        mounted() {
            // this.stationTransactions()
            this.getfind()
            // this.totalP()
        },
        filters: {
            numFilter(value) {
                // 截取当前数据到小数点后两位
                let realVal = parseFloat(value).toFixed(2)
                return realVal
            },

            // 时间过滤器
            timeFiler(value) {
                let times = /\d{4}-\d{1,2}-\d{1,2}/g.exec(value)
                return times[0]
            },
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

    .transaction {
        width: 100%;
        height: 100%;
    }

    .tranmain {
        /* width: 98%;
        height: 80%; */
        padding: 10px 10px 0px 10px;

    }

    .tranfind {
        width: 100%;

        padding-top: 10px;
        background-color: white;
        margin-bottom: 10px;
    }

    .tranfind .el-form-item__content {
        width: 160px;
    }

    /* 日期 */
    .tranfind .el-date-editor--daterange.el-input__inner {
        width: 200px;
        height: 32px;
        margin-right: 10px;
    }

    .tranfind .el-date-editor .el-range-input {
        font-size: 12px;
    }

    .tranfind .el-date-editor .el-range__icon {
        line-height: 25px;

    }

    .tranfind .el-date-editor .el-range-separator {
        color: #C0C4CC;
        line-height: 21px;
    }

    .trandata {
        /* width: 98%;
        height: 100%; */
        padding: 10px 20px;
        background-color: white;
    }

    .trandata .iconfont {
        font-size: 12px;
    }

    .trandata .recovery {
        background-color: rgb(48, 216, 192);
        color: white;
        border: 0px;
    }

    .trandata .disable {
        background-color: rgb(255, 102, 0);
        color: white;
        border: 0px;
    }

    .trandata .delete {
        background-color: rgb(234, 74, 92);
        color: white;
        border: 0px;
    }

    .trandata .commonbtn {
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

    .tranfoot {
        font-size: 14px;
    }

    .tranfoot span:first-child {
        display: inline-block;
        margin-right: 15px;
    }
</style>