<!-- 有问有答 -->
<template>
    <div class="questions">
        <el-menu :default-active="activeIndex2" class="el-menu-demo" mode="horizontal" @select="handleSelect"
            background-color="white" text-color="#f999" active-text-color="rgb(18,42,136)">
            <el-menu-item index="1">有问有答</el-menu-item>
        </el-menu>

        <div class="questmain">
            <div class="questfind">
                <el-form :inline="true" :model="formInline" class="demo-form-inline" size="small"
                    style="margin-left: 10px">
                    <el-form-item>
                        <el-input v-model="formInline.title" placeholder="请输入问题标题"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button style="background-color: rgb(54, 116, 255); color: white" icon="el-icon-search"
                            @click='getfind'>查询
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="questdata">
                <el-row style="margin-bottom: 12px">
                    <el-button size="small" class="commonbtn" icon="el-icon-plus" @click="addVisible=true">添加
                    </el-button>
                    <el-button size="small" class="delete" icon="el-icon-close" @click='getdel'>删除</el-button>
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
                    <el-table-column prop="queTitle" label="问题标题"> </el-table-column>
                    <el-table-column prop="ordid" label="排序序号"> </el-table-column>
                    <el-table-column label="操作" width="200">
                        <template slot-scope="scope">
                            <el-button size="mini" type="primary" @click="details(scope.$index, scope.row)">详情
                            </el-button>
                            <el-button size="mini" type="primary" @click="edit(scope.$index, scope.row)">编辑
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

        <!-- 添加 -->
        <el-dialog title="添加" :visible.sync="addVisible" width="45%" :close-on-click-modal="false">
            <div class="information">
                <div style="width: 100%; margin: 0 auto; " class="questadd">
                    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" class="demo-ruleForm"
                        label-position="left" style="margin: 0 auto;">
                        <el-form-item label="问题标题" prop="title">
                            <el-input v-model="ruleForm.title" placeholder="请输入问题标题"></el-input>
                        </el-form-item>
                        <el-form-item label="排序序号" prop="number">
                            <el-input v-model="ruleForm.number" placeholder="请输入排序序号"></el-input>
                        </el-form-item>
                        <el-form-item label="问题答案" prop="answer">

                            <!-- <mavon-editor v-model="ruleForm.answer" :toolbars="toolbars" /> -->
                            <tinymce-editor ref='tinymce' :init='init' v-model="ruleForm.answer"></tinymce-editor>
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

        <!-- 详情 -->
        <el-dialog title="详情" :visible.sync="detailsVisible" width="45%">
            <div class="information">
                <div style="width: 100%; margin: 0 auto; " class="questadd">
                    <p>问题标题:{{detailsC.queTitle}}</p>
                    <p>排序序号：{{detailsC.ordid}}</p>
                    <div>
                        <div>问题答案</div>
                        <div>
                            <tinymce-editor ref='tinymce' :init='init' v-model="detailsC.content"></tinymce-editor>
                        </div>
                    </div>
                </div>
            </div>
        </el-dialog>

        <!-- 编辑 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="45%" :close-on-click-modal="false">
            <div class="information">
                <div style="width: 100%; margin: 0 auto; " class="questadd">
                    <el-form :model="ruleForm" :rules="editrules" ref="editForm" label-width="80px"
                        class="demo-ruleForm" label-position="left" style="margin: 0 auto;">
                        <el-form-item label="问题标题" prop="title">
                            <el-input v-model="editForm.title" placeholder="请输入问题标题"></el-input>
                        </el-form-item>
                        <el-form-item label="排序序号" prop="number">
                            <el-input v-model="editForm.number" placeholder="请输入排序序号"></el-input>
                        </el-form-item>
                        <el-form-item label="问题答案" prop="answer">
                            <!-- <mavon-editor v-model="editForm.answer" ref="md2" @imgAdd="$imgAdd2"  @change="changes" :toolbars="toolbars" /> -->

                            <tinymce-editor ref='tinymce1' :init='init' v-model="editForm.answer"></tinymce-editor>

                        </el-form-item>
                        <el-form-item label=" ">
                            <el-button style="background-color: rgb(54,116,255); color: white; margin-bottom: 10px;"
                                @click='getedit()'>
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
    const axios = require("axios");
    export default {
        data() {
            return {
                activeIndex2: "1",
                token: localStorage.getItem("token"),
                pageNum: 1,
                pageSize: 10,
                pagetotal: 0,
                // 搜索
                formInline: {
                    title: ''
                },
                ruleForm: {
                    title: '',
                    number: '',
                    answer: ''
                },

                rules: {
                    title: [
                        { required: true, message: '请输入问题标题', trigger: 'change' },
                    ],
                    answer: [
                        { required: true, trigger: 'change' },
                    ],
                },

                // 添加
                addVisible: false,

                // 编辑
                editVisible: false,
                editForm: {
                    title: '',
                    number: '',
                    answer: '',
                    id: ''
                },

                editrules: {
                    title: [
                        { required: true, message: '请输入问题标题', trigger: 'change' },
                    ],
                    answer: [
                        { required: true, trigger: 'change' },
                    ],
                },

                // 详情
                detailsVisible: false,
                // detailsconter:'',
                detailsC: {},

                tableData: [],

                queIds: [],//选择删除id
                html: '',
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
            // 列表
            // getQuestionList() {
            //     this.$api.post({
            //         path: '/manage/getQuestionList',
            //         params: {
            //             token: this.token,
            //             queTitle: ''
            //         }, success: (data) => {
            //             console.log(data)
            //             this.tableData = data.data.list
            //             this.pagetotal = data.data.total
            //         }
            //     })
            // },

            // 搜索
            getfind() {
                this.$api.post({
                    path: '/manage/getQuestionList',
                    params: {
                        token: this.token,
                        queTitle: this.formInline.title,
                        pageNum: this.pageNum,
                        pageSize: this.pageSize
                    }, success: (data) => {
                        console.log(data)
                        this.tableData = data.data.list
                        this.pagetotal = data.data.total
                        // this.getQuestionList()
                    }
                })
            },
            // 富文本转html

            // 添加
            getAdd() {
                if (this.ruleForm.title == '' || this.ruleForm.answer == '') {
                    this.$message({
                        message: '请将信息填写完整',
                        type: 'warning'
                    });
                } else {
                    this.$api.post({
                        path: '/manage/operationQuestion',
                        params: {
                            token: this.token,
                            queTitle: this.ruleForm.title,
                            content: this.ruleForm.answer,
                            ordid: this.ruleForm.number,
                            type: 1
                        }, success: (data) => {
                            console.log(data)
                            if (data.code == 1) {
                                this.$message({
                                    message: data.msg,
                                    type: 'success'
                                });
                                this.getfind()
                                this.ruleForm.title = ''
                                this.ruleForm.answer = ''
                                this.ruleForm.number = ''
                                this.addVisible = false
                            }
                        }
                    })
                }
            },

            // 删除
            handleSelectionChange(val) {
                this.multipleSelection = val;
                let ids = []
                val.forEach(e => {
                    ids.push(e.queId)
                });

                this.queIds = ids
            },

            getdel() {
                if (this.queIds.length == 0) {
                    this.$message.error('请选择有问有答')
                } else {
                    this.$confirm('是否删除有问有答?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.$api.post({
                            path: '/manage/operationQuestion',
                            params: {
                                token: this.token,
                                type: 3,
                                queIds: this.queIds.join(',')
                            }, success: (data) => {
                                if (data.code == 1) {
                                    this.$message({
                                        message: data.msg,
                                        type: 'success'
                                    });
                                    this.getfind()
                                } else {
                                    this.$message({
                                        message: data.msg,
                                        type: 'warning'
                                    });
                                }
                                console.log(data)
                            }
                        })
                    })
                }


            },
            // 编辑
            edit(index, row) {
                console.log(index, row);
                this.editVisible = true
                this.editForm.title = row.queTitle
                this.editForm.answer = row.content
                this.editForm.number = row.ordid
                this.editForm.id = row.queId
            },
            getedit() {
                if (this.editForm.title == '' || this.editForm.answer == '') {
                    this.$message({
                        message: '请将信息填写完整',
                        type: 'warning'
                    });
                } else {
                    this.$api.post({
                        path: '/manage/operationQuestion',
                        params: {
                            token: this.token,
                            queTitle: this.editForm.title,
                            content: this.editForm.answer,
                            ordid: this.editForm.number,
                            queId: this.editForm.id,
                            type: 2
                        }, success: (data) => {
                            console.log(data)
                            if (data.code == 1) {
                                this.$message({
                                    message: data.msg,
                                    type: 'success'
                                });
                                this.getfind()
                                this.editVisible = false
                            }
                        }
                    })
                }

            },

            // 详情
            details(index, row) {
                console.log(index, row);
                this.detailsVisible = true

                this.$api.post({
                    path: '/manage/getQuestionDetail',
                    params: {
                        token: this.token,
                        queId: row.queId
                    }, success: (data) => {
                        console.log(data)
                        this.detailsC = data.data
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
                this.pageNum = val
                this.getfind()
            }
        },
        mounted() {
            this.getfind()
        }, computed: {
            init() {
                let self = this
                return {
                    language_url: 'tinymce/langs/zh_CN.js',
                    language: 'zh_CN',
                    skin_url: 'tinymce/skins/ui/oxide',
                    width: '100%',
                    height: 400,
                    plugins: 'link lists image media code table colorpicker textcolor wordcount contextmenu',
                    menubar: false,
                    toolbar: [
                        'bold italic underline strikethrough | fontsizeselect | forecolor backcolor | alignleft aligncenter alignright alignjustify ' +
                        '| bullist numlist | outdent indent blockquote | undo redo | link unlink image media | code removeformat '
                    ],
                    branding: false,
                    images_upload_handler: function (blobInfo, success, failure) {
                        console.log(blobInfo, 'imgres1');
                        self.$upload(blobInfo.blob()).then((res) => {
                            console.log(res, 'imgres');
                            var img = res.result[0].url;
                            success(img);
                        });
                    }
                }
            }
        },
    }
</script>


<style>
    * {
        padding: 0;
        margin: 0;
    }

    .questions {
        width: 100%;
        height: 100%;
    }

    .questadd p {
        margin-bottom: 10px;
    }

    .questadd .el-input {
        width: 235px;
    }

    .questions .el-dialog__header {
        padding: 12px 20px 10px
    }

    .tox-tinymce-aux {
        z-index: 9999 !important;
    }

    .questions .el-dialog__title {
        color: #606266;
        font-size: 14px;
    }

    .questions .el-dialog__body {

        padding-top: 20px;
        padding-bottom: 100px;
        border-top: 1px solid #ccc;
    }

    .questmain {
        width: 98%;
        height: 80%;
        padding: 10px 10px 0px 10px;

    }

    .questfind {
        width: 100%;

        padding-top: 10px;
        background-color: white;
        margin-bottom: 10px;
    }

    .questfind .el-form-item__content {
        width: 160px;
    }

    .questdata {
        width: 98%;
        height: 100%;
        padding: 10px 20px;
        background-color: white;
    }

    .questdata .iconfont {
        font-size: 12px;
    }

    .questdata .recovery {
        background-color: rgb(48, 216, 192);
        color: white;
        border: 0px;
    }

    .questdata .disable {
        background-color: rgb(255, 102, 0);
        color: white;
        border: 0px;
    }

    .questdata .delete {
        background-color: rgb(234, 74, 92);
        color: white;
        border: 0px;
    }

    .questdata .commonbtn {
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