<!-- 商品分类 -->
<template>
    <div class="goodsclass">
        <el-menu :default-active="activeIndex2" class="el-menu-demo" mode="horizontal" @select="handleSelect"
            background-color="white" text-color="#f999" active-text-color="rgb(18,42,136)">
            <el-menu-item index="1">商品分类</el-menu-item>
        </el-menu>

        <div class="gClassmain">
            <!-- 搜索 -->
            <div class="classfind">
                <el-form :inline="true" :model="formInline" class="demo-form-inline" size='small'
                    style="margin-left: 10px;">
                    <el-form-item>
                        <el-input v-model="formInline.classA" placeholder="请输入一级分类"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button style="background-color: rgb(54,116,255); color: white;" icon="el-icon-search"
                            @click='getfind'>查询
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>

            <!-- 表单 -->
            <div class="classdata">
                <el-row style="margin-bottom: 12px;">
                    <el-button type="primary" size="small" icon="el-icon-plus" @click="addVisible=true">添加</el-button>
                    <el-button size="small" class="delete" icon="el-icon-close" @click="outVisible=true">删除</el-button>
                </el-row>

                <el-table ref="multipleTable" border :data="tableData" tooltip-effect="dark" 
                    style="margin-bottom: 15px;" class="table" :header-cell-style="getRowClass"
                    @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="80">
                    </el-table-column>
                    <el-table-column label="id" width="80">
                        <template slot-scope="scope">
                            {{scope.$index+1}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="cateName" label="一级分类">
                    </el-table-column>
                    <el-table-column prop="ordid" label="排序">
                    </el-table-column>
                    <el-table-column label="图片">
                        <template slot-scope="scope">
                            <img :src="scope.row.cateImg" height="50" width="50" />
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="245">
                        <template slot-scope="scope">
                            <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑
                            </el-button>
                            <el-button size="mini" type="primary" @click="classB(scope.$index, scope.row)">二级分类
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

        <!-- 编辑 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%" class="editbox" :close-on-click-modal="false">
            <div class="information">
                <div style="width: 80%; margin: 0 auto; ">
                    <el-form :model="ruleForm" :rules="rules" label-position="left" ref="ruleForm" label-width="100px"
                        class="demo-ruleForm" style="margin: 0 auto;">
                        <el-form-item label="一级分类" prop="classA">
                            <el-input v-model="ruleForm.classA" placeholder="请输入一级分类"></el-input>
                        </el-form-item>
                        <el-form-item label="排序序号">
                            <el-input v-model="ruleForm.sortNo" placeholder="请输入排序序号">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="图片" prop="pic">
                            <el-upload class="upload-demo" action="" accept=".jpg,.jpeg,.png,.JPG,.JPEG,.PNG"
                                :http-request="uploadImgs" :show-file-list="false">
                                <el-button size="small" icon="el-icon-upload"
                                    style="margin-top: 10px;background-color: rgb(54,116,255); color: white;">上传
                                </el-button>
                                <div slot="tip" class="el-upload__tip">推荐尺寸为80*80</div>
                            </el-upload>
                            <div class="userimage">
                                <img v-show="imageUrl==''" :src="imgurl" alt="" />
                                <img v-if="imgurl" :src="imgurl" class="avatar">
                            </div>
                        </el-form-item>
                        <div class="submitbtn"
                            style="background-color: rgb(54,116,255); color: white;width: 72px; height: 32px;line-height: 32px;"
                            @click='editVisible=false,getEditA()'>确定</div>
                    </el-form>
                </div>
            </div>
        </el-dialog>

        <!-- 添加 -->
        <el-dialog title="添加" :visible.sync="addVisible" width="30%" class="editbox" :close-on-click-modal="false">
            <div class="information">
                <div style="width: 80%; margin: 0 auto; ">
                    <el-form :model="addForm" :rules="addrules" label-position="left" ref="addForm" label-width="100px"
                        class="demo-ruleForm" style="margin: 0 auto;">
                        <el-form-item label="一级分类" prop="classA">
                            <el-input v-model="addForm.classA" placeholder="请输入一级分类"></el-input>
                        </el-form-item>
                        <el-form-item label="排序序号">
                            <el-input v-model="addForm.sortNo" placeholder="请输入排序序号">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="图片" prop="pic">
                            <el-upload class="upload-demo" action="" accept=".jpg,.jpeg,.png,.JPG,.JPEG,.PNG"
                                :http-request="uploadImgs" :show-file-list="false">
                                <el-button size="small" icon="el-icon-upload"
                                    style="margin-top: 10px;background-color: rgb(54,116,255); color: white;">上传
                                </el-button>
                                <div slot="tip" class="el-upload__tip">推荐尺寸为80*80</div>
                            </el-upload>
                            <div class="userimage">
                                <img v-if="imgurl" :src="imgurl" class="avatar">
                            </div>
                        </el-form-item>
                        <div class="submitbtn"
                            style="background-color: rgb(54,116,255); color: white;width: 72px; height: 32px;line-height: 32px;"
                            @click='getOneCategoryList()'>确定</div>
                    </el-form>
                </div>
            </div>
        </el-dialog>

        <!-- 二级分类 -->
        <el-dialog title="二级分类" :visible.sync="classBVisible" width="560px" class="editbox">
            <div class="information">
                <div style="width: 80%; margin: 0 auto; ">
                    <el-form :model="classBForm" :rules="classBrules" label-position="left" ref="classBForm"
                        label-width="100px" class="demo-ruleForm" style="margin: 0 auto; margin-bottom: 20px;">
                        <el-form-item label="二级分类" prop="classB">
                            <el-input v-model="classBForm.classB" placeholder="请输入二级分类"></el-input>
                        </el-form-item>
                        <el-form-item label="排序序号">
                            <el-input v-model="classBForm.sortNo" placeholder="请输入排序序号">
                            </el-input>
                        </el-form-item>
                        <div class="submitbtn"
                            style="background-color: rgb(54,116,255); color: white;width: 72px; height: 32px;line-height: 32px;"
                            @click='getclassBadd'>添加</div>
                    </el-form>
                    <el-table ref="multipleTable" border :data="classBData" tooltip-effect="dark"
                        style="margin-bottom: 15px;" class="table" :header-cell-style="getRowClass"
                        @selection-change="handleSelectionChange">
                        <el-table-column label="id" width="50">
                            <template slot-scope="scope">
                                {{scope.$index+1}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="cateName" label="二级分类">
                        </el-table-column>
                        <el-table-column prop="ordid" label="排序序号">
                        </el-table-column>
                        <el-table-column label="操作" width="200">
                            <template slot-scope="scope">
                                <el-button size="mini" type="primary" @click="classbEdit(scope.$index, scope.row)">编辑
                                </el-button>
                                <el-button size="small" class="delete" @click='classbDel(scope.$index, scope.row)'>删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </el-dialog>

        <!-- 编辑二级分类 -->
        <el-dialog title="编辑二级分类" :visible.sync="editclassB" width="600px" class="editbox" :close-on-click-modal="false">
            <div class="information">
                <div style="width: 80%; margin: 0 auto; ">
                    <el-form :model="editBForm" :rules="editBrules" label-position="left" ref="editBForm"
                        label-width="100px" class="demo-ruleForm" style="margin: 0 auto; margin-bottom: 20px;">
                        <el-form-item label="二级分类" prop="classB">
                            <el-input v-model="editBForm.classB" placeholder="请输入二级分类"></el-input>
                        </el-form-item>
                        <el-form-item label="排序序号">
                            <el-input v-model="editBForm.sortNo" placeholder="请输入排序序号">
                            </el-input>
                        </el-form-item>
                        <div class="submitbtn"
                            style="background-color: rgb(54,116,255); color: white;width: 72px; height: 32px;line-height: 32px;"
                            @click='getclassbEdit()'>确定</div>
                    </el-form>
                </div>
            </div>
        </el-dialog>
        <el-dialog title="删除" :visible.sync="outVisible" width="30%">
            <span>确认删除？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="outVisible = false">取 消</el-button>
                <el-button type="primary" @click="(outVisible = false), getdelte()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                activeIndex2: '1',
                pagetotal: 0,//总页码
                pageSize: 10,
                pageNum: 1,
                token: localStorage.getItem('token'),

                outVisible: false,

                formInline: {
                    classA: ''
                },
                currentPage: 1,
                tableData: [],
                editVisible: false,//编辑
                ruleForm: {
                    classA: '',
                    sortNo: '',
                    cateId: ''
                },
                rules: {
                    classA: [
                        { required: true, message: '请输入一级分类', trigger: 'change' },
                    ],
                    pic: [
                        { required: true, message: '请上传图片' },
                    ]
                },


                addVisible: false,//添加
                addForm: {
                    classA: '',
                    sortNo: '',

                },
                addrules: {
                    classA: [
                        { required: true, message: '请输入一级分类', trigger: 'change' },
                    ],
                    pic: [
                        { required: true, message: '请上传图片' },
                    ]
                },


                classBVisible: false,//二级分类
                classBid: '',
                parentCateId: '',
                classBForm: {
                    classB: '',
                    sortNo: '',
                },
                classBrules: {
                    classB: [
                        { required: true, message: '请输入二级分类', trigger: 'change' },
                    ],
                },
                classBData: [],

                // 编辑二级分类
                editclassB: false,//二级分类
                CateId: '',
                editBForm: {
                    classB: '',
                    sortNo: '',

                },
                editBrules: {
                    classB: [
                        { required: true, message: '请输入二级分类', trigger: 'change' },
                    ],
                },
                imageUrl: '',
                imgurl: '',
                cateIds: [],
            }
        },
        methods: {
            handleSelect(key, keyPath) {
                console.log(key, keyPath);
            },


            //一级分类列表
            getGoodslist() {
                this.$api.post({
                    path: '/manage/getOneCategoryList',
                    params: {
                        token: this.token,
                        cateName: '',//分类名称
                        type: 1,//1列表、2添加、3删除、4编辑
                    },
                    success: (data) => {
                        console.log(data)
                        this.tableData = data.data.list
                        this.pagetotal = data.data.total
                    }
                })
            },

            // 搜索
            getfind() {
                this.$api.post({
                    path: '/manage/getOneCategoryList',
                    params: {
                        token: this.token,
                        cateName: this.formInline.classA,//分类名称
                        type: 1,//1列表、2添加、3删除、4编辑
                    },
                    success: (data) => {
                        console.log(data)
                        this.tableData = data.data.list
                        this.pagetotal = data.data.total
                    }
                })
            },



            getRowClass({ rowIndex }) {
                if (rowIndex == 0) {
                    return 'background:RGB(242,242,242)'
                } else {
                    return ''
                }
            },
            submitbtn() {
                this.editVisible = false
            },
            addsubmitbtn() {
                this.addVisible = false
            },
            // 分页
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
                this.pageSize = val
                this.getGoodslist()
            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
                this.pageNum = val
                this.getGoodslist()
            },

            uploadImgs(file) {
                // this.$uploadFiles('http://10.77.10.90:8080/mfxapi/fileupload', file.file).then(res => {/
                this.$uploadFiles('http://manager.zhizhennengyuan.com:8000/mfxapi/multifileupload', file.file).then(res => {
                    this.imageUrl = res.result[0].relative_url
                    this.imgurl = res.result[0].url
                    console.log(res, 'res2')
                })
            },

            // 添加一级分类产品
            getOneCategoryList() {
                if (this.addForm.classA == '' || this.imageUrl == '' || this.imgurl == '') {
                    this.$message.error('请将信息填写完整')
                    return
                } else {
                    this.$api.post({
                        path: '/manage/getOneCategoryList',
                        params: {
                            token: this.token,
                            type: 2,
                            cateName: this.addForm.classA,
                            cateImg: this.imageUrl,
                            ordid: this.addForm.sortNo
                        }, success: (data) => {
                            console.log(data)

                            if (data.code == 1) {
                                this.$message({
                                    message: data.msg,
                                    type: 'success'
                                });
                                this.addForm.classA = ''
                                this.imageUrl = ''
                                this.addForm.sortNo = ''
                                this.imgurl = ''
                                this.addVisible = false
                                this.getGoodslist()
                            } else if (data.code == -1) {
                                this.$message({
                                    message: data.msg,
                                    type: 'warning'
                                });
                            }

                        }
                    })
                }


            },

            //获取一级分类id
            // 获取用户id
            handleSelectionChange(val) {
                this.multipleSelection = val;

                let ids = []
                val.forEach(e => {
                    ids.push(e.cateId)
                })

                this.cateIds = ids
                console.log(ids, '用户id')
            },

            getdelte() {
                this.$api.post({
                    path: '/manage/getOneCategoryList',
                    params: {
                        token: this.token,
                        cateIds: this.cateIds.join(','),
                        type: 3
                    },
                    success: (data) => {
                        if (data.code == 1) {
                            this.$message({
                                message: data.msg,
                                type: 'success'
                            });
                            this.getGoodslist()
                        } else {
                            this.$message({
                                message: data.msg,
                                type: 'warning'
                            });
                        }
                        console.log(data)
                    }
                })
            },

            // 编辑
            handleEdit(index, row) {
                console.log(index, row);
                this.editVisible = true
                this.ruleForm.classA = row.cateName
                this.ruleForm.sortNo = row.ordid
                this.ruleForm.cateId = row.cateId
                this.imgurl = row.cateImg
            },

            getEditA() {
                this.$api.post({
                    path: '/manage/getOneCategoryList',
                    params: {
                        token: this.token,
                        cateId: this.ruleForm.cateId,
                        type: 4,
                        cateName: this.ruleForm.classA,
                        cateImg: this.imageUrl,
                        ordid: this.ruleForm.sortNo
                    }, success: (data) => {
                        console.log(data)
                        if (data.code == 1) {
                            this.$message({
                                message: data.msg,
                                type: 'success'
                            });
                            this.getGoodslist()
                        }
                    }
                })
            },

            // 二级分类
            classB(index, row) {
                console.log(index, row);
                this.classBVisible = true
                this.classBid = row.cateId
                // this.parentCateId = row.parentCateId
                this.getTwocateList()
            },

            // 二级分类列表
            getTwocateList() {
                this.$api.post({
                    path: '/manage/getTwoCategoryList',
                    params: {
                        token: this.token,
                        cateId: this.classBid,
                        type: 1
                    }, success: (data) => {
                        console.log(data)
                        this.classBData = data.data
                    }
                })
            },
            // 二级分类添加
            getclassBadd() {
                if (this.classBForm.classB == '') {
                    this.$message({
                        message: '请输入二级分类',
                        type: 'warning'
                    });
                } else {
                    this.$api.post({
                        path: '/manage/getTwoCategoryList',
                        params: {
                            token: this.token,
                            type: 2,
                            parentCateId: this.classBid,
                            cateName: this.classBForm.classB,
                            ordid: this.classBForm.sortNo
                        }, success: (data) => {
                            console.log(data)
                            if (data.code == 1) {
                                this.$message({
                                    message: data.msg,
                                    type: 'success'
                                });
                                this.getTwocateList()
                                this.classBForm.classB = ''
                                this.classBForm.sortNo = ''
                            } else{
                                this.$message.error(data.msg)
                            }

                        }
                    })
                }

            },
            // 二级分类编辑
            classbEdit(index, row) {
                console.log(index, row);
                this.editclassB = true
                this.CateId = row.cateId
                this.editBForm.classB = row.cateName
                this.editBForm.sortNo = row.ordid
                // this.classBVisible = false
            },
            getclassbEdit() {
                this.$api.post({
                    path: '/manage/getTwoCategoryList',
                    params: {
                        token: this.token,
                        type: 4,
                        cateId: this.CateId,
                        parentCateId: this.classBid,
                        cateName: this.editBForm.classB,
                        ordid: this.editBForm.sortNo
                    }, success: (data) => {
                        if (data.code == 1) {
                            this.$message({
                                message: data.msg,
                                type: 'success'
                            });
                            this.getTwocateList()
                            this.editclassB = false
                        }
                        console.log(data)

                    }
                })
            },

            // 二级分类删除
            classbDel(index, row) {
                console.log(index, row);
                this.$api.post({
                    path: '/manage/getTwoCategoryList',
                    params: {
                        token: this.token,
                        cateIds: row.cateId,
                        type: 3//1列表、2添加、3删除、4编辑
                    }, success: (data) => {
                        console.log(data)

                        if (data.code == 1) {
                            this.$message({
                                message: data.msg,
                                type: 'success'
                            });

                            this.getTwocateList()
                        } else if(data.code == -1){
                            this.$message({
                                message: data.msg,
                                type: 'warning'
                            });

                        }

                    }
                })
            },

        },
        mounted() {
            this.getGoodslist()
        }
    }
</script>


<style>
    * {
        padding: 0;
        margin: 0;
    }

    .goodsclass {
        width: 100%;
        height: 100%;
    }

    .gClassmain {
        /* width: 98%;
        height: 80%; */
        padding: 10px 10px 0px 10px;

    }

    .classfind {
        width: 100%;

        padding-top: 10px;
        background-color: white;
        margin-bottom: 10px;
    }

    .classfind .el-form-item__content {
        width: 160px;
    }

    .classdata {
        /* width: 98%;
        height: 100%; */
        padding: 10px 20px;
        background-color: white;

    }

    .classdata .recovery {
        background-color: rgb(48, 216, 192);
        color: white;
        border: 0px;
    }

    .classdata .disable {
        background-color: rgb(255, 102, 0);
        color: white;
        border: 0px;
    }

    .classdata .delete {
        background-color: rgb(234, 74, 92);
        color: white;
        border: 0px;
    }

    .el-table th,
    td {
        text-align: center !important;
    }

    .editbox .el-upload__tip {
        height: 20px;
        line-height: 20px;
        margin-top: 0px;
    }

    .table .delete {
        background-color: rgb(234, 74, 92);
        color: white;
        border: 0px;
    }

    .goodsclass .el-dialog__header {
        padding: 12px 20px 10px
    }

    .goodsclass .el-dialog__title {
        color: #606266;
        font-size: 14px;
    }

    .goodsclass .el-dialog__body {

        padding-top: 20px;
        padding-bottom: 100px;
        border-top: 1px solid #ccc;
    }

    /* 图片上传 */
    .userimage {
        width: 100%;
        /* height: 50px; */
    }

    .userimage img {
        width: 50px;
        height: 50px;
    }
</style>