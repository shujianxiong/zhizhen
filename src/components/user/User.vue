<template>
  <div class="userlist">
    <el-menu :default-active="activeIndex2" class="el-menu-demo" mode="horizontal" @select="handleSelect"
      background-color="white" text-color="#f999" active-text-color="rgb(18,42,136)">
      <el-menu-item index="1">用户列表</el-menu-item>
    </el-menu>

    <div class="usermain">
      <div class="userfind">
        <el-form :inline="true" :model="formInline" class="demo-form-inline" size="small" style="margin-left: 10px">
          <el-form-item>
            <el-input v-model="formInline.nick" placeholder="请输入昵称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="formInline.phone" placeholder="请输入手机号"></el-input>
          </el-form-item>
          <el-form-item>
            <el-select v-model="formInline.type" clearable placeholder="请选择用户类型">
              <el-option label="粉丝" value="1"></el-option>
              <el-option label="会员" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="formInline.region" clearable placeholder="请选择状态">
              <el-option label="正常" value="0"></el-option>
              <el-option label="禁用" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button style="background-color: rgb(54, 116, 255); color: white" icon="el-icon-search" @click='getfind'>
              查询
            </el-button>
          </el-form-item>
        </el-form>
      </div>

      <div class="userdata">
        <el-row style="margin-bottom: 12px">
          <el-button size="small" class="recovery" icon="el-icon-refresh-right" @click="huifuVisible = true">恢复
          </el-button>
          <el-button size="small" class="disable" icon="el-icon-search" @click="jinyongVisible = true">禁用</el-button>
          <el-button size="small" class="delete" icon="el-icon-close" @click='outVisible = true'>删除</el-button>
          <el-button size="small" class="commonbtn" icon="iconfont iconinport" @click='getexport'>导出</el-button>
          <el-upload class="upload-demo" action="" :http-request="uploadImgs" accept=".xls,.xlsx"
            :show-file-list="false">
            <el-button size="small" class="commonbtn" icon="iconfont iconexport">导入</el-button>
          </el-upload>

        </el-row>

        <el-table ref="multipleTable" border :data="tableData" tooltip-effect="dark"
          style="margin-bottom: 15px; font-size: 14px" class="table" :header-cell-style="getRowClass"
          @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column prop="uid" label="id" width="45">
            <!-- <template slot-scope="scope">
              {{scope.$index+1}}
            </template> -->
          </el-table-column>
          <el-table-column label="头像" width="80">
            <template slot-scope="scope">
              <img :src="scope.row.avatar" height='50' width="50" />
            </template>
          </el-table-column>
          <el-table-column prop="nickName" label="昵称">
          </el-table-column>
          <el-table-column label="性别">
            <template slot-scope="scope">
              <p v-show="scope.row.sex == '0'"> </p>
              <p v-show="scope.row.sex == '1'">男</p>
              <p v-show="scope.row.sex == '2'">女</p>
            </template>
          </el-table-column>
          <el-table-column prop="phone" label="手机号"> </el-table-column>
          <el-table-column prop="areaName" label="地区">
          </el-table-column>
          <el-table-column label="用户类型">
            <template slot-scope="scope">
              <p v-show="scope.row.utype == '1'">粉丝</p>
              <p v-show="scope.row.utype == '2'">会员</p>
            </template>
          </el-table-column>
            <el-table-column label="用户角色">
                <template slot-scope="scope">
                    <p v-show="scope.row.userRole == '1'">业务员</p>
                    <p v-show="scope.row.userRole == '0'">其他</p>
                </template>
            </el-table-column>
          <el-table-column prop="vip" label="发展会员数">
          </el-table-column>
          <el-table-column prop="wattBuyStation" label="自购瓦数">
          </el-table-column>
          <el-table-column prop="wattBuyGoodsSelf" label="返利瓦数">
          </el-table-column>
          <el-table-column prop="wattBuyGoodsLower" label="奖励瓦数">
          </el-table-column>
          <el-table-column prop="createTime" label="注册时间"> </el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <p v-show="scope.row.isForbid == '0'">正常</p>
              <p v-show="scope.row.isForbid == '1'">禁用</p>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="315">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="myteam(scope.$index, scope.row)">我的团队
              </el-button>
              <el-button size="mini" type="primary" @click="profit(scope.$index, scope.row)">收益统计
              </el-button>
                <el-button size="mini" type="danger" @click="bus(scope.$index, scope.row)">成为业务员
                </el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="orderfoot" style="display: flex;">
          <div >
            <span>粉丝数量：{{fansCount}}</span>
            <span>会员数量：{{vipCount}}</span>
          </div>

          <div class="page" style="margin-left: auto;">
            <div class="grid-content bg-purple-light">
              <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="pageNum" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
                :total="pagetotal">
              </el-pagination>
            </div>
          </div>
        </div>
      </div>
    </div>

    <el-dialog title="我的团队" :visible.sync="teamVisible" width="40%" class="rolesbox">
      <div class="information myteam">
        <div style="width: 100%; margin: 0 auto">
          <el-table ref="multipleTable" border :data="teamData" tooltip-effect="dark" style="margin-bottom: 15px"
            class="table" :header-cell-style="getRowClass" @selection-change="handleSelectionChange">
            <el-table-column label="id" width="65">
              <template slot-scope="scope">
                {{scope.$index+1}}
              </template>
            </el-table-column>
            <el-table-column prop="nickName" label="昵称"> </el-table-column>
            <el-table-column label="性别">
              <template slot-scope="scope">
                <p v-show="scope.row.sex == '0'"> </p>
                <p v-show="scope.row.sex == '1'">男</p>
                <p v-show="scope.row.sex == '2'">女</p>
              </template>
            </el-table-column>
            <el-table-column prop="phone" label="手机号"> </el-table-column>
            <el-table-column prop="areaName" label="地区"> </el-table-column>
            <el-table-column prop="usertype" label="用户类型">
              <template slot-scope="scope">
                <p v-show="scope.row.utype == '1'">粉丝</p>
                <p v-show="scope.row.utype == '2'">会员</p>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" @click="myteams(scope.$index, scope.row)">我的团队
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-dialog>

    <!-- 下级的下级 -->
    <el-dialog title="我的团队" :visible.sync="teamsVisible" width="40%" class="rolesbox">
      <div class="information myteam">
        <div style="width: 100%; margin: 0 auto">
          <el-table ref="multipleTable" border :data="teamsData" tooltip-effect="dark" style="margin-bottom: 15px"
            class="table" :header-cell-style="getRowClass" @selection-change="handleSelectionChange">
            <el-table-column prop="id" width="65">
              <template slot-scope="scope">
                {{scope.$index+1}}
              </template>
            </el-table-column>
            <el-table-column prop="nickName" label="昵称"> </el-table-column>
            <el-table-column label="性别">
              <template slot-scope="scope">
                <p v-show="scope.row.sex == '0'"> </p>
                <p v-show="scope.row.sex == '1'">男</p>
                <p v-show="scope.row.sex == '2'">女</p>
              </template>
            </el-table-column>
            <el-table-column prop="phone" label="手机号"> </el-table-column>
            <el-table-column prop="areaName" label="地区"> </el-table-column>
            <el-table-column prop="usertype" label="用户类型">
              <template slot-scope="scope">
                <p v-show="scope.row.utype == '1'">粉丝</p>
                <p v-show="scope.row.utype == '2'">会员</p>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-dialog>

    <!-- 收益统计 -->
    <el-dialog title="收益统计" :visible.sync="profitVisible" width="40%" class="rolesbox">
      <div class="information">
        <div style="width: 100%; margin: 0 auto">
          <el-table ref="multipleTable" border :data="profitData" tooltip-effect="dark" style="margin-bottom: 15px"
            class="table" :header-cell-style="getRowClass" @selection-change="handleSelectionChange">
            <el-table-column label="id" width="65">
              <template slot-scope="scope">
                {{scope.$index+1}}
              </template>
            </el-table-column>
            <el-table-column prop="stationName" label="电站名称">
            </el-table-column>
            <el-table-column prop="watt" label="瓦数总计"> </el-table-column>
            <el-table-column prop="currentAmount" label="收益总计"> </el-table-column>
          </el-table>
        </div>
      </div>
    </el-dialog>

    <el-dialog title="删除" :visible.sync="outVisible" width="20%" :before-close="handleClose">
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
    <el-dialog title="禁用" :visible.sync="jinyongVisible" width="20%" :before-close="handleClose3">
      <span>确认禁用？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="jinyongVisible = false">取 消</el-button>
        <el-button type="primary" @click="(jinyongVisible = false), getDisable()">确 定</el-button>
      </span>
    </el-dialog>
      <el-dialog title="成为业务员" :visible.sync="busVisible" width="20%">
          <span>确认将该用户设置成业务员？</span>
          <span slot="footer" class="dialog-footer">
                <el-button @click="busVisible = false">取 消</el-button>
                <el-button type="primary" @click="(busVisible = false),setBus()">确 定</el-button>
            </span>
      </el-dialog>
  </div>
</template>


<script>
  export default {
    data() {
      return {
        token: localStorage.getItem('token'),
        nemberName: localStorage.getItem('nemberName'),
        roleName: localStorage.getItem('roleName'),
        account: localStorage.getItem('account'),
        isForbid: localStorage.getItem('isForbid'),
        phone: localStorage.getItem('phone'),

        activeIndex2: "1",
        pageNum: 1,
        pagetotal: 0,//总页数
        pageSize: 10,

        excel: '', // 文件

        outVisible: false,
        huifuVisible: false,
        jinyongVisible: false,

        // 搜索
        formInline: {
          nick: "",
          phone: "",
          type: "",
          region: "",
        },

        tableData: [],

        teamVisible: false, //我的团队

        teamData: [],

        // 下级的下级
        teamsVisible: false,
        teamsData: [],

        // 收益统计
        profitVisible: false,
        profitData: [],


        busVisible: false, //业务员设置

        uids: [],//用户id
        // myteamList:[]
        fansCount: '',
        vipCount: '',
        html:'',
      };
    },

    methods: {
      handleSelect(key, keyPath) {
        console.log(key, keyPath);
      },

      handleClose(key, keyPath) {
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

      getRowClass({ rowIndex }) {
        if (rowIndex == 0) {
          return "background:RGB(242,242,242)";
        } else {
          return "";
        }
      },
      submitbtn() {
        this.editVisible = false;
      },
      addsubmitbtn() {
        this.addVisible = false;
      },
      // 分页
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.pageSize = val
        this.getUserList()
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.pageNum = val
        this.getUserList()
      },
      uploadImgs(file) {
        this.$ImportUserExcel('http://manager.zhizhennengyuan.com:8000/mfxapi/ImportUserExcel', file.file).then(res => {
          // this.excel = res.result[0].relative_url

          if (res.status == 1) {
            this.$message({
              message: '导入成功',
              type: 'success'
            });
            this.getUserList()
          }
          console.log(res, 'res2')
        })
      },

      // ImportUserExcel(){
      //   this.$api.post({

      //   })
      // },
      // 用户列表
      getUserList() {
        this.$api.post({
          path: '/manage/getUserList',
          params: {
            token: this.token,
            nickName: '',
            phone: '',
            utype: '',
            isForbid: '',
            pageSize: this.pageSize,
            pageNum: this.pageNum,
          }, success: (data) => {
            console.log(data)
            this.tableData = data.data.list
            this.pagetotal = data.data.total
            this.fansCount = data.data.fansCount
            this.vipCount = data.data.vipCount
          }
        })
      },
      // 状态值
      getchange(val) {
        console.log(val)
        this.formInline.region = val
        console.log(this.formInline.region)
      },
      // 用户类型
      gettype(val) {
        console.log(val)
        this.formInline.type = val
      },
      // 搜索
      getfind() {
        this.$api.post({
          path: '/manage/getUserList',
          params: {
            token: this.token,
            nickName: this.formInline.nick,
            phone: this.formInline.phone,
            utype: this.formInline.type,
            userRole: this.formInline.userRole,
            isForbid: this.formInline.region
          }, success: (data) => {
            console.log(data)
            this.tableData = data.data.list
            this.pagetotal = data.data.total
          }
        })
      },

      // 获取用户id
      handleSelectionChange(val) {
        this.multipleSelection = val;

        let ids = []
        val.forEach(e => {
          ids.push(e.uid)
        })

        this.uids = ids
        console.log(ids, '用户id')
      },

      // 删除用户
      getdelete() {
        this.$api.post({
          path: '/manage/operationUser',
          params: {
            token: this.token,
            uids: this.uids.join(","),
            type: 3,//1恢复、2禁用、3删除

          },
          success: (data) => {
            console.log(data)
            if (data.code == 1) {
              this.$message({
                message: data.msg,
                type: 'success'
              });
              this.getUserList()
            } else {
              this.$message({
                message: '请选择要删除的用户信息',
                type: 'warning'
              });
            }
          }
        })
      },

      // 禁用
      getDisable() {
        this.$api.post({
          path: '/manage/operationUser',
          params: {
            token: this.token,
            uids: this.uids.join(","),
            type: 2,//1恢复、2禁用、3删除
          },
          success: (data) => {
            console.log(data)
            if (data.code == 1) {
              this.$message({
                message: data.msg,
                type: 'success'
              });
              this.getUserList()
            } else {
              this.$message({
                message: '请选择要禁用的用户信息',
                type: 'warning'
              });
            }
          }
        })
      },

      // 恢复
      getrecovery() {
        this.$api.post({
          path: '/manage/operationUser',
          params: {
            token: this.token,
            uids: this.uids.join(","),
            type: 1,//1恢复、2禁用、3删除
          },
          success: (data) => {
            console.log(data)
            if (data.code == 1) {
              this.$message({
                message: data.msg,
                type: 'success'
              });
              this.getUserList()
            } else {
              this.$message({
                message: '请选择要恢复的用户信息',
                type: 'warning'
              });
            }
          }
        })
      },

      // 我的团队
      myteam(index, row) {
        console.log(index, row);
        this.teamVisible = true;
        this.$api.post({
          path: '/manage/getTeam',
          params: {
            token: this.token,
            uid: row.uid
          }, success: (data) => {
            console.log(data)
            this.teamData = data.data
          }
        })
      },

      // 我的团队下级团队
      myteams(index, row) {
        console.log(index, row);
        this.teamsVisible = true;
        console.log(row.uid)
        this.$api.post({
          path: '/manage/getTeam',
          params: {
            token: this.token,
            uid: row.uid
          }, success: (data) => {
            console.log(data)
            this.teamsData = data.data
          }
        })
      },

      

      // 收益统计
      profit(index, row) {
        console.log(index, row);
        this.profitVisible = true;
        this.$api.post({
          path: '/manage/getRevenueStatistics',
          params: {
            token: this.token,
            uid: row.uid
          }, success: (data) => {
            console.log(data)
            this.profitData = data.data
          }
        })
      },
        // 删除
        bus(index, row) {
            console.log(index, row);
            this.busVisible = true;
            this.uid = row.uid

        },
        setBus() {
            this.$api.post({
                path: '/manage/setBus',
                params: {
                    token: this.token,
                    uid: this.uid
                }, success: (data) => {
                    console.log(data)
                    if (data.code == 1) {
                        this.$message({
                            message: data.msg,
                            type: 'success'
                        });
                        this.getUserList()
                        this.busVisible = false
                    }

                }
            })
        },
      // 导出
      getexport() {
        let params = {
          token: this.token,
          type: 1
        }
        // params.is_export = 1
        this.$download('http://manager.zhizhennengyuan.com:8000/manage/export', params, '用户列表').then(res => {
          console.log(res, 'res1')
        })
      },
    },
    mounted() {
      this.getUserList()
    }
  };
</script>

<style>
  * {
    padding: 0;
    margin: 0;
  }

  .userlist {
    width: 100%;
    height: 100%;
  }

  .userlist .el-dialog__header {
    padding: 12px 20px 10px;
  }

  .userlist .el-dialog__title {
    color: #606266;
    font-size: 14px;
  }

  .userlist .el-dialog__body {
    padding-top: 20px;
    padding-bottom: 100px;
    border-top: 1px solid #ccc;
  }

  .usermain {
    /* width: 98%;
    height: 80%; */
    padding: 10px 10px 0px 10px;

  }

  .myteam>div p {
    padding-bottom: 0px;
  }

  .userfind {
    width: 100%;

    padding-top: 10px;
    background-color: white;
    margin-bottom: 10px;
  }

  .userfind .el-form-item__content {
    width: 160px;
  }

  .userdata {
    /* width: 98%;
    height: 670px; */
    padding: 10px 20px;
    background-color: white;
  }

  .userdata .upload-demo {
    display: inline-block;
    margin-left: 10px;
  }

  .userdata .iconfont {
    font-size: 12px;
  }

  .userdata .recovery {
    background-color: rgb(48, 216, 192);
    color: white;
    border: 0px;
  }

  .userdata .disable {
    background-color: rgb(255, 102, 0);
    color: white;
    border: 0px;
  }

  .userdata .delete {
    background-color: rgb(234, 74, 92);
    color: white;
    border: 0px;
  }

  .userdata .commonbtn {
    /* height: 30px; */
    background-color: rgb(54, 116, 255);
    color: white;
    border: 0px;
  }

  .el-table th,
  td {
    text-align: center !important;
  }

  .el-table td {
    font-size: 12px;
  }
</style>