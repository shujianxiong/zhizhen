<template>
  <div class="indexbox">
    <el-container>
      <el-aside width="200px" class="indexc">
        <el-menu default-active="2" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose"
          background-color="rgb(25, 26, 35)" text-color="#999" active-text-color="white" unique-opened router>
          <div class="sidebar-logo">至真</div>
          <template v-for="item in menuData">
            <template v-if="item.sub_menu">
                <el-submenu :index="item.menu_url" :key="item.menu_id" :unique-opened="true">
                    <template slot="title">
                        <i :class="['iconfont',item.icon]"></i>
                        <span slot="title">{{ item.menu_name }}</span>
                    </template>
                    <template v-for="subItem in item.sub_menu">
                        <el-submenu v-if="subItem.sub_menu" :index="subItem.menu_url" :key="subItem.menu_id">
                            <template slot="title">{{ subItem.menu_name }}</template>
                            <el-menu-item v-for="(threeItem,i) in subItem.sub_menu" :key="i" :index="threeItem.menu_url">
                                {{ threeItem.menu_name }}</el-menu-item>
                        </el-submenu>
                        <el-menu-item v-else :index="subItem.menu_url" :key="subItem.menu_id">{{ subItem.menu_name }}</el-menu-item>
                    </template>
                </el-submenu>
            </template>
            <template v-else>
                <el-menu-item :index="item.menu_url" :key="item.menu_id" >
                    <i :class="['iconfont',item.icon]"></i>
                    <span slot="title">{{ item.menu_name }}</span>
                </el-menu-item>
            </template>
        </template>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header style="height: 70px">
          <el-row>
            <el-col :span="12">
              <div class="grid-content bg-purple" style="padding-left: 50px">
                至真
              </div>
            </el-col>
            <el-col :span="12">
              <div class="grid-content bg-purple-light top">
                <el-dropdown @command="handleCommand">
                  <el-button type="primary">
                    {{account}}<i class="el-icon-caret-bottom el-icon--right"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="pass">修改密码</el-dropdown-item>
                    <el-dropdown-item command="information">基本信息</el-dropdown-item>
                    <el-dropdown-item command="out">退出</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </el-col>
          </el-row>
        </el-header>
        <el-main style="padding: 0px;" class="element">
          <router-view ></router-view>
        </el-main>
      </el-container>
    </el-container>

    <!-- 基本信息 -->
    <el-dialog title="基本信息" :visible.sync="dialogVisible" width="30%" :before-close="informationClose"
      class="informationbox">
      <div class="informations">
        <div>
          <p>
            <span style="display: inline-block; margin-right: 10px">账号 ：</span><span>{{account}}</span>
          </p>
          <p>
            <span style="display: inline-block; margin-right: 10px">姓名 ：</span><span>{{memberName}}</span>
          </p>
          <p>
            <span style="display: inline-block; margin-right: 10px">手机号 ：</span><span>{{phone}}</span>
          </p>
          <p>
            <span style="display: inline-block; margin-right: 10px">角色 ：</span><span>{{roleNames}}</span>
          </p>
          <p>
            <span style="display: inline-block; margin-right: 10px">开户时间 ：</span><span>{{createTime}}</span>
          </p>
        </div>
      </div>
    </el-dialog>

    <!-- 修改密码 -->
    <el-dialog title="修改密码" :visible.sync="passVisible" width="30%" :before-close="passClose" class="informationbox">
      <div class="information">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="原密码" prop="oldpwd">
            <el-input v-model="ruleForm.oldpwd" placeholder="请输入原密码"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="pass">
            <el-input type="password" v-model="ruleForm.pass" placeholder="请输入新密码" autocomplete="off">
            </el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="checkPass">
            <el-input type="password" v-model="ruleForm.checkPass" placeholder="请确认新密码" autocomplete="off">
            </el-input>
          </el-form-item>
          <el-form-item label=" ">
            <el-button type="primary" @click='getedit'>确定</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>

    <!-- 退出 -->
    <el-dialog title="退出" :visible.sync="outVisible" width="30%" :before-close="handleClose1">
      <span>确认退出？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="outVisible = false">取 消</el-button>
        <el-button type="primary" @click="outVisible = false,getloginOut()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    data() {
      var validatePass = (rule, value, callback) => {
        if (value === "") {
          callback(new Error("请输入密码"));
        } else {
          if (this.ruleForm.checkPass !== "") {
            this.$refs.ruleForm.validateField("checkPass");
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === "") {
          callback(new Error("请再次输入密码"));
        } else if (value !== this.ruleForm.pass) {
          callback(new Error("两次输入密码不一致!"));
        } else {
          callback();
        }
      };
      return {
        dialogVisible: false, //基本信息模态框
        passVisible: false, //修改密码
        outVisible: false,//退出登录

        memberId: localStorage.getItem('memberId'),
        token: localStorage.getItem('token'),
        account: localStorage.getItem('account'),
        memberName: localStorage.getItem('memberName'),
        phone: localStorage.getItem('phone'),
        roleNames: localStorage.getItem('roleNames'),
        createTime: localStorage.getItem('createTime'),

        ruleForm: {
          oldpwd: "",
          pass: "",
          checkPass: "",
        },

        rules: {
          oldpwd: [
            { required: true, message: "请输原密码", trigger: "blur" },
          ],
          pass: [
            {
              required: true,
              message: "请输入新密码",
              validator: validatePass,
              trigger: "blur",
            },
          ],
          checkPass: [
            {
              required: true,
              message: "请输入确认密码",
              validator: validatePass2,
              trigger: "blur",
            },
          ],
        },
      };
    },
    methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
        // this.outVisible = false
      },
      handleClose1(key, keyPath) {
        console.log(key, keyPath);
        this.outVisible = false
      },
      handleCommand(command) {
        if (command == "information") {
          this.dialogVisible = true;
        } else if (command == "pass") {
          this.passVisible = true;
        } else if (command == "out") {
          this.outVisible = true;
        }
      },

      informationClose() {
        this.dialogVisible = false;
      },
      passClose() {
        this.passVisible = false;
      },

      // 修改密码
      getedit() {
        if (this.ruleForm.oldpwd == '' || this.ruleForm.pass == '' || this.ruleForm.checkPass == '') {
          this.$message({
            message: '请将信息填写完整',
            type: 'warning'
          });
        } else {
          this.$api.post({
            path: '/manage/editPassword',
            params: {
              token: this.token,
              memberId: this.memberId,
              pwd: this.ruleForm.oldpwd,
              new_pwd: this.ruleForm.pass
            }, success: (data) => {
              console.log(data)
              if (data.code == 1) {
                this.$message({
                  message: data.msg,
                  type: 'success'
                });
                this.passVisible = false
                this.ruleForm.oldpwd = ''
                this.ruleForm.pass = ''
                this.ruleForm.checkPass = ''
              }
            }
          })
        }

      },

      getrole() {
        this.$api.post({
          path: '/manage/getUserPermissionsMenu',
          params: {
            token: this.token
          }, success: (data) => {
            console.log(data)
          }
        })
      },

      getloginOut() {
        this.$api.post({
          path: '/manage/loginOut',
          params: {
            token: this.token
          }, success: (data) => {
            if (data.code == 1) {
              this.$message({
                message: data.msg,
                type: 'success'
              });
              localStorage.removeItem('token');
              localStorage.removeItem('uid');
              this.$router.push('/login');
            }
            console.log(data)
          }
        })
      }
    },

    mounted() {
      this.getrole()
    },
    computed: {
        menuData() {
            return this.$store.state.menuData
        },
        // onRoutes() {
        //     return this.$route.path.replace('/', '');
        // }
    },
  };
</script>

<style lang="scss">
  .indexbox {
    width: 100%;
    height: 100%;
    /* margin: 0 a; */
  }
  .sidebar-logo {
    width: 200px;
    height: 70px;
    background-color: rgb(36,47,66);
    /* margin: 0 auto; */
    color: white;
    font-size: 26px;
    font-weight: bold;
    text-align: center;
    line-height: 70px;
    /* z-index: -9999; */
}
  .indexc .iconfont {
    font-size: 20px;
  }

  .indexbox>.el-container {
    height: 100%;
  }

  .el-header,
  .el-footer {
    background-color: rgb(36, 47, 66);
    color:rgb(36, 47, 66) ;
    /* text-align: center; */
    line-height: 70px;
    font-weight: bold;
    font-size: 28px;
  }

  .el-aside {
    background-color: rgb(25, 26, 35);
    /* color: #333; */
    text-align: left;
    line-height: 200px;
    width: 100%;
  }

  .el-main {
    height: 100%;
    background-color: #e9eef3;
    color: #333;
    /* text-align: center; */
    /* line-height: 160px; */
    width: 100%;
    padding: 0;
  }

  .el-dropdown {
    margin-left: 85%;
  }

  .top .el-button--primary {
    border-color: transparent;
    background-color: transparent;
  }

  .top .el-button--primary:focus,
  .top .el-button--primary:hover {
    border-color: transparent;
    background-color: transparent;
  }

  .indexbox .el-menu {
    border-right: 0px;
  }

  .el-menu-vertical-demo {
    width: 200px;
  }

  /* {
        min-width: 100%;
    } */

  /* =======================基本信息====================== */
  .information {
    width: 100%;
    /* height: 300px; */
    /* margin-top: 20px; */
  }

  .information>div {
    width: 60%;
    margin: 0 auto;
  }

  .informations>div p {
    margin-bottom: 10px;
  }

  .informations>div p span:first-child {
    display: inline-block;
    width: 80px;
    text-align: right;
  }

  .informationbox .el-dialog__body {
    padding-top: 20px;
    padding-bottom: 100px;
    border-top: 1px solid #ccc;
  }

  .informationbox .el-dialog__title {
    font-size: 14px;
  }

  /* =====================修改密码=========================== */
  .codebtn {
    width: 95px;
    height: 40px;
    background-color: rgb(54, 116, 255);
    color: white;
    text-align: center;
    line-height: 40px;
    border-radius: 3px;
  }

  .submitbtn {
    width: 95px;
    height: 40px;
    background-color: rgb(54, 116, 255);
    color: white;
    text-align: center;
    line-height: 40px;
    border-radius: 3px;
    margin-left: 100px;
    margin-top: 30px;
  }

  .informationbox .el-input__inner {
    width: 72%;
  }

  .codenum .el-form-item__content {
    display: flex;
  }

  .codenum .el-input__inner {
    width: 95%;
  }

  .codenum .el-input {
    width: 50%;
  }

  .el-menu-item-group__title {
    height: 0px;
  }
  .element::-webkit-scrollbar {
    width: 0 !important
  }

  .element {
    -ms-overflow-style: none;
  }

  /* .element {
    overflow: -moz-scrollbars-none;
  } */
</style>