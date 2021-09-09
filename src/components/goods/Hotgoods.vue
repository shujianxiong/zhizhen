<template>
  <div class="hotgoods">
    <el-menu :default-active="activeIndex2" class="el-menu-demo" mode="horizontal" @select="handleSelect"
      background-color="white" text-color="#f999" active-text-color="rgb(18,42,136)">
      <el-menu-item index="1">热卖商品</el-menu-item>
    </el-menu>

    <div class="hotmain">
      <div class="hotfind">
        <el-form :inline="true" :model="formInline" class="demo-form-inline" size="small" style="margin-left: 10px">
          <el-form-item>
            <el-input v-model="formInline.goodsname" placeholder="请输入商品名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-select v-model="formInline.classA"  placeholder="请选择一级分类" @change="seloneCate">
              <el-option label="请选择一级分类" value=""></el-option>
              <el-option v-for="(item, index) in oneCateLiat" :label="item.cateName" :key="index" :value="item.cateId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="formInline.classB" placeholder="请选择二级分类"                            >
              <el-option label="请选择二级分类" value=""></el-option>
              <el-option v-for="item in twoCateLiat" :key="item.cateId" :label="item.cateName" :value="item.cateId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="formInline.region" placeholder="请选择状态" @change="getfindType">
              <el-option label="请选择状态" value=""></el-option>
              <el-option label="上架" value="1"></el-option>
              <el-option label="下架" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button style="background-color: rgb(54, 116, 255); color: white" icon="el-icon-search"
              @click="getHotlist">查询
            </el-button>
          </el-form-item>
        </el-form>
      </div>

      <div class="hotdata">
        <el-row style="margin-bottom: 12px">
          <el-button size="small" class="commonbtn" @click="selectVisible = true">选择商品
          </el-button>
          <el-button size="small" class="delete" icon="el-icon-close" @click="outVisible = true">删除</el-button>
        </el-row>

        <el-table ref="multipleTable" border :data="tableData" tooltip-effect="dark"
          style="margin-bottom: 15px; font-size: 14px" class="table" :header-cell-style="getRowClass"
          @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column label="id" width="45">
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column prop="goodsName" label="商品名称"> </el-table-column>
          <el-table-column prop="goodsclass" label="商品分类">
            <template slot-scope="scope">
              {{ scope.row.oneCateName }}-{{ scope.row.twoCateName }}
            </template>
          </el-table-column>
          <el-table-column label="封面图">
            <template slot-scope="scope">
              <img :src="scope.row.coverImg" width="50" height="50" />
            </template>
          </el-table-column>
          <el-table-column prop="originalProice" label="原价"></el-table-column>
          <el-table-column prop="memberPrice" label="会员价"> </el-table-column>
          <el-table-column prop="costPrice" label="成本价"> </el-table-column>
          <el-table-column prop="provider" label="供应商"> </el-table-column>
          <el-table-column prop="state" label="状态" width="70">
            <template slot-scope="scope">
              <p v-show="scope.row.shelfStatus == '1'">上架</p>
              <p v-show="scope.row.shelfStatus == '2'">下架</p>
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
    <!-- 选择商品 -->
    <el-dialog title="选择商品" :visible.sync="selectVisible" width="1000px" :close-on-click-modal="false">
      <div class="information select">
        <div style="width: 100%; margin: 0 auto">
          <el-row style="margin-bottom: 12px">
            <el-form :inline="true" :model="selectform" class="demo-form-inline" size="small" style="margin-left: 10px">
              <el-form-item>
                <el-input v-model="selectform.goodsName"  placeholder="请输入商品名称"></el-input>
              </el-form-item>
              <el-form-item>
                <el-select v-model="selectform.classA" clearable placeholder="请选择一级分类" @change='seleconeCate'>
                  
                  <el-option v-for="(item, index) in selectform.oneCateLiat" :label="item.cateName" :key="index"
                    :value="item.cateId"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-select v-model="selectform.classB" clearable placeholder="请选择二级分类" >
                  
                  <el-option v-for="(item, index) in selectform.twoCateLiat" :label="item.cateName" :key="index"
                    :value="item.cateId"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-select v-model="selectform.region" clearable placeholder="请选择状态" @change='selsectType'>
                  <el-option label="上架" value="1"></el-option>
                  <el-option label="下架" value="2"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button style="background-color: rgb(54, 116, 255); color: white" icon="el-icon-search"
                  @click="selgoodsFind">查询
                </el-button>
                <el-button style="background-color: rgb(54, 116, 255); color: white"
                  @click="addHomeGoods()">确定
                </el-button>
              </el-form-item>
            </el-form>
          </el-row>

          <el-table ref="multipleTable" border :data="selectData" tooltip-effect="dark"
            style="margin-bottom: 15px; font-size: 14px" class="table" :header-cell-style="getRowClass"
            @selection-change="SelectionChange">
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column label="id" width="45">
              <template slot-scope="scope">
                {{ scope.$index + 1 }}
              </template>
            </el-table-column>
            <el-table-column prop="goodsName" label="商品名称">
            </el-table-column>
            <el-table-column label="商品分类">
              <template slot-scope="scope">
                {{ scope.row.oneCateName }}-{{ scope.row.twoCateName }}
              </template>
            </el-table-column>
            <el-table-column label="封面图">
              <template slot-scope="scope">
                <img :src="scope.row.coverImg" width="50" height="50" />
              </template>
            </el-table-column>
            <el-table-column prop="originalProice" label="原价"></el-table-column>
            <el-table-column prop="memberPrice" label="会员价">
            </el-table-column>
            <el-table-column prop="costPrice" label="成本价"> </el-table-column>
            <el-table-column prop="provider" label="供应商"> </el-table-column>
            <el-table-column prop="state" label="状态" width="70">
              <template slot-scope="scope">
                <p v-show="scope.row.shelfStatus == '1'">上架</p>
                <p v-show="scope.row.shelfStatus == '2'">下架</p>
              </template>
            </el-table-column>
          </el-table>
          <div class="page" style="position: relative; width: 100%;">
            <div class="grid-content bg-purple-light" style="position: absolute; right: 0;">
              <el-pagination background @size-change="selSizeChange" @current-change="selCurrentChange"
                :current-page="selectform.pageNum" :page-size="selectform.pageSize"
                layout="total, sizes, prev, pager, next, jumper" :total="selectform.pagetotal">
              </el-pagination>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>

    <el-dialog title="删除" :visible.sync="outVisible" width="20%" :before-close="handleClose">
      <span>确认删除？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="outVisible = false">取 消</el-button>
        <el-button type="primary" @click="(outVisible = false), delHotGoods()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        activeIndex2: "1",
        pageNum: 1,
        token: localStorage.getItem("token"),
        pagetotal: 0,
        pageSize: 10,

        outVisible: false,

        oneCateid: "",
        oneCateLiat: [], //一级分类

        twoCateid: "",
        twoCateLiat: [], //二级分类
        // 搜索
        formInline: {
          goodsName: "",
          classA: "",
          classB: "",
          region: "",
        },

        tableData: [],

        // 选择商品
        selectVisible: false,
        selectform: {
          goodsName: "",
          classA: "",
          classB: "",
          region: "",
          oneCateLiat: [],
          twoCateLiat: [],
          pageNum: 1,
          pageSize: 10,
          pagetotal: 0,
        },
        selectData: [],
        goodsIds: [],
        goodsHotIds: [],
        multipleSelection: {}
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
      // 分页
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.pageSize = val;
        this.getHotlist();
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.pageNum = val;
        this.getHotlist();
      },

      // 获取一级分类
      getCate(cateId,val) {
        this.$api.post({
          path: "/manage/getCate",
          params: {
            token:this.token,
            cateId: cateId,
          },
          success: (data) => {
            if(val == 1){
              this.oneCateLiat = data.data;
            } else{
              this.twoCateLiat = data.data;
            }
            
          },
        });
      },
      seloneCate(val) {
        // this.oneCateid = val;
        this.formInline.classB = "";
        this.twoCateLiat = []
        this.getCate(val,2)
      },
      
      getfindType(val) {
        this.formInline.region = val;
      },
      getHotlist() {
        this.$api.post({
          path: "/manage/getBestSellers",
          params: {
            token: this.token,
            goodsName: this.formInline.goodsName,
            oneCateName: this.formInline.classA,
            twoCateName: this.formInline.classB,
            shelfStatus: this.formInline.region,
            pageNum: this.pageNum,
            pageSize: this.pageSize,
          },
          success: (data) => {
            console.log(data);
            this.tableData = data.data.list;
            this.pagetotal = data.data.total;
          },
        });
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
        this.outVisible = false
      },

      // 热卖商品列表
      // getHotlist() {
      //   this.$api.post({
      //     path: "/manage/getBestSellers",
      //     params: {
      //       token: this.token,
      //       goodsName: "",
      //       oneCateName: "",
      //       twoCateName: "",
      //       shelfStatus: "",
      //       pageNum: this.pageNum,
      //       pageSize: this.pageSize,
      //     },
      //     success: (data) => {
      //       console.log(data);
      //       this.tableData = data.data.list;
      //       this.pagetotal = data.data.total;
      //     },
      //   });
      // },

      // 获取一级分类
      getselCate(cateId,val) {
        this.$api.post({
          path: "/manage/getCate",
          params: {
            token:this.token,
            cateId:cateId,
          },
          success: (data) => {
            console.log(data);
            if(val == 1){
              this.selectform.oneCateLiat = data.data;
            }else{
              this.selectform.twoCateLiat = data.data;
            }
            
          },
        });
      },
      seleconeCate(val) {
        // this.oneCateid = val;
        this.selectform.classB = "";
        this.selectform.twoCateLiat = []
        this.getselCate(val,2)
      },
      // selectwoCate(val) {
      //   this.selectform.classB = val;
      // },
      selsectType(val) {
        this.selectform.region = val;
      },
      selgoodsFind() {
        this.$api.post({
          path: "/manage/getBestSellersGoodsList",
          params: {
            token: this.token,
            goodsName: this.selectform.goodsName,
            oneCateName: this.selectform.classA,
            twoCateName: this.selectform.classB,
            shelfStatus: this.selectform.region,
            pageNum: this.selectform.pageNum,
            pageSize: this.selectform.pageSize,
          },
          success: (data) => {
            console.log(data);
            this.selectData = data.data.list;
            this.selectform.pagetotal = data.data.total;
          },
        });
      },

      // 选择商品列表
      // getBestSellersGoodsList() {
      //   this.$api.post({
      //     path: "/manage/getBestSellersGoodsList",
      //     params: {
      //       token: this.token,
      //       goodsName: "",
      //       oneCateName: "",
      //       twoCateName: "",
      //       shelfStatus: "",
      //       pageNum: this.selectform.pageNum,
      //       pageSize: this.selectform.pageSize,
      //     },
      //     success: (data) => {
      //       console.log(data);
      //       this.selectData = data.data.list;
      //       this.selectform.pagetotal = data.data.total;
      //     },
      //   });
      // },

      // 分页
      selSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.selectform.pageSize = val;
        this.selgoodsFind();
      },
      selCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.selectform.pageNum = val;
        this.selgoodsFind();
      },

      // 添加
      SelectionChange(val) {
        this.multipleSelection = val;
        let ids = [];
        val.forEach((e) => {
          ids.push(e.goodsId);
        });

        this.goodsIds = ids;
        console.log(ids);
      },

      addHomeGoods() {
        this.$api.post({
          path: "/manage/addHomeGoods",
          params: {
            token: this.token,
            goodsIds: this.goodsIds.join(","),
          },
          success: (data) => {
            console.log(data);
            if (data.code == 1) {
              this.$message({
                message: data.msg,
                type: "success",
              });
              this.multipleSelection = {}
              this.selectVisible = false
              this.getHotlist();
              this.selgoodsFind()
            }
          },
        });
      },

      // 删除
      handleSelectionChange(val) {
        //   this.multipleSelection = val;
        let ids = [];
        val.forEach((e) => {
          ids.push(e.goodsHotId);
        });

        this.goodsHotIds = ids;
        console.log(ids);
      },
      delHotGoods() {
        if (this.goodsHotIds.join(",") == '') {
          this.$message({
            message: "请选择要操作的商品信息",
            type: "warning",
          });
        } else {
          this.$api.post({
            path: "/manage/delHotGoods",
            params: {
              token: this.token,
              goodsHotIds: this.goodsHotIds.join(","),
            },
            success: (data) => {
              console.log(data);
              if (data.code == 1) {
                this.$message({
                  message: data.msg,
                  type: "success",
                });
                this.getHotlist();
              }
            },
          });
        }

      },
    },

    mounted() {
      this.getHotlist();
      this.getCate(0,1);
      this.selgoodsFind();
      this.getselCate(0,1)
    },
  };
</script>

<style>
  * {
    padding: 0;
    margin: 0;
  }

  .hotgoods {
    width: 100%;
    height: 100%;
  }

  .hotmain {
    /* width: 98%;
    height: 80%; */
    padding: 10px 10px 0px 10px;

  }

  .hotfind {
    width: 100%;
    
    padding-top: 10px;
    background-color: white;
    margin-bottom: 10px;
  }

  .hotfind .el-form-item__content {
    width: 160px;
  }

  .hotdata {
    /* width: 98%;
    height: 100%; */
    padding: 10px 20px;
    background-color: white;
  }

  .hotdata .recovery {
    background-color: rgb(48, 216, 192);
    color: white;
    border: 0px;
  }

  .hotdata .disable {
    background-color: rgb(255, 102, 0);
    color: white;
    border: 0px;
  }

  .hotdata .delete {
    background-color: rgb(234, 74, 92);
    color: white;
    border: 0px;
  }

  .hotdata .commonbtn {
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

  .select .el-input {
    width: 60%;
  }

  .select .el-form-item--small.el-form-item {
    margin-right: -70px;
  }

  .select .el-pagination {
    padding-top: 0px;
  }

  .hotgoods .el-dialog__header {
    padding: 12px 20px 10px;
  }

  .hotgoods .el-dialog__title {
    color: #606266;
    font-size: 14px;
  }

  .hotgoods .el-dialog__body {
    padding-top: 20px;
    padding-bottom: 100px;
    border-top: 1px solid #ccc;
  }
</style>