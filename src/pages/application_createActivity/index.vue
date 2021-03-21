<template>
  <div class="all">
    <div class="activityFrom">
      <input class="input" v-model="activity.activityTitle" placeholder="活动标题">
      <textarea class="inputArea" v-model="activity.activityContent" placeholder="活动内容"></textarea>
      <input class="input" v-model="activity.activityLocation" placeholder="活动地址">
      <input class="input" v-model="activity.meetingPlace" placeholder="集合地址">
      <input class="input" v-model="activity.activityContact" placeholder="组织者姓名">
      <input class="input" v-model="activity.contactNumber" placeholder="联系方式">
      <picker
        mode="date"
        :value="gatherDate"
        :start="nowDate"
        @change="gatherDateChange">
        <p class="selectBox">
          集合时间: {{gatherDate}}
        </p>
      </picker>
      <picker
        mode="date"
        :value="lastDate"
        :start="nowDate"
        @change="lastDateChange">
        <p class="selectBox">
          报名截止日期: {{lastDate}}
        </p>
      </picker>
      <div class="uploadImg">
        <div style="display: flex;flex-direction: column">
          <div>
            <p style="align-self: center;">上传图片：</p>
            <image v-if="!imgPath" src="/static/images/index.png" @click="uploadImage" style="width: 180rpx;height: 180rpx;"></image>
            <div style="display: flex">
              <image v-if="imgPath" :src="imgPath" style="width: 180rpx;height: 180rpx;"></image>
              <p v-if="imgPath" @click="deleteImg" class='reddotX'>x</p>
            </div>
          </div>
        </div>
      </div>
      <div class="uploadFile">
        <p style="align-self: center;">上传附件：</p>
        <div v-if="!upfilePath" class="uploadButton"><p @click="uploadFile">点击上传</p></div>
        <div style="display: flex">
          <p v-if="upfilePath" class="uploadButton">已上传</p>
          <p v-if="upfilePath" @click="deleteFile" class='reddotX'>x</p>
        </div>
      </div>
      <div class="buttonBox">
        <button class="buttonDetail" style="margin-right: 4%;" @click="previewActivity">预览</button>
        <button class="buttonDetail" style="margin-left: 4%;" @click="submit(activity)">提交</button>
      </div>
      <!--<button @click="returnPage" style="width: 90%">返回/取消</button>-->
    </div>
  </div>

</template>

<script>
import WxValidate from'../../tools/WxValidate.js'
  export default {
    name: "index",
    data(){
      return{
        lastDate:'',
        gatherDate:'',
        imgPath:'',
        upfilePath:'',
        activity:{
          activityTitle: '',
          activityContent: '',
          activityLocation: '',
          meetingPlace: '',
          activityContact: '',
          contactNumber: ''
        },
        file:{},
        picUrl:"",
        pluginUrl:"",
      }
    },
    created(){

    },
    computed:{
      nowDate(){
        let date = new Date();
        let str = date.getMonth()+1;
        return date.getFullYear()+"-"+str+"-"+date.getDate();
      }
    },
    methods:{
      //
      // returnPage(){
      //   if (this.activity.picUrl!=null){
      //     this.deleteImg();
      //   };
      //   if (this.activity.pluginUrl!=null){
      //     this.deleteFile();
      //   };
      //   wx.navigateTo({
      //     url:"../application_volunteering/main"
      //   })
      // },
// 报错
showModal(error) {
    wx.showModal({
      content: error.msg,
      showCancel: false,
    })
  },
    //验证函数
      initValidate(){
        var that = this;
        const rules =  {
          activityTitle: {
            required: true,
          },
          activityContent: {
            required: true
          },
          activityLocation: {
            required: true
          },
          meetingPlace:{
            required: true
          },
          activityContact:{
            required: true,
          },
          contactNumber: {
            required: true,
            tel: true 
          }
        };
        const message = {
          activityTitle: {
            required: '请填写活动标题'
          },
          activityContent: {
            required: '请填写活动内容'
          },
          activityLocation: {
            required: '请填写活动地址'
          },
          meetingPlace: {
            required: '请填写集合地址'
          },
          activityContact: {
            required: '请填写组织者姓名'
          },
          contactNumber: {
            required: '请填写联系电话',
            tel: '请填写正确的手机号'
          },

        };
        console.log(WxValidate)
        that.wv = new WxValidate(rules, message);
      },
      submit(e){
        var that = this;
        that.activity.activitySponsorId = that.$store.state.wxUserInfo.partyId;
        console.log(that.wv,e)
        // const params = e.detail.value
        if(!this.wv.checkForm(that.activity)){
            const error = this.wv.errorList[0];
            this.showModal(error);
        } else {
          wx.request({
          url:'http://localhost:8090/ServiceVolunteerActivity/insertActivity',
          data: that.activity,
          method:'POST',
          header:{
            'content-type': 'application/json'
          },
          success:function (res) {
            wx.showModal({
              title: '提示',
              content: '活动审核中，请耐心等待',
              showCancel:false,
              confirmText:'确定',
              success: function (res) {
                if (res.confirm) {
                  that.activity={}
                };
              }
            })
          }
        });
        }
        

        // console.log(this.activity)
      },


      lastDateChange(e) {
        this.lastDate = e.mp.detail.value
        this.activity.lastDate = this.lastDate;
      },
      gatherDateChange(e){
        this.gatherDate = e.mp.detail.value
        this.activity.gatherDate = this.gatherDate;
      },
      uploadImage(){
        let self = this;
        wx.chooseImage({
          count: 1,
          sizeType: ['original', 'compressed'],
          sourceType: ['album', 'camera'],
          success (res) {
            const tempFilePaths = res.tempFilePaths;
            let filename=tempFilePaths[0];
            if(!filename){
              return false
            };
            let a = filename.split('').reverse().join('');
            let b = a.substring(0,a.search(/\./)).split('').reverse().join('');
            if (b==='jpg'){
              self.imgPath = tempFilePaths[0];
              wx.uploadFile({
                url: 'http://localhost:8090/dynamicArticleManagement/upload',
                filePath: tempFilePaths[0],
                name: "file",
                formData: {
                  'user': 'test'
                },
                success (res){
                  self.activity.picUrl= res.data;
                }
              })
            }else {
              wx.showModal({
                title: '提示',
                content: '图片格式错误，请上传正确格式',
                showCancel:false,
              })
            };
          }
        })
      },
      uploadFile(){
        let self = this;
        wx.chooseMessageFile({
          count:1,
          type:'all',
          success(res){
            let filename=res.tempFiles[0].path;
            if(!filename){
              return false
            };
            let a = filename.split('').reverse().join('');
            let b = a.substring(0,a.search(/\./)).split('').reverse().join('');
            if (b==='doc'||b==='docx'||b==='pdf'||b==='xlsx'){
              self.upfilePath = res.tempFiles[0].path;
              self.file = res.tempFiles[0];
              wx.uploadFile({
                url: 'http://localhost:8090/dynamicArticleManagement/upload',
                filePath: self.file.path,
                name: "file",
                success (res){
                  self.activity.pluginUrl = res.data;
                }
              })
            }else {
              wx.showModal({
                title: '提示',
                content: '附件格式错误，请上传正确格式',
                showCancel:false,
              })
            };
          }
        })
      },
      deleteImg(){
        let that = this;
        wx.request({
          url:'http://localhost:8090/dynamicArticleManagement/deleteFile',
          data:that.activity.picUrl,
          method: "Post",
          header: {
            'content-type': 'application/json',
          },
          success:function(res) {
            if (res.data===1){
              that.imgPath='';
              that.activity.picUrl='';
            }else {
              wx.showModal({
                title: '提示',
                content: '删除失败',
                showCancel:false,
              })
            };
          }
        })
      },
      deleteFile(){
        let that = this;
        wx.request({
          url:'http://localhost:8090/dynamicArticleManagement/deleteFile',
          data:that.activity.pluginUrl,
          method: "Post",
          header: {
            'content-type': 'application/json',
          },
          success:function(res) {
            if (res.data===1){
              that.upfilePath='';
              that.activity.pluginUrl='';
            }else {
              wx.showModal({
                title: '提示',
                content: '删除失败',
                showCancel:false,
              })
            };
          }
        })
      },
      previewActivity(){
        let str = JSON.stringify(this.activity)
        wx.navigateTo({
          url: '../application_previewActivity/main?activity=' + str
        })
      },
    },
    onLoad:function (options) {
      if (options.flag=="0") {
        this.activity={}
      }
      this.initValidate();

    },
    onUnload: function () {
        if (this.activity.picUrl!=null){
          this.deleteImg();
        };
        if (this.activity.pluginUrl!=null){
          this.deleteFile();
        };
              
    },
    // onLoad:function (options) {
    //   if (options.activity!=null) {
    //     this.activity=JSON.parse(decodeURIComponent(options.activity));
    //   }else {
    //     this.activity = {};
    //   }
    // }
  };
</script>

<style>
  page{
    background: #f2f1ed;
  }
</style>
<style scoped>
  .all{
    padding-bottom: 30rpx;
    display: flex;
    justify-content: center;
    width: 100%;
  }
  .activityFrom{
    width: 90%;
  }
  .inputArea{
    margin-top: 16rpx;
    border-top: 4rpx solid #E4E4E4;
    border-bottom: 4rpx solid #E4E4E4;
    background-color: #FFFFFF;
    width: 100%;
  }
  .input{
    margin-top: 16rpx;
    border-top: 4rpx solid #E4E4E4;
    border-bottom: 4rpx solid #E4E4E4;
    height: 100rpx;
    background-color: #FFFFFF;
  }
  .selectBox{
    margin: 0rpx;
    margin-top: 16rpx;
    border-top: 4rpx solid #E4E4E4;
    border-bottom: 4rpx solid #E4E4E4;
    line-height: 100rpx;
    background-color: #FFFFFF;
    color: #808080;
  }
  .uploadImg{
    margin-top: 20rpx;
    display: flex;
    justify-items: center;
    width: 88%;
  }
  .uploadFile{
    margin-top: 20rpx;
    display: flex;
    justify-items: center;
    width: 88%;
  }
  .uploadButton{
    display: flex;
    width: 180rpx;
    height: 80rpx;
    background-color: #FFFFFF;
    border: 2rpx solid #E4E4E4;
    align-items: center;
    justify-content: center;
  }
  .buttonBox{
    width: 100%;
    display: flex;
    margin-top: 20rpx;
  }
  .buttonDetail{
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #118EE9;
    color: #FFFFFF;
    font-size: 46rpx;
    width: 45%;
    height: 90rpx;
    border-radius: 10rpx;
  }
  .buttonDetail::after{
    border: none;
  }
  .reddotX{
    width:40rpx;
    border-radius:50rpx;
    text-align:center;
    color:white;
    background-color:#A9A9A9;
    line-height:38rpx;
    height:40rpx;
  }
  input,textarea, .selectBox{
    padding-left: 15px;
  }
  textarea{
    padding-top: 10px;
  }
</style>
