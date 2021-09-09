<!-- 出入帐统计 -->
<template>
    <div class="billbox">
        <el-menu :default-active="activeIndex2" class="el-menu-demo" mode="horizontal" @select="handleSelect"
            background-color="white" text-color="#f999" active-text-color="rgb(18,42,136)">
            <el-menu-item index="1">出入帐统计</el-menu-item>
        </el-menu>

        <div class="billmain">
            <div class="entrybox">
                <el-form :inline="true" :model="formInline" class="demo-form-inline" size="small"
                    style="margin-left: 20px" label-width="120px" label-position="left">
                    <el-form-item label="入账统计" class="entry">
                        <el-date-picker v-model="formInline.time" type="daterange" range-separator="-"
                            start-placeholder="日期" end-placeholder="日期" value-format="yyyy-MM-dd">
                        </el-date-picker>
                        <i class="el-icon-search search" @click='getEntryfind'></i>
                    </el-form-item>
                </el-form>

                <div class="entrymain">
                    <div class="enbox">
                        <img src="../../assets/images/1.png" alt="">
                        <div class="enboxL">
                            <p>{{entry.order_amount}} <span>元</span></p>
                            <p>非电站产品销售额</p>
                        </div>
                    </div>
                    <div class="enbox">
                        <img src="../../assets/images/1.png" alt="">
                        <div class="enboxL">
                            <p>{{entry.sumAmount}} <span>元</span></p>
                            <p>电站产品销售额</p>
                        </div>
                    </div>
                    <div class="enbox">
                        <img src="../../assets/images/1.png" alt="">
                        <div class="enboxL">
                            <p>{{entry.lr_amount}} <span>元</span></p>
                            <p>团队收益(返利剩余金额)</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="entrybox">
                <el-form :inline="true" :model="outInline" class="demo-form-inline" size="small"
                    style="margin-left: 20px" label-width="120px" label-position="left">
                    <el-form-item label="出账统计" class="entry">
                        <el-date-picker v-model="outInline.time" type="daterange" range-separator="-"
                            start-placeholder="日期" end-placeholder="日期" value-format="yyyy-MM-dd">
                        </el-date-picker>
                        <i class="el-icon-search search" @click='getOutfind'></i>
                    </el-form-item>
                </el-form>

                <div class="entrymain">
                    <div class="enbox">
                        <img src="../../assets/images/1.png" alt="">
                        <div class="enboxL">
                            <p>{{out.own}} <span>元</span></p>
                            <p>非电站产品返利<br>(自己购买返利)</p>
                        </div>
                    </div>
                    <div class="enbox">
                        <img src="../../assets/images/1.png" alt="">
                        <div class="enboxL">
                            <p>{{out.subordinate}} <span>元</span></p>
                            <p>非电站产品销售额<br>(下级购买返利)</p>
                        </div>
                    </div>
                    <div class="enbox">
                        <img src="../../assets/images/1.png" alt="">
                        <div class="enboxL">
                            <p>{{out.stationExpenditure}} <span>元</span></p>
                            <p>电站支出</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                activeIndex2: "1",

               

                formInline:{
                    time:''
                },

                outInline:{
                    time:''
                },
                token:localStorage.getItem('token'),
                entry:{},
                out:{}
            }
        },
        methods: {
            handleSelect(key, keyPath) {
                console.log(key, keyPath);
            },

            // 入账统计
            getEntryStatistics(){
                this.$api.post({
                    path:'/manage/getEntryStatistics',
                    params:{
                        token:this.token,
                        startTime:'',
                        endTime:''
                    },success:(data)=>{
                        console.log(data)
                        this.entry = data.data
                    }
                })
            },
            getEntryfind(){
                this.$api.post({
                    path:'/manage/getEntryStatistics',
                    params:{
                        token:this.token,
                        startTime:this.formInline.time[0],
                        endTime:this.formInline.time[1]
                    },success:(data)=>{
                        console.log(data)
                        this.entry = data.data
                    }
                })
            },

            // 出账统计
            getOutStatistics(){
                this.$api.post({
                    path:'/manage/getOutStatistics',
                    params:{
                        token:this.token,
                        startTime:'',
                        endTime:''
                    },success:(data)=>{
                        console.log(data)
                        this.out = data.data
                    }
                })
            },
            getOutfind(){
                this.$api.post({
                    path:'/manage/getOutStatistics',
                    params:{
                        token:this.token,
                        startTime:this.outInline.time[0],
                        endTime:this.outInline.time[1]
                    },success:(data)=>{
                        console.log(data)
                        this.out = data.data
                    }
                })
            }
        },
        mounted() {
            this.getEntryStatistics()
            this.getOutStatistics()
        },watch: {
            "formInline.time"(newVal) {
                if (newVal == null) {
                    this.formInline.time = [];
                }
            },
            "outInline.time"(newVal) {
                if (newVal == null) {
                    this.outInline.time = [];
                }
            }
        }
    }
</script>

<style>
    * {
        padding: 0;
        margin: 0;
        cursor: default;
    }

    .billbox {
        width: 100%;
        height: 100%;
    }

    .billmain {
        /* width: 98%;
        height: 80%; */
        padding: 10px 10px 0px 10px;
        
    }

    .entrybox {
        /* width: 98%; */
        /* height: 100%; */
        padding: 10px 20px;
        background-color: white;
        margin-bottom: 15px;
    }

    /* 日期 */
    .entrybox .el-date-editor--daterange.el-input__inner {
        width: 250px;
        height: 32px;
        margin-right: 10px;
    }

    .entrybox .el-date-editor .el-range-input {
        width: 30%;
        font-size: 12px;
    }

    .entrybox .el-date-editor .el-range__icon {
        line-height: 25px;

    }

    .entrybox .el-date-editor .el-range-separator {
        color: #C0C4CC;
        line-height: 21px;
    }

    .entrybox .el-form-item__label{
        font-size: 18px;
        color:  rgb(54, 116, 255);
        font-weight: bold;
    }

    .entry{
        position: relative;
    }

    .entry .search{
        display: inline-block;
        width: 40px;
        height: 32px;
        position: absolute;
        /* margin-left: -5; */
        padding-left: 10px;
        /* text-align: center; */
        line-height: 32px;
        color: #C0C4CC ;
        right: 0px;
        border-left:1px solid #DCDFE6;
    }
    .entrymain{
        display: flex;
        width: 100%;

    }
    .enbox{
        height: 54px;
        padding: 37px 20px 37px 30px;
        border: 1px solid rgb(215,215,215);
        border-radius: 5px;
        display: flex;
        margin-right: 10px;
    }
    .enbox img{
        width: 60px;
        height: 100%;
        margin-right: 40px;
    }
    .enboxL{
        height: 100%;


    }

    .enboxL p:first-child{
        font-size: 32px;
        font-weight: bold;
    }

    .enboxL p:first-child span{
        font-size: 14px;
        font-weight: 700;
    }

    .enboxL p:last-child{
        font-size: 14px;
        font-weight: bold;
        color: #999;
    }
</style>