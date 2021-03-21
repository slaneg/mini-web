<template>
  <div>
    <div class="previewDiv">
      <h3>{{article.title}}</h3>
      <div class="articleInfo">
        <span>{{name}}</span>
        <span>重庆理工党建</span>
        <span>{{time}}</span>
      </div>
      <image v-if="article.picUrl" class="image" :src="article.picUrl"></image>
      <text decode="true" class="articleContent">{{article.content}}</text>
    </div>
    <div v-if="article.pluginUrl" style="margin: 20rpx;color: blue">
      <p @click="seePluginUrl">点击查看附件</p>
    </div>
    <button @click="submitWord" style="width: 95%" type="primary">提交</button>
  </div>
</template>

<script>
  export default {
    data(){
      return{
        article:{},
        time:"",
        name:""
      }
    },
    methods:{
      getTime(){
        var taht=this;
        var timestamp = Date.parse(new Date());
        var date = new Date(timestamp);
        var Y =date.getFullYear();
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
        var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
        taht.time=Y + '年'  + M+ '月' + D+ '日'
      },
      submitWord(){
        let that = this;
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
                wx.switchTab({
                  url: '../application/main'
                })
              }
            })
          }
        })
      },
      seePluginUrl(){
        var taht=this;
        let filename=taht.article.pluginUrl;
        if(!filename){
          return false
        };
        let a = filename.split('').reverse().join('');
        let b = a.substring(0,a.search(/\./)).split('').reverse().join('');
        wx.downloadFile({
          url: taht.article.pluginUrl, // 后台返回的地址。
          success: function (res) {
            var filePath = res.tempFilePath; // 小程序中文件的临时文件
            console.log(filePath);
            wx.openDocument({
              filePath: filePath,
              // 文档打开格式记得写上，否则可能不能打开文档。 文档类型只能是一个
              // 若是想打开多种类型的文档，可以解析文档地址中的文档格式，动态复制到fileTpye参数
              fileType: b,
              success: function (res) {
                console.log('打开文档成功')
              },
              fail: (e) => {
                console.log(e);
              }
            })
          }
        })
      }
    },
    onLoad:function(options) {
      this.name=this.$store.state.wxUserInfo.name;
      this.getTime();
      this.article=JSON.parse(decodeURIComponent(options.articleData));
      this.article.contributorId=this.$store.state.wxUserInfo.partyId;
      this.article.organizationId=this.$store.state.globalOrganizationPosition.organizationId;
    }
  };
</script>
<style>
  page{
    background: #f2f1ed;
  }
</style>
<style scoped>
  .image{
    width: 90%;
    margin-top:20rpx;
  }
  .previewDiv{
    width:100%;
    margin-top: 35rpx;
    display:flex;
    flex-direction:column;
    align-items:center;
  }
  .articleContent{
    margin-top: 20rpx;
    margin-bottom: 20rpx;
    width: 90%;
    min-height: 200px;
  }
  .articleInfo{
    display: flex;
    justify-content: space-around;
    width: 90%;
    font-size: 24rpx;
    margin-top: 20rpx;
  }
</style>
