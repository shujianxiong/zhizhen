<!-- 售后列表 -->
<template>
  <div class="salelist">
    <el-menu :default-active="activeIndex2" class="el-menu-demo" mode="horizontal" @select="handleSelect"
      background-color="white" text-color="#f999" active-text-color="rgb(18,42,136)">
      <el-menu-item index="1">售后列表</el-menu-item>
    </el-menu>
    <div class="salemain">
      <div class="salefind">
        <el-form :inline="true" :model="formInline" class="demo-form-inline" size="small" style="margin-left: 10px">
          <el-form-item>
            <el-input v-model="formInline.refundno" placeholder="请输入退款编号"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="formInline.orderno" placeholder="请输入订单编号"></el-input>
          </el-form-item>
          <el-date-picker v-model="formInline.time" type="daterange" range-separator="-" start-placeholder="申请时间"
            end-placeholder="申请时间" value-format="yyyy-MM-dd">
          </el-date-picker>
          <el-form-item>
            <el-input v-model="formInline.nick" placeholder="请输入用户昵称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="formInline.phone" placeholder="请输入用户手机号"></el-input>
          </el-form-item>
          <el-form-item>
            <el-select v-model="formInline.salestate" clearable placeholder="请选择售后状态">
              <el-option label="待审核" value="1"></el-option>
              <el-option label="审核通过" value="2"></el-option>
              <el-option label="审核不通过" value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button style="background-color: rgb(54, 116, 255); color: white" icon="el-icon-search" @click="getfind">
              查询
            </el-button>
          </el-form-item>
        </el-form>
      </div>

      <div class="saledata">
        <el-row style="margin-bottom: 12px">
          <el-button size="small" class="commonbtn" icon="iconfont iconinport" @click='getexport'>导出</el-button>
        </el-row>
        <el-table ref="multipleTable" border :data="tableData" tooltip-effect="dark"
          style="margin-bottom: 15px; font-size: 14px" class="table" :header-cell-style="getRowClass"
          @selection-change="handleSelectionChange">
          <el-table-column label="id" width="45">
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column prop="refundNo" label="退款编号"> </el-table-column>
          <el-table-column prop="orderNo" label="订单编号"> </el-table-column>
          <el-table-column prop="createTime" label="申请时间">
          </el-table-column>
          <el-table-column prop="nickName" label="用户昵称"> </el-table-column>
          <el-table-column prop="phone" label="用户手机号"> </el-table-column>
          <el-table-column prop="refundAmount" label="退款金额">
          </el-table-column>
          <el-table-column prop="refundStatus" label="售后状态">
            <template slot-scope="scope">
              <p v-show="scope.row.refundStatus == 1">申请中</p>
              <p v-show="scope.row.refundStatus == 2">退货中</p>
              <p v-show="scope.row.refundStatus == 3">退货成功</p>
              <p v-show="scope.row.refundStatus == 4">审核驳回</p>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="details(scope.$index, scope.row)">详情
              </el-button>
              <el-button size="mini" type="primary" v-show="scope.row.refundStatus == 2"
                @click="receiving(scope.$index, scope.row)">确认收货
              </el-button>
              <el-button size="mini" type="primary" v-show="scope.row.refundStatus == 1"
                @click="examine(scope.$index, scope.row)">审核
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="salefoot" style="display: flex;">
          <div >
            <span>订单数量：{{ tableData.length }}</span>
            <span>退款金额：{{ totalPrice | numFilter }}元</span>
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

    <!-- 售后详情 -->
    <el-dialog title="详情" :visible.sync="detailsVisible" width="45%">
      <div class="information">
        <div style="width: 100%; margin: 0 auto">
          <div class="salesmessage">
            <P><i class="iconfont iconjinqi"></i>订单信息</P>
            <div class="salesnews">
              <div>退款编号：{{ saledetails.refundNo }}</div>
              <div>订单编号：{{ saledetails.orderNo }}</div>
              <div>申请时间：{{ saledetails.createTime }}</div>
              <div>
                订单状态：
                <span style="color: rgb(56, 118, 255)" v-show="saledetails.refundStatus == 1">待审核</span>
                <span style="color: rgb(56, 118, 255)" v-show="saledetails.refundStatus == 2">退货中</span>
                <span style="color: rgb(56, 118, 255)" v-show="saledetails.refundStatus == 3">审核通过</span>
                <span style="color: rgb(56, 118, 255)" v-show="saledetails.refundStatus == 4">审核不通过</span>
              </div>
              <div>退款金额：{{ saledetails.refundAmount }}元</div>
            </div>
            <el-table ref="multipleTable" border :data="message" tooltip-effect="dark"
              style="margin-bottom: 15px; font-size: 14px" :header-cell-style="getRowClass"
              @selection-change="handleSelectionChange">
              <el-table-column prop="id" label="id" width="45">
              </el-table-column>
              <el-table-column label="商品封面图">
                <template slot-scope="scope">
                  <img :src="scope.row.coverImg" height="50" width="50" />
                </template>
              </el-table-column>
              <el-table-column prop="goodsName" label="商品名称">
              </el-table-column>
              <el-table-column prop="goodsclass" label="商品分类">
                <template slot-scope="scope">
                  {{ scope.row.firstCateName }}-{{ scope.row.secondCateName }}
                </template>
              </el-table-column>
              <el-table-column prop="num" label="数量"> </el-table-column>
              <el-table-column prop="price" label="单价"> </el-table-column>
              <el-table-column prop="total" label="总价"> </el-table-column>
            </el-table>
          </div>
          <div class="salemessage">
            <P><i class="iconfont iconjinqi"></i>售后信息</P>
            <div>退款理由：{{ saledetails.refundReason }}</div>
            <div class="evaluatebox">
              <span>图片：</span>
              <div class="evaluateimg">
                <img v-for="item in refundImgList" :key="item.orderRefundImgId" :src="item.src" alt="" />
              </div>
            </div>
            <div
              v-show="saledetails.refundStatus == 2 || saledetails.refundStatus == 3 || saledetails.refundStatus == 4">
              审核时间：{{ saledetails.approveTime }}</div>
            <div v-show='saledetails.refundStatus == 2 || saledetails.refundStatus == 4'>驳回原因：{{
              saledetails.rejectReason }}</div>
          </div>
        </div>
      </div>
    </el-dialog>

    <!-- 审核 -->
    <el-dialog title="审核" :visible.sync="examineVisible" width="30%" :close-on-click-modal="false">
      <div class="information">
        <div style="width: 100%; margin: 0 auto" class="examinebox">
          <div class="salemessage">
            <P><i class="iconfont iconjinqi"></i>申请信息</P>
            <div>退款编号：{{ examinedata.refundNo }}</div>
            <div>退款金额：{{ examinedata.refundAmount }}元</div>
            <div>申请时间：{{ examinedata.createTime }}</div>
            <div>退货理由：{{ examinedata.refundReason }}</div>
            <div class="evaluatebox">
              <span>图片：</span>
              <div class="evaluateimg">
                <img v-for="item in refundImgList" :key="item.orderRefundImgId" :src="item.src" alt="" />
              </div>
            </div>
          </div>
          <div class="salemessage">
            <P><i class="iconfont iconjinqi"></i>审核信息</P>
            <el-form ref="forms" :model="forms" label-width="80px" label-position="left">
              <el-form-item label="审核" class="shenhe">
                <el-radio-group v-model="forms.resource" @change="agreeChange">
                  <el-radio :label="2">通过</el-radio>
                  <el-radio :label="4">不通过</el-radio>
                </el-radio-group>
              </el-form-item>

              <div style="width: 100%" v-show="!btnstatus">
                <el-form-item label="驳回理由">
                  <el-input type="textarea" v-model="forms.desc"></el-input>
                </el-form-item>
              </div>
              <el-form-item label="">
                <el-button style="background-color: rgb(54, 116, 255); color: white"
                  @click="examineVisible = false,approveOrderRefund()">确定
                </el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </el-dialog>

    <!-- 确认收货 -->
    <el-dialog title="确认收货" :visible.sync="receivVisible" width="25%">
      <div class="information">
        <div style="width: 100%; margin: 0 auto" class="examinebox">
          <p>确认是否收到客户的退货？</p>
          <div style="margin-left: auto; width: 50%">
            <el-button type="info" @click="receivVisible = false">取消</el-button>
            <el-button type="primary" @click="receivVisible = false,confirmGoods()">确定</el-button>
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
        activeIndex2: "1",
        currentPage: 1,
        token: localStorage.getItem("token"),

        pagetotal: 0,
        pageNum: 1,
        pageSize: 10,
        // 搜索
        formInline: {
          refundno: "",
          orderno: "",
          nick: "",
          phone: "",
          time: "",
          salestate: "",
        },
        totalPrice: 0,
        tableData: [],

        // 售后详情
        detailsVisible: false,
        saledetails: {}, //售后详情
        refundImgList: [], //退货图片
        message: [],

        // 审核
        examineVisible: false,
        examinedata: {},
        forms: {
          resource: 2,
          desc: "",
          id: "",
          status: "",
        },
        btnstatus: true,

        // 确认收货
        receivVisible: false,
        refundId: ""
      };
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
          return "background:RGB(242,242,242)";
        } else {
          return "";
        }
      },



      // 分页
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.pageSize = val
        this.getRefundList()
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.pageNum = val
        this.getRefundList()
      },

      // 售后列表
      getRefundList() {
        this.$api.post({
          path: "/manage/getRefundList",
          params: {
            token: this.token,
            refundNo: "",
            orderNo: "",
            startTime: "",
            endTime: "",
            nickName: "",
            phone: "",
            refundStatus: "",
            pageNum: this.pageNum,
            pageSize: this.pageSize
          },
          success: (data) => {
            console.log(data);
            this.tableData = data.data.list;
            this.pagetotal = data.data.total
            this.totalP();
          },
        });
      },

      // 导出
      getexport() {
        let params = {
          token: this.token,
          type: 4
        }
        // params.is_export = 1
        this.$download('http://manager.zhizhennengyuan.com:8000/manage/export', params, '售后列表').then(res => {
          console.log(res, 'res1')
        })
      },

      // 售后详情
      details(index, row) {
        console.log(index, row);
        this.detailsVisible = true;

        this.$api.post({
          path: "/manage/getRefundDetail",
          params: {
            token: this.token,
            refundId: row.refundId,
          },
          success: (data) => {
            console.log(data);
            this.saledetails = data.data;
            this.refundImgList = data.data.orderRefundImgList;
            this.message = data.data.orderGoodsList;
          },
        });
      },

      // 售后状态
      getPaytype(val) {
        console.log(val);
        this.formInline.salestate = val;
      },
      // 搜索
      getfind() {
        this.$api.post({
          path: "/manage/getRefundList",
          params: {
            token: this.token,
            refundNo: this.formInline.refundno,
            orderNo: this.formInline.orderno,
            startTime: this.formInline.time[0],
            endTime: this.formInline.time[0],
            nickName: this.formInline.nick,
            phone: this.formInline.phone,
            refundStatus: this.formInline.salestate,
          },
          success: (data) => {
            console.log(data);
            this.tableData = data.data.list;
            this.totalP();
          },
        });
      },

      // 退款金额
      totalP() {
        let total = 0;
        this.tableData.forEach((e) => {
          total += e.refundAmount;
        });

        this.totalPrice = total;
      },

      // 审核
      examine(index, row) {
        console.log(index, row);
        this.examineVisible = true;
        this.$api.post({
          path: "/manage/getRefundDetail",
          params: {
            token: this.token,
            refundId: row.refundId,
          },
          success: (data) => {
            console.log(data);
            this.examinedata = data.data;
            this.refundImgList = data.data.orderRefundImgList;
            this.forms.id = data.data.refundId;
          },
        });
      },
      agreeChange: function (val) {
        let that = this;
        that.btnstatus = val == 1 ? true : false;
        console.log(val);
        that.forms.resource = val;
      },

      approveOrderRefund() {
        this.$api.post({
          path: "/manage/approveOrderRefund",
          params: {
            token: this.token,
            refundId: this.forms.id,
            refund_status: this.forms.resource,
            reject_reason: this.forms.desc,
          },
          success: (data) => {
            console.log(data);
            if (data.code == 1) {
              this.$message({
                message: data.msg,
                type: "success",
              });
              this.getRefundList()
            }
          },
        });
      },

      // 确认收货
      receiving(index, row) {
        console.log(index, row);
        this.receivVisible = true;
        this.refundId = row.refundId
      },

      confirmGoods() {
        this.$api.post({
          path: '/manage/confirmGoods',
          params: {
            token: this.token,
            refundId: this.refundId
          }, success: (data) => {
            console.log(data)
            if (data.code == 1) {
              this.$message({
                message: data.msg,
                type: "success",
              });
              this.getRefundList()
            }
          }
        })
      }
    },
    mounted() {
      this.getRefundList();
      // this.totalP()、、
    },
    filters: {
      numFilter(value) {
        // 截取当前数据到小数点后两位
        let realVal = parseFloat(value).toFixed(2);
        return realVal;
      },
    }, watch: {
      "formInline.time"(newVal) {
        if (newVal == null) {
          this.formInline.time = [];
        }
      }
    }
  };
</script>

<style>
  * {
    padding: 0;
    margin: 0;
    cursor: default;
  }

  .salelist {
    width: 100%;
    height: 100%;
  }

  .salemain {
    /* width: 98%;
    height: 80%; */
    padding: 10px 10px 0px 10px;

  }

  .salefind {
    width: 100%;

    padding-top: 10px;
    background-color: white;
    margin-bottom: 10px;
  }

  .salefind .el-form-item__content {
    width: 160px;
  }

  /* 日期 */
  .salefind .el-date-editor--daterange.el-input__inner {
    width: 200px;
    height: 32px;
    margin-right: 10px;
  }

  .salefind .el-date-editor .el-range-input {
    font-size: 12px;
  }

  .salefind .el-date-editor .el-range__icon {
    line-height: 25px;
  }

  .salefind .el-date-editor .el-range-separator {
    color: #c0c4cc;
    line-height: 21px;
  }

  .saledata {
    /* width: 98%;
    height: 100%; */
    padding: 10px 20px;
    background-color: white;
  }

  .saledata .iconfont {
    font-size: 12px;
  }

  .saledata .recovery {
    background-color: rgb(48, 216, 192);
    color: white;
    border: 0px;
  }

  .saledata .disable {
    background-color: rgb(255, 102, 0);
    color: white;
    border: 0px;
  }

  .saledata .delete {
    background-color: rgb(234, 74, 92);
    color: white;
    border: 0px;
  }

  .saledata .commonbtn {
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

  .salefoot span:first-child {
    display: inline-block;
    margin-right: 15px;
  }

  /* 售后详情 */
  .salelist .el-dialog__header {
    padding: 12px 20px 10px;
  }

  .salelist .el-dialog__title {
    color: #606266;
    font-size: 14px;
  }

  .salelist .el-dialog__body {
    padding-top: 20px;
    /* padding-bottom: 100px; */
    border-top: 1px solid #ccc;
  }

  .salesmessage {
    width: 100%;
    margin-bottom: 80px;
  }

  .salesmessage p {
    color: rgb(56, 118, 255);
    font-weight: bold;
    /* line-height: 19px; */
  }

  .salesmessage p i {
    display: inline-block;
    margin-right: 5px;
    font-size: 15px;
    /* line-height: 18px; */
  }

  .salesnews {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
  }

  .salesnews>div {
    width: 50%;
    margin-bottom: 10px;
  }

  .evaluatebox {
    width: 100%;
    display: flex;
  }

  .evaluateimg {
    width: 80%;
    display: flex;
  }

  .evaluateimg img {
    width: 70px;
    height: 70px;
    margin-right: 10px;
  }

  .salemessage {
    width: 100%;
    margin-bottom: 10px;
  }

  .salemessage p {
    color: rgb(56, 118, 255);
    font-weight: bold;
    /* line-height: 19px; */
  }

  .salemessage p i {
    display: inline-block;
    margin-right: 5px;
    font-size: 15px;
    /* line-height: 18px; */
  }

  .salenews {
    width: 100%;
    /* display: flex;
        flex-wrap: wrap; */
  }

  .salemessage div {
    /* width: 50%; */
    margin-bottom: 10px;
  }

  .deliverbox .el-input {
    width: 80%;
  }

  .examinebox .el-button {
    padding: 10px 25px;
    margin-top: 20px;
  }

  .shenhe .el-form-item__content {
    line-height: 50px;
  }

  .salemessage .el-textarea__inner {
    height: 120px;
    width: 80%;
  }
</style>