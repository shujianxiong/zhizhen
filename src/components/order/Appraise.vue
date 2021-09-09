<!-- 评价列表 -->
<template>
    <div class="appraisebox">
        <el-menu :default-active="activeIndex2" class="el-menu-demo" mode="horizontal" @select="handleSelect"
            background-color="white" text-color="#f999" active-text-color="rgb(18,42,136)">
            <el-menu-item index="1">评价列表</el-menu-item>
        </el-menu>

        <div class="appraisemain">
            <div class="appraisefind">
                <el-form :inline="true" :model="formInline" class="demo-form-inline" size="small"
                    style="margin-left: 10px">
                    <el-form-item>
                        <el-input v-model="formInline.people" placeholder="请输入评价人"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model="formInline.phone" placeholder="请输入评价人手机号"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model="formInline.word" placeholder="请输入关键词"></el-input>
                    </el-form-item>
                    <el-date-picker v-model="formInline.time" type="daterange" range-separator="-"
                        start-placeholder="评价时间" end-placeholder="评价时间">
                    </el-date-picker>
                    <el-form-item>
                        <el-input v-model="formInline.orderno" placeholder="请输入订单编号"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model="formInline.goodsname" placeholder="请输入商品名称"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button style="background-color: rgb(54, 116, 255); color: white" icon="el-icon-search"
                            @click='getfind'>查询
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>

            <div class="appraisedata">
                <el-row style="margin-bottom: 12px">
                    <el-button size="small" class="delete" icon="el-icon-close" @click="outVisible = true">删除
                    </el-button>
                </el-row>

                <el-table ref="multipleTable" border :data="tableData" tooltip-effect="dark"
                    style="margin-bottom: 15px; font-size: 14px" class="table" :header-cell-style="getRowClass"
                    @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55"> </el-table-column>
                    <el-table-column label="id" width="45">
                        <template slot-scope="scope">
                            {{scope.$index+1}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="nickName" label="评价人"></el-table-column>
                    <el-table-column prop="phone" label="评价人手机号"></el-table-column>
                    <el-table-column prop="createTime" label="评价时间"></el-table-column>
                    <el-table-column prop="evlLevel" label="评价星级"></el-table-column>
                    <el-table-column prop="content" label="评价内容" width="280"></el-table-column>
                    <el-table-column prop="orderNo" label="关联订单编号"></el-table-column>
                    <el-table-column prop="goodsName" label="关联商品"></el-table-column>
                    <el-table-column label="操作" width="200">
                        <template slot-scope="scope">
                            <el-button size="mini" type="primary" @click="details(scope.$index, scope.row)">详情
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="page" style="display: flex;">
                    <div class="grid-content bg-purple-light" style="margin-left: auto;">
                        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                            :current-page="pageNum" :page-size="pageSize"
                            layout="total, sizes, prev, pager, next, jumper" :total="pagetotal">
                        </el-pagination>
                    </div>
                </div>
            </div>
        </div>

        <!-- 详情 -->
        <el-dialog title="详情" :visible.sync="detailsVisible" width="30%">
            <div class="information">
                <div style="width: 100%; margin: 0 auto; ">
                    <div class="salemessage">
                        <div>评价人：{{evaldetails.nickName}}</div>
                        <div>评价人手机号：{{evaldetails.phone}}</div>
                        <div>评价时间：{{evaldetails.createTime}}</div>
                        <div>评价星级：{{evaldetails.evlLevel}}</div>
                        <div>评价内容：{{evaldetails.content}}</div>
                        <div class="evaluatebox">
                            <span>评价图片：</span>
                            <div class="evaluateimg">
                                <img v-for='item in evaluationImgList' :src="item.src" :key="item.evalImgId" alt="">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </el-dialog>

        <el-dialog title="删除" :visible.sync="outVisible" width="20%" :before-close="handleClose">
            <span>确认删除？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="outVisible = false">取 消</el-button>
                <el-button type="primary" @click="(outVisible = false), delEval()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                activeIndex2: "1",
                // pageNum: 1,
                token: localStorage.getItem("token"),
                pagetotal: 0,//评价列表总页数
                pageNum: 1,
                pageSize: 10,

                outVisible: false,

                // 搜索
                formInline: {
                    people: '',
                    phone: '',
                    orderno: '',
                    word: '',
                    time: '',
                    goodsname: ''
                },
                tableData: [],

                evalIds: [],//删除评价id

                // 详情
                detailsVisible: false,
                evaldetails: {},
                evaluationImgList: [],

            }
        },

        methods: {
            handleSelect(key, keyPath) {
                console.log(key, keyPath);
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
                this.getEvalList()
            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
                this.pageNum = val
                this.getEvalList()
            },
            handleClose(key, keyPath) {
                console.log(key, keyPath);
                this.outVisible = false
            },

            // 评价列表
            getEvalList() {
                this.$api.post({
                    path: '/manage/getEvalList',
                    params: {
                        token: this.token,
                        nickName: '',
                        phone: '',
                        startTime: '',
                        endTime: '',
                        orderNo: '',
                        goodsName: '',
                        content: '',
                        pageNum: this.pageNum,
                        pageSize: this.pageSize
                    }, success: (data) => {
                        console.log(data)
                        this.tableData = data.data.list
                        this.pagetotal = data.data.total
                    }
                })
            },

            // 搜索
            getfind() {
                this.$api.post({
                    path: '/manage/getEvalList',
                    params: {
                        token: this.token,
                        nickName: this.formInline.people,
                        phone: this.formInline.phone,
                        startTime: this.formInline.time[0],
                        endTime: this.formInline.time[1],
                        orderNo: this.formInline.orderno,
                        goodsName: this.formInline.goodsname,
                        content: this.formInline.word,
                        pageNum: this.pageNum,
                        pageSize: this.pageSize
                    }, success: (data) => {
                        console.log(data)
                        this.tableData = data.data.list
                        this.pagetotal = data.data.total
                    }
                })
            },

            // 获取
            handleSelectionChange(val) {
                this.multipleSelection = val;
                console.log(val)
                let ids = []
                val.forEach(e => {
                    ids.push(e.evalId)
                })
                this.evalIds = ids
            },

            // 删除评论
            delEval() {
                this.$api.post({
                    path: '/manage/delEval',
                    params: {
                        token: this.token,
                        evalIds: this.evalIds.join(',')
                    }, success: (data) => {
                        if (data.code == 1) {
                            this.$message({
                                message: data.msg,
                                type: 'success'
                            });
                            this.getEvalList()
                        } else {
                            this.$message({
                                message: '请选择要删除的信息',
                                type: 'warning'
                            });
                        }
                    }
                })
            },

            // 详情
            details(index, row) {
                console.log(index, row);
                this.detailsVisible = true;
                this.$api.post({
                    path: '/manage/getEvalDetails',
                    params: {
                        token: this.token,
                        evalId: row.evalId
                    }, success: (data) => {
                        console.log(data)
                        this.evaldetails = data.data
                        this.evaluationImgList = data.data.evaluationImgList
                    }
                })
            },
        },
        mounted() {
            this.getEvalList()
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

    .appraisebox {
        width: 100%;
        height: 100%;
    }

    .appraisemain {
        /* width: 98%;
        height: 80%; */
        padding: 10px 10px 0px 10px;

    }

    .appraisefind {
        width: 100%;

        padding-top: 10px;
        background-color: white;
        margin-bottom: 10px;
    }

    .appraisefind .el-form-item__content {
        width: 160px;
    }

    /* 日期 */
    .appraisefind .el-date-editor--daterange.el-input__inner {
        width: 200px;
        height: 32px;
        margin-right: 10px;
    }

    .appraisefind .el-date-editor .el-range-input {
        font-size: 12px;
    }

    .appraisefind .el-date-editor .el-range__icon {
        line-height: 25px;

    }

    .appraisefind .el-date-editor .el-range-separator {
        color: #C0C4CC;
        line-height: 21px;
    }

    .appraisedata {
        /* width: 98%;
        height: 100%; */
        padding: 10px 20px;
        background-color: white;
    }

    .appraisedata .recovery {
        background-color: rgb(48, 216, 192);
        color: white;
        border: 0px;
    }

    .appraisedata .disable {
        background-color: rgb(255, 102, 0);
        color: white;
        border: 0px;
    }

    .appraisedata .delete {
        background-color: rgb(234, 74, 92);
        color: white;
        border: 0px;
    }

    .appraisedata .commonbtn {
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

    .appraisebox .el-dialog__header {
        padding: 12px 20px 10px
    }

    .appraisebox .el-dialog__title {
        color: #606266;
        font-size: 14px;
    }

    .appraisebox .el-dialog__body {

        padding-top: 20px;
        /* padding-bottom: 100px; */
        border-top: 1px solid #ccc;
    }

    .salesmessage {
        width: 100%;
        margin-bottom: 80px;
    }

    .salesmessage p {
        color: rgb(56, 118, 255);
        font-weight: bold;
        /* line-height: 19px; */
    }

    .salesmessage p i {
        display: inline-block;
        margin-right: 5px;
        font-size: 15px;
        /* line-height: 18px; */
    }

    .salesnews {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
    }

    .salesnews>div {
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

    .salemessage div {
        /* width: 50%; */
        margin-bottom: 10px;
    }
</style>