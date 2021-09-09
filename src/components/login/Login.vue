<template>
    <div class="loginbox">
        <div class="login">
            <div class="loginmain">
                <div class="loginmainL">

                </div>
                <div class="loginmainR">
                    <h1 style="font-weight: normal;margin-bottom: 40px;">登录管理系统</h1>
                    <el-form :model="form" style="margin-top: 20px" :rules="rules" ref="form">
                        <el-form-item prop="account">
                            <div class="icon">
                                <img src="../../assets/images/account.png" alt="" class="icon-img">
                            </div>
                            <el-input v-model="form.account" placeholder="请输入账号"></el-input>
                        </el-form-item>

                        <el-form-item prop="pwd" class="pwd">
                            <div class="icon">
                                <img src="../../assets/images/pwd.png" alt="" class="icon-img">
                            </div>
                            <el-input v-model="form.pwd" placeholder="请输入密码" type="password"></el-input>
                        </el-form-item>

                        <el-form-item class="btnbox">
                            <!-- <div class="btn" @click="submit('form')">登录</div> -->
                            <el-button type="primary" @click='login'>
                                登录
                            </el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                form: {
                    account: '',
                    pwd: ''
                },
                rules: {
                    account: [
                        { required: true, message: '请输入账号/手机号', trigger: 'change' }
                    ],
                    pwd: [
                        { required: true, message: '请输入密码', trigger: 'change' }
                    ],

                },
                token: ''
            }
        },
        methods: {
            // 登录
            login() {
                if (this.form.account == '') {
                    this.$message({
                        message: '请输入账号/手机号',
                        type: 'warning'
                    });
                } else if (this.form.pwd == '') {
                    this.$message({
                        message: '请输入密码',
                        type: 'warning'
                    });
                } else {
                    this.$api.post({
                        path: "/manage/userLogin",
                        params: {
                            account: this.form.account,
                            pwd: this.form.pwd
                        },
                        success: (data) => {
                            console.log(data)
                            localStorage.setItem("token", data.data.token);
                            localStorage.setItem('account', data.data.account);
                            localStorage.setItem('memberId', data.data.memberId);
                            localStorage.setItem('memberName', data.data.memberName);
                            localStorage.setItem('roleNames', data.data.roleNames);
                            localStorage.setItem('createTime', data.data.createTime);

                            // localStorage.isForbid('isForbid',data.data.isForbid);
                            localStorage.setItem('phone', data.data.phone);

                            this.token = data.data.token
                            if (data.code == 1) {
                                this.$message({
                                    message: data.msg,
                                    type: 'success'
                                });
                                this.$router.push('/');
                            } else if(data.code == -1) {
                                this.$message({
                                    message: data.msg,
                                    type: 'error'
                                });
                            }

                            // this.getrole()
                            this.$api.post({
                                path: '/manage/getUserPermissionsMenu',
                                params: {
                                    token: this.token
                                }, success: (data) => {
                                    console.log(data)
                                    this.$store.commit('setMenuData', data.data);
                                    this.$router.push('/welcome');
                                }
                            })
                        },
                    });
                }

            },

            // getrole() {
            //     this.$api.post({
            //         path: '/manage/getUserPermissionsMenu',
            //         params: {
            //             token: this.token
            //         }, success: (data) => {
            //             console.log(data)
            //             this.$store.commit('setMenuData', data.data);
            //             this.$router.push('/index');
            //         }
            //     })
            // }

        }
    }
</script>


<style lang="scss">
    .loginbox {
        width: 100%;
        height: 100%;
        background-color: rgb(54, 116, 255);
        /* position: relative; */
        display: flex;
        /*控制元素在主轴的对齐方式*/
        justify-content: center;
        /*控制默认的一行的对齐方式*/
        align-items: center;
        margin: 0 auto
    }

    .login {
        width: 900px;
        height: 445px;
        background-color: white;
        border-radius: 20px;
        /* position: absolute;
        left: 30%;
        top: 27%; */

    }

    .loginmain {
        width: 685px;
        height: 345px;
        padding: 50px 125px 50px 90px;
        display: flex;
    }

    .loginmainL {
        width: 290px;
        height: 100%;
        background-image: url(../../assets/images/logo1.png);
        background-size: 100% 100%;
    }

    .loginmainR {
        width: 295px;
        height: 100%;
        margin-left: auto;
    }

    .icon {
        width: 50px;
        height: 50px;
        /* border-right: 1px solid #dcdfe6; */
        position: absolute;
        left: 0;
        top: 0;
        z-index: 10;
    }

    .icon-img {
        width: 15px;
        height: 15px;
        display: block;
        margin: 15px;
    }

    .el-form-item {
        position: relative;
    }

    .loginmainR .el-input__inner {
        height: 50px;
        padding: 0px 55px;
    }

    .loginmainR .pwd {
        margin-bottom: 50px;
    }

    .btn {
        width: 295px;
        height: 50px;
        background-color: rgb(56, 118, 255);
        border-radius: 5px;
        font-size: 18px;
        color: #fff;
        font-weight: 700;
        text-align: center;
        line-height: 50px;
        margin-top: 13px;
        cursor: pointer;
    }

    .btnbox .el-button--primary {
        background-color: rgb(56, 118, 255);
        border-color: rgb(56, 118, 255);
        border-radius: 5px;
        font-size: 18px;
        color: #fff;
        font-weight: 700;
        text-align: center;
        /* line-height: 50px; */
    }

    .btnbox .el-button {
        padding: 13px 130px;
        margin-top: 6px;
    }
</style>