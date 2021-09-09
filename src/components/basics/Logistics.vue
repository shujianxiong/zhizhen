<!-- 物流公司 -->
<template>
    <div class="logistics">
        <el-menu :default-active="activeIndex2" class="el-menu-demo" mode="horizontal" @select="handleSelect"
            background-color="white" text-color="#f999" active-text-color="rgb(18,42,136)">
            <el-menu-item index="1">物流公司</el-menu-item>
        </el-menu>

        <div class="logmain">
            <div class="logfind">
                <el-form :inline="true" :model="formInline" class="demo-form-inline" size="small"
                    style="margin-left: 10px">
                    <el-form-item>
                        <el-input v-model="formInline.logistics" placeholder="请输入物流公司"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button style="background-color: rgb(54, 116, 255); color: white" icon="el-icon-search"
                            @click='getfind'>查询
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="logdata">
                <el-row style="margin-bottom: 12px">
                    <el-button size="small" class="commonbtn" icon="el-icon-plus" @click="addVisible=true">添加
                    </el-button>
                    <el-button size="small" class="delete" icon="el-icon-close" @click='getDel'>删除</el-button>
                </el-row>

                <el-table ref="multipleTable" border :data="tableData" tooltip-effect="dark"
                    style="margin-bottom: 15px; font-size: 14px" class="table" :header-cell-style="getRowClass"
                    @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="60"> </el-table-column>
                    <el-table-column label="id" width="60">
                        <template slot-scope="scope">
                            {{scope.$index+1}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="logisticsComName" label="物流公司"> </el-table-column>
                    <el-table-column label="操作" width="200">
                        <template slot-scope="scope">
                            <el-button size="mini" type="primary" @click="edit(scope.$index, scope.row)">编辑
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <div class="page" style="display: flex;">
                    <div class="grid-content bg-purple-light" style="margin-left: auto;">
                        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                            :current-page="currentPage" :page-sizes="[5,10,20]" :page-size="5"
                            layout="total, sizes, prev, pager, next, jumper" :total="pagetotal">
                        </el-pagination>
                    </div>
                </div>
            </div>
        </div>

        <!-- 添加 -->
        <el-dialog title="添加" :visible.sync="addVisible" width="600px" :close-on-click-modal="false">
            <div class="information">
                <div style="width: 100%; margin: 0 auto; " class="questadd">
                    <el-form :model="ruleForm" ref="ruleForm" label-width="80px" class="demo-ruleForm"
                        label-position="left" style="margin: 0 auto;width: 500px;">
                        <el-form-item label="物流公司" required>
                            <el-input v-model="ruleForm.logistics" placeholder="请输入物流公司名称"></el-input>
                        </el-form-item>
                        <el-form-item label=" ">
                            <el-button style="background-color: rgb(54,116,255); color: white; margin-bottom: 10px;"
                                @click='getAdd'>
                                确定
                            </el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </el-dialog>

        <!-- 编辑 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="600px" :close-on-click-modal="false">
            <div class="information">
                <div style="width: 100%; margin: 0 auto; " class="questadd">
                    <el-form :model="editForm" ref="editForm" label-width="80px" class="demo-ruleForm"
                        label-position="left" style="margin: 0 auto;width: 500px;">
                        <el-form-item label="物流公司" required>
                            <el-input v-model="editForm.logistics" placeholder="请输入物流公司名称"></el-input>
                        </el-form-item>
                        <el-form-item label=" ">
                            <el-button style="background-color: rgb(54,116,255); color: white; margin-bottom: 10px;"
                                @click='getEdit'>
                                确定
                            </el-button>
                        </el-form-item>
                    </el-form>
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
                token: localStorage.getItem('token'),
                // 搜索
                formInline: {
                    logistics: ''
                },
                ruleForm: {
                    logistics: '',
                },

                rules: {
                    logistics: [
                        { required: true, message: '请输入物流公司名称', trigger: 'change' },
                    ],
                },

                // 添加
                addVisible: false,

                // 编辑
                editVisible: false,
                editForm: {
                    logistics: '',
                    logistics_com_id: ''
                },

                editrules: {
                    logistics: [
                        { required: true, message: '请输入物流公司名称', trigger: 'change' },
                    ],
                },

                // 详情
                detailsVisible: false,

                tableData: [],

                logistics_com_ids: [],

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

            // 物流公司列表
            getLogisticsCompany() {
                this.$api.post({
                    path: '/manage/getLogisticsCompany',
                    params: {
                        token: this.token,
                        logistics_com_name: ''
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
                    path: '/manage/getLogisticsCompany',
                    params: {
                        token: this.token,
                        logistics_com_name: this.formInline.logistics
                    }, success: (data) => {
                        console.log(data)
                        this.tableData = data.data.list
                        this.pagetotal = data.data.total
                    }
                })
            },
            
            // 添加
            getAdd() {
                if (this.ruleForm.logistics == '') {
                    this.$message({
                        message: '请输入物流公司名称',
                        type: 'warning'
                    });
                } else {
                    this.$api.post({
                        path: '/manage/operationLogisticsCompany',
                        params: {
                            token: this.token,
                            logistics_com_name: this.ruleForm.logistics,
                            type: 1
                        }, success: (data) => {
                            console.log(data)
                            if (data.code == 1) {
                                this.$message({
                                    message: data.msg,
                                    type: 'success'
                                });
                                this.addVisible = false
                                this.getLogisticsCompany()
                            }

                        }
                    })
                }

            },
            // 编辑
            edit(index, row) {
                console.log(index, row);
                this.editVisible = true
                this.editForm.logistics = row.logisticsComName
                this.editForm.logistics_com_id = row.logisticsComId
            },

            getEdit() {
                this.$api.post({
                    path: '/manage/operationLogisticsCompany',
                    params: {
                        token: this.token,
                        logistics_com_name: this.editForm.logistics,
                        logistics_com_id: this.editForm.logistics_com_id,
                        type: 2
                    }, success: (data) => {
                        console.log(data)
                        if (data.code == 1) {
                            this.$message({
                                message: data.msg,
                                type: 'success'
                            });
                            this.editVisible = false
                            this.getLogisticsCompany()
                        }

                    }
                })
            },

            // 删除
            handleSelectionChange(val) {
                this.multipleSelection = val;

                let ids = []
                val.forEach(e => {
                    ids.push(e.logisticsComId)
                });
                this.logistics_com_ids = ids
            },

            getDel() {
                this.$api.post({
                    path: '/manage/operationLogisticsCompany',
                    params: {
                        token: this.token,
                        logistics_com_ids: this.logistics_com_ids.join(','),
                        type: 3
                    }, success: (data) => {
                        console.log(data)
                        if (data.code == 1) {
                            this.$message({
                                message: data.msg,
                                type: 'success'
                            });
                            this.getLogisticsCompany()
                        } else {
                            this.$message({
                                message: '请选择要删除的信息',
                                type: 'warning'
                            });
                        }
                    }
                })
            },

            // 分页
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
            }
        },
        mounted() {
            this.getLogisticsCompany()
        },
    }
</script>


<style>
    * {
        padding: 0;
        margin: 0;
    }

    .logistics {
        width: 100%;
        height: 100%;
    }

    .questadd .el-input {
        width: 235px;
    }

    .questadd .el-button {
        margin-top: 50px;
    }

    .logistics .el-dialog__header {
        padding: 12px 20px 10px
    }

    .logistics .el-dialog__title {
        color: #606266;
        font-size: 14px;
    }

    .logistics .el-dialog__body {

        padding-top: 20px;
        padding-bottom: 100px;
        border-top: 1px solid #ccc;
    }

    .logmain {
        width: 98%;
        height: 80%;
        padding: 10px 10px 0px 10px;

    }

    .logfind {
        width: 100%;
        padding-top: 10px;
        background-color: white;
        margin-bottom: 10px;
    }

    .logfind .el-form-item__content {
        width: 160px;
    }

    .logdata {
        width: 98%;
        height: 100%;
        padding: 10px 20px;
        background-color: white;
    }

    .logdata .iconfont {
        font-size: 12px;
    }

    .logdata .recovery {
        background-color: rgb(48, 216, 192);
        color: white;
        border: 0px;
    }

    .logdata .disable {
        background-color: rgb(255, 102, 0);
        color: white;
        border: 0px;
    }

    .logdata .delete {
        background-color: rgb(234, 74, 92);
        color: white;
        border: 0px;
    }

    .logdata .commonbtn {
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
</style>