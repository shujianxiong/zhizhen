<template>
    <div class="inforbox">
        <el-menu :default-active="activeIndex2" class="el-menu-demo" mode="horizontal" @select="handleSelect"
            background-color="white" text-color="#f999" active-text-color="rgb(18,42,136)">
            <el-menu-item index="1">热点资讯</el-menu-item>
        </el-menu>

        <div class="informain">
            <div class="inforfind">
                <el-form :inline="true" :model="formInline" class="demo-form-inline" size="small"
                    style="margin-left: 10px" label-position='left'>
                    <el-form-item>
                        <el-input v-model="formInline.title" placeholder="请输入资讯标题"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-select v-model="formInline.type" placeholder="请选择类型">
                            <el-option label="请选择类型" value=""></el-option>
                            <el-option label="图文" value="1"></el-option>
                            <el-option label="视频" value="2"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button style="background-color: rgb(54, 116, 255); color: white" icon="el-icon-search"
                            @click="getfind">查询
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>

            <div class="infordata">
                <el-row style="margin-bottom: 12px">
                    <el-button size="small" class="commonbtn" icon="el-icon-plus" @click="addVisible=true">添加
                    </el-button>
                    <el-button size="small" class="delete" icon="el-icon-close" @click='getdelete'>删除</el-button>
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
                    <el-table-column prop="infoTitle" label="资讯标题"> </el-table-column>
                    <el-table-column prop="createTime" label="发布时间"> </el-table-column>
                    <el-table-column label="类型">
                        <template slot-scope="scope">
                            <p v-show="scope.row.infoType == 1">图文</p>
                            <p v-show="scope.row.infoType == 2">视频</p>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="200">
                        <template slot-scope="scope">
                            <el-button size="mini" type="primary" @click="details(scope.$index, scope.row)">详情
                            </el-button>
                            <el-button size="mini" type="primary" @click="edit(scope.$index, scope.row)">编辑
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="page" style="position: relative;">
                    <div class="grid-content bg-purple-light" style="position: absolute; right: 0;">
                        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                            :current-page="pageNum" :page-size="pageSize"
                            layout="total, sizes, prev, pager, next, jumper" :total="pagetotal">
                        </el-pagination>
                    </div>
                </div>
            </div>
        </div>

        <el-dialog title="添加" :visible.sync="addVisible" width="835px" class="banneradd">
            <div class="information">
                <div style="width: 100%; margin: 0 auto; ">
                    <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm"
                        label-position='left' :inline="true">
                        <el-form-item label="资讯标题" required>
                            <el-input v-model="ruleForm.imgname" placeholder="请输入资讯标题"></el-input>
                        </el-form-item>
                        <br>
                        <el-form-item label="图片" required>
                            <el-upload action="" list-type="picture-card" accept=".jpg,.jpeg,.png,.JPG,.JPEG,.PNG"
                                :http-request="uploadImgs" :show-file-list="false">
                                <i class="el-icon-camera-solid"></i>
                            </el-upload>
                            <div class="userimage">
                                <img v-if="imgurl" :src="imgurl" class="avatar" />
                            </div>
                            <p class="pbox">推荐尺寸为220*160</p>
                        </el-form-item>
                        <br>
                        <el-form-item label="选择类型" prequired>
                            <el-radio-group v-model="ruleForm.resource" @change="agreeChange">
                                <el-radio :label="1" value='1'>图文</el-radio>
                                <el-radio :label="2" value='2'>视频</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <br>
                        <el-form-item label="html文件" required v-show='ruleForm.resource==1'>
                            <!-- <mavon-editor v-model="ruleForm.html" :value="ruleForm.html" :ishljs="true" ref="md"
                                @imgAdd="$imgAdd" @change="change" :toolbars="toolbars" /> -->

                            <tinymce-editor ref='tinymce' :init='init' v-model="ruleForm.html"></tinymce-editor>
                        </el-form-item>
                        <br>
                        <el-form-item label="视频" required v-show='ruleForm.resource==2'>
                            <el-upload class="upload-demo" action="" :http-request="vuploadImgs" accept=".mp4"
                                :show-file-list="false">
                                <el-button size="small" icon="el-icon-upload" style="
                                  margin-top: 10px;
                                  background-color: rgb(54, 116, 255);
                                  color: white;
                                ">上传
                                </el-button>
                            </el-upload>
                            <div class="userimage">
                                <video v-if="vimgurl" :src="vimgurl" class="avatar" width="200" height="100"
                                    controls></video>
                            </div>
                        </el-form-item>
                        <br>

                        <el-form-item label=" ">
                            <el-button style="background-color: rgb(54,116,255); color: white;" @click="addInfo()">
                                确定
                            </el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </el-dialog>
        <el-dialog title="详情" :visible.sync="detailsVisible" width="45%" class="banneradd">
            <div class="information">
                <div style="width: 100%; margin: 0 auto; ">
                    <p style="margin-bottom: 10px;">资讯标题：{{detailsf.infoTitle}}</p>
                    <p style="margin-bottom: 10px;">
                        封面图：
                        <br>
                        <img :src="detailsf.coverImg" alt="" style="width: 135px;height: 75px;">
                    </p>
                    <p style="margin-bottom: 10px;">类型：{{detailsf.infoType==1?'图文':'视频'}}</p>

                    <div v-show="detailsf.infoType == '1'">
                        <p>图文详情：</p>
                        <!-- <mavon-editor v-model="detailsf.content" :toolbars="toolbars" /> -->
                        <tinymce-editor ref='tinymce2' :init='init' v-model="detailsf.content"></tinymce-editor>
                    </div>
                    <div v-show="detailsf.infoType == '2'">
                        <p>视频：</p>
                        <video :src="detailsf.content" initial-time="0" autoplay="false" controls>
                        </video>
                    </div>
                </div>
            </div>
        </el-dialog>

        <el-dialog title="编辑" :visible.sync="editVisible" width="835px" class="banneradd">
            <div class="information">
                <div style="width: 100%; margin: 0 auto; ">
                    <el-form :model="editf" ref="editf" label-width="100px" class="demo-ruleForm" label-position='left'
                        :inline="true">
                        <el-form-item label="资讯标题" required>
                            <el-input v-model="editf.imgname" placeholder="请输入资讯标题"></el-input>
                        </el-form-item>
                        <br>
                        <el-form-item label="封面图" required>
                            <el-upload action="" list-type="picture-card" accept=".jpg,.jpeg,.png,.JPG,.JPEG,.PNG"
                                :http-request="EuploadImgs" :show-file-list="false">
                                <i class="el-icon-camera-solid"></i>
                            </el-upload>
                            <div class="userimage">
                                <img v-if="editf.imgurl" :src="editf.imgurl" class="avatar" />
                            </div>
                            <p>推荐尺寸为220*160</p>
                        </el-form-item>
                        <br>
                        <el-form-item label="选择类型" required>
                            <el-radio-group v-model="editf.resource">
                                <el-radio v-model="editf.resource" :label="'1'">图文</el-radio>
                                <el-radio v-model="editf.resource" :label="'2'">视频</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <br>
                        <el-form-item label="html文件" required v-show='editf.resource==1'>
                            <!-- <mavon-editor v-model="editf.html" ref="md" @imgAdd="$imgAdd2" @change="changes"
                                :toolbars="toolbars" /> -->

                            <tinymce-editor ref='tinymce3' :init='init' v-model="editf.html"></tinymce-editor>
                        </el-form-item>
                        <br>
                        <el-form-item label="视频" required v-show='editf.resource==2'>
                            <el-upload class="upload-demo" action="" :http-request="EvuploadImgs" accept=".mp4"
                                :show-file-list="false">
                                <el-button size="small" icon="el-icon-upload" style="
                                  margin-top: 10px;
                                  background-color: rgb(54, 116, 255);
                                  color: white;
                                ">上传
                                </el-button>
                            </el-upload>
                            <div class="userimage">
                                <video v-if="editf.vimgurl" :src="editf.vimgurl" class="avatar" width="200" height="100"
                                    controls></video>
                            </div>
                        </el-form-item>
                        <br>

                        <el-form-item label=" ">
                            <el-button style="background-color: rgb(54,116,255); color: white;" @click='EaddInfo'>
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
    // import config from '@/config/index'
    const axios = require("axios");
    export default {
        data() {
            return {
                activeIndex2: "1",
                pageNum: 1,
                pageSize: 10,
                token: localStorage.getItem('token'),
                pagetotal: 0,
                formInline: {
                    title: '',
                    type: ''
                },

                tableData: [],

                // 添加
                addVisible: false,

                // 详情
                detailsVisible: false,

                // 编辑
                editVisible: false,

                ruleForm: {
                    imgname: '',
                    type: '',
                    link: '',
                    goodsName: '',
                    ordid: '',
                    html: '',
                    resource: 1,
                    infoTitle: ''
                },
                rules: {
                    imgname: [
                        { required: true, message: '请输入图片名称', trigger: 'change' },
                    ],
                    resource: [
                        { required: true, message: '请选择类型', trigger: 'change' }
                    ],
                    goodsName: [
                        { required: true, message: '请选择商品', trigger: 'change' },
                    ],
                    pic: [
                        { required: true, trigger: 'change' }
                    ],
                    html: [
                        { required: true, trigger: 'change' }
                    ]
                },


                imageUrl: '',
                imgurl: '',

                // 上传视频
                vUrl: "",
                vimgurl: "",

                detailsf: {
                    content: '',
                    coverImg: '',
                    infoTitle: '',
                    infoType: '',
                },


                // 编辑
                editf: {
                    imgname: '',
                    type: '',
                    link: '',
                    goodsName: '',
                    ordid: '',
                    html: '',
                    resource: "1",
                    infoTitle: '',
                    imageUrl: '',
                    imgurl: '',
                    infoId: '',
                    // 上传视频
                    vUrl: "",
                    vimgurl: "",
                },
                erules: {
                    imgname: [
                        { required: true, message: '请输入图片名称', trigger: 'change' },
                    ],
                    resource: [
                        { required: true, message: '请选择类型', trigger: 'change' }
                    ],
                    goodsName: [
                        { required: true, message: '请选择商品', trigger: 'change' },
                    ],
                    pic: [
                        { required: true, trigger: 'change' }
                    ],
                    html: [
                        { required: true, trigger: 'change' }
                    ]
                },
                infoIds: [],
                html: '',
            }
        },
        methods: {
            handleSelect(key, keyPath) {
                console.log(key, keyPath);
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
                let infoIds = []
                val.forEach(e => {
                    infoIds.push(e.infoId)
                });

                this.infoIds = infoIds
            },
            getRowClass({ rowIndex }) {
                if (rowIndex == 0) {
                    return 'background:RGB(242,242,242)'
                } else {
                    return ''
                }
            },
            // 富文本转html
            change(value, render) {
                // render 为 markdown 解析后的结果[html]
                this.html = render;
            },
            changes(value, render) {
                // render 为 markdown 解析后的结果[html]
                this.html = render;
            },

            // // 资讯列表
            // getInfoList() {
            //     this.$api.post({
            //         path: '/manage/getInfoList',
            //         params: {
            //             token: this.token,
            //             infoTitle: '',
            //             infoType: ''
            //         }, success: (data) => {
            //             console.log(data)
            //             this.tableData = data.data.list
            //             this.pagetotal = data.data.total
            //         }
            //     })
            // },



            // 选择类型
            getchange(val) {
                console.log(val)
                this.formInline.type = val
            },
            // 搜索
            getfind() {
                this.$api.post({
                    path: '/manage/getInfoList',
                    params: {
                        token: this.token,
                        infoTitle: this.formInline.title,
                        infoType: this.formInline.type,
                        pageNum: this.pageNum,
                        pageSize: this.pageSize,
                    }, success: (data) => {
                        console.log(data)
                        this.tableData = data.data.list
                        this.pagetotal = data.data.total
                    }
                })
            },

            // 添加
            addInfo() {
                if (this.ruleForm.imgname == '' || this.imageUrl == '') {
                    this.$message({
                        message: '请将信息填写完整',
                        type: 'warning'
                    });
                } else {
                    if (this.ruleForm.resource == 1) {
                        if (this.ruleForm.html == '') {
                            this.$message({
                                message: '请填写html文件',
                                type: 'warning'
                            });
                        } else {
                            this.ruleForm.infoTitle = this.ruleForm.html
                            this.$api.post({
                                path: '/manage/addInfo',
                                params: {
                                    token: this.token,
                                    type: 1,
                                    infoTitle: this.ruleForm.imgname,
                                    coverImg: this.imageUrl,
                                    infoType: this.ruleForm.resource,
                                    content: this.ruleForm.infoTitle
                                }, success: (data) => {
                                    console.log(data)
                                    if (data.code == 1) {
                                        this.getfind()
                                        this.addVisible = false
                                        this.$message({
                                            message: data.msg,
                                            type: 'success'
                                        });

                                        this.ruleForm.imgname = ''
                                        this.imgurl = ''
                                        this.ruleForm.html = ''
                                        this.ruleForm.infoTitle = ''
                                        this.imageUrl = ''
                                    }
                                }
                            })
                        }

                    } else {
                        this.ruleForm.infoTitle = this.vUrl
                        this.$api.post({
                            path: '/manage/addInfo',
                            params: {
                                token: this.token,
                                type: 1,
                                infoTitle: this.ruleForm.imgname,
                                coverImg: this.imageUrl,
                                infoType: this.ruleForm.resource,
                                content: this.ruleForm.infoTitle
                            }, success: (data) => {
                                console.log(data)
                                if (data.code == 1) {
                                    this.getfind()
                                    this.addVisible = false
                                    this.$message({
                                        message: data.msg,
                                        type: 'success'
                                    });

                                    this.ruleForm.imgname = ''
                                    this.vimgurl = ''
                                    this.ruleForm.html = ''
                                    this.ruleForm.infoTitle = ''
                                    this.imageUrl = ''
                                }

                            }
                        })
                    }

                }
            },

            // 详情
            details(index, row) {
                console.log(index, row);
                this.detailsVisible = true;

                this.$api.post({
                    path: '/manage/getInfoDetails',
                    params: {
                        token: this.token,
                        infoId: row.infoId
                    }, success: (data) => {
                        console.log(data)
                        this.detailsf.content = data.data.content
                        this.detailsf.coverImg = data.data.coverImg
                        this.detailsf.infoTitle = data.data.infoTitle
                        this.detailsf.infoType = data.data.infoType
                    }
                })
            },

            // 编辑
            edit(index, row) {

                this.editVisible = true
                this.$api.post({
                    path: '/manage/getInfoDetails',
                    params: {
                        token: this.token,
                        infoId: row.infoId
                    }, success: (data) => {
                        console.log(data)

                        console.log(index, row);
                        // this.detailsf.content = data.data.content
                        this.editf.imgurl = data.data.coverImg
                        this.editf.imgname = data.data.infoTitle
                        this.editf.resource = data.data.infoType
                        this.editf.infoId = data.data.infoId
                        if (data.data.infoType == 1) {

                            this.editf.html = data.data.content
                        } else {
                            this.editf.vimgurl = data.data.content
                        }

                        this.eagreeChange(data.data.infoType)
                        // this.ToText()
                    }
                })
            },

            ToText() {
                var input = this.editf.html;
                return input.replace(/<(style|script|iframe)[^>]*?>[\s\S]+?<\/\1\s*>/gi, '').replace(/<[^>]+?>/g, '').replace(/\s+/g, ' ').replace(/ /g, ' ').replace(/>/g, ' ');

            },

            eagreeChange(val) {
                this.editf.resource = val
                console.log(val)
            },

            // 编辑
            EaddInfo() {

                if (this.editf.resource == 1) {
                    this.editf.infoTitle = this.editf.html
                    if (this.editf.html == '') {
                        this.$message({
                            message: '请将信息填写完整',
                            type: 'warning'
                        });
                    } else {
                        this.$api.post({
                            path: '/manage/addInfo',
                            params: {
                                token: this.token,
                                type: 2,
                                infoId: this.editf.infoId,
                                infoTitle: this.editf.imgname,
                                coverImg: this.editf.imageUrl,
                                infoType: this.editf.resource,
                                content: this.editf.infoTitle
                            }, success: (data) => {
                                console.log(data)
                                if (data.code == 1) {
                                    this.getfind()

                                    this.$message({
                                        message: data.msg,
                                        type: 'success'
                                    });

                                    this.editVisible = false
                                }
                            }
                        })
                    }


                } else {
                    this.editf.infoTitle = this.editf.vUrl
                    if (this.editf.vimgurl == '') {
                        this.$message({
                            message: '请上传视频',
                            type: 'warning'
                        });
                    } else {
                        this.$api.post({
                            path: '/manage/addInfo',
                            params: {
                                token: this.token,
                                type: 2,
                                infoId: this.editf.infoId,
                                infoTitle: this.editf.imgname,
                                coverImg: this.editf.imageUrl,
                                infoType: this.editf.resource,
                                content: this.editf.infoTitle
                            }, success: (data) => {
                                console.log(data)
                                if (data.code == 1) {
                                    this.getfind()

                                    this.$message({
                                        message: data.msg,
                                        type: 'success'
                                    });
                                    this.editVisible = false
                                }

                            }
                        })
                    }

                }
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
            },
            uploadImgs(file) {
                this.$uploadFiles('http://manager.zhizhennengyuan.com:8000/mfxapi/multifileupload', file.file).then(res => {
                    // this.$uploadFiles('http://10.77.10.90:8080/mfxapi/multifileupload', file.file).then(res => {
                    this.imageUrl = res.result[0].relative_url
                    this.imgurl = res.result[0].url
                    console.log(res, 'res2')
                })
            },

            // 上传视频
            vuploadImgs(file) {
                this.$uploadFiles(
                    "http://manager.zhizhennengyuan.com:8000/mfxapi/multifileupload",
                    file.file
                ).then((res) => {
                    this.vUrl = res.result[0].relative_url;
                    this.vimgurl = res.result[0].url;
                    console.log(res, "res2");
                });
            },

            // 编辑
            EuploadImgs(file) {
                this.$uploadFiles('http://manager.zhizhennengyuan.com:8000/mfxapi/multifileupload', file.file).then(res => {
                    // this.$uploadFiles('http://10.77.10.90:8080/mfxapi/multifileupload', file.file).then(res => {
                    this.editf.imageUrl = res.result[0].relative_url
                    this.editf.imgurl = res.result[0].url
                    console.log(res, 'res2')
                })
            },

            // 上传视频
            EvuploadImgs(file) {
                this.$uploadFiles(
                    "http://manager.zhizhennengyuan.com:8000/mfxapi/multifileupload",
                    file.file
                ).then((res) => {
                    this.editf.vUrl = res.result[0].relative_url;
                    this.editf.vimgurl = res.result[0].url;
                    console.log(res, "res2");
                });
            },
            agreeChange(val) {
                this.ruleForm.resource = val
                console.log(val)
            },


            getdelete() {
                if (this.infoIds.join(',') == '') {
                    this.$message({
                        message: '请选择要删除的信息',
                        type: 'warning'
                    });
                } else {
                    this.$api.post({
                        path: '/manage/addInfo',
                        params: {
                            token: this.token,
                            type: 3,
                            infoIds: this.infoIds.join(','),
                        }, success: (data) => {
                            console.log(data)
                            if (data.code == 1) {
                                this.getfind()
                                this.editVisible = false
                                this.$message({
                                    message: data.msg,
                                    type: 'success'
                                });
                            }
                        }
                    })
                }

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
        cursor: default;
    }

    .inforbox {
        width: 100%;
        height: 100%;
    }

    .tox-tinymce-aux {
        z-index: 9999 !important;
    }

    .informain {
        width: 98%;
        height: 80%;
        padding: 10px 10px 0px 10px;

    }

    .inforfind {
        width: 100%;

        padding-top: 10px;
        background-color: white;
        margin-bottom: 10px;
    }

    .inforfind .el-form-item__content {
        width: 160px;
    }

    .infordata {
        width: 98%;
        height: 100%;
        padding: 10px 20px;
        background-color: white;
    }

    .infordata .recovery {
        background-color: rgb(48, 216, 192);
        color: white;
        border: 0px;
    }

    .infordata .disable {
        background-color: rgb(255, 102, 0);
        color: white;
        border: 0px;
    }

    .infordata .delete {
        background-color: rgb(234, 74, 92);
        color: white;
        border: 0px;
    }

    .infordata .commonbtn {
        /* height: 30px; */
        background-color: rgb(54, 116, 255);
        color: white;
        border: 0px;
    }

    .table th,
    td {
        text-align: center !important;
        /* height: 30px; */
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

    .inforbox .el-form-item__label {
        padding: 0px;
    }

    .inforbox .el-upload--picture-card {
        width: 65px;
        height: 65px;
        line-height: 65px;
    }

    .inforbox .el-upload--picture-card i {
        font-size: 20px;
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

    .inforbox .el-dialog__header {
        padding: 12px 20px 10px;
    }

    .inforbox .el-dialog__title {
        color: #606266;
        font-size: 14px;
    }

    .inforbox .el-dialog__body {
        padding-top: 20px;
        padding-bottom: 100px;
        border-top: 1px solid #ccc;
    }

    .pbox {
        font-size: 10px;
        color: #999;
    }
</style>