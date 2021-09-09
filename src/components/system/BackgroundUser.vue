<!-- 后台用户 -->
<template>
  <div class="background">
    <el-menu :default-active="activeIndex2" class="el-menu-demo" mode="horizontal" @select="handleSelect"
      background-color="white" text-color="#f999" active-text-color="rgb(18,42,136)">
      <el-menu-item index="1">后台用户</el-menu-item>
    </el-menu>

    <div class="backmain">
      <div class="backfind">
        <el-form :inline="true" :model="formInline" class="demo-form-inline" size="small" style="margin-left: 10px">
          <el-form-item>
            <el-input v-model="formInline.account" placeholder="请输入账号"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="formInline.name" placeholder="请输入姓名"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="formInline.phone" placeholder="请输入手机号"></el-input>
          </el-form-item>
          <el-form-item>
            <el-select v-model="formInline.region" @change="getchange" placeholder="请选择状态">
              <el-option label="请选择状态" value=""></el-option>
              <el-option label="正常" value="0"></el-option>
              <el-option label="禁用" value="1"></el-option>

            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button style="background-color: rgb(54, 116, 255); color: white" icon="el-icon-search"
              @click="getMemberfind">查询
            </el-button>
          </el-form-item>
        </el-form>
      </div>

      <div class="backdata">
        <el-row style="margin-bottom: 12px">
          <el-button type="primary" size="small" icon="el-icon-plus" @click="addVisible = true">添加</el-button>
          <el-button size="small" class="recovery" icon="el-icon-refresh-right" @click="huifuVisible = true">恢复
          </el-button>
          <el-button size="small" class="disable" icon="el-icon-search" @click="jinyongVisible = true">禁用</el-button>
          <el-button size="small" class="delete" icon="el-icon-close" @click="outVisible = true">删除
          </el-button>
        </el-row>

        <el-table ref="multipleTable2" border :data="tableData" tooltip-effect="dark" style="margin-bottom: 15px"
          class="table" :header-cell-style="getRowClass" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="80"> </el-table-column>
          <el-table-column label="id" width="80">
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column prop="account" label="账号"> </el-table-column>
          <el-table-column prop="memberName" label="姓名"> </el-table-column>
          <el-table-column prop="phone" label="手机号"> </el-table-column>
          <el-table-column prop="roleNames" label="角色"> </el-table-column>
          <el-table-column prop="createTime" label="开户时间">
          </el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <p v-show="scope.row.isForbid == '0'">正常</p>
              <p v-show="scope.row.isForbid == '1'">禁用</p>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="245">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="page" style="display: flex;">
          <div class="grid-content bg-purple-light" style="margin-left: auto;">
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
              :current-page="pageNum" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
              :total="pagetotal">
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
    <!-- 添加-->
    <el-dialog title="添加" :visible.sync="addVisible" width="560px" class="editbox">
      <div class="information">
        <div style="width: 80%; margin: 0 auto">
          <el-form :model="addForm" ref="addForm" label-width="100px" class="demo-ruleForm" style="margin: 0 auto">
            <el-form-item label="账号" required>
              <el-input v-model="addForm.account" placeholder="请输入账号"></el-input>
            </el-form-item>
            <el-form-item label="密码" required>
              <el-input type="password" v-model="addForm.pass" placeholder="请输入密码" autocomplete="off">
              </el-input>
            </el-form-item>
            <el-form-item label="确认密码" required>
              <el-input type="password" v-model="addForm.spass" placeholder="请输入密码" autocomplete="off">
              </el-input>
            </el-form-item>
            <el-form-item label="姓名" required>
              <el-input v-model="addForm.name" placeholder="请输入员工姓名"></el-input>
            </el-form-item>
            <el-form-item label="手机号" required>
              <el-input v-model="addForm.phone" placeholder="请输入手机号"></el-input>
            </el-form-item>
            <el-form-item label="选择角色" required>
              <el-button style="background-color: rgb(54, 116, 255); color: white" @click="getrolesType(1)">
                选择角色
              </el-button>
              <div class="roleNames">
                <el-tag v-for="tag in roleNames" :key="tag.name" closable :type="tag.type" @close="handleClose(tag)">
                  {{ tag.name }}
                </el-tag>
              </div>
            </el-form-item>
            <el-form-item label="状态" required class="select">
              <el-select v-model="addForm.region" placeholder="请选择状态" @change="getchange">
                <el-option label="正常" value="0"></el-option>
                <el-option label="禁用" value="1"></el-option>
              </el-select>
            </el-form-item>
            <div class="submitbtn" style="background-color: rgb(54, 116, 255); color: white" @click="getaddMember">
              确定
            </div>
          </el-form>
        </div>
      </div>
    </el-dialog>

    <!-- 编辑-->
    <el-dialog title="编辑" :visible.sync="editVisible" width="560px" class="editbox">
      <div class="information">
        <div style="width: 80%; margin: 0 auto">
          <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm" style="margin: 0 auto">
            <el-form-item label="账号" required>
              <el-input v-model="ruleForm.account" placeholder="请输入账号"></el-input>
            </el-form-item>
            <el-form-item label="密码" required>
              <el-input type="password" v-model="ruleForm.pass" placeholder="请输入密码" autocomplete="off">
              </el-input>
            </el-form-item>
            <el-form-item label="确认密码" required>
              <el-input type="password" v-model="ruleForm.spass" placeholder="请输入密码" autocomplete="off">
              </el-input>
            </el-form-item>
            <el-form-item label="姓名" required>
              <el-input v-model="ruleForm.name" placeholder="请输入员工姓名"></el-input>
            </el-form-item>
            <el-form-item label="手机号" required>
              <el-input v-model="ruleForm.phone" placeholder="请输入手机号"></el-input>
            </el-form-item>
            <el-form-item label="选择角色" required>
              <el-button style="background-color: rgb(54, 116, 255); color: white" @click="getrolesType(2)">
                选择角色
              </el-button>
              <div class="roleNames">
                <el-tag v-for="tag in ruleForm.roleNames" :key="tag.name" closable :type="tag.type"
                  @close="handleCloseE(tag)">
                  {{ tag.name }}
                </el-tag>
              </div>
            </el-form-item>
            <el-form-item label="状态" required class="select">
              <el-select v-model="ruleForm.region" placeholder="请选择状态" @change="getisForbid">
                <el-option label="正常" value="0"></el-option>
                <el-option label="禁用" value="1"></el-option>
              </el-select>
            </el-form-item>
            <div class="submitbtn" style="background-color: rgb(54, 116, 255); color: white" @click="geteditMember()">
              确定
            </div>
          </el-form>
        </div>
      </div>
    </el-dialog>

    <!-- 选择角色 -->
    <el-dialog title="选择角色" :visible.sync="roleselect" width="30%" class="rolesbox">
      <div class="information">
        <div style="width: 80%; margin: 0 auto">
          <el-form :model="rolesForm" :inline="true" label-width="100px" class="demo-ruleForm" style="margin: 0 auto"
            size="small">
            <el-form-item>
              <el-input v-model="rolesForm.role" placeholder="请输入角色名称"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button style="background-color: rgb(54, 116, 255); color: white" icon="el-icon-search"
                @click="getfindrole">查询
              </el-button>
            </el-form-item>
            <el-form-item>
              <el-button style="background-color: rgb(54, 116, 255); color: white"
                @click="(roleselect = false), getroles()">确定
              </el-button>
            </el-form-item>
          </el-form>

          <el-table ref="multipleTable" border :data="rolesData" tooltip-effect="dark" style="margin-bottom: 15px"
            class="table" :header-cell-style="getRowClass" @selection-change="getroleselect">
            <el-table-column type="selection" width="75"> </el-table-column>
            <el-table-column label="id" width="65">
              <template slot-scope="scope">
                {{ scope.$index + 1 }}
              </template>
            </el-table-column>
            <el-table-column prop="roleName" label="角色名称">
            </el-table-column>
            <el-table-column prop="intro" label="角色描述"> </el-table-column>
          </el-table>
        </div>
      </div>
    </el-dialog>

    <el-dialog title="删除" :visible.sync="outVisible" width="30%" :before-close="handleClose1">
      <span>确认删除？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="outVisible = false">取 消</el-button>
        <el-button type="primary" @click="(outVisible = false), getdelete()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="恢复" :visible.sync="huifuVisible" width="30%" :before-close="handleClose2">
      <span>确认恢复？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="huifuVisible = false">取 消</el-button>
        <el-button type="primary" @click="(huifuVisible = false), getrecovery()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="禁用" :visible.sync="jinyongVisible" width="30%" :before-close="handleClose3">
      <span>确认禁用？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="jinyongVisible = false">取 消</el-button>
        <el-button type="primary" @click="(jinyongVisible = false), getDisable()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        outVisible: false,
        token: localStorage.getItem("token"),
        nemberName: localStorage.getItem("nemberName"),
        roleName: localStorage.getItem("roleName"),
        account: localStorage.getItem("account"),
        isForbid: localStorage.getItem("isForbid"),
        phone: localStorage.getItem("phone"),
        activeIndex2: "1",
        formInline: {
          account: "",
          name: "",
          phone: "",
          region: "",
        },
        pageNum: 1,
        pageSize: 10,
        // pagetotal:0,
        tableData: [],
        ruleForm: {
          account: "",
          pass: "",
          spass: "",
          name: "",
          phone: "",
          region: "",
          memberId: "",
          roleIds: [], //获取到的角色id
          roleNames: [], //获取到的角色名
          roleList: [],
        },
        rules: {
          account: [{ required: true, message: "请输入账号", trigger: "blur" }],

          pass: [{ required: true, message: "请输入密码", trigger: "blur" }],
          spass: [{ required: true, message: "请输入密码", trigger: "blur" }],
          name: [{ required: true, message: "请输入员工姓名", trigger: "blur" }],
          phone: [
            { required: true, message: "请输入手机号", trigger: "blur" },
            { min: 11, max: 11, message: "请输入正确的手机号", trigger: "blur" },
          ],
          region: [{ required: true, message: "请选择状态", trigger: "change" }],
        },
        addForm: {
          account: "",
          pass: "",
          spass: "",
          name: "",
          phone: "",
          region: "",
        },
        addrules: {
          account: [{ required: true, message: "请输入账号", trigger: "blur" }],

          pass: [{ required: true, message: "请输入密码", trigger: "blur" }],
          spass: [{ required: true, message: "请输入密码", trigger: "blur" }],
          name: [{ required: true, message: "请输入员工姓名", trigger: "blur" }],
          phone: [
            { required: true, message: "请输入手机号", trigger: "blur" },
            { min: 11, max: 11, message: "请输入正确的手机号", trigger: "blur" },
          ],
          region: [{ required: true, message: "请选择状态", trigger: "change" }],
        },
        editVisible: false,
        addVisible: false,
        rolesForm: {
          role: "",
        },
        roleselect: false,

        rolesData: [
        ],
        pagetotal: 0,

        list: [
        ],
        // 编辑信息
        editList: {},

        roleIds: [], //获取到的角色id
        roleNames: [], //获取到的角色名
        memberIds: [], //用户id
        roleList: [], //角色列表

        roletype: "", //角色属性
        huifuVisible: false,
        jinyongVisible: false,
        pass: '',
        spass: '',
        multipleSelection: [],
      };
    },
    methods: {
      handleSelect(key, keyPath) {
        console.log(key, keyPath);
      },

      getRowClass({ rowIndex }) {
        if (rowIndex == 0) {
          return "background:RGB(242,242,242)";
        } else {
          return "";
        }
      },

      handleClose1(key, keyPath) {
        console.log(key, keyPath);
        this.outVisible = false
      },
      handleClose2(key, keyPath) {
        console.log(key, keyPath);
        this.huifuVisible = false
      },
      handleClose3(key, keyPath) {
        console.log(key, keyPath);
        this.jinyongVisible = false
      },
      submitbtn() {
        this.editVisible = false;
      },
      // addsubmitbtn() {
      //     this.addVisible = false
      // },
      // 分页
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.pageSize = val;
        this.getMemberList();
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.pageNum = val;
        this.getMemberList();
      },
      // 用户列表
      getMemberList() {
        this.$api.post({
          path: "/manage/getMemberList",
          params: {
            token: this.token,
            account: "",
            memberName: "",
            phone: "",
            isForbid: "",
            pageNum: this.pageNum,
            pageSize: this.pageSize,
          },
          success: (data) => {
            console.log(data);
            this.tableData = data.data.memberList;
            this.pagetotal = data.data.total;
          },
        });
      },
      // 状态值
      getchange(val) {
        console.log(val);
        this.formInline.region = val;
        this.addForm.region = val;
        console.log(this.formInline.region);
      },
      // 搜索
      getMemberfind() {
        this.$api.post({
          path: "/manage/getMemberList",
          params: {
            token: this.token,
            account: this.formInline.account,
            memberName: this.formInline.name,
            phone: this.formInline.phone,
            isForbid: this.formInline.region,
          },
          success: (data) => {
            console.log(data);
            this.tableData = data.data.memberList;
            this.pagetotal = data.data.total;
            // this.formInline.account = ''
            // this.formInline.name = ''
            // this.formInline.phone = ''
            // this.formInline.region = ''
          },
        });
      },

      // 选择角色列表
      getAllRole() {
        this.$api.post({
          path: "/manage/getAllRole",
          params: {
            token: this.token,
          },
          success: (data) => {
            console.log(data);
            this.rolesData = data.data;
          },
        });
      },

      getfindrole() {
        this.$api.post({
          path: "/manage/getAllRole",
          params: {
            token: this.token,
            roleName: this.rolesForm.role,
          },
          success: (data) => {
            console.log(data);
            this.rolesData = data.data;
            // this.rolesForm.role = "";
          },
        });
      },
      getrolesType(v) {
        this.roleselect = true;
        this.roletype = v;
      },
      // 获取角色名
      getroleselect(val) {
        this.multipleSelection = val;
        console.log(val);
        if (this.roletype == "1") {
          let roleId = [];
          let roleName = [];
          val.forEach((e) => {
            roleId.push(e.roleId);
            roleName.push({
              name: e.roleName,
              id: e.roleId,
              type: "",
            });
          });
          this.roleIds = roleId;
          this.roleNames = roleName;
        } else {
          let roleId = [];
          let roleName = [];
          val.forEach((e) => {
            roleId.push(e.roleId);
            roleName.push({
              name: e.roleName,
              id: e.roleId,
              type: "",
            });
          });
          this.ruleForm.roleIds = roleId;
          this.ruleForm.roleNames = roleName;
        }
      },
      handleClose(tag) {
          this.roleNames.splice(this.roleNames.indexOf(tag), 1);
          console.log(this.roleNames);
          let roleId = [];
          this.roleNames.forEach((e) => {
            roleId.push(e.id);
          });
          this.roleIds = roleId.join(",");
          console.log(roleId);
        

      },
      handleCloseE(tag) {
          this.ruleForm.roleNames.splice(this.ruleForm.roleNames.indexOf(tag), 1);
          console.log(this.ruleForm.roleNames,'bianji');
          let roleId = [];
          this.ruleForm.roleNames.forEach((e) => {
            roleId.push(e.id);
          });
          this.ruleForm.roleIds = roleId.join(",");
          // console.log(roleId);

      },
      getroles() {
        if (this.roletype == "1") {
          if (this.roleId == []) {
            this.$message({
              message: "请选择角色",
              type: "warning",
            });
          } else {
            this.$message({
              message: "选择成功",
              type: "success",
            });
            // this.getfindrole()
            this.roleId = [];
            
          }
          // this.$refs.multipleTable.clearSelection();
        } else {
          if (this.ruleForm.roleId == []) {
            this.$message({
              message: "请选择角色",
              type: "warning",
            });
          } else {
            this.$message({
              message: "选择成功",
              type: "success",
            });
            this.ruleForm.roleId = [];
            // this.getfindrole()
          }
          // this.$refs.multipleTable.clearSelection();
        }
      },

      // 添加用户
      getaddMember() {
        if (
          this.addForm.name == "" ||
          this.addForm.account == "" ||
          this.addForm.pass == "" ||
          this.addForm.spass == "" ||
          this.addForm.phone == "" ||
          this.roleIds.join(",") == "" ||
          this.addForm.region == ""
        ) {
          this.$message({
            message: "请将信息填写完整",
            type: "warning",
          });
        } else {
          this.$api.post({
            path: "/manage/addMember",
            params: {
              token: this.token,
              memberId: 0,
              memberName: this.addForm.name,
              account: this.addForm.account,
              pwd: this.addForm.pass,
              phone: this.addForm.phone,
              rolenames: this.roleIds.join(","),
              isForbid: this.addForm.region,
            },
            success: (data) => {
              console.log(data);
              this.addVisible = false;
              this.getMemberList();
              this.addForm.name = "";
              this.addForm.account = "";
              this.addForm.pass = "";
              this.addForm.phone = "";
              this.addForm.spass = "";
              this.roleId = "";
              this.$refs.multipleTable.clearSelection();
              (this.addForm.region = ""), (this.roleNames = []);
              this.getMemberList();
              this.getfindrole()
            },
          });
        }
      },

      // 获取用户id
      handleSelectionChange(val) {
        // this.multipleSelection = val;

        let ids = [];
        val.forEach((e) => {
          ids.push(e.memberId);
        });

        this.memberIds = ids;
        console.log(ids, "用户id");
      },

      // 编辑
      handleEdit(index, row) {
        console.log(index, row);
        this.editVisible = true;
        this.memberId = row.memberId;
        this.ruleForm.account = row.account;
        this.pass = row.pwd;
        this.ruleForm.name = row.memberName;
        this.ruleForm.phone = row.phone;
        this.spass = row.pwd;
        this.ruleForm.region = row.isForbid;

        let arr = [];
        let ids = []
        row.roleList.forEach((e) => {
          arr.push({
            name: e.roleName,
            id: e.roleId,
            type: "",
          });
          ids.push(e.roleId)
        });
        this.ruleForm.roleNames = arr;
        this.ruleForm.roleIds = ids
      },
      getisForbid(val) {
        this.ruleForm.region = val;
      },
      geteditMember() {
        // this.pass = this.ruleForm.pass
        // this.spass = this.ruleForm.spass

        this.$api.post({
          path: "/manage/addMember",
          params: {
            token: this.token,
            memberId: this.memberId,
            memberName: this.ruleForm.name,
            account: this.ruleForm.account,
            pwd: this.ruleForm.pass,
            phone: this.ruleForm.phone,
            rolenames: this.ruleForm.roleIds.join(","),
            isForbid: this.ruleForm.region,
          },
          success: (data) => {
            console.log(data);
            if (data.code == 1) {
              this.$message({
                message: data.msg,
                type: 'success'
              });
              this.getMemberList();
              this.editVisible = false
              this.getfindrole()
            }

          },
        });
      },

      // 删除用户
      getdelete() {
        if (this.memberIds.join(",") == "") {
          this.$message({
            message: "请选择要删除的用户",
            type: "warning",
          });
        } else {
          this.$api.post({
            path: "/manage/operationMember",
            params: {
              token: this.token,
              type: 3, //1禁用、2恢复、3删除
              memberIds: this.memberIds.join(","),
            },
            success: (data) => {
              console.log(data);
              if (data.code == 1) {
                this.$message({
                  message: data.msg,
                  type: "success",
                });
                this.getMemberList();
              }else{
                this.$message.error(data.msg);
              }
            },
          });
        }
      },

      // 禁用
      getDisable() {
        if (this.memberIds.join(",") == "") {
          this.$message({
            message: "请选择要禁用的用户",
            type: "warning",
          });
        } else {
          this.$api.post({
            path: "/manage/operationMember",
            params: {
              token: this.token,
              type: 1, //1禁用、2恢复、3删除
              memberIds: this.memberIds.join(","),
            },
            success: (data) => {
              console.log(data);
              if (data.code == 1) {
                this.$message({
                  message: data.msg,
                  type: "success",
                });
                this.getMemberList();
              }
            },
          });
        }
      },

      // 恢复禁用
      getrecovery() {
        if (this.memberIds.join(",") == "") {
          this.$message({
            message: "请选择要恢复的用户",
            type: "warning",
          });
        } else {
          this.$api.post({
            path: "/manage/operationMember",
            params: {
              token: this.token,
              type: 2, //1禁用、2恢复、3删除
              memberIds: this.memberIds.join(","),
            },
            success: (data) => {
              console.log(data);
              if (data.code == 1) {
                this.$message({
                  message: data.msg,
                  type: "success",
                });
                this.getMemberList();
              }
            },
          });
        }
      },
    },
    mounted() {
      this.getMemberList();
      this.getAllRole();
    },
  };
</script>

<style>
  * {
    padding: 0;
    margin: 0;
  }

  .background {
    width: 100%;
    height: 100%;
  }

  .backmain {
    /* width: 98%;
    height: 80%; */
    padding: 10px 10px 0px 10px;
  }

  .background .el-dialog__header {
    padding: 12px 20px 10px;
  }

  .background .el-dialog__title {
    color: #606266;
    font-size: 14px;
  }

  .background .el-dialog__body {
    padding-top: 20px;
    padding-bottom: 100px;
    border-top: 1px solid #ccc;
  }

  .backfind {
    width: 100%;
    /* height: 40px; */
    padding-top: 10px;
    background-color: white;
    margin-bottom: 10px;
  }

  .backfind .el-form-item__content {
    width: 160px;
  }

  .backdata {
    /* width: 98%;
    height: 100%; */
    padding: 10px 20px;
    background-color: white;
  }

  .backdata .recovery {
    background-color: rgb(48, 216, 192);
    color: white;
    border: 0px;
  }

  .backdata .disable {
    background-color: rgb(255, 102, 0);
    color: white;
    border: 0px;
  }

  .backdata .delete {
    background-color: rgb(234, 74, 92);
    color: white;
    border: 0px;
  }

  .el-table th,
  td {
    text-align: center !important;
  }

  .roleNames span {
    display: inline-block;
    margin-right: 10px;
  }

  /* ===================编辑=================== */
  .information {
    width: 100%;
    /* height: 300px; */
    /* margin-top: 20px; */
  }

  .information>div {
    width: 60%;
    margin: 0 auto;
  }

  .editbox .el-dialog__body {
    padding-top: 20px;
    padding-bottom: 100px;
    border-top: 1px solid #ccc;
  }

  .editbox .el-dialog__title {
    font-size: 14px;
  }

  .editbox .el-input__inner {
    width: 72%;
  }

  .select .el-input__inner {
    width: 103%;
  }

  /* 选择角色 */
  .rolesbox .el-dialog__body {
    padding-top: 20px;
    padding-bottom: 100px;
    border-top: 1px solid #ccc;
  }

  .rolesbox .el-dialog__title {
    font-size: 14px;
  }

  .rolesbox .el-input__inner {
    width: 95%;
  }

  .addbtns {
    width: 80px;
    height: 35px;
    color: white;
    background-color: rgb(54, 116, 255);
    border-radius: 5px;
    text-align: center;
    line-height: 35px;
    /* font-weight: bold; */
  }
</style>