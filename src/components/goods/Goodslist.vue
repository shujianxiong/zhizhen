<!-- 商品列表 -->
<template>
  <div class="goodslist">
    <el-menu :default-active="activeIndex2" class="el-menu-demo" mode="horizontal" @select="handleSelect"
      background-color="white" text-color="#f999" active-text-color="rgb(18,42,136)">
      <el-menu-item index="1">商品列表</el-menu-item>
    </el-menu>

    <div class="goodsmain element">
      <div class="goodsfind">
        <el-form :inline="true" :model="formInline" class="demo-form-inline" size="small" style="margin-left: 10px">
          <el-form-item>
            <el-input v-model="formInline.goodsName" placeholder="请输入商品名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-select v-model="formInline.classA" clearable placeholder="请选择一级分类" @change="seloneCate">
              <el-option v-for="item in oneCateLiat" clearable :key="item.cateId" :label="item.cateName"
                :value="item.cateId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="formInline.classB" placeholder="请选择二级分类">
              <el-option v-for="item in twoCateLiat" :key="item.cateId" :label="item.cateName" :value="item.cateId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="formInline.region" clearable placeholder="请选择状态">
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
      </div>

      <div class="goodsdata">
        <el-row style="margin-bottom: 12px">
          <el-button size="small" class="commonbtn" icon="el-icon-plus" @click="addVisible = true">添加
          </el-button>
          <el-button size="small" class="recovery" icon="el-icon-top" @click="upVisible = true">上架
          </el-button>
          <el-button size="small" class="disable" icon="el-icon-bottom" @click="downVisible = true">下架
          </el-button>
          <el-button size="small" class="delete" icon="el-icon-close" @click="outVisible = true">删除
          </el-button>
          <el-button size="small" class="commonbtn" icon="iconfont iconinport" @click="getexport">导出
          </el-button>
          <el-button size="small" class="commonbtn" @click="getsubmitSort">提交排序</el-button>
        </el-row>

        <el-table ref="multipleTable" border :data="tableData" tooltip-effect="dark"
          style="margin-bottom: 15px; font-size: 14px" class="table" :header-cell-style="getRowClass"
          @selection-change="goodslistChange">
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
              <img :src="scope.row.coverImg" height="50" width="50" />
            </template>
          </el-table-column>
          <el-table-column prop="originalProice" label="原价">
          </el-table-column>
          <el-table-column prop="memberPrice" label="会员价"> </el-table-column>
          <el-table-column prop="costPrice" label="成本价"> </el-table-column>
          <el-table-column prop="stock" label="库存"> </el-table-column>
          <el-table-column prop="provider" label="供应商"> </el-table-column>
          <el-table-column prop="state" label="状态" width="70">
            <template slot-scope="scope">
              <p v-show="scope.row.shelfStatus == 1">上架</p>
              <p v-show="scope.row.shelfStatus == 2">下架</p>
            </template>
          </el-table-column>
          <el-table-column label="排序id">
            <template slot-scope="scope">
              <el-input v-model="scope.row.ordid"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="details(scope.$index, scope.row)">详情
              </el-button>
              <el-button size="mini" type="primary" @click="edit(scope.$index, scope.row)">编辑
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <div style="display: flex;">
          <div>商品数量：{{ pagetotal }}</div>

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

    <!-- 添加 -->
    <el-dialog title="添加" :visible.sync="addVisible" width="835px" class="addbox" @close="backGoodss"
      :close-on-click-modal="false">
      <div class="information adds">
        <div style="width: 100%; margin: 0 auto">
          <p style="color: rgb(56, 118, 255); font-weight: bold">基本信息</p>
          <el-form :model="ruleForm" ref="ruleForm" label-width="80px" class="demo-ruleForm" label-position="left"
            :inline="true" style="margin: 0 auto">
            <el-form-item label="商品名称" required>
              <el-input v-model="ruleForm.goodsname" placeholder="请输入商品名称"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" class="addselect" required>
              <el-select v-model="ruleForm.classA" placeholder="请选择一级分类" @change="seloneCate">
                <el-option v-for="item in oneCateLiat" :key="item.cateId" :label="item.cateName" :value="item.cateId">
                </el-option>
              </el-select>
              <el-select v-model="ruleForm.classB" placeholder="请选择二级分类">
                <el-option v-for="item in twoCateLiat" :key="item.cateId" :label="item.cateName" :value="item.cateId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="供应商" required>
              <el-input v-model="ruleForm.supplier" placeholder="请输入供应商"></el-input>
            </el-form-item>
            <el-form-item label="库存" required>
              <el-input v-model="ruleForm.stock" placeholder="请输入库存"></el-input>
            </el-form-item>
            <el-form-item label="原价" required>
              <el-input v-model="ruleForm.original" placeholder="请输入原价"></el-input>
            </el-form-item>
            <el-form-item label="会员价" required>
              <el-input v-model="ruleForm.vipPice" placeholder="请输入会员价"></el-input>
            </el-form-item>
            <el-form-item label="成本价" required>
              <el-input v-model="ruleForm.cost" placeholder="请输入成本价"></el-input>
            </el-form-item>
            <br />
            <el-form-item label="规格" required>
              <el-button style="
                  background-color: rgb(54, 116, 255);
                  color: white;
                  margin-bottom: 10px;
                " @click="(specsVisible = true), getguige(1)">
                添加规格
              </el-button>
              <el-table ref="multipleTable" border :data="addData" tooltip-effect="dark" style="margin-bottom: 15px"
                :header-cell-style="getRowClass" @selection-change="handleSelectionChange">
                <el-table-column label="id" width="80">
                  <template slot-scope="scope">
                    {{ scope.$index + 1 }}
                  </template>
                </el-table-column>
                <el-table-column prop="specsName" label="规格名称" width="125">
                </el-table-column>
                <el-table-column prop="attrName" label="属性名称" width="170">
                </el-table-column>
              </el-table>
            </el-form-item>
            <br />
            <el-form-item label="视频">
              <el-upload class="upload-demo" action="" :http-request="vuploadImgs" :show-file-list="false"
                accept=".mp4">
                <el-button size="small" icon="el-icon-upload" style="
                    margin-top: 10px;
                    background-color: rgb(54, 116, 255);
                    color: white;
                  ">上传
                </el-button>
              </el-upload>
              <div class="userimage">
                <div style="width: 200px; height: 100px;" v-if="vimgurl">
                  <video v-if="vimgurl" :src="vimgurl" class="avatar" width="200" height="100" controls></video>
                  <div class="remove_logo" @click="vuploadDel()" style="top:40px;right:-5px">×</div>
                </div>

              </div>
            </el-form-item>
            <br />
            <el-form-item label="封面图" required>
              <el-upload action="" list-type="picture-card" accept=".jpg,.jpeg,.png,.JPG,.JPEG,.PNG"
                :http-request="uploadImgs" :show-file-list="false">
                <i class="el-icon-camera-solid"></i>
              </el-upload>
              <div class="userimage">
                <img v-if="imgurl" :src="imgurl" class="avatar" />
              </div>
              <p style="font-size: 12px; color: #999">
                推荐尺寸为180*180
              </p>
            </el-form-item>
            <br />
            <el-form-item label="轮播图" required>
              <div class="img_box">
                <div class="img_size" v-for="(item, index) of AdvImg" :key="index" v-show="AdvImg.length != 0">
                  <img v-if="AdvImg.length != 0" :src="item.src" />
                  <div class="remove_logo" @click="fileDel(index)">×</div>
                </div>
                <el-upload action="" list-type="picture-card" accept=".jpg,.jpeg,.png,.JPG,.JPEG,.PNG"
                  :http-request="goodsAdvsup" :show-file-list="false">
                  <i class="el-icon-camera-solid"></i>
                </el-upload>
              </div>
              <p style="font-size: 12px; color: #999">
                最多上传5张，推荐尺寸为750*750
              </p>
            </el-form-item>
          </el-form>
          <p style="color: rgb(56, 118, 255); font-weight: bold">商品详情</p>
          <div>
            <!-- <mavon-editor v-model="ruleForm.goodsDesc" ref="md" @imgAdd="$imgAdd" @change="change"
              :toolbars="toolbars" /> -->

            <tinymce-editor ref='tinymce' :init='init' v-model="ruleForm.goodsDesc" style="z-index: 9999;">
            </tinymce-editor>
          </div>

          <div class="addbtns" @click="getaddGoods()"
            style="background-color: rgb(54, 116, 255);width: 70px; height: 35px; text-align: center; color: white;line-height: 35px; border-radius: 4px;">
            确定
          </div>
        </div>
      </div>
    </el-dialog>

    <!-- 编辑 -->
    <el-dialog title="编辑" :visible.sync="editVisible" width="835px" class="addbox" :close-on-click-modal="false" @close='editClose'>
      <div class="information adds">
        <div style="width: 100%; margin: 0 auto">
          <p style="color: rgb(56, 118, 255); font-weight: bold">基本信息</p>
          <el-form :model="editForm" ref="editForm" label-width="80px" class="demo-ruleForm" label-position="left"
            :inline="true" style="margin: 0 auto">
            <el-form-item label="商品名称" required>
              <el-input v-model="editForm.goodsname" placeholder="请输入商品名称"></el-input>
            </el-form-item>

            <el-form-item label="商品分类" class="addselect" required>
              <el-select v-model="editForm.classA" @change='seloneCate'>
                <el-option v-for="item in oneCateLiat" :key="item.cateId" :label="item.cateName" :value="item.cateId">
                  {{item.cateName}}
                </el-option>
              </el-select>
              <el-select v-model="editForm.classB">
                <el-option v-for="item in twoCateLiat" :key="item.cateId" :label="item.cateName" :value="item.cateId">
                  {{item.cateName}}
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="供应商" required>
              <el-input v-model="editForm.supplier" placeholder="请输入供应商"></el-input>
            </el-form-item>
            <el-form-item label="库存" required>
              <el-input v-model="editForm.stock" placeholder="请输入库存"></el-input>
            </el-form-item>
            <el-form-item label="原价" required>
              <el-input v-model="editForm.original" placeholder="请输入原价"></el-input>
            </el-form-item>
            <el-form-item label="会员价" required>
              <el-input v-model="editForm.vipPice" placeholder="请输入会员价"></el-input>
            </el-form-item>
            <el-form-item label="成本价" required>
              <el-input v-model="editForm.cost" placeholder="请输入成本价"></el-input>
            </el-form-item>
            <br />
            <el-form-item label="规格" required>
              <el-button style="
                  background-color: rgb(54, 116, 255);
                  color: white;
                  margin-bottom: 10px;
                " @click="(specsVisible = true), getguige(2)">
                添加规格
              </el-button>
              <el-table ref="multipleTable" border :data="editData" tooltip-effect="dark" style="margin-bottom: 15px"
                :header-cell-style="getRowClass" @selection-change="handleSelectionChange">
                <el-table-column label="id" width="80">
                  <template slot-scope="scope">
                    {{ scope.$index + 1 }}
                  </template>
                </el-table-column>
                <el-table-column prop="specsName" label="规格名称" width="125">
                </el-table-column>
                <el-table-column prop="attrName" label="属性名称" width="170">
                </el-table-column>
              </el-table>
            </el-form-item>
            <br />
            <el-form-item label="视频">
              <el-upload class="upload-demo" action="" :http-request="evuploadImgs" :show-file-list="false">
                <el-button size="small" icon="el-icon-upload" style="
                    margin-top: 10px;
                    background-color: rgb(54, 116, 255);
                    color: white;
                  ">上传
                </el-button>
              </el-upload>
              <div class="userimage">
                <!-- <img  /> -->
                <div style="width: 200px; height: 100px;" v-if="editForm.video">
                  <video :src="editForm.video" class="avatar" width="200" height="100" controls></video>
                  <div class="remove_logo" @click="evuploadDel()" style="top:40px;right:-5px">×</div>
                </div>

              </div>
            </el-form-item>
            <br />
            <el-form-item label="封面图" required>
              <el-upload action="" list-type="picture-card" accept=".jpg,.jpeg,.png,.JPG,.JPEG,.PNG"
                :http-request="euploadImgs" :show-file-list="false">
                <i class="el-icon-camera-solid"></i>
              </el-upload>
              <div class="userimage">
                <img v-if="editForm.coverImg" :src="editForm.coverImg" class="avatar" />
              </div>
              <p style="font-size: 12px; color: #999">
                推荐尺寸为180*180
              </p>
            </el-form-item>
            <br />
            <el-form-item label="轮播图" required>
              <div class="img_box">
                <div class="img_size" v-for="(item, index) of editForm.goodsAdvs" :key="index"
                  v-show="editForm.goodsAdvs.length != 0">
                  <img v-if="editForm.goodsAdvs.length != 0" :src="item.goodsAdvImg" />
                  <div class="remove_logo" @click="efileDel(index)">×</div>
                </div>
                <el-upload action="" list-type="picture-card" accept=".jpg,.jpeg,.png,.JPG,.JPEG,.PNG"
                  :http-request="egoodsAdvsup" :show-file-list="false">
                  <i class="el-icon-camera-solid"></i>
                </el-upload>
              </div>
              <p style="font-size: 12px; color: #999">
                最多上传5张，推荐尺寸为750*750
              </p>
            </el-form-item>
          </el-form>
          <p style="color: rgb(56, 118, 255); font-weight: bold">商品详情</p>
          <div>
            <!-- <mavon-editor v-model="editForm.goodsDesc" ref="md2" @imgAdd="$imgAdd2" @change="changes"
              :toolbars="toolbars" /> -->

            <tinymce-editor ref='tinymce' :init='init' v-model="editForm.goodsDesc" style="z-index: 9999;">
            </tinymce-editor>
          </div>
          <div class="addbtns" @click="geteditGoods()"
            style="background-color: rgb(54, 116, 255);width: 70px; height: 35px; text-align: center; color: white;line-height: 35px; border-radius: 4px;">
            确定</div>
        </div>
      </div>
    </el-dialog>

    <!-- 详情 -->
    <el-dialog title="详情" :visible.sync="detailsVisible" width="860px" class="addbox">
      <div class="information adds">
        <div style="width: 100%; margin: 0 auto">
          <div class="goodsnewsbox">
            <p style="color: rgb(56, 118, 255); font-weight: bold">基本信息</p>
            <div class="goodsnews">
              <div>商品名称：{{ goodsDetail.goodsName }}</div>
              <div>
                商品分类：{{ goodsDetail.oneCateName }}-{{
                goodsDetail.twoCateName
                }}
              </div>
              <div>供应商：{{ goodsDetail.provider }}</div>
              <div>库存：{{ goodsDetail.stock }}</div>
              <div>原价：{{ goodsDetail.originalProice }}元</div>
              <div>会员价：{{ goodsDetail.memberPrice }}元</div>
              <div>成本价：{{ goodsDetail.costPrice }}元</div>
            </div>
            <p>规格信息:</p>
            <el-table ref="multipleTable" border :data="detailsData" tooltip-effect="dark" style="margin-bottom: 15px"
              :header-cell-style="getRowClass" @selection-change="handleSelectionChange">
              <el-table-column label="id" width="80" align="center">
                <template slot-scope="scope">
                  {{ scope.$index + 1 }}
                </template>
              </el-table-column>
              <el-table-column prop="specsName" label="规格名称" align="center">
              </el-table-column>
              <el-table-column prop="attrName" label="属性名称" align="center">
              </el-table-column>
            </el-table>
            <div class="goodsimg">
              <div>
                <p>封面图：</p>
                <div>
                  <img :src="goodsDetail.coverImg" alt="" />
                </div>
              </div>
              <div>
                <p>轮播图：</p>
                <div class="lunbo">
                  <img v-for="item in goodsAdvs" :src="item.goodsAdvImg" alt="" :key="item.goodsAdvId" />
                </div>
              </div>
            </div>
            <div class="goodsv" v-show='goodsDetail.video'>
              <p>视频：</p>

              <video :src="goodsDetail.video" width="200" height="100" controls></video>
            </div>
          </div>
          <p style="color: rgb(56, 118, 255); font-weight: bold">商品详情</p>
          <div>
            <!-- <mavon-editor v-model="goodsDetail.goodsDesc" :toolbars="toolbars" /> -->
            <tinymce-editor id='tinymce' :init='init' v-model="goodsDetail.goodsDesc"></tinymce-editor>
          </div>
        </div>
      </div>
    </el-dialog>

    <!-- 添加规格 -->
    <el-dialog title="添加规格" :visible.sync="specsVisible" width="660px" class="addbox specs"
      :close-on-click-modal="false">
      <div class="information inform">
        <el-form :model="specsForm" ref="specsForm" label-width="100px" class="demo-ruleForm">
          <div class="normbox" v-for="(item, index) in specsForm.goodsSpecs" :key="item.key">
            <el-form-item label="规格名称" :prop="'goodsSpecs.' + index + '.specsName'">
              <el-input v-model="item.specsName" placeholder="请输入规格名称"></el-input>
            </el-form-item>
            <el-form-item label="属性名称" :prop="'goodsSpecs.' + index + '.attrName'">
              <el-input v-model="item.attrName" placeholder="请输入属性名称，多个以英文逗号隔开"></el-input>
            </el-form-item>
            <div class="goodsAdd" v-if="index != 0" @click="removeEnvironmentForm(item)">
              <i class="el-icon-close"></i>
            </div>
          </div>
          <el-form-item label=" ">
            <el-button style="background-color: rgb(54, 116, 255); color: white" @click="addEnvironment(specsForm)">确定
            </el-button>
          </el-form-item>
        </el-form>
        <div class="goodsLAdd" @click="addEnvironmentForm" style="width: 15px">
          <i class="el-icon-plus"></i>
        </div>
      </div>
    </el-dialog>

    <el-dialog title="删除" :visible.sync="outVisible" width="20%" :before-close="handleClose">
      <span>确认删除？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="outVisible = false">取 消</el-button>
        <el-button type="primary" @click="(outVisible = false), operationGoods(3)">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="上架" :visible.sync="upVisible" width="20%" :before-close="handleClose2">
      <span>确认商品上架？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="upVisible = false">取 消</el-button>
        <el-button type="primary" @click="(upVisible = false), operationGoods(1)">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="下架" :visible.sync="downVisible" width="20%" :before-close="handleClose3">
      <span>确认商品下架？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="downVisible = false">取 消</el-button>
        <el-button type="primary" @click="(downVisible = false), operationGoods(2)">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  const axios = require("axios");
  import config from "@/config/index";
  // import Editor from '../tinymce/tinymce.vue'
  export default {
    data() {
      return {
        activeIndex2: "1",
        pageNum: 1,
        pagetotal: 0,
        pageSize: 10,
        token: localStorage.getItem("token"),

        outVisible: false,
        upVisible: false,
        downVisible: false,

        oneCateid: 0,
        oneCateLiat: [], //一级分类

        twoCateid: "",
        twoCateLiat: [], //二级分类

        addCateid: 0,
        addCateLiat: [],
        addtwoCateLiat: [],

        editCateid: 0,
        editCateLiat: [],

        edittowCateLiat: [],

        // 搜索
        formInline: {
          goodsName: "",
          classA: "",
          classB: "",
          region: "",
        },
        tableData: [],

        // 添加
        addVisible: false,
        ruleForm: {
          goodsname: "",
          goodsclass: "",
          classA: "",
          classB: "",
          supplier: "",
          stock: "",
          original: "",
          vipPice: "",
          cost: "",
          goodsDesc: "",
        },
        rules: {
          goodsname: [
            { required: true, message: "请输入商品名称", trigger: "blur" },
          ],
          supplier: [
            { required: true, message: "请输入供应商", trigger: "blur" },
          ],
          stock: [{ required: true, message: "请输入库存", trigger: "blur" }],
          original: [{ required: true, message: "请输入原价", trigger: "blur" }],
          vipPice: [{ required: true, message: "请输入会员价", trigger: "blur" }],
          cost: [{ required: true, message: "请输入成本价", trigger: "blur" }],
          // video: [{ required: true, message: "请上传视频", trigger: "blur" }],
          guige: [{ required: true, message: "请添加规格", trigger: "change" }],
          pic: [{ required: true, message: "请上传封面图" }],
          img: [{ required: true, message: "请上传轮播图" }],
          class: [{ required: false }],
        },
        addData: [],
        dialogVisible: false,
        dialogImageUrl: "",
        // 编辑
        editVisible: false,
        editForm: {
          goodsname: "",
          goodsId: "",
          goodsclass: "",
          classA: "",
          classB: "",
          supplier: "",
          stock: "",
          original: "",
          vipPice: "",
          cost: "",
          goodsAdvs: [],
          video: "",
          coverImg: "",
          goodsDesc: "",
          imageUrl: "",
          imgurl: "",
          guige: '',
          pic: '',
          img: '',
          AdvImg: [],
          fileLists: [], //添加商品轮播图

          // 上传视频
          vUrl: "",
          vimgurl: "",

          oneCateName: "",
          twoCateName: "",
          goodsSpecs: [],
        },
        editrules: {
          goodsname: [
            { required: true, message: "请输入商品名称", trigger: "blur" },
          ],
          supplier: [
            { required: true, message: "请输入供应商", trigger: "blur" },
          ],
          stock: [{ required: true, message: "请输入库存", trigger: "blur" }],
          original: [{ required: true, message: "请输入原价", trigger: "blur" }],
          vipPice: [{ required: true, message: "请输入会员价", trigger: "blur" }],
          cost: [{ required: true, message: "请输入成本价", trigger: "blur" }],
          guige: [{ required: true, message: "请添加规格", trigger: "change" }],
          pic: [{ required: true, message: "请上传封面图" }],
          img: [{ required: true, message: "请上传轮播图" }],
        },
        editData: [],

        // 详情
        detailsVisible: false,

        //添加 添加规格
        specsVisible: false,
        specsForm: {
          goodsSpecs: [
            {
              specsName: "",//normsname
              attrName: "",
            },
          ],
        },




        //多个商品id
        goodsIds: [],

        // 排序
        goodsList: [],

        // 商品详情
        goodsDetail: {},

        // 商品详情规格信息
        detailsData: [],

        // 商品详情轮播图
        goodsAdvs: [],

        // 商品规格
        goodsSpecs: [],

        list: [],
        imageUrl: "",
        imgurl: "",

        AdvImg: [],
        fileLists: [], //添加商品轮播图

        // 上传视频
        vUrl: "",
        vimgurl: "",
        guige: "",
        html: '',
      };
    },
    created() {
      this.selectgoodsFind();
      this.getCate(0, 1);
    },
    methods: {
      handleSelect(key, keyPath) {
        console.log(key, keyPath);
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },

      handleClose(key, keyPath) {
        console.log(key, keyPath);
        this.outVisible = false
      },
      handleClose2(key, keyPath) {
        console.log(key, keyPath);
        this.upVisible = false
      },
      handleClose3(key, keyPath) {
        console.log(key, keyPath);
        this.downVisible = false
      },
      backGoodss() {
        this.ruleForm.goodsname = "";
        this.ruleForm.classB = "";
        this.ruleForm.classA = "";
        this.ruleForm.supplier = "";
        this.imageUrl = "";
        this.imgurl = "";
        this.vUrl = "";
        this.vimgurl = "";
        this.ruleForm.stock = "";
        this.ruleForm.original = "";
        this.ruleForm.vipPice = "";
        this.ruleForm.cost = "";
        this.ruleForm.goodsDesc = "";
        this.goodsSpecs = [];
        this.AdvImg = []
        this.addVisible = false
        this.specsForm.goodsSpecs = [{
          specsName: "",
          attrName: "",
        }]
        this.addData = []
      },
      //添加规格表单
      addEnvironmentForm() {
        this.specsForm.goodsSpecs.push({
          specsName: "",
          attrName: "",
          key: Date.now(),
        });
      },
      getguige(val) {
        this.guige = val;
      },
      addEnvironment(formName) {
        if (this.guige == 1) {
          let goodsAttrList = [];
          let arr1 = JSON.parse(JSON.stringify(this.specsForm)).goodsSpecs;

          let arr = [];
          this.list = this.specsForm.goodsSpecs;
          for (let i = 0; i < this.list.length; i++) {
            this.list[i].attrName = this.list[i].attrName.split(",");
            arr.push({ goodsAttrList: [], specsName: "" });
            for (let j = 0; j < this.list[i].attrName.length; j++) {
              arr[i].goodsAttrList.push({ attrName: this.list[i].attrName[j] });
              arr[i].specsName = this.list[i].specsName;
            }
          }

          this.goodsSpecs = arr;
          console.log(this.list, arr, "this.list");

          this.addData = arr1;
          console.log(this.addData, arr);
        } else {
          let goodsAttrList = [];
          let arr1 = JSON.parse(JSON.stringify(this.specsForm)).goodsSpecs;

          let arr = [];
          this.list = this.specsForm.goodsSpecs;
          for (let i = 0; i < this.list.length; i++) {
            this.list[i].attrName = this.list[i].attrName.split(",");
            arr.push({ goodsAttrList: [], specsName: "" });
            for (let j = 0; j < this.list[i].attrName.length; j++) {
              arr[i].goodsAttrList.push({ attrName: this.list[i].attrName[j] });
              arr[i].specsName = this.list[i].specsName;
            }
          }

          arr1.forEach((e) => {
            this.editData.push({
              specsName: e.specsName,
              attrName: e.attrName,
            });
          });

          // this.editData.push(arr1);
          console.log(this.editData);
          this.goodsSpecs = arr;
          console.log(this.list, arr, "this.list");
        }

        this.specsVisible = false;
        this.$refs.specsForm.resetFields();

        // console.log(JSON.parse(JSON.stringify(this.specsForm)));
      },

      removeEnvironmentForm(item) {
        var index = this.specsForm.goodsSpecs.indexOf(item);
        if (index !== -1) {
          this.specsForm.goodsSpecs.splice(index, 1);
        }
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
        this.pageSize = val;
        this.selectgoodsFind();
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.pageNum = val;
        this.selectgoodsFind();
      },

      // 商品列表
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
      //       this.tableData = data.data.list;
      //       this.pagetotal = data.data.total;
      //     },
      //   });
      // },

      // 导出
      getexport() {
        let params = {
          token: this.token,
          type: 2,
        };
        // params.is_export = 1
        this.$download(
          "http://manager.zhizhennengyuan.com:8000/manage/export",
          params,
          "商品列表"
        ).then((res) => {
          console.log(res, "res1");
        });
      },

      // 获取商品id
      goodslistChange(val) {
        this.multipleSelection = val;
        console.log(val);
        let ids = [];
        let goodsList = [];
        val.forEach((e) => {
          ids.push(e.goodsId);
          goodsList.push({
            goodsId: e.goodsId,
            ordid: e.ordid,
          });
        });

        this.goodsIds = ids;
        this.goodsList = goodsList;

        console.log(this.goodsList);
      },

      // 商品添加


      uploadImgs(file) {
        this.$uploadFiles(
          "http://manager.zhizhennengyuan.com:8000/mfxapi/multifileupload",
          file.file
        ).then((res) => {
          this.imageUrl = res.result[0].relative_url;
          this.imgurl = res.result[0].url;
          console.log(res, "res2");
        });
      },

      // 上传视频
      vuploadImgs(file) {
        this.$uploadFiles(
          "http://manager.zhizhennengyuan.com:8000/mfxapi/multifileupload",
          file.file
        ).then((res) => {
          this.vUrl = res.result[0].relative_url;
          this.vimgurl = res.result[0].url;
          console.log(res, "res2");
        });
      },
      vuploadDel() {
        this.vUrl = ''
        this.video = ''
      },
      // 删除图片
      fileDel(index) {
        this.AdvImg.splice(index, 1);
        this.fileLists.splice(index, 1);
      },
      // 上传展示图
      goodsAdvsup(file) {
        if (this.AdvImg.length < 5) {
          // console.log(file.file, 'file')
          this.$uploadFiles(
            "http://manager.zhizhennengyuan.com:8000/mfxapi/multifileupload",
            file.file
          ).then((res) => {
            console.log(res);
            res.result.forEach((e) => {
              this.AdvImg.push({
                src: e.url,
              });

              this.fileLists.push({
                goodsAdvImg: e.relative_url,
              });
            });
            console.log(this.AdvImg);
            // console.log(res.data, 'res2')
            console.log(this.fileLists);
          });
        } else {
          this.$message.error("不能超过五张哦！");
        }
      },



      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },

      // 富文本转html
      change(value, render) {
        // render 为 markdown 解析后的结果[html]
        this.html = render;
      },
      changes(value, render) {
        // render 为 markdown 解析后的结果[html]
        this.html = render;
      },

      // 添加商品
      getaddGoods() {
        if (
          this.ruleForm.goodsname == "" ||
          this.ruleForm.classB == "" ||
          this.ruleForm.supplier == "" ||
          this.imageUrl == "" ||
          this.ruleForm.stock == "" ||
          this.ruleForm.original == "" ||
          this.ruleForm.vipPice == "" ||
          this.ruleForm.cost == "" ||
          this.fileLists.length == 0 ||
          this.goodsSpecs == []
        ) {
          this.$message({
            message: "请将信息填写完整",
            type: "warning",
          });
        } else {
          this.$api.post({
            path: "/manage/addGoods",
            params: {
              token: this.token,
              goodsName: this.ruleForm.goodsname,
              cateId: this.ruleForm.classB,
              provider: this.ruleForm.supplier,
              shelfStatus: 1,
              coverImg: this.imageUrl,
              video: this.vUrl,
              stock: this.ruleForm.stock,
              originalProice: this.ruleForm.original,
              memberPrice: this.ruleForm.vipPice,
              costPrice: this.ruleForm.cost,
              goodsDesc: this.ruleForm.goodsDesc,
              goodsSpecs: this.goodsSpecs,
              goodsAdvs: this.fileLists,
              goodsDescMd: this.ruleForm.goodsDesc
            },
            success: (data) => {
              console.log(data);
              if (data.code == 1) {
                this.$message({
                  message: data.msg,
                  type: "success",
                });
                this.ruleForm.goodsname = "";
                this.ruleForm.classB = "";
                this.ruleForm.classA = "";
                this.ruleForm.supplier = "";
                this.imageUrl = "";
                this.imgurl = "";
                this.vUrl = "";
                this.vimgurl = "";
                this.ruleForm.stock = "";
                this.ruleForm.original = "";
                this.ruleForm.vipPice = "";
                this.ruleForm.cost = "";
                this.ruleForm.goodsDesc = "";
                this.goodsSpecs = [];
                this.AdvImg = []
                this.addVisible = false
                this.addData = []
                this.fileLists = []
                this.selectgoodsFind();
                this.specsForm.goodsSpecs = [{ specsName: '', attrName: '' }]
              }
            },
          });
        }
      },
      addClose() {
        this.ruleForm.goodsname = "";
        this.ruleForm.classB = "";
        this.ruleForm.classA = "";
        this.ruleForm.supplier = "";
        this.imageUrl = "";
        this.imgurl = "";
        this.vUrl = "";
        this.vimgurl = "";
        this.ruleForm.stock = "";
        this.ruleForm.original = "";
        this.ruleForm.vipPice = "";
        this.ruleForm.cost = "";
        this.ruleForm.goodsDesc = "";
      },
      // 商品(上架、下架、删除)
      operationGoods(type) {
        this.$api.post({
          path: "/manage/operationGoods",
          params: {
            token: this.token,
            type: type,
            goodsIds: this.goodsIds.join(","),
          },
          success: (data) => {
            if (data.code == 1) {
              this.$message({
                message: data.msg,
                type: "success",
              });

              if (this.tableData.length == 0) {
                this.pageNum == 1
                // this.selectgoodsFind();
              }
              this.selectgoodsFind();

            } else {
              this.$message({
                message: "请选择要操作的商品信息",
                type: "warning",
              });
            }
            console.log(data);

          },
        });
      },

      // 提交排序
      getsubmitSort() {
        if (this.goodsList.length == 0) {
          this.$message({
            message: "请选择要修改的信息",
            type: "warning",
          });
          this.selectgoodsFind();
        } else {
          this.$api.post({
            path: "/manage/submitSort",
            params: {
              token: this.token,
              goodsList: this.goodsList,
            },
            success: (data) => {
              console.log(data);
              if (data.code == 1) {
                this.$message({
                  message: data.msg,
                  type: "success",
                });
                this.selectgoodsFind();
              }
            },
          });
        }
      },

      // 商品详情
      details(index, row) {
        console.log(index, row);
        this.detailsVisible = true;
        this.$api.post({
          path: "/manage/getGoodsDetail",
          params: {
            token: this.token,
            goodsId: row.goodsId,
          },
          success: (data) => {
            console.log(data);
            this.goodsDetail = data.data;
            this.detailsData = data.data.goodsSpecs;
            this.goodsAdvs = data.data.goodsAdvs;
          },
        });
      },


      // 编辑
      edit(index, row) {
        console.log(index, row);
        this.editVisible = true;
        this.$api.post({
          path: "/manage/getGoodsDetail",
          params: {
            token: this.token,
            goodsId: row.goodsId,
          },
          success: (data) => {
            console.log(data);
            this.editForm.goodsname = data.data.goodsName;
            this.editForm.goodsId = data.data.goodsId;
            this.editForm.classB = data.data.cateId;
            this.editForm.classA = data.data.oneId;
            this.editForm.supplier = data.data.provider;
            this.editForm.stock = data.data.stock;
            this.editForm.original = data.data.originalProice;
            this.editForm.vipPice = data.data.memberPrice;
            this.editForm.cost = data.data.costPrice;
            this.editForm.goodsDesc = data.data.goodsDesc;
            this.editForm.goodsSpecs = data.data.goodsSpecs;
            this.editForm.goodsAdvs = data.data.goodsAdvs;
            this.editForm.video = data.data.video;
            this.editForm.coverImg = data.data.coverImg;
            this.editForm.goodsDesc = data.data.goodsDesc;
            this.editForm.oneCateName = data.data.oneCateName;
            this.editForm.twoCateName = data.data.twoCateName;
            this.editForm.vUrl = data.data.videoSrc;

            data.data.goodsAdvs.forEach((e) => {
              this.editForm.fileLists.push({
                goodsAdvImg: e.adv
              })
            })

            let editData = []
            this.editForm.goodsSpecs.forEach((e) => {
              editData.push({
                specsName: e.specsName,
                attrName: e.attrName,
              });
            });
            this.editData = editData

            this.specsForm.goodsSpecs = data.data.goodsSpecs

            this.getCate(data.data.oneId, 2)

          },
        });
      },
      geteditGoods() {

        this.$api.post({
          path: "/manage/addGoods",
          params: {
            token: this.token,
            goodsName: this.editForm.goodsname,
            goodsId: this.editForm.goodsId,
            cateId: this.editForm.classB,
            provider: this.editForm.supplier,
            shelfStatus: 1,
            coverImg: this.editForm.imageUrl,
            video: this.editForm.vUrl,
            stock: this.editForm.stock,
            originalProice: this.editForm.original,
            memberPrice: this.editForm.vipPice,
            costPrice: this.editForm.cost,
            goodsDesc: this.editForm.goodsDesc,
            goodsSpecs: this.goodsSpecs,
            goodsAdvs: this.editForm.fileLists,
          },
          success: (data) => {
            console.log(data);
            if (data.code == 1) {
              this.$message({
                message: data.msg,
                type: "success",
              });

              this.editVisible = false
              this.selectgoodsFind();
              this.editForm.goodsId = ''
              // this.editForm.goodsAdvs = []
              // this.editForm.fileLists = []
              // this.editForm.fileLists.length = 0
              // this.editForm.goodsAdvs.length = 0
              // this.editForm.imageUrl = ''
              // this.editForm.coverImg = ''
              // this.editForm.vUrl = ''
              // this.editForm.video = ''
              // this.specsForm.goodsSpecs = [{ specsName: '', attrName: '' }]
              this.editClose()
            }
          }

        });

      },

      editClose() {
        this.editForm.goodsname = '';
        this.editForm.goodsId = '';
        this.editForm.classB = '';
        this.editForm.classA = '';
        this.editForm.supplier = '';
        this.editForm.stock = '';
        this.editForm.original = '';
        this.editForm.vipPice = '';
        this.editForm.cost = '';
        this.editForm.goodsDesc = '';
        this.editForm.goodsSpecs = '';
        this.editForm.goodsAdvs = '';
        this.editForm.video = '';
        this.editForm.coverImg = '';
        this.editForm.goodsDesc = '';
        this.editForm.oneCateName = '';
        this.editForm.twoCateName = '';
        this.editForm.vUrl = '';
        this.editForm.imageUrl = ''
        this.editForm.goodsAdvs = []
        this.editForm.fileLists = []
        this.editForm.fileLists.length = 0
        this.editForm.goodsAdvs.length = 0
        this.specsForm.goodsSpecs = [{ specsName: '', attrName: '' }]
      },


      euploadImgs(file) {
        this.$uploadFiles(
          "http://manager.zhizhennengyuan.com:8000/mfxapi/multifileupload",
          file.file
        ).then((res) => {
          this.editForm.imageUrl = res.result[0].relative_url;
          this.editForm.coverImg = res.result[0].url;
          console.log(res, "res2");
        });
      },

      // 上传视频
      evuploadImgs(file) {
        this.$uploadFiles(
          "http://manager.zhizhennengyuan.com:8000/mfxapi/multifileupload",
          file.file
        ).then((res) => {
          this.editForm.vUrl = res.result[0].relative_url;
          this.editForm.video = res.result[0].url;
          console.log(res, "res2");
        });
      },
      evuploadDel() {
        this.editForm.vUrl = ''
        this.editForm.video = ''
      },
      // 删除图片
      efileDel(index) {
        this.editForm.goodsAdvs.splice(index, 1);
        this.editForm.fileLists.splice(index, 1);

        console.log(this.editForm.goodsAdvs, index, "ss");
      },
      // 上传展示图
      egoodsAdvsup(file) {
        if (this.editForm.goodsAdvs.length < 5) {
          // console.log(file.file, 'file')
          this.$uploadFiles(
            "http://manager.zhizhennengyuan.com:8000/mfxapi/multifileupload",
            file.file
          ).then((res) => {
            console.log(res);
            res.result.forEach((e) => {
              this.editForm.goodsAdvs.push({
                goodsAdvImg: e.url,
              });

              this.editForm.fileLists.push({
                goodsAdvImg: e.relative_url,
              });
            });
            console.log(this.editForm.goodsAdvs);
            // console.log(res.data, 'res2')
            console.log(this.editForm.fileLists);
          });
        } else {
          this.$message.error("不能超过五张哦！");
        }
      },

      // 获取一级分类
      getCate(cateId, type) {
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
          },
        });
      },
      seloneCate(val) {
        this.twoCateLiat = []
        this.formInline.classB = ''
        this.ruleForm.classB = ''
        this.editForm.classB = ''
        this.getCate(val, 2)
      },

      getfindType(val) {
        this.formInline.region = val;
      },
      selectgoodsFind() {
        this.$api.post({
          path: "/manage/getGoodsList",
          params: {
            token: this.token,
            goodsName: this.formInline.goodsName,
            oneCateName: this.formInline.classA.toString(),
            twoCateName: this.formInline.classB.toString(),
            shelfStatus: this.formInline.region,
            pageNum: this.pageNum,
            pageSize: this.pageSize
          },
          success: (data) => {
            console.log(data);
            this.tableData = data.data.list;
            this.pagetotal = data.data.total;
          },
        });
      },
    },

    mounted() {
      // this.getGoodsList();
      // this.selectgoodsFind()
      // this.getCate(0, 1);
      // this.getaddCate();
      // this.geteditCate(0, 1);

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
  }

  .goodslist {
    width: 100%;
    height: 100%;
  }

  .goodsmain {
    /* width: 98%;
    height: 80%; */
    padding: 10px 10px 0px 10px;

  }

  .goodsfind {
    width: 100%;

    padding-top: 10px;
    background-color: white;
    margin-bottom: 10px;
  }

  .goodsfind .el-form-item__content {
    width: 160px;
  }

  .goodsdata {
    /* width: 98%;
    height: 100%; */
    padding: 10px 20px;
    background-color: white;
  }

  .goodsdata .iconfont {
    font-size: 12px;
  }

  .goodsdata .recovery {
    background-color: rgb(48, 216, 192);
    color: white;
    border: 0px;
  }

  .goodsdata .disable {
    background-color: rgb(255, 102, 0);
    color: white;
    border: 0px;
  }

  .goodsdata .delete {
    background-color: rgb(234, 74, 92);
    color: white;
    border: 0px;
  }

  .goodsdata .commonbtn {
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

  .addbox .el-table td,
  .el-table th {
    padding: 0px !important;
  }

  /* .add .el-input{
        width: 155%;
    } */
  /* .addbox .el-dialog__body {
        padding-top: 20px;
        padding-bottom: 100px;
        border-top: 1px solid #ccc;
    } */
  .goodslist .el-dialog__header {
    padding: 12px 20px 10px;
  }

  .goodslist .el-dialog__title {
    color: #606266;
    font-size: 14px;
  }

  .goodslist .el-dialog__body {
    padding-top: 20px;
    padding-bottom: 100px;
    border-top: 1px solid #ccc;
  }

  .adds .el-form--inline .el-form-item {
    margin-right: 80px;
  }

  .adds .el-select-dropdown .el-popper {
    min-width: 160px;
  }

  .adds .el-input__icon {
    width: 25px;
  }

  .adds .addselect .el-input {
    width: 60%;
  }

  .adds .addselect .el-form--inline .el-form-item {
    margin-right: -45px;
  }

  .adds .el-select {
    margin-right: -70px;
  }

  .adds .el-input {
    width: 135%;
  }

  .adds .el-input__inner {
    padding-left: 5px;
  }

  .adds .el-form-item__label {
    padding: 0px;
  }

  .adds .el-upload--picture-card {
    width: 65px;
    height: 65px;
    line-height: 65px;
  }

  .adds .el-upload--picture-card i {
    font-size: 20px;
  }

  /* 详情 */
  .goodsnewsbox {
    width: 100%;
  }

  .goodsnews {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
  }

  .goodsnews>div {
    width: 50%;
    margin-bottom: 10px;
  }

  .goodsimg {
    width: 100%;
    display: flex;
  }

  .goodsimg div:first-child {
    width: 80px;
    margin-right: 60px;
  }

  .goodsimg div:first-child div {
    width: 100%;
    height: 80px;
  }

  .goodsimg div:first-child div img {
    width: 100%;
    height: 100%;
  }

  .goodsimg div:last-child {
    width: 80%;
    height: 80px;
    /* display: flex; */
  }

  .lunbo {
    width: 100%;
    height: 80px;
    display: flex;
  }

  .lunbo img {
    width: 80px;
    height: 80px;
    margin-right: 10px;
  }

  .goodsv {
    width: 100%;
  }

  .goodsv video {
    width: 80px;
    height: 80px;
  }

  .specs .el-input {
    width: 60%;
  }

  .normbox {
    width: 80%;
    position: relative;
  }

  .goodsAdd {
    position: absolute;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    border: 1px solid #999;
    text-align: center;
    line-height: 15px;
    right: 138px;
    top: 12px;
  }

  .inform {
    position: relative;
  }

  .goodsLAdd {
    position: absolute;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    border: 1px solid #999;
    text-align: center;
    line-height: 15px;
    right: 255px;
    top: 12px;
  }

  .img_box {
    width: 100%;
    padding: 0 2%;
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 20px;
  }

  .img_size {
    position: relative;
    width: 64px;
    height: 64px;
    padding: 5px;
    margin-right: 10px;
  }

  .img_size img {
    width: 100%;
    height: 100%;
    border-radius: 5px;
  }

  .remove_logo {
    position: absolute;
    width: 15px;
    height: 15px;
    background: red;
    border-radius: 25px;
    top: 5px;
    right: 5px;
    text-align: center;
    line-height: 15px;
    font-size: 12px;
    color: white;
  }

  .add_img {
    width: 64px;
    height: 64px;
    margin-top: 5px;
    text-align: center;
    line-height: 64px;
    font-size: 30px;
    color: #777777;
    border: 1px solid #cccccc;
    border-radius: 5px;
  }

  /* 图片上传 */
  .userimage {
    width: 100%;
    /* height: 50px; */
  }

  .userimage img {
    width: 50px;
    height: 50px;
  }

  .element::-webkit-scrollbar {
    width: 0 !important
  }

  .element {
    -ms-overflow-style: none;
  }

  .element {
    overflow: -moz-scrollbars-none;
    ;
  }

  .tox-tinymce-aux {
    z-index: 9999 !important;
  }
</style>