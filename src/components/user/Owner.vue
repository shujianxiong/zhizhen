<template>
  <div class="userlist">
    <el-menu :default-active="activeIndex2" class="el-menu-demo" mode="horizontal" @select="handleSelect"
      background-color="white" text-color="#f999" active-text-color="rgb(18,42,136)">
      <el-menu-item index="1">业主列表</el-menu-item>
    </el-menu>

    <div class="usermain">
      <div class="userfind">
        <el-form :inline="true" :model="formInline" class="demo-form-inline" size="small" style="margin-left: 10px">
          <el-form-item>
            <el-input v-model="formInline.nickName" placeholder="请输入昵称"></el-input>
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
          <el-button size="small" class="commonbtn" icon="iconfont iconinport" @click='getexport'>导出</el-button>
        </el-row>

        <el-table ref="multipleTable" border :data="tableData" tooltip-effect="dark">
          <el-table-column prop="ownerId" label="id" width="45">
            <!-- <template slot-scope="scope">
              {{scope.$index+1}}
            </template> -->
          </el-table-column>
          <el-table-column prop="nickName" label="业务员">
          </el-table-column>
          <el-table-column prop="ownerName" label="业主"> </el-table-column>
          <el-table-column prop="ownerAddress" label="业主地址">
          </el-table-column>
          <el-table-column prop="projectAddress" label="项目地址">
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间"> </el-table-column>
            <el-table-column label="操作" width="200">
                <template slot-scope="scope">
                    <el-button size="mini" type="primary" @click="details(scope.$index, scope.row)">详情
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
      </div>
    </div>

      <!-- 详情 -->
      <el-dialog title="详情" :visible.sync="detailsVisible" width="30%">
          <div class="information">
              <div style="width: 100%; margin: 0 auto; ">
                  <div class="salemessage">
                      <div>业主：{{ownerdetails.ownerName}}</div>
                      <div>业主手机号：{{ownerdetails.ownerPhone}}</div>
                      <div>业主地址：{{ownerdetails.ownerAddress}}</div>
                      <div>业主身份证：{{ownerdetails.ownerCard}}</div>
                      <div>项目地址：{{ownerdetails.projectAddress}}</div>
                      <div>负责人：{{ownerdetails.nickName}}</div>
                  </div>
              </div>
          </div>
      </el-dialog>
  </div>
</template>


<script>
  export default {
    data() {
      return {
        token: localStorage.getItem('token'),
        nemberName: localStorage.getItem('nemberName'),

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

        uids: [],//用户id
        // myteamList:[]
        fansCount: '',
        vipCount: '',
        html:'',
          // 详情
          detailsVisible: false,
          ownerdetails: {},
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
      // ImportUserExcel(){
      //   this.$api.post({

      //   })
      // },
      // 业主列表
      getUserList() {
        this.$api.post({
          path: '/manage/getOwnerList',
          params: {
            token: this.token,
            nickName: '',
            phone: '',
            pageSize: this.pageSize,
            pageNum: this.pageNum
          }, success: (data) => {
            console.log(data)
            this.tableData = data.data.list
            this.pagetotal = data.data.total
            this.fansCount = data.data.fansCount
            this.vipCount = data.data.vipCount
          }
        })
      },
        // 详情
        details(index, row) {
            this.detailsVisible = true;
            this.$api.post({
                path: '/manage/getOwnerDetail',
                params: {
                    token: this.token,
                    ownerId: row.ownerId
                }, success: (data) => {
                    this.ownerdetails = data.data
                }
            })
        },
      // 搜索
      getfind() {
        this.$api.post({
          path: '/manage/getOwnerList',
          params: {
            token: this.token,
            nickName: this.formInline.nickName
          }, success: (data) => {
            console.log(data)
            this.tableData = data.data.list
            this.pagetotal = data.data.total
          }
        })
      },


      // 导出
      getexport() {
        let params = {
          token: this.token,
          type: 11
        }
        // params.is_export = 1
        this.$download('http://manager.zhizhennengyuan.com:8000/manage/export', params, '业主列表').then(res => {
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