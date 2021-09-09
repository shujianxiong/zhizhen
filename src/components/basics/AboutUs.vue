<!-- 关于我们 -->
<template>
    <div class="aboutUs">
        <el-menu :default-active="activeIndex2" class="el-menu-demo" mode="horizontal" @select="handleSelect"
            background-color="white" text-color="#f999" active-text-color="rgb(18,42,136)">
            <el-menu-item index="1">关于我们</el-menu-item>
        </el-menu>

        <div class="aboutmain">
            <div class="aboutdata">
                <el-form :model="ruleForm" ref="ruleForm" label-width="90px" class="demo-ruleForm" label-position="left"
                    style="margin: 0 auto;">
                    <el-form-item label="退货接收人" prop="returnName">
                        <el-input v-model="ruleForm.returnName" placeholder="请输入姓名"></el-input>
                    </el-form-item>
                    <el-form-item label="退货手机号" prop="returnPhone">
                        <el-input v-model="ruleForm.returnPhone" placeholder="请输入手机号"></el-input>
                    </el-form-item>
                    <el-form-item label="退货地址" prop="returnAddress">
                        <el-input v-model="ruleForm.returnAddress" placeholder="请输入地址"></el-input>
                    </el-form-item>
                </el-form>
                <div class="aboutbox">
                    <p>关于至真能源</p>
                    <div>
                        <!-- <mavon-editor v-model='ruleForm.about' ref="md" @imgAdd="$imgAdd" @change="change"
                            :toolbars="toolbars" /> -->

                        <tinymce-editor ref='tinymce' :init='init' v-model="ruleForm.about"></tinymce-editor>
                    </div>
                </div>
                <div class="aboutbox">
                    <p>注册协议</p>
                    <div>
                        <!-- <mavon-editor v-model='ruleForm.agreement' ref="md2" @imgAdd="$imgAdd2" @change="change2"
                            :toolbars="toolbars" /> -->
                            <tinymce-editor ref='tinymce' :init='init' v-model="ruleForm.agreement"></tinymce-editor>
                    </div>
                </div>
                <div class="aboutbtn" @click='updateAboutUs'>确定</div>
            </div>
        </div>
    </div>
</template>

<script>
    const axios = require("axios");
    export default {
        data() {
            return {
                activeIndex2: "1",
                currentPage: 1,
                token: localStorage.getItem('token'),

                ruleForm: {
                    returnName: '',
                    returnPhone: '',
                    returnAddress: '',
                    about: '',
                    agreement: ''
                }
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

            // 关于我们列表
            getaboutUs() {
                this.$api.post({
                    path: '/manage/aboutUs',
                    params: {
                        token: this.token
                    }, success: (data) => {
                        console.log(data)
                        this.ruleForm.returnName = data.data.return_goods_people
                        this.ruleForm.returnPhone = data.data.return_goods_phone
                        this.ruleForm.returnAddress = data.data.return_goods_address
                        this.ruleForm.about = data.data.about_us
                        this.ruleForm.agreement = data.data.registration_agreement
                    }
                })
            },

            // 提交
            updateAboutUs() {
                this.$api.post({
                    path: '/manage/updateAboutUs',
                    params: {
                        token: this.token,
                        return_goods_people: this.ruleForm.returnName,
                        return_goods_phone: this.ruleForm.returnPhone,
                        return_goods_address: this.ruleForm.returnAddress,
                        about_us: this.ruleForm.about,
                        registration_agreement: this.ruleForm.agreement
                    }, success: (data) => {
                        console.log(data)
                        if (data.code == 1) {
                            this.$message({
                                message: data.msg,
                                type: 'success'
                            });
                        }
                    }
                })
            }

        },

        mounted() {
            this.getaboutUs()
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

    .aboutUs {
        width: 100%;
        height: 100%;
    }
    .tox-tinymce-aux{
    z-index: 9999 !important;
  }
    .questadd .el-input {
        width: 235px;
    }

    .aboutdata .el-input {
        width: 235px;
    }

    .questadd .el-button {
        margin-top: 50px;
    }

    .aboutUs .el-dialog__header {
        padding: 12px 20px 10px
    }

    .aboutUs .el-dialog__title {
        color: #606266;
        font-size: 14px;
    }

    .aboutUs .el-dialog__body {

        padding-top: 20px;
        padding-bottom: 100px;
        border-top: 1px solid #ccc;
    }

    .aboutmain {
        width: 98%;
        height: 89%;
        padding: 10px 10px 0px 10px;
    }

    .aboutfind {
        width: 100%;

        padding-top: 10px;
        background-color: white;
        margin-bottom: 10px;
    }

    .aboutfind .el-form-item__content {
        width: 160px;
    }

    .aboutdata {
        width: 98%;
        height: 100%;
        padding: 10px 20px;
        background-color: white;
    }

    .aboutdata .iconfont {
        font-size: 12px;
    }

    .aboutdata .recovery {
        background-color: rgb(48, 216, 192);
        color: white;
        border: 0px;
    }

    .aboutdata .disable {
        background-color: rgb(255, 102, 0);
        color: white;
        border: 0px;
    }

    .aboutdata .delete {
        background-color: rgb(234, 74, 92);
        color: white;
        border: 0px;
    }

    .aboutdata .commonbtn {
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

    .aboutbox {
        width: 100%;
        margin-bottom: 20px;
    }

    .aboutbox p {
        font-size: 14px;
        color: #606266;
    }

    .aboutbtn {
        width: 80px;
        height: 36px;
        background-color: rgb(54, 116, 255);
        color: white;
        text-align: center;
        line-height: 36px;
        border-radius: 4px;
    }
</style>