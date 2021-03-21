<template>
  <div class="mainStyle">
    <div class="title">
      <div id="title">{{tableData.title}}</div>
      <div v-show="Authentication&&CanCollection">
        <div v-show="!isCollection" class="collection" @click="getCollection(id)">收藏</div>
        <div v-show="isCollection" class="collection"  @click="getNotCollection(id)">取消收藏</div>
      </div>
    </div>
    <div class="content2">
      <div class="mainStyle2">
        <div class="topInfo">
          <div style="font-size: 28rpx;color: RGB(135,135,138);">{{tableData.contributorName}}</div>
          <div class="span_style">重庆理工党建</div>
          <div style="font-size: 28rpx;color: RGB(135,135,138);">{{tableData.checkTime}}</div>
          <div style="font-size: 28rpx;color: RGB(135,135,138);">阅读：<span  class="span_style">{{tableData.browsingAmount}}</span></div>
        </div>
        <div style="display: flex;flex-direction: column;margin-top: 30rpx;margin-bottom: 50rpx;">
          <div class="imgs">
            <img style=" width: 625rpx;height:250rpx ; " :src="tableData.picUrl">
          </div>
          <div id="content">{{tableData.content}}</div>
        </div>
        <div class="footInfo">
          <div style="width: 450rpx;">
            <div style="display: flex;font-size: 28rpx;color: RGB(135,135,138);" v-if="tableData.pluginUrl" >
              附件&nbsp;&nbsp;&nbsp;&nbsp;
              <div class="span_style" style="border-bottom: cornflowerblue solid 2rpx" @click="getEnclosure(tableData.pluginUrl)" >更多图片.word</div>
            </div>
            <div v-else ></div>
            <div style="margin-left: 30rpx;margin-top: 120rpx">
              <div v-show="!isPraise" @click="doGiveUp(id)" >
                <span  class="span_style">赞:  {{tableData.praiseAmount}}</span>
              </div>
              <div v-show="isPraise" @click="doNotGiveUp(id)" >
                <span  class="span_style"><img src="/static/images/giveUp(s).png"  class="giveup"></span>
              </div>
            </div>
          </div>
          <div style="margin-top: 85rpx;width: 264rpx">
            <div>来源：{{tableData.collegeName}}</div>
            <div>编辑：{{tableData.contributorName}}</div>
            <div v-if="tableData.reviewerName">审核：{{tableData.reviewerName}}</div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
  import request from '../../tools/service'
  export default {
    name: "index",
    data() {
      return {
        tableData: {},
        id: "",
        //是否认证
        Authentication: true,
        CanCollection: false,
        isTrain: false,
        isPraise: false,
        isCollection: false,
      }
    },
    methods: {
      async getText(id) {
        console.log('查看文章')
        let url = '/dynamicArticleManagement/selectArticleByPrimaryKey';
        let data = { id: id };
        let result = await request.demand(url, data, 'GET');
        console.log(result)
        this.tableData = result.data;
        this.tableData.checkTime = this.tableData.checkTime.substring(0, 10)
      },

      async getCollection(articleId) {

        if (this.$store.state.wxUserInfo.partyId == '' || this.$store.state.wxUserInfo.partyId == null) {
          wx.showToast({
            title: "请先认证",
            icon: "none"
          })
        }else {
          let url = '/WxUserCollect/insert';
          let data = { userId: this.$store.state.wxUserInfo.partyId, messageId: articleId  };
          let result = await request.demand(url, data, 'POST');
          this.isCollection = result.data;
          if (this.isCollection) {
            wx.showToast({
              title: "收藏成功",
              icon: "success"
            })
          }else{
            wx.showToast({
              title:"收藏失败",
              icon:"none"
            })
          }
        }
    },
    async getNotCollection(articleId) {
      let url = '/WxUserCollect/deleteByUserIdAndArticleId';
      let data = { userId: this.$store.state.wxUserInfo.partyId, messageId: articleId };
      let result = await request.demand(url, data, 'POST');
      this.isCollection = !result.data;
      if (!this.isCollection) {
        wx.showToast({
          title: "取消收藏",
          icon: "success"
        })
      }
    },
    async doGiveUp(articleId) {
      let url = '/dynamicPraiseRecord/insertByArticleTrainId';
      if (this.$store.state.wxUserInfo.partyId == '' || this.$store.state.wxUserInfo.partyId == null) {
        wx.showToast({
          title: "请先认证",
          icon: "none"
        })
      } else {
        let data = { articleId: articleId, userId: this.$store.state.wxUserInfo.partyId };
        let result = await request.demand(url, data, 'GET');
        this.isPraise = result.data;
      }
    },
    async doNotGiveUp(articleId) {
      let url = '/dynamicPraiseRecord/deletePraiseRecord';
      let data = { articleId: articleId, userId: this.$store.state.wxUserInfo.partyId };
      let result = await request.demand(url, data, 'POST');
      this.isPraise = result.data;

    },
    //附件下载
    getEnclosure(url) {
      wx.downloadFile(url)
    },
    async aboutPraiseRecord(articleId) {
      let url = '/dynamicPraiseRecord/selectPraiseRecordNumById';
      let data = { articleId: articleId, userId: this.$store.state.wxUserInfo.partyId };
      let result = await request.demand(url, data, 'POST');
      this.isPraise = result.data;
    },
    async aboutCollectRecord(articleId) {
      let url = '/WxUserCollect/isCollected';
      let data = { userId: this.$store.state.wxUserInfo.partyId, messageId: articleId };
      let result = await request.demand(url, data, 'POST');
      this.isCollection = result.data;

    },
  },
    mounted(){
      this.id=this.$mp.query.id;
      this.CanCollection=this.$mp.query.CanCollection;
      this.getText(this.$mp.query.id);
      this.aboutPraiseRecord(this.$mp.query.id);
      this.aboutCollectRecord(this.$mp.query.id)
    }
  };
</script>

<style scoped>
  .mainStyle{
    display: flex;
    flex-direction:column;
    padding-left: 30rpx;
    padding-right: 30rpx;
    width: 750rpx;
    height: 100%;
    background-color:#F5F5FA
  }
  .title{
    display: flex;
    height: 100rpx;
    align-items: center;
  }
  #title{
    width:500rpx;
    font-size: 35rpx;
    font-family: 黑体;

  }
  .collection{
    width: 190rpx;
    text-align: right;
    padding-right: 100rpx;
    font-size: 30rpx;
    font-family: 黑体;
    color:RGB(22,155,213) ;
  }
  .content2{
    height: 1107rpx;
  }
  .mainStyle2{
    display: flex;
    flex-direction: column;
  }
  .topInfo{
    display: flex;
    align-items: center;
    justify-content: space-around;
    width: 90%;
  }
  .span_style{
    color: RGB(24,144,255);
    font-size: 28rpx;
    font-family: 'Microsoft Tai Le Bold'
  }
  .imgs{
    display: flex;
    justify-content: center;
    margin-bottom: 20rpx;
    width: 750rpx;
    height:260rpx ;
  }
  #content{
    margin-left: 20rpx;
    color:  RGB(135,135,138);
    font-size: 28rpx;
    width: 650rpx;
    line-height: 50rpx;

  }
  .footInfo{
    display: flex;

  }
  .giveup{
    width: 40rpx;
    height: 40rpx;
  }

</style>
