<!-- banner图 -->
<template>
  <div class="banner">
    <el-menu :default-active="activeIndex2" class="el-menu-demo" mode="horizontal" @select="handleSelect"
      background-color="white" text-color="#f999" active-text-color="rgb(18,42,136)">
      <el-menu-item index="1">banner图</el-menu-item>
    </el-menu>

    <div class="banmain">
      <div class="banfind">
        <el-form :inline="true" :model="formInline" class="demo-form-inline" size="small" style="margin-left: 10px">
          <el-form-item>
            <el-input v-model="formInline.imgname" placeholder="请输入图片名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-select v-model="formInline.type" placeholder="请选择图片类型" @change="getType">
              <el-option label="仅图片" value="1"></el-option>
              <el-option label="链接" value="2"></el-option>
              <el-option label="html内容" value="3"></el-option>
              <el-option label="商品详情" value="4"></el-option>
              <el-option label="请选择图片类型" value=""></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button style="background-color: rgb(54, 116, 255); color: white" icon="el-icon-search" @click="getfind">
              查询
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="bandata">
        <el-row style="margin-bottom: 12px">
          <el-button size="small" class="commonbtn" icon="el-icon-plus" @click="addVisible = true">添加
          </el-button>
          <el-button size="small" class="delete" icon="el-icon-close" @click="outVisible = true">删除</el-button>
        </el-row>
        <el-table ref="multipleTable" border :data="tableData" tooltip-effect="dark"
          style="margin-bottom: 15px; font-size: 14px" class="table" :header-cell-style="getRowClass"
          @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="80"> </el-table-column>
          <el-table-column label="id" width="110">
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column prop="advName" label="图片名称"> </el-table-column>
          <el-table-column label="图片">
            <template slot-scope="scope">
              <img :src="scope.row.advImg" height="85" width="170" />
            </template>
          </el-table-column>
          <el-table-column label="图片类型">
            <template slot-scope="scope">
              <p v-show="scope.row.advType == 1">仅图片</p>
              <p v-show="scope.row.advType == 2">链接</p>
              <p v-show="scope.row.advType == 3">html内容</p>
              <p v-show="scope.row.advType == 4">商品详情</p>
            </template>
          </el-table-column>
          <el-table-column prop="ordid" label="排序序号"> </el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="edit(scope.$index, scope.row)">编辑
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div style="display: flex;">
          <div class="grid-content bg-purple-light" style="margin-left: auto;">
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
              :current-page="pageNum" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
              :total="pagetotal">
            </el-pagination>
          </div>
        </div> 
      </div>
    </div>

    <!-- 添加 -->
    <el-dialog title="添加" :visible.sync="addVisible" width="840px" class="banneradd" :close-on-click-modal="false">
      <div class="information">
        <div style="width: 100%; margin: 0 auto">
          <el-form :model="ruleForm" ref="ruleForm" label-width="80px" class="demo-ruleForm" :inline="true">
            <el-form-item label="图片名称" required>
              <el-input v-model="ruleForm.imgname" placeholder="请输入图片名称"></el-input>
            </el-form-item>
            <br />
            <el-form-item label="图片" required>
              <el-upload class="upload-demo" action="" accept=".jpg,.jpeg,.png,.JPG,.JPEG,.PNG"
                :http-request="uploadImgs" :show-file-list="false">
                <el-button size="small" icon="el-icon-upload" style="
                    margin-top: 10px;
                    background-color: rgb(54, 116, 255);
                    color: white;
                  ">上传
                </el-button>
                <div slot="tip" class="el-upload__tip">推荐尺寸为702*320</div>
              </el-upload>
              <div class="euserimage">
                <img v-if="imgurl" :src="imgurl" class="avatar" />
              </div>
            </el-form-item>
            <br />
            <el-form-item label="图片类型" required>
              <el-select v-model="ruleForm.type" placeholder="请选择图片类型" @change="getaddType">
                <el-option label="仅图片" value="1"></el-option>
                <el-option label="html文件" value="3"></el-option>
                <el-option label="链接" value="2"></el-option>
                <el-option label="商品详情" value="4"></el-option>
              </el-select>
            </el-form-item>
            <br />
            <el-form-item label="html文件" required v-show="ruleForm.type == 3">
              <!-- <mavon-editor v-model="ruleForm.html" ref="md" @imgAdd="$imgAdd" @change="change" :toolbars="toolbars" /> -->
              <tinymce-editor ref='tinymce' :init='init' v-model="ruleForm.html"></tinymce-editor>
            </el-form-item>
            <br />
            <el-form-item label="链接" required v-show="ruleForm.type == 2">
              <el-input v-model="ruleForm.link" placeholder="请输入链接"></el-input>
            </el-form-item>
            <br />
            <el-form-item label="商品详情" required v-show="ruleForm.type == 4">
              <el-input v-model="ruleForm.goodsName" placeholder="请选择商品"></el-input>
            </el-form-item>
            <el-form-item v-show="ruleForm.type == 4">
              <el-button style="background-color: rgb(54, 116, 255); color: white" @click="getselect(1)">
                选择商品
              </el-button>
            </el-form-item>
            <br />
            <el-form-item label="排序序号">
              <el-input v-model="ruleForm.ordid" placeholder="请填写排序序号"></el-input>
            </el-form-item>
            <br />
            <el-form-item label=" ">
              <el-button style="background-color: rgb(54, 116, 255); color: white" @click="getAdd()">
                确定
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-dialog>

    <!-- 编辑 -->
    <el-dialog title="编辑" :visible.sync="editVisible" width="840px" class="banneradd" :close-on-click-modal="false">
      <div class="information">
        <div style="width: 100%; margin: 0 auto">
          <el-form :model="editForm" ref="editForm" label-width="80px" class="demo-ruleForm" :inline="true">
            <el-form-item label="图片名称" required>
              <el-input v-model="editForm.imgname" placeholder="请输入图片名称"></el-input>
            </el-form-item>
            <br />
            <el-form-item label="图片" required>
              <el-upload class="upload-demo" action="" accept=".jpg,.jpeg,.png,.JPG,.JPEG,.PNG"
                :http-request="euploadImgs" :show-file-list="false">
                <el-button size="small" icon="el-icon-upload" style="
                    margin-top: 10px;
                    background-color: rgb(54, 116, 255);
                    color: white;
                  ">上传
                </el-button>
                <div slot="tip" class="el-upload__tip">推荐尺寸为702*320</div>
              </el-upload>
              <div class="euserimage">
                <img v-if="editForm.imgurl" :src="editForm.imgurl" class="avatar" />
              </div>
            </el-form-item>
            <br />
            <el-form-item label="图片类型" required>
              <el-select v-model="editForm.type" placeholder="请选择图片类型" @change="getaddType">
                <el-option label="仅图片" value="1"></el-option>
                <el-option label="html文件" value="3"></el-option>
                <el-option label="链接" value="2"></el-option>
                <el-option label="商品详情" value="4"></el-option>
              </el-select>
            </el-form-item>
            <br />
            <el-form-item label="html文件" required v-show="editForm.type == 3">
              <!-- <mavon-editor v-model="editForm.html" ref="md2" @imgAdd="$imgAdd2"  @change="changes" :toolbars="toolbars" /> -->
              <tinymce-editor ref='tinymce2' :init='init' v-model="editForm.html"></tinymce-editor>
            </el-form-item>
            <br />
            <el-form-item label="链接" required v-show="editForm.type == 2">
              <el-input v-model="editForm.link" placeholder="请输入链接"></el-input>
            </el-form-item>
            <br />
            <el-form-item label="商品详情" required v-show="editForm.type == 4">
              <el-input v-model="editForm.goodsName" placeholder="请选择商品"></el-input>
            </el-form-item>
            <el-form-item v-show="editForm.type == 4">
              <el-button style="background-color: rgb(54, 116, 255); color: white" @click="getselect(2)">
                选择商品
              </el-button>
            </el-form-item>
            <br />
            <el-form-item label="排序序号">
              <el-input v-model="editForm.ordid" placeholder="请输入序号"></el-input>
            </el-form-item>
            <br />
            <el-form-item label=" ">
              <el-button style="background-color: rgb(54, 116, 255); color: white" @click="getedit()">
                确定
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-dialog>

    <!-- 选择商品 -->
    <el-dialog title="选择商品" :visible.sync="selectVisible" width="1050px" :close-on-click-modal="false">
      <div class="information select">
        <div style="width: 100%; margin: 0 auto">
          <el-row style="margin-bottom: 12px">
            <el-form :inline="true" :model="selectform" class="demo-form-inline" size="small" style="margin-left: 10px">
              <el-form-item>
                <el-input v-model="selectform.goodsName" placeholder="请输入商品名称"></el-input>
              </el-form-item>
              <el-form-item>
                <el-select v-model="selectform.classA" clearable placeholder="请选择一级分类" @change='seleconeCate'>

                  <el-option v-for="(item, index) in oneCateLiat" :label="item.cateName" :key="index"
                    :value="item.cateId"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-select v-model="selectform.classB" clearable placeholder="请选择二级分类">
                  <el-option v-for="(item, index) in twoCateLiat" :label="item.cateName" :key="index"
                    :value="item.cateId"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-select v-model="selectform.region" clearable placeholder="请选择状态">
                  <el-option label="上架" value="1"></el-option>
                  <el-option label="下架" value="2"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button style="background-color: rgb(54, 116, 255); color: white" icon="el-icon-search"
                  @click="selectgoodsFind">查询
                </el-button>
              </el-form-item>
            </el-form>
          </el-row>

          <el-table ref="multipleTable" border :data="selectData" tooltip-effect="dark"
            style="margin-bottom: 15px; font-size: 14px" class="table" :header-cell-style="getRowClass"
            @selection-change="handleSelectionChange">
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
                <img :src="scope.row.coverImg" height="50" width="50" />
              </template>
            </el-table-column>
            <el-table-column prop="originalProice" label="原价">
            </el-table-column>
            <el-table-column prop="memberPrice" label="会员价">
            </el-table-column>
            <el-table-column prop="costPrice" label="成本价"> </el-table-column>
            <el-table-column prop="provider" label="供应商"> </el-table-column>
            <el-table-column label="状态" width="70">
              <template slot-scope="scope">
                <p v-show="scope.row.shelfStatus == 1">上架</p>
                <p v-show="scope.row.shelfStatus == 2">下架</p>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" @click="selectgoods(scope.$index, scope.row)">选择
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="page" style="position: relative;">
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

    <el-dialog title="删除" :visible.sync="outVisible" width="30%">
      <span>确认删除？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="outVisible = false">取 消</el-button>
        <el-button type="primary" @click="(outVisible = false), getdel()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  const axios = require("axios");
  export default {
    // components: {mavonEditor},
    data() {
      return {
        outVisible: false,
        activeIndex2: "1",
        currentPage: 1,
        token: localStorage.getItem("token"),
        pageNum: 1,
        pageSize: 10,
        pagetotal: 0,
        formInline: {
          imgname: "",
          type: "",
        },
        tableData: [

        ],
        addVisible: false, //添加
        ruleForm: {
          imgname: "",
          type: "",
          link: "",
          goodsName: "",
          ordid: "",
          html: "",
        },
        rules: {
          imgname: [
            { required: true, },
          ],
          type: [
            { required: true, },
          ],
          goodsName: [{ required: true }],
          pic: [{ required: true }],
          html: [{ required: true }],
        },

        editVisible: false, //编辑
        editForm: {
          imgname: "",
          type: "",
          link: "",
          goodsName: "",
          goodsId: '',
          ordid: "",
          html: "",
          imageUrl: "",
          imgurl: "",
          advId: ''
        },
        editrules: {
          imgname: [
            { required: true },
          ],
          type: [
            { required: true },
          ],
          goodsName: [{ required: true }],
          pic: [{ required: true }],
          html: [{ required: true }],
        },


        imageUrl: "",
        imgurl: "",

        // 选择商品
        selectVisible: false,
        oneCateLiat: [],
        twoCateLiat: [],
        selectform: {
          goodsName: "",
          classA: "",
          classB: "",
          region: "",

          pageNum: 1,
          pageSize: 10,
          pagetotal: 0,
        },
        selectData: [

        ],

        goodsId: "", //选择商品id
        oneCate: [], //一级分类
        oneCateid: 0, // 一级分类id

        advIds: [], //多个轮播图id

        selectType: '',
        html: '',
        html2: '',
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
        this.getfind();
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.pageNum = val;
        this.getfind();
      },

      // // banner列表
      // getAdvList() {
      //   this.$api.post({
      //     path: "/manage/getAdvList",
      //     params: {
      //       token: this.token,
      //       advName: "",
      //       advType: "", //轮播图类型：1仅图片；2链接；3html内容；4商品详情'
      //     },
      //     success: (data) => {
      //       console.log(data);
      //       this.tableData = data.data.list;
      //       this.pagetotal = data.data.total;
      //     },
      //   });
      // },

      // 获取文件状态
      getType(val) {
        this.formInline.type = val;
      },

      // 添加轮播图文件状态
      getaddType(val) {
        this.ruleForm.type = val;
      },

      // getGoodsList() {
      //   this.$api.post({
      //     path: "/manage/getGoodsList",
      //     params: {
      //       token: this.token,
      //       goodsName: "",
      //       oneCateName: "",
      //       twoCateName: "",
      //       shelfStatus: "",
      //     },
      //     success: (data) => {
      //       console.log(data);
      //       this.selectData = data.data.list;
      //       this.selectform.pagetotal = data.data.total
      //     },
      //   });
      // },
      // 分页
      selSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.selectform.pageSize = val;
        this.selectgoodsFind();
      },
      selCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.selectform.pageNum = val;
        this.selectgoodsFind();
      },
      // 搜索
      getfind() {
        this.$api.post({
          path: "/manage/getAdvList",
          params: {
            token: this.token,
            advName: this.formInline.imgname,
            advType: this.formInline.type, //轮播图类型：1仅图片；2链接；3html内容；4商品详情'
            pageSize: this.pageSize,
            pageNum: this.pageNum
          },
          success: (data) => {
            console.log(data);
            this.tableData = data.data.list;
            this.pagetotal = data.data.total;

            // if (data.code == 1) {
            //   this.$message({
            //     message: data.msg,
            //     type: 'success'
            //   });
            // }
          },
        });
      },

      uploadImgs(file) {
        this.$uploadFiles(
          "http://manager.zhizhennengyuan.com:8000/mfxapi/multifileupload",
          file.file
        ).then((res) => {
          // this.$uploadFiles('http://10.77.10.90:8080/mfxapi/multifileupload', file.file).then(res => {
          this.imageUrl = res.result[0].relative_url;
          this.imgurl = res.result[0].url;
          console.log(res, "res2");
        });
      },
      euploadImgs(file) {
        this.$uploadFiles(
          "http://manager.zhizhennengyuan.com:8000/mfxapi/multifileupload",
          file.file
        ).then((res) => {
          // this.$uploadFiles('http://10.77.10.90:8080/mfxapi/multifileupload', file.file).then(res => {
          this.editForm.imageUrl = res.result[0].relative_url;
          this.editForm.imgurl = res.result[0].url;
          console.log(res, "res2");
        });
      },
      // 获取一级分类
      getselCate(cateId, type) {
        this.$api.post({
          path: "/manage/getCate",
          params: {
            token: this.token,
            cateId: cateId,
          },
          success: (data) => {
            console.log(data);
            if (type == 1) {
              this.oneCateLiat = data.data;
            } else {
              this.twoCateLiat = data.data;
            }
            console.log(data.data);
          },
        });
      },
      seleconeCate(val) {
        this.twoCateLiat = []
        this.selectform.classB = ''
        this.getselCate(val, 2)
      },
      // selectwoCate(val) {
      //   this.selectform.classB = val;
      // },

      selgoodsFind() {
        this.$api.post({
          path: "/manage/getBestSellersGoodsList",
          params: {
            token: this.token,
            goodsName: this.selectform.goodsName,
            oneCateName: this.selectform.classA,
            twoCateName: this.selectform.classB,
            shelfStatus: this.selectform.region,
          },
          success: (data) => {
            console.log(data);
            this.selectData = data.data.list;
          },
        });
      },

      getselect(type) {
        this.selectVisible = true
        this.selectType = type

      },

      // 选择商品
      selectgoods(index, row) {
        console.log(index, row);
        if (this.selectType == 1) {
          this.goodsId = row.goodsId;
          this.ruleForm.goodsName = row.goodsName;
          this.selectVisible = row.selectVisible;
          this.$message({
            message: "选择成功",
            type: "success",
          });
        } else {
          this.editForm.goodsId = row.goodsId;
          this.editForm.goodsName = row.goodsName;
          this.selectVisible = row.selectVisible;
          this.$message({
            message: "选择成功",
            type: "success",
          });
        }

      },

      // 商品分类
      getCate() {
        this.$api.post({
          path: "/manage/getCate",
          params: {
            token: this.token,
            cateId: this.oneCateid,
          },
          success: (data) => {
            console.log(data);
            this.oneCate = data.data;
          },
        });
      },
      seloneCate(val) {
        this.oneCateid = val;
        this.selectform.classA = val;
        this.getCate();
      },
      seltwoCate(val) {
        this.selectform.classB = val;
      },
      // 选择商品搜索文件状态
      getfindType(val) {
        this.selectform.region = val;
      },

      // 选择商品搜索
      selectgoodsFind() {
        this.$api.post({
          path: "/manage/getGoodsList",
          params: {
            token: this.token,
            goodsName: this.selectform.goodsName,
            oneCateName: this.selectform.classA,
            twoCateName: this.selectform.classB,
            shelfStatus: this.selectform.region,
            pageSize: this.selectform.pageSize,
            pageNum: this.selectform.pageNum
          },
          success: (data) => {
            console.log(data);
            this.selectform.pagetotal = data.data.total
            this.selectData = data.data.list;
          },
        });
      },



      getAdd() {
        if (this.ruleForm.imgname == '' || this.imageUrl == '' || this.ruleForm.type == '') {
          this.$message({
            message: '请将信息填写完整',
            type: 'warning'
          });
        } else {
          if (this.ruleForm.type == 3) {
            if (this.ruleForm.html == '') {
              this.$message({
                message: '请将信息填写完整',
                type: 'warning'
              });
            } else {
              this.$api.post({
                path: "/manage/operationAdv",
                params: {
                  token: this.token,
                  type: 1,
                  advName: this.ruleForm.imgname,
                  advImg: this.imageUrl,
                  advType: this.ruleForm.type,
                  advContent: this.ruleForm.html,
                  ordid: this.ruleForm.ordid,
                },
                success: (data) => {
                  console.log(data);
                  this.getfind();
                  if (data.code == 1) {
                    this.$message({
                      message: data.msg,
                      type: 'success'
                    });
                    this.addVisible = false
                  }
                },
              });
            }

          } else if (this.ruleForm.type == 4) {
            if (this.goodsId == '') {
              this.$message({
                message: '请将信息填写完整',
                type: 'warning'
              });
            } else {
              this.$api.post({
                path: "/manage/operationAdv",
                params: {
                  token: this.token,
                  type: 1,
                  advName: this.ruleForm.imgname,
                  advImg: this.imageUrl,
                  advType: this.ruleForm.type,
                  advContent: this.goodsId,
                  ordid: this.ruleForm.ordid,
                },
                success: (data) => {
                  console.log(data);
                  if (data.code == 1) {
                    this.$message({
                      message: data.msg,
                      type: 'success'
                    });
                    this.addVisible = false
                    this.getfind();
                    this.imgurl = ''
                    this.ruleForm.imgname = ''
                    this.ruleForm.type = ''
                    this.goodsId = ''
                    this.ruleForm.ordid = ''
                  }

                },
              });
            }

          } else if (this.ruleForm.type == 2) {
            if (this.ruleForm.link == '') {
              this.$message({
                message: '请将信息填写完整',
                type: 'warning'
              });
            } else {
              this.$api.post({
                path: "/manage/operationAdv",
                params: {
                  token: this.token,
                  type: 1,
                  advName: this.ruleForm.imgname,
                  advImg: this.imageUrl,
                  advType: this.ruleForm.type,
                  advContent: this.ruleForm.link,
                  ordid: this.ruleForm.ordid,
                },
                success: (data) => {
                  if (data.code == 1) {
                    this.$message({
                      message: data.msg,
                      type: 'success'
                    });
                    this.addVisible = false
                    console.log(data);
                    this.getfind();
                    this.imgurl = ''
                    this.ruleForm.imgname = ''
                    this.ruleForm.type = ''
                    this.ruleForm.link = ''
                    this.ruleForm.ordid = ''
                  }

                }
              })
            }
          } else {
            this.$api.post({
              path: "/manage/operationAdv",
              params: {
                token: this.token,
                type: 1,
                advName: this.ruleForm.imgname,
                advImg: this.imageUrl,
                advType: this.ruleForm.type,
                advContent: "",
                ordid: this.ruleForm.ordid,
              },
              success: (data) => {
                console.log(data)
                if (data.code == 1) {
                  this.$message({
                    message: data.msg,
                    type: 'success'
                  });
                  this.getfind()
                  this.imgurl = ''
                  this.ruleForm.imgname = ''
                  this.ruleForm.type = ''
                  this.ruleForm.link = ''
                  this.ruleForm.ordid = ''
                  this.addVisible = false
                }
              },
            });
          }
        }

      },
      // 编辑
      edit(index, row) {
        // 轮播图类型：1仅图片；2链接；3html内容；4商品详情
        console.log(index, row);
        this.editVisible = true;
        this.editForm.advId = row.advId
        this.editForm.imgname = row.advName;
        this.editForm.type = row.advType;
        this.editForm.imgurl = row.advImg
        this.editForm.ordid = row.ordid
        if (row.advType == 3) {
          this.editForm.html = row.advContent;
        } else if (row.advType == 2) {
          this.editForm.link = row.advContent;
        } else if (row.advType == 4) {
          this.editForm.goodsName = row.goodsName;
          this.editForm.goodsId = row.advContent
        }
      },

      getedit() {
        if (this.editForm.imgname == '' || this.editForm.type == '') {
          this.$message({
            message: '请将信息填写完整',
            type: 'warning'
          });
          return
        }
        if (this.editForm.type == 3) {
          if (this.editForm.html == '') {
            this.$message({
              message: '请将信息填写完整',
              type: 'warning'
            });
          } else {
            this.$api.post({
              path: "/manage/operationAdv",
              params: {
                token: this.token,
                type: 2,
                advName: this.editForm.imgname,
                advId: this.editForm.advId,
                advImg: this.editForm.imageUrl,
                advType: this.editForm.type,
                advContent: this.editForm.html,
                ordid: this.editForm.ordid,
              },
              success: (data) => {
                console.log(data);

                if (data.code == 1) {
                  this.$message({
                    message: '修改成功',
                    type: 'success'
                  });
                  this.getfind();
                  this.editVisible = false
                }
              },
            });
          }

        } else if (this.editForm.type == 4) {
          if (this.editForm.goodsId == '') {
            this.$message({
              message: '请将信息填写完整',
              type: 'warning'
            });
          } else {
            this.$api.post({
              path: "/manage/operationAdv",
              params: {
                token: this.token,
                type: 2,
                advName: this.editForm.imgname,
                advId: this.editForm.advId,
                advImg: this.editForm.imageUrl,
                advType: this.editForm.type,
                advContent: this.editForm.goodsId,
                ordid: this.editForm.ordid,
              },
              success: (data) => {
                console.log(data);
                this.getfind();
                if (data.code == 1) {
                  this.$message({
                    message: '修改成功',
                    type: 'success'
                  });
                  this.getfind();
                  this.editVisible = false
                }
              },
            });
          }

        } else if (this.editForm.type == 2) {
          if (this.editForm.link == '') {
            this.$message({
              message: '请将信息填写完整',
              type: 'warning'
            });
          } else {
            this.$api.post({
              path: "/manage/operationAdv",
              params: {
                token: this.token,
                type: 2,
                advName: this.editForm.imgname,
                advId: this.editForm.advId,
                advImg: this.editForm.imageUrl,
                advType: this.editForm.type,
                advContent: this.editForm.link,
                ordid: this.editForm.ordid,
              },
              success: (data) => {
                console.log(data);
                this.getfind();
                if (data.code == 1) {
                  this.$message({
                    message: '修改成功',
                    type: 'success'
                  });
                  this.getfind();
                  this.editVisible = false

                }
              },
            });
          }

        } else {
          this.$api.post({
            path: "/manage/operationAdv",
            params: {
              token: this.token,
              type: 2,
              advName: this.editForm.imgname,
              advId: this.editForm.advId,
              advImg: this.editForm.imageUrl,
              advType: this.editForm.type,
              advContent: "",
              ordid: this.editForm.ordid,
            },
            success: (data) => {
              console.log(data);
              // this.getfind();
              if (data.code == 1) {
                this.$message({
                  message: '修改成功',
                  type: 'success'
                });
                this.getfind();
                this.editVisible = false
              }
            },
          });
        }
      },

      geteditType(val) {
        this.editForm.type = val;
      },

      // 删除
      handleSelectionChange(val) {
        this.multipleSelection = val;

        let ids = [];
        val.forEach((e) => {
          ids.push(e.advId);
        });

        this.advIds = ids;
      },

      getdel() {
        this.$api.post({
          path: "/manage/operationAdv",
          params: {
            token: this.token,
            type: 3,
            advIds: this.advIds.join(","),
          },
          success: (data) => {
            if (data.code == 1) {
              this.$message({
                message: data.msg,
                type: "success",
              });
              this.getfind();
            } else {
              this.$message({
                message: "请选择要删除的轮播图信息",
                type: "warning",
              });
            }
            console.log(data);
          },
        });
      },
    },
    mounted() {
      this.getfind();
      this.selectgoodsFind();
      this.getCate();
      this.getselCate(0, 1)
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
  };
</script>

<style>
  * {
    padding: 0;
    margin: 0;
    cursor: default;
  }

  /* .tox .tox-dialog{
    z-index: 9999 !important;
  }

  .tox .tox-dialog-wrap{
    z-index: 9999;
  } */
  .tox-tinymce-aux {
    z-index: 9999 !important;
  }

  .banner {
    width: 100%;
    height: 100%;
  }

  .banner .el-dialog__header {
    padding: 12px 20px 10px;
  }

  .banner .el-dialog__title {
    color: #606266;
    font-size: 14px;
  }

  .banner .el-dialog__body {
    padding-top: 20px;
    padding-bottom: 100px;
    border-top: 1px solid #ccc;
  }

  .banner .el-dialog__header {
    padding: 12px 20px 10px;
  }

  .banner .el-dialog__title {
    color: #606266;
    font-size: 14px;
  }

  .banner .el-dialog__body {
    padding-top: 20px;
    padding-bottom: 100px;
    border-top: 1px solid #ccc;
  }

  .banmain {
    /* width: 98%;
    height: 83%; */
    padding: 10px 10px 0px 10px;

  }

  .banfind {
    width: 100%;

    padding-top: 10px;
    background-color: white;
    margin-bottom: 10px;
  }

  .banfind .el-form-item__content {
    width: 160px;
  }

  /* 日期 */
  .banfind .el-date-editor--daterange.el-input__inner {
    width: 200px;
    height: 32px;
    margin-right: 10px;
  }

  .banfind .el-date-editor .el-range-input {
    font-size: 12px;
  }

  .banfind .el-date-editor .el-range__icon {
    line-height: 25px;
  }

  .banfind .el-date-editor .el-range-separator {
    color: #c0c4cc;
    line-height: 21px;
  }

  .bandata {
    /* width: 98%;
    height: 100%; */
    padding: 10px 20px;
    background-color: white;
  }

  .bandata .iconfont {
    font-size: 12px;
  }

  .bandata .recovery {
    background-color: rgb(48, 216, 192);
    color: white;
    border: 0px;
  }

  .bandata .disable {
    background-color: rgb(255, 102, 0);
    color: white;
    border: 0px;
  }

  .bandata .delete {
    background-color: rgb(234, 74, 92);
    color: white;
    border: 0px;
  }

  .bandata .commonbtn {
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

  .table th>.cell {
    padding-top: 12px;
    padding-bottom: 12px;
  }

  .banneradd .el-input {
    width: 235px;
  }

  /* 图片上传 */
  .euserimage {
    width: 100%;
    /* height: 50px; */
  }

  .euserimage img {
    width: 80px;
    height: 50px;
  }
</style>