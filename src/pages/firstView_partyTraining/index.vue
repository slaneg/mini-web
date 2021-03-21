<template>
  <div class="mainStyle">
    <div class="title">
      <div id="title">{{tableData.title}}</div>
    </div>
    <div class="content2">
      <div class="mainStyle2">
        <div class="topInfo">
          <div style="font-size: 28rpx;color: RGB(135,135,138);">{{tableData.editorName}}</div>
          <div class="span_style">重庆理工党建</div>
          <div style="font-size: 28rpx;color: RGB(135,135,138);">{{tableData.publishTime}}</div>
          <div style="font-size: 28rpx;color: RGB(135,135,138);">阅读：<span  class="span_style">{{tableData.browsingAmount}}</span></div>
        </div>
        <div style="display: flex;flex-direction: column;margin-top: 30rpx;margin-bottom: 50rpx;">
          <div v-if="tableData.picUrl!=null&&tableData.picUrl!=''" class="imgs">
            <img style=" width: 625rpx;height:250rpx ; margin-left: -35px;" :src="tableData.picUrl">
          </div>
          <div id="content" ><text decord="true">{{tableData.content}}</text></div>
        </div>
        <div class="footInfo">
          <div style="width: 450rpx;">
            <div style="display: flex;font-size: 28rpx;color: RGB(135,135,138);" v-if="tableData.pluginUrl" >
              附件&nbsp;&nbsp;&nbsp;&nbsp;
              <div class="span_style" style="border-bottom: cornflowerblue solid 2rpx" @click="getEnclosure(tableData.pluginUrl)" >更多图片.word</div>
            </div>
            <div v-else ></div>
          </div>
          <div style="display: flex;justify-content: space-between;width: 95%;">
            <div style="margin-left: 30rpx;">
              <div v-show="!isPraise" @click="doGiveUp(id)" >
                <span  class="span_style" v-if="tableData.praiseAmount!=null">赞:  {{tableData.praiseAmount}}</span>
                <span  class="span_style" v-else>赞: 0</span>
              </div>
              <div v-show="isPraise" @click="doNotGiveUp(id)" >
                <span  class="span_style"><img src="/static/images/giveUp(s).png"  class="giveup"></span>
              </div>
            </div>
            <div style="margin-top: 85rpx;color: #666666;font-size: 26rpx;">
              <div> 来源：{{tableData.organizationName}}</div>
              <div>编辑：{{tableData.editorName}}</div>
            </div>
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
        isPraise: false,
        isCollection: false,
      }
    },
    methods: {
      async getText(id) {
        let url = '/dynamicTrainManagement/selectTrainByPrimaryKey';
        let data = { id: id };
        let result = await request.demand(url, data, 'GET');
        this.tableData = result.data;



      },


      async doGiveUp(articleId) {
        let url = '/dynamicPraiseRecord/insertByArticleTrainId';
        if (this.$store.state.wxUserInfo.partyId == '' || this.$store.state.wxUserInfo.partyId == null) {
          wx.showToast({
            title: "请先认证",
            icon: "none"
          })
        } else {
          let data = { articleId: articleId, userId: this.$store.state.wxUserInfo.partyId,praiseType:2 };
          let result = await request.demand(url, data, 'GET');
          this.isPraise = result.data;
        }
      },
      async doNotGiveUp(articleId) {
        let url = '/dynamicPraiseRecord/deletePraiseRecord';
        let data = { articleId: articleId, userId: this.$store.state.wxUserInfo.partyId ,praiseType:2};
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
    },
    mounted(){
      this.id=this.$mp.query.id;
      this.CanCollection=this.$mp.query.CanCollection;
      this.getText(this.$mp.query.id);
      this.aboutPraiseRecord(this.$mp.query.id);
    }
  };
</script>
<style>
  page{
    background: #f2f1ed;
  }
</style>
<style scoped>
  .mainStyle{
    display: flex;
    flex-direction:column;
    padding-left: 30rpx;
    padding-right: 30rpx;
    /*width: 750rpx;*/
    height: 100%;
  }
  .title{
    display: flex;
    height: 100rpx;
    align-items: center;
  }
  #title{
    width:560rpx;
    font-size: 35rpx;
    font-family: 黑体;

  }
  .collection{
    width: 105rpx;
    text-align: right;
    font-size: 27rpx;
    font-family: 黑体;
    color:RGB(22,155,213) ;
  }
  .content2{
    height: 100%;
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
    color: RGB(217,0,27);
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
    height: 100%;

  }
  .footInfo{
    display: flex;
    margin-bottom: 50rpx;
    flex-direction: column;
  }
  .giveup{
    width: 40rpx;
    height: 40rpx;
  }

</style>
