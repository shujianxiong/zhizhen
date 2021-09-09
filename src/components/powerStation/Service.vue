<template>
  <div class="service">
    <el-menu :default-active="activeIndex2" class="el-menu-demo" mode="horizontal" @select="handleSelect"
      background-color="white" text-color="#f999" active-text-color="rgb(18,42,136)">
      <el-menu-item index="1">服务电站</el-menu-item>
    </el-menu>
    <div class="sermain">
      <div class="sermainbox">
        <el-form ref="form" :model="form" label-width="100px" label-position="left" size="medium" :inline="true"
          :rules="rules">
          <el-form-item label="电站名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入电站名称"></el-input>
          </el-form-item>
          <br />
          <el-form-item label="轮播图" prop="img">
            <div class="img_box">
              <div class="img_size" v-for="(item, index) of AdvImg" :key="index" v-show="AdvImg.length != 0">
                <img v-if="AdvImg.length != 0" :src="item.stationAdvImg" />
                <div class="remove_logo" @click="fileDel(index)">×</div>
              </div>
              <el-upload action="" list-type="picture-card" accept=".jpg,.jpeg,.png,.JPG,.JPEG,.PNG"
                :http-request="goodsAdvsup" :show-file-list="false">
                <i class="el-icon-camera-solid"></i>
              </el-upload>
            </div>
            <p style="font-size: 12px; color: #999">
              最多上传5张，推荐尺寸为640*300
            </p>
          </el-form-item>
          <br />
          <div class="toolbars">
            <div class="toolbar">
              <p><span>*</span>图文简介</p>
              <div>
                <tinymce-editor ref='tinymce' :init='init' v-model="form.twjj"></tinymce-editor>
              </div>
            </div>
            <div class="toolbar">
              <p><span>*</span>组建更换</p>
              <div>
                <tinymce-editor ref='tinymce1' :init='init' v-model="form.zjgh"></tinymce-editor>
              </div>
            </div>
            <div class="toolbar">
              <p><span>*</span>发电量核查</p>
              <div>
                  <tinymce-editor ref='tinymce2' :init='init' v-model="form.fdlhc"></tinymce-editor>
              </div>
            </div>
            <div class="toolbar">
              <p><span>*</span>发电量专项检查</p>
              <div>
                  <tinymce-editor ref='tinymce3' :init='init' v-model="form.fdlzxjc"></tinymce-editor>
              </div>
            </div>
            <div class="toolbar">
              <p><span>*</span>电站清洗保养</p>
              <div class="toolbarbox">
                  <tinymce-editor ref='tinymce4' :init='init' v-model="form.dzqxby"></tinymce-editor>
              </div>
            </div>
          </div>
          <el-form-item>
            <el-button style="background-color: rgb(54, 116, 255); color: white" @click="updateServiceStation">确定
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
  const axios = require("axios");
  import marked from "marked";
  // import '@/assets/css/markdown/dark.css' //引入代码高亮的css
  import hljs from "highlight.js";
  export default {
    data() {
      return {
        activeIndex2: "1",
        token: localStorage.getItem("token"),
        AdvImg: [],
        fileLists: [], //添加商品轮播图
        form: {
          name: "",
          img: "",
          twjj: "",
          zjgh: "",
          fdlhc: "",
          fdlzxjc: "",
          dzqxby: "",
        },
        rules: {
          name: [
            { required: true, message: "请输入电站名称", trigger: "blur" },
          ],
          img: [
            { required: true, message: "请上传图片", trigger: "change" },
          ],
        },
        
        type: 0,

       
      };
    },
    methods: {
      handleSelect(key, keyPath) {
        console.log(key, keyPath);
      },
      // 删除图片
      fileDel(index) {
        this.AdvImg.splice(index, 1);
        this.fileLists.splice(index, 1);
      },

      get(val) {
        this.type = val
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
                stationAdvImg: e.url,
              });

              this.fileLists.push({
                stationAdvImg: e.relative_url,
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
     
      getServiceStationList() {
        this.$api.post({
          path: "/manage/getServiceStationList",
          params: {
            token: this.token,
          },
          success: (data) => {
            console.log(data);
            this.form.name = data.data.srv_stattion_name;
            this.form.dzqxby = data.data.srv_station_dzqxby;
            this.form.fdlhc = data.data.srv_station_fdlhc;
            this.form.fdlzxjc = data.data.srv_station_fdlzxjc;            
            this.form.twjj = data.data.srv_station_tjjj;        
            this.form.zjgh = data.data.srv_station_zjgh;
            this.AdvImg = data.data.stationAdvList;
          },
        });
      },

      updateServiceStation() {
        
        if (this.AdvImg.length == 0 || this.form.name == '' || this.form.dzqxby == '' || this.form.fdlhc == '' || this.form.fdlzxjc == '' || this.form.twjj == '' || this.form.zjgh == '') {
          this.$message({
            message: '请将信息填写完整',
            type: 'warning'
          });
        }
        this.$api.post({
          path: "/manage/updateServiceStation",
          params: {
            token: this.token,
            srv_stattion_name: this.form.name,
            srv_station_dzqxby: this.form.dzqxby,
            srv_station_fdlhc: this.form.fdlhc,
            srv_station_fdlzxjc: this.form.fdlzxjc,
            srv_station_tjjj: this.form.twjj,
            srv_station_zjgh: this.form.zjgh,
            stationAdvList: this.fileLists,
          },
          success: (data) => {
            if (data.code == 1) {
              this.$message({
                message: '服务电站编辑成功',
                type: 'success'
              });
            }
            console.log(data);
            this.getServiceStationList();
          },
        });
      },
    },
    mounted() {
      this.getServiceStationList();
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

  .tox-tinymce-aux{
    z-index: 9999 !important;
  }

  .service {
    width: 100%;
    height: 100%;
  }

  .sermain {
    width: 98%;
    padding: 10px 10px 0px 10px;

  }

  .sermainbox {
    width: 99%;
    height: 730px;
    padding: 10px;
    background-color: white;
    /* overflow-y: auto; */
    /* overflow-x: hidden; */
    overflow-y: scroll;
  }

  .sermainbox .el-upload--picture-card {
    width: 64px;
    height: 64px;
    line-height: 64px;
  }

  .sermainbox .el-upload--picture-card i {
    font-size: 20px;
  }

  .sermainbox .el-upload-list--picture-card .el-upload-list__item {
    width: 64px;
    height: 64px;
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

  .toolbars {
    width: 100%;
    /* display: flex;
    flex-wrap: wrap; */
    margin-top: 10px;
  }


  .toolbar {
    /* display: inline-block; */
    /* width: 45%; */
    /* z-index: 9999; */
    /* margin-right: 25px; */
    margin-top: 10px;
    margin-bottom: 10px;
  }

  .toolbar p {
    font-size: 14px;
    color: #606266;
    margin-bottom: 10px;
  }

  .toolbar p span {
    color: red;
  }

  .mavon-editor {
    height: 300px;
    overflow-y: scroll;
  }

  /* .twjj .add-image-link-wrapper[data-v-548e2160] {
    z-index: 99999 !important;
  }
  .add-image-link-wrapper[data-v-548e2160]{
    z-index: 9999;
  }
  .fdlhc .add-image-link-wrapper[data-v-548e2160] {
    z-index: 99999 !important;
  }
  .v-note-show{
    z-index: 0;
  }

  .div{
    z-index: 9999;
  } */

  .v-note-wrapper .v-note-panel .v-note-show .v-show-content {
    height: 500px !important;
  }
</style>