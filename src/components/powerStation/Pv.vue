<!-- 光伏电站 -->
<template>
    <div class="pvbox">
        <el-menu :default-active="activeIndex2" class="el-menu-demo" mode="horizontal" @select="handleSelect"
            background-color="white" text-color="#f999" active-text-color="rgb(18,42,136)">
            <el-menu-item index="1">共享能源</el-menu-item>
        </el-menu>

        <div class="pvmain">
            <div class="pvfind">
                <el-form :inline="true" :model="formInline" class="demo-form-inline" size="small"
                    style="margin-left: 10px">
                    <el-form-item>
                        <el-input v-model="formInline.no" placeholder="请输入设备PN码"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model="formInline.name" placeholder="请输入电站名称"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-select v-model="formInline.state" placeholder="请选择状态" @change='getchange'>
                            <el-option label="请选择状态" value=""></el-option>
                            <el-option label="筹集中" :value="1"></el-option>
                            <el-option label="已售罄" :value="2"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button style="background-color: rgb(54, 116, 255); color: white" icon="el-icon-search"
                            @click='getfind'>查询
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="pvdata">
                <el-row style="margin-bottom: 12px">
                    <el-button size="small" class="commonbtn" icon="el-icon-plus" @click="addVisible=true">添加
                    </el-button>
                    <el-button size="small" class="commonbtn" @click='setVisible=true'>电站设置</el-button>
                    <el-button size="small" class="commonbtn" @click='getsubmitSort'>提交排序</el-button>
                </el-row>

                <el-table ref="multipleTable" border :data="tableData" tooltip-effect="dark"
                    style="margin-bottom: 15px; font-size: 14px" class="table" 
                   
                    :header-cell-style="getRowClass"
                    @selection-change="ordidSelectionChange">
                    <el-table-column type="selection" width="60" align="center"></el-table-column>
                    <el-table-column label="id" width="45">
                        <template slot-scope="scope">
                            {{ scope.$index + 1 }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="stationNo" label="设备PN码"> </el-table-column>
                    <el-table-column prop="stationName" label="电站名称"> </el-table-column>
                    <el-table-column prop="syYearRate" label="年收益百分比"> </el-table-column>
                    <el-table-column prop="price" label="产品单价"> </el-table-column>
                    <el-table-column prop="syPeriod" label="收益期限/年"> </el-table-column>
                    <el-table-column prop="ygWatt" label="已购数量/瓦"> </el-table-column>
                    <el-table-column prop="syWatt" label="剩余数量/瓦"> </el-table-column>
                    <el-table-column prop="status" label="状态"> </el-table-column>
                    <el-table-column prop="attribute" label="属性"> </el-table-column>
                    <el-table-column label="排序">
                        <template slot-scope="scope">
                          <el-input v-model="scope.row.ordid"></el-input>
                        </template>
                      </el-table-column>
                    <el-table-column label="操作" width='315'>
                        <template slot-scope="scope">
                            <el-button size="mini" type="primary" @click="details(scope.$index, scope.row)">详情
                            </el-button>
                            <el-button size="mini" type="primary" @click="edit(scope.$index, scope.row)">编辑
                            </el-button>
                            <el-button size="mini" type="primary" @click="business(scope.$index, scope.row)">交易情况
                            </el-button>
                            <el-button size="mini" type="danger" @click="deletes(scope.$index, scope.row)">删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="page" style="display: flex;">
                    <div class="grid-content bg-purple-light" style="margin-left: auto;">
                        <el-pagination background @size-change="handleSizeChange" @current-change="current_change"
                            :current-page="pageNum" :page-size="pageSize"
                            layout="total, sizes, prev, pager, next, jumper" :total="pagetotal">
                        </el-pagination>
                    </div>
                </div>
            </div>
        </div>

        <!-- 添加 -->
        <el-dialog title="添加" :visible.sync="addVisible" width="750px" @close="backGoodss"
            :close-on-click-modal="false">
            <div class="information">
                <div style="width: 100%; margin: 0 auto; ">
                    <div class="salemessage addimput">
                        <p>基本信息</p>
                        <el-form :inline="true" :model="ruleForm" ref="ruleForm">
                            <el-form-item label="设备PN码" required class="longinput">
                                <el-input v-model="ruleForm.no" placeholder="请输入设备PN码"></el-input>
                            </el-form-item>
                            <br>
                            <el-form-item label="实际电站名称" class="small">
                                <el-input v-model="ruleForm.realStationName" disabled placeholder="请选择电站"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button style="background-color: rgb(54, 116, 255); color: white"
                                    @click='realList(1)'>
                                    选择电站</el-button>
                            </el-form-item>
                            <br>
                            <el-form-item label="电站名称" required class="longinput">
                                <el-input v-model="ruleForm.name" placeholder="请输入电站名称"></el-input>
                            </el-form-item>
                            <br>
                            <el-form-item label="电站地址" required class="longinput">
                                <el-input v-model="ruleForm.address" placeholder="请输入电站地址"></el-input>
                            </el-form-item>
                            <br>
                            <el-form-item label="经度" required class="small">
                                <el-input v-model="ruleForm.longitude" placeholder="请输入经度"></el-input>
                            </el-form-item>
                            <el-form-item label="纬度" required class="small smallinput">
                                <el-input v-model="ruleForm.latitude" placeholder="请输入纬度"></el-input>
                            </el-form-item>
                            <br>
                            <el-form-item label="年收益百分比" required class="longinput">
                                <el-input v-model="ruleForm.profit" placeholder="请输入年收益百分比"></el-input>
                                <span>%</span>
                            </el-form-item>
                            <el-form-item label="总瓦数" required class="longinput">
                                <el-input v-model="ruleForm.total" placeholder="请输入总瓦数"></el-input>
                                <span>瓦</span>
                            </el-form-item>
                            <el-form-item label="产品单价" required class="longinput">
                                <el-input v-model="ruleForm.price" placeholder="请输入产品单价"></el-input>
                                <span>元/瓦</span>
                            </el-form-item>
                            <el-form-item label="收益期限" required class="longinput">
                                <el-input v-model="ruleForm.term" placeholder="请输入收益期限"></el-input>
                                <span>年</span>
                                <p>说明：购买次日算起</p>
                            </el-form-item>
                            <br>
                            <el-form-item label="轮播图" required class="longinput">
                                <div class="img_box">
                                    <div class="img_size" v-for="(item, index) of imgurl" :key="index"
                                        v-show="imgurl.length != 0">
                                        <img v-if="imgurl.length != 0" :src="item.src" />
                                        <div class="remove_logo" @click="fileDel(index)">×</div>
                                    </div>
                                    <el-upload action="" list-type="picture-card" :on-preview="handlePictureCardPreview"
                                        :on-remove="handleRemove" accept=".jpg,.jpeg,.png,.JPG,.JPEG,.PNG"
                                        :http-request="uploadImgs" :show-file-list="false">
                                        <i class="el-icon-camera-solid"></i>
                                    </el-upload>
                                </div>
                                <p style="font-size: 12px; color: #999;">最多上传5张，推荐尺寸为640*300</p>
                            </el-form-item>

                        </el-form>
                    </div>

                    <div class="salemessage addimput">
                        <p>规则介绍</p>
                        <div>
                            <!-- <mavon-editor v-model="ruleForm.ruleDesc" ref="md1" @imgAdd="$imgAdd1" @change="change"
                                :toolbars="toolbars" /> -->

                            <tinymce-editor ref='tinymce' :init='init' v-model="ruleForm.ruleDesc"></tinymce-editor>
                        </div>
                    </div>
                    <div class="salemessage addimput">
                        <p>电站详情</p>
                        <div>
                            <!-- <mavon-editor v-model="ruleForm.stationDesc" ref="md2" @imgAdd="$imgAdd2" @change="changes"
                                :toolbars="toolbars" /> -->
                            <tinymce-editor ref='tinymce1' :init='init' v-model="ruleForm.stationDesc"></tinymce-editor>
                        </div>
                    </div>

                    <el-button style="background-color: rgb(54, 116, 255); color: white" @click="addStation()">确定
                    </el-button>
                </div>
            </div>
        </el-dialog>
        <!-- 编辑 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="750px" :close-on-click-modal="false">
            <div class="information">
                <div style="width: 100%; margin: 0 auto; ">
                    <div class="salemessage addimput">
                        <p>基本信息</p>
                        <el-form :inline="true" ref="editForm" :model='editForm'>
                            <el-form-item label="设备PN码" required class="longinput">
                                <el-input v-model="editForm.no" placeholder="请输入设备PN码"></el-input>
                            </el-form-item>
                            <br>
                            <el-form-item label="实际电站名称" class="small">
                                <el-input v-model="editForm.realStationName" disabled placeholder="请选择电站"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button style="background-color: rgb(54, 116, 255); color: white"
                                    @click='realList(2)'>
                                    选择电站</el-button>
                            </el-form-item>
                            <br>
                            <el-form-item label="电站名称" required class="longinput">
                                <el-input v-model="editForm.name" placeholder="请输入电站名称"></el-input>
                            </el-form-item>
                            <br>
                            <el-form-item label="电站地址" required class="longinput">
                                <el-input v-model="editForm.address" placeholder="请输入电站地址"></el-input>
                            </el-form-item>
                            <br>
                            <el-form-item label="经度" required class="small">
                                <el-input v-model="editForm.longitude" placeholder="请输入经度"></el-input>
                            </el-form-item>
                            <el-form-item label="纬度" required class="small smallinput">
                                <el-input v-model="editForm.latitude" placeholder="请输入纬度"></el-input>
                            </el-form-item>
                            <br>
                            <el-form-item label="年收益百分比" required class="longinput">
                                <el-input v-model="editForm.profit" placeholder="请输入年收益百分比"></el-input>
                                <span>%</span>
                            </el-form-item>
                            <el-form-item label="总瓦数" required class="longinput">
                                <el-input v-model="editForm.total" placeholder="请输入总瓦数" :disabled='true'></el-input>
                                <span>瓦</span>
                            </el-form-item>
                            <el-form-item label="产品单价" required class="longinput">
                                <el-input v-model="editForm.price" placeholder="请输入产品单价"></el-input>
                                <span>元/瓦</span>
                            </el-form-item>
                            <el-form-item label="收益期限" required class="longinput">
                                <el-input v-model="editForm.term" placeholder="请输入收益期限" :disabled='true'></el-input>
                                <span>年</span>
                                <p>说明：购买次日算起</p>
                            </el-form-item>
                            <br>
                            <el-form-item label="轮播图" required class="longinput">
                                <div class="img_box">
                                    <div class="img_size" v-for="(item, index) of editForm.imgurl" :key="index"
                                        v-show="editForm.imgurl.length != 0">
                                        <img v-if="editForm.imgurl.length != 0" :src="item.stationAdvImg" />
                                        <div class="remove_logo" @click="efileDel(index)">×</div>
                                    </div>
                                    <el-upload action="" list-type="picture-card" :on-preview="handlePictureCardPreview"
                                        :on-remove="handleRemove" accept=".jpg,.jpeg,.png,.JPG,.JPEG,.PNG"
                                        :http-request="euploadImgs" :show-file-list="false">
                                        <i class="el-icon-camera-solid"></i>
                                    </el-upload>

                                </div>
                                <p style="font-size: 12px; color: #999;">最多上传5张，推荐尺寸为640*300</p>
                            </el-form-item>
                        </el-form>
                    </div>

                    <div class="salemessage addimput">
                        <p>规则介绍</p>
                        <div>
                            <!-- <mavon-editor v-model="editForm.ruleDesc" ref="md3" @imgAdd="$imgAdd3" @change="change3"
                                :toolbars="toolbars" /> -->
                            <tinymce-editor ref='tinymce2' :init='init' v-model="editForm.ruleDesc"></tinymce-editor>
                        </div>
                    </div>
                    <div class="salemessage addimput">
                        <p>电站详情</p>
                        <div>
                            <!-- <mavon-editor v-model="editForm.stationDesc" ref="md4" @imgAdd="$imgAdd4" @change="change4"
                                :toolbars="toolbars" /> -->

                            <tinymce-editor ref='tinymce3' :init='init' v-model="editForm.stationDesc"></tinymce-editor>
                        </div>
                    </div>

                    <el-button style="background-color: rgb(54, 116, 255); color: white" @click="updateStation()">确定
                    </el-button>
                </div>
            </div>
        </el-dialog>
        <!-- 详情 -->
        <el-dialog title="详情" :visible.sync="detailsVisible" width="40%">
            <div class="information">
                <div style="width: 100%; margin: 0 auto; ">
                    <div class="salemessage addimput">
                        <p>基本信息</p>
                        <div>
                            <div>电站编码：{{sdetails.stationNo}}</div>
                            <div>电站名称：{{sdetails.stationName}}</div>
                            <span
                                style="display: inline-block;width: 30%;margin-bottom: 10px;">经度：{{sdetails.lng}}</span><span
                                style="display: inline-block;width: 50%;">纬度：{{sdetails.lat}}</span>
                            <div>年收益百分比：{{sdetails.syYearRate}}%</div>
                            <div>总瓦数：{{sdetails.totalWatt}}瓦</div>
                            <div>产品单价：{{sdetails.price}}元/瓦</div>
                            <div>收益期限：{{sdetails.syPeriod}}年</div>
                        </div>
                        <div>
                            <div>轮播图：</div>
                            <div class="lunboimgs">
                                <img v-for='item in stationAdvList' :key="item.stationAdvId" :src="item.stationAdvImg"
                                    alt="">
                            </div>
                        </div>
                    </div>

                    <div class="salemessage addimput">
                        <p>规则介绍</p>
                        <!-- <mavon-editor v-model="sdetails.ruleDesc" :toolbars="toolbars" /> -->
                        <tinymce-editor ref='tinymce4' :init='init' v-model="sdetails.ruleDesc"></tinymce-editor>
                    </div>
                    <div class="salemessage addimput">
                        <p>电站详情</p>
                        <!-- <mavon-editor v-model="sdetails.stationDesc" :toolbars="toolbars" /> -->
                        <tinymce-editor ref='tinymce5' :init='init' v-model="sdetails.stationDesc"></tinymce-editor>
                    </div>


                </div>
            </div>
        </el-dialog>

        <!-- 交易详情 -->
        <el-dialog title="交易详情" :visible.sync="businessVisible" width="930px">
            <div class="information business">
                <div style="width: 100%; margin: 0 auto; ">
                    <el-row style="margin-bottom: 12px" class="businessb">
                        <el-form :inline="true" :model="businessform" class="demo-form-inline" size="small"
                            style="margin-left: 10px">
                            <el-form-item>
                                <el-input v-model="businessform.phone" placeholder="请输入用户手机号"></el-input>
                            </el-form-item>
                            <el-date-picker v-model="businessform.time" type="daterange" range-separator="-"
                                start-placeholder="时间" end-placeholder="时间" value-format="yyyy-MM-dd">
                            </el-date-picker>
                            <el-form-item>
                                <el-input v-model="businessform.orderno" placeholder="请输入订单编号"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-select v-model="businessform.region" placeholder="请选择状态" @change='getChangebusines'>
                                    <el-option label="自购瓦数" value="1"></el-option>
                                    <el-option label="返利瓦数" value="2"></el-option>
                                    <el-option label="奖励瓦数" value="3"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item>
                                <el-button style="background-color: rgb(54, 116, 255); color: white"
                                    icon="el-icon-search" @click='getbusinessFind'>查询
                                </el-button>
                            </el-form-item>
                        </el-form>
                    </el-row>

                    <el-table ref="multipleTable" border :data="businessData" tooltip-effect="dark"
                        style="margin-bottom: 15px; font-size: 14px" class="table" :header-cell-style="getRowClass"
                        @selection-change="handleSelectionChange">
                        <el-table-column label="id" width="45">
                            <template slot-scope="scope">
                                {{ scope.$index + 1 }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="order_no" label="订单编号"> </el-table-column>
                        <el-table-column prop="create_time" label="时间"> </el-table-column>
                        <el-table-column prop="current_watt" label="瓦数" width="75"> </el-table-column>
                        <el-table-column prop="sy_year_rate" label="年收益百分比"> </el-table-column>
                        <el-table-column prop="price" label="产品单价(元/瓦)"> </el-table-column>
                        <el-table-column label="属性" width="80">
                            <template slot-scope="scope">
                                <p v-show='scope.row.ref_type == 1'>自购瓦数</p>
                                <p v-show='scope.row.ref_type == 2'>返利瓦数</p>
                                <p v-show='scope.row.ref_type == 3'>奖励瓦数</p>
                            </template>
                        </el-table-column>
                        <el-table-column prop="phone" label="受益人"> </el-table-column>
                    </el-table>
                    <div class="page" style="margin-left: auto; width: 50%;">
                        <div class="grid-content bg-purple-light">
                            <el-pagination background @size-change="businessSizeChange"
                                @current-change="businessCurrentChange" :current-page="businessform.pageNum"
                                :page-size="businessform.pageSize" layout="total, sizes, prev, pager, next, jumper"
                                :total="businessform.pagetotal">
                            </el-pagination>
                        </div>
                    </div>
                </div>
            </div>
        </el-dialog>

        <!-- 电站设置 -->
        <el-dialog title="电站设置" :visible.sync="setVisible" width="35%">
            <div class="information">
                <div style="width: 100%; margin: 0 auto; " class="businessadd">
                    <el-form :inline="true" :model="setInline" class="demo-form-inline" label-width="200px"
                        label-position='left' :rules="setrules">
                        <el-form-item label="返利瓦数计入电站" prop='rebate'>
                            <el-input v-model="setInline.rebate"></el-input>
                        </el-form-item>
                        <el-form-item size='small'>
                            <el-button type="primary" @click='selectcable=true,getselecetType(1)'>选择电站</el-button>
                        </el-form-item>
                        <br>
                        <el-form-item label="奖励瓦数计入电站" prop='reward'>
                            <el-input v-model="setInline.reward"></el-input>
                        </el-form-item>
                        <el-form-item size='small'>
                            <el-button type="primary" @click='selectcable=true,getselecetType(2)'>选择电站</el-button>
                        </el-form-item>
                        <br>
                        <el-form-item label=" ">
                            <el-button type="primary" @click='setVisible=false,saveStationSetting()'>确定</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </el-dialog>

        <!-- 选择电站 -->
        <el-dialog title="电站设置" :visible.sync="selectcable" width="40%">
            <div class="information">
                <div style="width: 100%; margin: 0 auto; " class="businessadd">
                    <el-table ref="multipleTable" border :data="setData" tooltip-effect="dark"
                        style="margin-bottom: 15px; font-size: 14px" class="table" :header-cell-style="getRowClass"
                        @selection-change="handleSelectionChange">
                        <el-table-column label="id" width="45">
                            <template slot-scope="scope">
                                {{ scope.$index + 1 }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="stationName" label="电站名称"> </el-table-column>
                        <el-table-column prop="address" label="电站地址"> </el-table-column>
                        <el-table-column prop="syYearRate" label="年收益百分比"> </el-table-column>
                        <el-table-column prop="price" label="产品单价"> </el-table-column>
                        <el-table-column prop="syPeriod" label="收益期限"> </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button size="mini" type="primary" @click="setselect(scope.$index, scope.row)">选择
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </el-dialog>

        <el-dialog title="删除" :visible.sync="outVisible" width="20%">
            <span>确认删除？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="outVisible = false">取 消</el-button>
                <el-button type="primary" @click=" getdeletes()">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 实际电站列表 -->
        <el-dialog title="电站设置" :visible.sync="realV" width="40%">
            <div class="information">
                <div style="width: 100%; margin: 0 auto; " class="realV">
                    <el-table ref="multipleTable" border :data="realData" tooltip-effect="dark"
                        style="margin-bottom: 15px; font-size: 14px" class="table" :header-cell-style="getRowClass"
                        @selection-change="handleSelectionChange">
                        <el-table-column prop="pid" label="id"></el-table-column>
                        <el-table-column prop="name" label="电站名称"> </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button size="mini" type="primary" @click="real(scope.$index, scope.row)">选择
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>

                    <div class="page" style="position: relative;">
                        <div class="grid-content bg-purple-light" style="position: absolute; right: 0;">
                            <el-pagination background @size-change="realSizeChange" @current-change="realCurrentChange"
                            :current-page="realForm.pageNum"
                            :page-size="realForm.pageSize" layout="total, sizes, prev, pager, next, jumper"
                            :total="realForm.pagetotal">
                            </el-pagination>
                        </div>
                    </div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
<script src="https://cdn.bootcss.com/js-sha1/0.6.0/sha1.min.js"></script>
<script>
    const axios = require("axios");
    export default {
        data() {
            return {
                outVisible: false,
                activeIndex2: "1",
                pageNum: 1,
                pagetotal: 0,
                pageSize: 10,
                token: localStorage.getItem('token'),
                // 搜索
                formInline: {
                    no: '',
                    name: '',
                    state: ''
                },

                tableData: [],

                // 添加
                addVisible: false,
                ruleForm: {
                    plantId: '',//实际电站id
                    realStationName: '',//实际电站名称
                    no: '',
                    name: '',
                    longitude: '',
                    latitude: '',
                    profit: '',
                    total: '',//总瓦数
                    price: '',
                    term: '',
                    ruleDesc: '',
                    stationDesc: '',
                    img: '',
                    address: ''
                },
                html: '',
                html2: '',

                // 详情
                detailsVisible: false,
                sdetails: {},
                stationAdvList: [],

                // 编辑
                editVisible: false,
                editForm: {
                    plantId: '',//实际电站id
                    realStationName: '',//实际电站名称
                    no: '',
                    name: '',
                    longitude: '',
                    latitude: '',
                    profit: '',
                    total: '',//总瓦数
                    price: '',
                    term: '',
                    ruleDesc: '',
                    stationDesc: '',
                    stationId: '',
                    img: '',
                    imgurl: [],//上传图片
                    fileLists: [],
                    address: ''
                },



                // 交易情况
                businessVisible: false,
                businessform: {
                    phone: '',
                    time: '',
                    orderno: '',
                    stationId: '',
                    pageNum: 1,
                    pagetotal: 0,
                    pageSize: 10,
                },
                businessData: [],

                // 电站设置
                setVisible: false,
                setInline: {
                    rebate: '',
                    rebateId: '',
                    reward: '',
                    rewardId: ''
                },
                setrules: {
                    rebate: [
                        { required: true, message: '请选择返利瓦数计入电站', trigger: 'change' }
                    ],
                    reward: [
                        { required: true, message: '请选择j奖励瓦数计入电站', trigger: 'change' }
                    ],
                },

                // 选择电站
                selectcable: false,
                setType: '',
                setData: [],

                imgurl: [],//上传图片
                fileLists: [],

                

                stationId: '',
                html: '',
                html2: '',


                // 实际电站列表
                realV: false,
                realType: '',
                realData: [],
                realForm: {
                    pageNum: 1,
                    pageSize: 10,
                    pagetotal: 0,
                    token: '',
                    secret: ''
                },
                stations:[]
            }
        },
        methods: {
            handleSelect(key, keyPath) {
                console.log(key, keyPath);
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            current_change: function (currentPage) {
                this.currentPage = currentPage;
            },
            getRowClass({ rowIndex }) {
                if (rowIndex == 0) {
                    return 'background:RGB(242,242,242)'
                } else {
                    return ''
                }
            },
            handleRemove(file) {
                console.log(file);
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },
            backGoodss() {
                this.ruleForm.no = ''
                this.ruleForm.name = ''
                this.ruleForm.adderess = ''
                this.ruleForm.longitude = ''
                this.ruleForm.latitude = ''
                this.ruleForm.profit = ''
                this.ruleForm.total = ''
                this.ruleForm.price = ''
                this.ruleForm.term = ''
                this.ruleForm.term = ''
                this.imgurl = []
                this.ruleForm.ruleDesc = ''
                this.ruleForm.stationDesc = ''
                this.fileLists = ''
                this.ruleForm.address = ''
            },
            //光伏电站列表
            // photovoltaicStation() {
            //     this.$api.post({
            //         path: '/manage/photovoltaicStation',
            //         params: {
            //             token: this.token,
            //             status: '',
            //             stationNo: '',
            //             stationName: '',
            //             pageNum: this.pageNum,
            //             pageSize: this.pageSize
            //         }, success: (data) => {
            //             console.log(data)
            //             this.tableData = data.data.list
            //             this.pagetotal = data.data.total
            //         }
            //     })
            // },
            //光伏电站列表 分页
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
                this.pageSize = val
                this.getfind()
            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
                this.pageNum = val
                this.getfind()
            },

            // 搜索
            getchange(val) {
                if (val == 1) {
                    this.formInline.state = '筹集中'
                } else if (val == 2) {
                    this.formInline.state = '已售罄'
                }
            },
            getfind() {
                this.$api.post({
                    path: '/manage/photovoltaicStation',
                    params: {
                        token: this.token,
                        status: this.formInline.state,
                        stationNo: this.formInline.no,
                        stationName: this.formInline.name
                    }, success: (data) => {
                        console.log(data)
                        this.tableData = data.data.list
                        this.pagetotal = data.data.total
                    }
                })
            },

            realList(type) {
                this.realV = true
                this.realType = type
                this.getreal()

            },

            // 认证电站
            getRenzhen() {
                let sha1 = require('js-sha1')
                let str = '湖北至真新能源有限公司'
                let usr = encodeURI(str)
                let pwd = 'admin123'
                let companyKey = 'xCyghHEa3E2iOhmx'
                let sign = ''
                let time = new Date().getTime()
                // sign = SHA-1(salt + SHA-1(pwd) + "&action=auth&usr=" + usr + "&company-key=" + company-key);
                sign = sha1(time + sha1(pwd) + "&action=auth&usr=" + usr + "&company-key=" + companyKey);

                console.log(usr, 'usr');
                console.log(sign);

                axios({
                    url: `http://api.shinemonitor.com/public/?sign=${sign}&salt=${time}&action=auth&usr=${usr}&company-key=${companyKey}`,

                    method: 'get',
                    data: '',
                    headers: { 'Content-Type': 'multipart/form-data;charset=utf-8' },
                }).then((res) => {
                    console.log(res)
                    this.realForm.token = res.data.dat.token
                    this.realForm.secret = res.data.dat.secret
                })
            },

            // 选择实际电站

            getreal() {
                let sha1 = require('js-sha1')
                let time = new Date().getTime()
                let data = Object.assign({}, this.realForm, {
                    pageNum: this.realForm.pageNum - 1
                })
                let action = `queryPlants&page=${data.pageNum}&pagesize=${this.realForm.pageSize}`
                // sign = SHA-1(salt + secret + token + "&action=...");
                let sign = sha1(time + this.realForm.secret + this.realForm.token + '&action=' + action)
                console.log(sign, 'sss');

                axios({
                    url: `http://api.shinemonitor.com/public/?sign=${sign}&salt=${time}&token=${this.realForm.token}&action=queryPlants&page=${data.pageNum}&pagesize=${this.realForm.pageSize}`,

                    method: 'get',
                    data: '',
                    headers: { 'Content-Type': 'multipart/form-data;charset=utf-8' },
                }).then((res) => {
                    console.log(res, 111)

                    this.realData = res.data.dat.plant
                    this.realForm.pagetotal = res.data.dat.total
                })
            },
            realSizeChange(val) {
                console.log(`每页 ${val} 条`);
                this.realForm.pageSize = val
                this.getreal()
            },
            realCurrentChange(val) {
                console.log(`当前页: ${val}`);
                this.realForm.pageNum = val
                this.getreal()
            },

            real(index, row) {
                if (this.realType == 1) {
                    this.ruleForm.plantId = row.pid
                    this.ruleForm.realStationName = row.name

                } else {
                    this.editForm.plantId = row.pid
                    this.editForm.realStationName = row.name
                }
                console.log(index, row);

                this.realV = false

            },




            // 删除图片
            fileDel(index) {
                this.imgurl.splice(index, 1)
                this.fileLists.splice(index, 1)
            },
            // 上传展示图
            uploadImgs(file) {
                console.log(file)
                if (this.imgurl.length < 5) {
                    // console.log(file.file, 'file')
                    this.$uploadFiles('http://manager.zhizhennengyuan.com:8000/mfxapi/multifileupload', file.file).then(res => {
                        console.log(res)
                        res.result.forEach((e) => {
                            this.imgurl.push({
                                src: e.url
                            })

                            this.fileLists.push({
                                stationAdvImg: e.relative_url,
                            })
                        })
                        console.log(this.imgurl)
                        // console.log(res.data, 'res2')
                        console.log(this.fileLists)
                    })
                } else {
                    this.$message.error("不能超过五张哦！")
                }

            },



            efileDel(index) {
                this.editForm.imgurl.splice(index, 1)
                this.editForm.fileLists.splice(index, 1)
            },
            //添加
            addStation() {
                if (this.ruleForm.no == '' || this.ruleForm.name == '' || this.ruleForm.longitude == '' || this.ruleForm.latitude == '' || this.ruleForm.profit == '' || this.ruleForm.total == '' || this.ruleForm.term == '' || this.ruleForm.address == '' || this.fileLists.length == 0) {
                    this.$message({
                        message: '请将信息填写完整',
                        type: 'warning'
                    });
                } else {
                    this.$api.post({
                        path: '/manage/addStation',
                        params: {
                            token: this.token,
                            stationType: 1,
                            plantId: this.ruleForm.plantId,
                            realStationName: this.ruleForm.realStationName,
                            stationNo: this.ruleForm.no,
                            stationName: this.ruleForm.name,
                            lng: this.ruleForm.longitude,
                            lat: this.ruleForm.latitude,
                            syYearRate: this.ruleForm.profit,
                            totalWatt: this.ruleForm.total,
                            syPeriod: this.ruleForm.term,
                            price: this.ruleForm.price,
                            stationAdvList: this.fileLists,
                            address: this.ruleForm.address,
                            ruleDesc: this.ruleForm.ruleDesc,
                            stationDesc: this.ruleForm.stationDesc,
                            ruleDescMd: this.ruleForm.ruleDesc,
                            stationDescMd: this.ruleForm.stationDesc,
                        }, success: (data) => {
                            console.log(data)
                            console.log(this.sdetails.ruleDesc);
                            console.log(this.html)
                            if (data.code == 1) {
                                this.$message({
                                    message: data.msg,
                                    type: "success",
                                });
                                this.getfind()
                                this.ruleForm.no = ''
                                this.ruleForm.name = ''
                                this.ruleForm.longitude = ''
                                this.ruleForm.latitude = ''
                                this.ruleForm.profit = ''
                                this.ruleForm.total = ''
                                this.ruleForm.term = ''
                                this.ruleForm.price = ''
                                this.ruleForm.ruleDesc = ''
                                this.ruleForm.stationDesc = ''
                                this.ruleForm.address = ''
                                this.fileLists = [],
                                    this.imgurl = []
                                this.addVisible = false
                            }
                        }
                    })
                }

            },

            // 详情
            details(index, row) {
                console.log(index, row);
                this.detailsVisible = true;

                this.$api.post({
                    path: '/manage/getStationDetail',
                    params: {
                        token: this.token,
                        stationId: row.stationId
                    }, success: (data) => {
                        console.log(data)
                        this.sdetails = data.data
                        this.stationAdvList = data.data.stationAdvList
                    }
                })
            },

            // 编辑
            edit(index, row) {
                console.log(index, row);
                this.editVisible = true
                this.editForm.stationId = row.stationId
                this.$api.post({
                    path: '/manage/getStationDetail',
                    params: {
                        token: this.token,
                        stationId: row.stationId
                    }, success: (data) => {
                        console.log(data)
                        // this.sdetails = data.data
                        this.editForm.no = data.data.stationNo
                        this.editForm.name = data.data.stationName
                        this.editForm.longitude = data.data.lng
                        this.editForm.latitude = data.data.lat
                        this.editForm.profit = data.data.syYearRate
                        this.editForm.total = data.data.totalWatt
                        this.editForm.term = data.data.syPeriod
                        this.editForm.price = data.data.price
                        this.editForm.ruleDesc = data.data.ruleDescMd
                        this.editForm.stationDesc = data.data.stationDescMd
                        this.editForm.address = data.data.address
                        this.editForm.imgurl = data.data.stationAdvList
                        this.editForm.plantId = data.data.plantId
                        this.editForm.realStationName = data.data.realStationName
                    }
                })
            },

            // 编辑上传
            // 上传展示图
            euploadImgs(file) {
                console.log(file)
                if (this.editForm.imgurl.length < 5) {
                    // console.log(file.file, 'file')
                    this.$uploadFiles('http://manager.zhizhennengyuan.com:8000/mfxapi/multifileupload', file.file).then(res => {
                        console.log(res)
                        res.result.forEach((e) => {
                            this.editForm.imgurl.push({
                                stationAdvImg: e.url
                            })

                            this.editForm.fileLists.push({
                                stationAdvImg: e.relative_url,
                            })
                        })
                        console.log(this.editForm.imgurl)
                        // console.log(res.data, 'res2')
                        console.log(this.editForm.fileLists)
                    })
                } else {
                    this.$message.error("不能超过五张哦！")
                }

            },

            updateStation() {
                // var htmlContent = this.converter.makeHtml(mdContent)
                this.$api.post({
                    path: '/manage/updateStation',
                    params: {
                        token: this.token,
                        stationType: 1,
                        plantId: this.editForm.plantId,
                        realStationName: this.editForm.realStationName,
                        stationId: this.editForm.stationId,
                        stationNo: this.editForm.no,
                        stationName: this.editForm.name,
                        lng: this.editForm.longitude,
                        lat: this.editForm.latitude,
                        syYearRate: this.editForm.profit,
                        totalWatt: this.editForm.total,
                        syPeriod: this.editForm.term,
                        price: this.editForm.price,
                        ruleDesc: this.editForm.ruleDesc,
                        stationDesc: this.editForm.stationDesc,
                        address: this.editForm.address,
                        stationAdvList: this.editForm.fileLists,
                        ruleDescMd: this.editForm.ruleDesc,
                        stationDescMd: this.editForm.stationDesc,
                    }, success: (data) => {
                        console.log(data)
                        // console.log();
                        if (data.code == 1) {
                            this.$message({
                                message: data.msg,
                                type: "success",
                            });
                            this.getfind()
                            this.fileLists = []
                            this.editVisible = false
                        } else {
                            this.$message.error(data.msg);
                        }

                    }
                })
            },

            // 交易情况
            business(index, row) {
                console.log(index, row);
                this.businessVisible = true
                this.businessform.stationId = row.stationId
                this.getbusinessFind()
            },

            getbusinessFind() {
                this.$api.post({
                    path: '/manage/transactionStatus',
                    params: {
                        token: this.token,
                        stationId: this.businessform.stationId,
                        phone: this.businessform.phone,
                        startTime: this.businessform.time[0],
                        endTime: this.businessform.time[1],
                        orderNo: this.businessform.orderno,
                        refType: this.businessform.refType,
                        pageNum: this.businessform.pageNum,
                        pageSize: this.businessform.pageSize
                    }, success: (data) => {
                        console.log(data)
                        this.businessData = data.data.list
                        this.businessform.pagetotal = data.data.total
                    }
                })
            },

            businessSizeChange(val) {
                console.log(`每页 ${val} 条`);
                this.businessform.pageSize = val
                this.getbusinessFind()
            },
            businessCurrentChange(val) {
                console.log(`当前页: ${val}`);
                this.businessform.pageNum = val
                this.getbusinessFind()
            },

            getChangebusines(val) {
                this.businessform.refType = val
            },



            // 删除
            deletes(index, row) {
                console.log(index, row);
                this.outVisible = true
                this.stationId = row.stationId

            },
            getdeletes() {
                this.$api.post({
                    path: '/manage/delStation',
                    params: {
                        token: this.token,
                        stationId: this.stationId
                    }, success: (data) => {
                        console.log(data)
                        if (data.code == 1) {
                            this.$message({
                                message: data.msg,
                                type: 'success'
                            });
                            this.getfind()
                            this.outVisible = false
                        }

                    }
                })
            },

            // 选择电站列表
            getAllStation() {
                this.$api.post({
                    path: '/manage/getAllStation',
                    params: {
                        token: this.token,
                        stationType: 1//1光伏电站、2项目电站
                    }, success: (data) => {
                        console.log(data)
                        this.setData = data.data
                    }
                })
            },

            getselecetType(type) {
                this.setType = type
                console.log(type)
            },

            // 选择电站
            setselect(index, row) {
                console.log(index, row);
                this.selectcable = false
                if (this.setType == '1') { //返利
                    this.setInline.rebate = row.stationName
                    this.setInline.rebateId = row.stationId
                } else if (this.setType == '2') {//奖励
                    this.setInline.reward = row.stationName
                    this.setInline.rewardId = row.stationId
                }

                this.$message({
                    message: '选择成功',
                    type: 'success'
                });
            },

            //电站设置保存
            saveStationSetting() {
                this.$api.post({
                    path: '/manage/saveStationSetting',
                    params: {
                        token: this.token,
                        buy_goods_station_lower: this.setInline.rebateId,//返利
                        buy_goods_station_self: this.setInline.rewardId//奖励
                    }, success: (data) => {
                        console.log(data)
                        this.getfind()
                    }
                })
            },

            ordidSelectionChange(val) {
                this.multipleSelection = val;
                let stations = []
                val.forEach(e => {
                    stations.push({
                        "stationId": e.stationId,
                        "ordid": e.ordid
                    })
                })

                let newobj = {};
                stations = stations.reduce((preVal, curVal) => {
                    newobj[curVal.stationId] ? '' : newobj[curVal.stationId] = preVal.push(curVal);
                    return preVal
                }, [])

                this.stations = stations
            },

            // 提交排序
            getsubmitSort() {
                if (this.stations.length == 0) {
                    this.$message({
                        message: "请选择要修改的信息",
                        type: "warning",
                    });
                } else {
                    this.$api.post({
                        path: "/manage/submitSortStation",
                        params: {
                            token: this.token,
                            stations: this.stations,
                        },
                        success: (data) => {
                            console.log(data);
                            if (data.code == 1) {
                                this.$message({
                                    message: data.msg,
                                    type: "success",
                                });
                                this.getfind();
                            }
                        },
                    });
                }
            },
        },
        mounted() {
            this.getfind()
            this.getAllStation()
            this.getRenzhen()
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
    }
</script>

<style>
    .tox-tinymce-aux {
        z-index: 9999 !important;
    }
    * {
        padding: 0;
        margin: 0;
        cursor: default;
    }

    .pvbox {
        width: 100%;
        height: 100%;
    }

    

    .pvmain {
        /* width: 98%;
        height: 80%; */
        padding: 10px 10px 0px 10px;

    }

    .pvfind {
        width: 100%;

        padding-top: 10px;
        background-color: white;
        margin-bottom: 10px;
    }

    .pvfind .el-form-item__content {
        width: 160px;
    }

    .pvdata {
       
        padding: 10px 20px;
        background-color: white;
    }

    .pvdata .iconfont {
        font-size: 12px;
    }

    .pvdata .recovery {
        background-color: rgb(48, 216, 192);
        color: white;
        border: 0px;
    }

    .pvdata .disable {
        background-color: rgb(255, 102, 0);
        color: white;
        border: 0px;
    }

    .pvdata .delete {
        background-color: rgb(234, 74, 92);
        color: white;
        border: 0px;
    }

    .pvdata .commonbtn {
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

    /* 添加 */
    .pvbox .el-dialog__header {
        padding: 12px 20px 10px
    }

    .pvbox .el-dialog__title {
        color: #606266;
        font-size: 14px;
    }

    .pvbox .el-dialog__body {

        padding-top: 20px;
        padding-bottom: 100px;
        border-top: 1px solid #ccc;
    }

    .salemessage {
        width: 100%;
        margin-bottom: 10px;
    }

    .salemessage>p {
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

    .salemessage>div {
        width: 99%;
        padding-left: 10px;
    }

    .lunboimgs {
        width: 100%;
        display: flex;
    }

    .lunboimgs img {
        width: 110px;
        height: 65px;
        margin-right: 10px;
    }

    .longinput .el-input {
        width: 290px;
        position: relative;
    }

    .longinput span {
        display: inline-block;
        position: absolute;
        width: 55px;
        height: 42px;
        border-left: 1px solid #DCDFE6;
        border-radius: 4px 0px 0px 4px;
        right: 0px;
        text-align: center;
    }

    .longinput p {
        color: #999;
        font-size: 12px;
        height: 20px;
        line-height: 20px;
        font-weight: inherit;
    }

    .addimput .el-form-item__label {
        width: 110px;
        text-align: left;
    }

    .addimput .el-upload--picture-card {
        width: 65px;
        height: 65px;
        line-height: 65px;
    }

    .addimput .el-upload--picture-card i {
        font-size: 20px;
    }

    .smallinput .el-form-item__label {
        width: 70px;
        text-align: right;
    }

    /* 日期 */
    .business .el-date-editor--daterange.el-input__inner {
        width: 200px;
        height: 32px;
        margin-right: 10px;
    }

    .business .el-date-editor .el-range-input {
        font-size: 12px;
    }

    .business .el-date-editor .el-range__icon {
        line-height: 25px;

    }

    .business .el-date-editor .el-range-separator {
        color: #C0C4CC;
        line-height: 21px;
    }

    .businessb .el-input {
        width: 160px;
    }

    .businessb .el-input__inner {
        padding-left: 5px;
    }

    .businessadd .el-input {
        width: 250px;
    }

    .realV .el-input {
        width: 50px;
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
</style>