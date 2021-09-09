
<template>
    <div class="vipbox">
        <el-menu :default-active="activeIndex2" class="el-menu-demo" mode="horizontal" @select="handleSelect"
            background-color="white" text-color="#f999" active-text-color="rgb(18,42,136)">
            <el-menu-item index="1">会员效益</el-menu-item>
        </el-menu>

        <div class="vipmain">
            <div class="vipmainbox">
                <div class="formbox" style="width: 50%;">
                    <el-form ref="form" :model="form" label-width="300px" label-position="left" size="medium">
                        <el-form-item label="运营成本百分比">
                            <el-input v-model="form.member_yycb_percent"></el-input>
                            <p>说明：占毛利的百分比，运营成本百分比+会员返利百分比=100%</p>
                            <span class="p">%</span>
                        </el-form-item>

                        <el-form-item label="会员返利百分比">
                            <el-input v-model="form.mem_fl_pt"></el-input>
                            <p>说明：占毛利的百分比，运营成本百分比+会员返利百分比=100%</p>
                            <span class="p">%</span>
                        </el-form-item>

                        <el-form-item label="会员自购返利百分比">
                            <el-input v-model="form.mem_fl_self_pt"></el-input>
                            <p>说明：占会员返利的百分比</p>
                            <span class="p">%</span>
                        </el-form-item>

                        <el-form-item label="会员下级粉丝购买奖励百分比">
                            <el-input v-model="form.mem_fl_fs_lower_pt"></el-input>
                            <p>说明：占会员返利的百分比</p>
                            <span class="p">%</span>
                        </el-form-item>

                        <el-form-item label="会员下级会员购买奖励百分比">
                            <el-input v-model="form.mem_fl_hy_lower_pt"></el-input>
                            <p>说明：占会员返利的百分比</p>
                            <span class="p">%</span>
                        </el-form-item>

                        <el-form-item label="会员下级会员的下级会员购买奖励百分比">
                            <el-input v-model="form.mem_fl_hy_lower_hy_lower_pt"></el-input>
                            <p>说明：占会员返利的百分比</p>
                            <span class="p">%</span>
                        </el-form-item>

                        <el-form-item label="会员下级会员的下级粉丝购买奖励百分比">
                            <el-input v-model="form.mem_fl_hy_lower_fs_lower_pt"></el-input>
                            <p>说明：占会员返利的百分比</p>
                            <span class="p">%</span>
                        </el-form-item>

                        <el-form-item label="会员下级粉丝的下级会员购买奖励百分比">
                            <el-input v-model="form.mem_fl_fs_lower_hy_lower_pt"></el-input>
                            <p>说明：占会员返利的百分比</p>
                            <span class="p">%</span>
                        </el-form-item>

                        <el-form-item label="会员下级粉丝的下级粉丝购买奖励百分比">
                            <el-input v-model="form.mem_fl_fs_lower_fs_lower_pt"></el-input>
                            <p>说明：占会员返利的百分比</p>
                            <span class="p">%</span>
                        </el-form-item>
                    </el-form>
                </div>
                <p>权益说明</p>
                <div>
                    <!-- <mavon-editor v-model='form.quanyi_desc' :toolbars="toolbars" /> -->
                    <tinymce-editor ref='tinymce' :init='init' v-model="form.quanyi_desc"></tinymce-editor>
                </div>
                <el-form style="margin-top: 20px;">
                    <el-form-item>
                        <el-button style="background-color: rgb(54, 116, 255); color: white" @click=' updateSetting'>确定
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                activeIndex2: "1",
                token: localStorage.getItem('token'),
                form: {
                    member_yycb_percent: '',
                    mem_fl_pt: '',
                    mem_fl_self_pt: '',
                    mem_fl_fs_lower_pt: '',
                    mem_fl_hy_lower_pt: '',
                    mem_fl_hy_lower_hy_lower_pt: '',
                    mem_fl_hy_lower_fs_lower_pt: '',
                    mem_fl_fs_lower_fs_lower_pt: '',
                    mem_fl_fs_lower_hy_lower_pt: '',
                    quanyi_desc: ''
                },
               
            }
        },
        methods: {
            handleSelect(key, keyPath) {
                console.log(key, keyPath);
            },


            getSetting() {
                this.$api.post({
                    path: '/manage/getSetting',
                    params: {
                        token: this.token
                    }, success: (data) => {
                        console.log(data)
                        this.form.member_yycb_percent = data.data.member_yycb_percent
                        this.form.mem_fl_pt = data.data.mem_fl_pt
                        this.form.mem_fl_self_pt = data.data.mem_fl_self_pt
                        this.form.mem_fl_fs_lower_pt = data.data.mem_fl_fs_lower_pt
                        this.form.mem_fl_hy_lower_pt = data.data.mem_fl_hy_lower_pt
                        this.form.mem_fl_hy_lower_hy_lower_pt = data.data.mem_fl_hy_lower_hy_lower_pt
                        this.form.mem_fl_hy_lower_fs_lower_pt = data.data.mem_fl_hy_lower_fs_lower_pt
                        this.form.mem_fl_fs_lower_fs_lower_pt = data.data.mem_fl_fs_lower_fs_lower_pt
                        this.form.mem_fl_fs_lower_hy_lower_pt = data.data.mem_fl_fs_lower_hy_lower_pt
                        this.form.quanyi_desc = data.data.quanyi_desc
                    }
                })
            },
            updateSetting() {
                this.$api.post({
                    path: '/manage/updateSetting',
                    params: {
                        token: this.token,
                        member_yycb_percent: this.form.member_yycb_percent,
                        mem_fl_pt: this.form.mem_fl_pt,
                        mem_fl_self_pt: this.form.mem_fl_self_pt,
                        mem_fl_fs_lower_pt: this.form.mem_fl_fs_lower_pt,
                        mem_fl_hy_lower_pt: this.form.mem_fl_hy_lower_pt,
                        mem_fl_hy_lower_hy_lower_pt: this.form.mem_fl_hy_lower_hy_lower_pt,
                        mem_fl_hy_lower_fs_lower_pt: this.form.mem_fl_hy_lower_fs_lower_pt,
                        mem_fl_fs_lower_fs_lower_pt: this.form.mem_fl_fs_lower_fs_lower_pt,
                        mem_fl_fs_lower_hy_lower_pt: this.form.mem_fl_fs_lower_hy_lower_pt,
                        quanyi_desc: this.form.quanyi_desc,
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
            this.getSetting()
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

    .vipbox {
        width: 100%;
        height: 100%;
    }

    .vipmain {
        width: 98%;
        /* height: 80%; */
        padding: 10px 10px 0px 10px;
        /* background-color: white; */

    }

    .vipmainbox {
        width: 99%;
        height: 80%;
        padding: 10px;
        background-color: white;
        overflow-y: auto;
        overflow-x: hidden;
    }

    .vipmain .el-form-item {
        position: relative;
    }

    .formbox p {
        color: #999;
        font-size: 12px;
    }

    .p {
        display: inline-block;
        position: absolute;
        right: 62%;
        top: 0px;
        color: #ccc;
    }

    .formbox .el-input {
        width: 40%;
    }

    .formbox {
        width: 50%;
        /* height: 100%; */
        background-color: white;
    }
</style>