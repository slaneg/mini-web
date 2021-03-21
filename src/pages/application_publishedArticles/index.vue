<template>
  <div class="activityFrom">
    <input class="inputTitle" placeholder-style="color:#BCBCBC" v-model="article.title" type="text" placeholder="    请输入文章标题"></input>
    <div class="radioBox">
      <radio-group class="radio-group" @change="radioChange">
        <radio class="radio"
               v-for="item in items" :key="item.name"
               :value=item.name
               :checked=item.checked>
          <p style="font-weight: 500;font-size: 30rpx">{{item.value}}</p>
        </radio>
      </radio-group>
    </div>
    <textarea @input='input' maxlength="2000" v-model="article.content" confirm-type="完成" placeholder="请输入不少于200字的文章内容(必填)" class="inputArea"></textarea>
    <text decode="true" class="currentWordNumber">{{currentNoteLen|0}}/2000个字</text>
    <div class="uploadImg">
      <p style="align-self: center;">上传图片：</p>
      <div v-if="imgPath" class="imgUpDiv">
        <image  :src="imgPath" class="image"></image>
      </div>
      <div v-if="!imgPath" class="imgUpDiv" id="deleteImg" @click="uploadImage">
        <image  src="/static/images/index.png" style="width: 180rpx;height: 180rpx;margin-left: 20rpx"></image>
        <p style="text-align:center;color: #A9A9A9A9">上传</p>
      </div>
      <span v-if="imgPath" @click="deleteImg" class='reddotX'>x</span>
      <p style="text-align:center;color: #A9A9A9A9;width:46%;">支持扩展名:.jpg...</p>
    </div>
    <div class="uploadFile">
      <p style="align-self: center;">上传附件：</p>
      <div v-if="!upfilePath" class="uploadButton">
        <img class="upFile" src="/static/upFile.png"/>
        <p @click="uploadFile">上传文件</p>
      </div>
      <div v-if="upfilePath" class="uploadButton">
        <p class="uploadButton">已上传</p>
      </div>
      <p v-if="upfilePath" @click="deleteFile" class='reddotX'>x</p>
      <p style="text-align:center;color: #A9A9A9A9">支持扩展名：.doc .docx .pdf .xlsx...</p>
    </div>
    <div class="bottomBox">
      <div class="buttonBox">
        <button class="buttonDetail" @click="previewArticle">预览</button>
        <button @click="submitWord" class="buttonDetail">提交</button>
      </div>
      <!--<button @click="returnPage" style="width: 90%">返回/取消</button>-->
    </div>
  </div>
</template>

<script>
  export default {
    name: "index",
    data(){
      return{
        file:{},
        imgPath:'',
        upfilePath:'',
        article:{
          title:"",
          organizationId:"",
          source:1,
          contributorId:"",
          picUrl:"",
          pluginUrl:"",
          content:"",
        },
        items: [
          { name: '1', value: '党员先锋', checked:'true'},
          { name: '2', value: '基层风采'},
        ],
        imgStyle:{
          left:"",
          top:"",
          position:"absolute",
        },
        noteMinLen: 200,  //字数限制
        currentNoteLen: 0, //输入的字数
      }
    },
    methods:{
      returnPage(){
        if (this.article.picUrl!==""){
          this.deleteImg();
        };
        if (this.article.pluginUrl!==""){
          this.deleteFile();
        };
        wx.switchTab({
          url:"../application/main"
        })
      },
      input(event) {
        var value = event.mp.detail.value;
        var len = parseInt(value.length);
        let that = this;
        that.currentNoteLen=len;
      },
      submitWord(){
        let that = this;
        if (that.article.title!=''&&that.article.content!=''){
          if (that.currentNoteLen>200&&that.currentNoteLen<2000){
            this.article.content=this.article.content.split(" ").join("&nbsp;&nbsp;");
            wx.request({
              url:'http://localhost:8090/dynamicArticleManagement/insertArticle',
              data:that.article,
              method: "Post",
              header: {
                'content-type': 'application/json',
              },
              success:function(res) {
                wx.showModal({
                  title: '提示',
                  content: '文章审核中，请耐心等待',
                  showCancel:false,
                  confirmText:'确定',
                  success: function (res) {
                    if (res.confirm) {
                      that.article.title="";
                      that.article.content="";
                      that.article.picUrl="";
                      that.article.pluginUrl="";
                      that.upfilePath="";
                      that.imgPath="";
                      that.article.contributorId=that.$store.state.wxUserInfo.partyId;
                      that.article.organizationId=that.$store.state.globalOrganizationPosition.organizationId;
                    };
                  }
                })
              }
            })
          }else{
            wx.showModal({
              title: '提示',
              content: '文章字数不得小于200字大于2000字',
              showCancel:false,
            })
          } ;

        }else {
          wx.showModal({
            title: '提示',
            content: '文章没有填完哦，请先填完',
            showCancel:false,
          })
        };
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
                  self.article.picUrl= res.data;
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
          type:'file',
          success(res){
            let filename=res.tempFiles[0].path;
            if(!filename){
              return false
            };
            let a = filename.split('').reverse().join('');
            let b = a.substring(0,a.search(/\./)).split('').reverse().join('');
            if (b==='doc'||b==='docx'||b==='pdf'||b==='xlsx'){
              console.log(res.tempFiles[0].size);//1048576
              if (res.tempFiles[0].size<1048576){
                self.upfilePath = res.tempFiles[0].path;
                self.file = res.tempFiles[0];
                wx.uploadFile({
                  url: 'http://localhost:8090/dynamicArticleManagement/upload',
                  filePath: self.file.path,
                  name: "file",
                  success (res){
                    self.article.pluginUrl = res.data;
                  }
                })
              }else {
                wx.showModal({
                  title: '提示',
                  content: '附件大小不能超过1MB',
                  showCancel:false,
                })
              };
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
      previewArticle(){
        let that = this;
        if (that.article.title!=''&&that.article.content!=''){
          this.article.content=this.article.content.split(" ").join("&nbsp;&nbsp;");
          wx.navigateTo({
            url: '../application_previewArticle/main?articleData='+ encodeURIComponent(JSON.stringify(this.article))
          })
          this.article.content=this.article.content.split("&nbsp;&nbsp;").join(" ");
        }else {
          wx.showModal({
            title: '提示',
            content: '文章没有填完哦，请先填完',
            showCancel:false,
          })
        };
      },
      deleteImg(){
        let that = this;
        wx.request({
          url:'http://localhost:8090/dynamicArticleManagement/deleteFile',
          data:that.article.picUrl,
          method: "Post",
          header: {
            'content-type': 'application/json',
          },
          success:function(res) {
            if (res.data===1){
              that.imgPath='';
              that.article.picUrl='';
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
          data:that.article.pluginUrl,
          method: "Post",
          header: {
            'content-type': 'application/json',
          },
          success:function(res) {
            if (res.data===1){
              that.upfilePath='';
              that.article.pluginUrl='';
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
      radioChange(e){
        // this.article.source = e.mp.detail.value;
        console.log('radio发生change事件，携带value值为：',e.mp.detail.value);
        for (var i = 0; i < this.items.length;i++){
          if (this.items[i].name==e.target.value){
            this.items[i].checked = true;
            this.article.source= this.items[i].name;
          } else{
            this.items[i].checked =false
          }
        }
      }
    },
    onLoad:function() {
      this.article.title="";
      this.article.content="";
      this.upfilePath="";
      this.imgPath="";
      this.article.contributorId=this.$store.state.wxUserInfo.partyId;
      this.article.organizationId=this.$store.state.globalOrganizationPosition.organizationId;
    },
    onUnload:function(){
      this.returnPage();
    }
  };
</script>

<style>
  page{
    background: #f2f1ed;
  }
</style>
<style scoped>
  .inputTitle{
    margin-top: 16rpx;
    border-top: 4rpx solid #E4E4E4;
    border-bottom: 4rpx solid #E4E4E4;
    height: 90rpx;
    width: 88%;
    padding-left:15rpx;
    background-color: #FFFFFF;
  }
  .inputArea{
    border-top: 4rpx solid #E4E4E4;
    border-bottom: 4rpx solid #E4E4E4;
    background-color: #FFFFFF;
    padding:15rpx;
    width: 88%;
    height:165px;
  }
  .radioBox{
    margin: 20rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 88%;
  }
  .activityFrom{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .radio{
    width: 35%;
  }
  .radio-group{
    display: flex;
    align-items: center;
    justify-content:space-between;
    width:80%;
  }
  .uploadImg{
    margin-top: 30rpx;
    display: flex;
    justify-items: center;
    width: 88%;
    flex-wrap:wrap;
  }
  .uploadFile{
    margin-top: 30rpx;
    display: flex;
    justify-items: center;
    width: 88%;
    flex-wrap:wrap;
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
    display: flex;
    justify-content:space-around;
    margin-bottom: 10rpx;
  }
  .buttonDetail{
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #118EE9;
    color: #FFFFFF;
    font-size: 46rpx;
    width: 40%;
    height: 95rpx;
    border-radius: 10rpx;
    margin:0;
  }
  .buttonDetail::after{
    border: none;
  }
  .imgUpDiv{
    width: 35%;
    height:230rpx;
    border:1px dashed #B9B9B9;
    border-radius:10rpx;
    padding:5rpx;
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
  .image{
    position: relative;
    width: 100%;
    height: 100%;
  }
  .upFile{
    width:30rpx;
    height:30rpx;
  }
  .currentWordNumber{
    color: #999999;
    font-size: 24rpx;
    position: absolute;
    right: 40rpx;
    top: 525rpx;
  }
  .bottomBox{
    margin-top: 30rpx;
    display: flex;
    flex-direction:column;
    width: 90%;
  }
</style>
