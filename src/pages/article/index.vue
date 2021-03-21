<template>
  <div class="mainStyle">
    <div class="title">
      <div id="title">{{atricleData.month}}月|{{atricleData.title}}</div>
    </div>
    <div class="topInfo">
      <div style="font-size: 28rpx;color: RGB(135,135,138);margin-right: 4rpx;" >{{atricleData.editorName}}</div>
      <div class="span_style">重庆理工党建</div>
      <div style="font-size: 28rpx;color: RGB(135,135,138);">{{atricleData.releaseTime}}</div>
      <div style="font-size: 28rpx;color: RGB(135,135,138);">阅读：<span  class="span_style">{{atricleData.viewsNumber}}</span></div>
    </div>
    <p class="littleTittle">内容：</p>
    <div style="display: flex;flex-direction: column;margin-top: 30rpx;margin-bottom: 50rpx;">
      <div id="content"><text decord="true">{{atricleData.learningContent}}</text></div>
    </div>
    <p class="littleTittle">党课学习时间：</p>
    <p class="content">{{atricleData.learningTime}}</p>
    <p class="littleTittle">学习方式：</p>
    <p class="content">{{atricleData.learningWay}}</p>
    <p class="littleTittle">参会人：</p>
    <p class="content" v-if="atricleData.participantsName!=null">{{atricleData.participantsName}}</p>
    <p class="content" v-else>无</p>
    <div class="footInfo">
      <div style="width: 400rpx;">
        <div style="margin-left: 30rpx;margin-top: 120rpx">
          <div v-show="!isPraise" @click="doGiveUp(id)" >

            <span  class="span_style" v-if="atricleData.likesNumber!=null">赞:  {{atricleData.likesNumber}}</span>
            <span  class="span_style" v-else>赞: 0</span>
          </div>
          <div v-show="isPraise" @click="doNotGiveUp(id)" >
            <span  class="span_style"><img src="/static/images/giveUp(s).png"  class="giveup"></span>
          </div>
        </div>
      </div>
      <div style="margin-top: 85rpx">
        <div style="font-size: 28rpx;"> 支部书记：{{atricleData.branchSecretaryName}}</div>
        <div style="font-size: 28rpx;">联系方式：{{atricleData.phone}}</div>
      </div>
    </div>
  </div>

</template>

<script>
  import request from '../../tools/service'
  export default {
    name: "index",
    data(){
      return{
        atricleData:{},
        isPraise:false
      }
    },
    methods:{
      async doGiveUp(articleId){
        let url='/dynamicPraiseRecord/insertByArticleTrainId';
          let data={articleId:articleId,userId:this.$store.state.wxUserInfo.partyId,praiseType:3};
          let result = await request.demand(url, data,'GET');
          this.isPraise = result.data;
      },
      async doNotGiveUp(articleId){
        let url='/dynamicPraiseRecord/deletePraiseRecord';
        let data={articleId:articleId,userId:this.$store.state.wxUserInfo.partyId,praiseType:3};
        let result = await request.demand(url, data,'POST');
        this.isPraise = result.data;

      },
      async selectByThemeDayId(id){
        let url='/serviceThemeDay/selectByThemeDayId';
        let data={id:id};
        let result = await request.demand(url, data);
        this.atricleData = result.data;
        this.atricleData.title=this.atricleData.title.substr(0,12)+"..."
      },
      //附件下载
      getEnclosure(url){
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
      this.selectByThemeDayId(this.$mp.query.id);
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
  width: 100%;
  height: 100%;

}
.title{
  display: flex;
  align-items: center;
}
#title{
  width:80%;
  height: 100rpx;
  font-size: 35rpx;
  font-family: 黑体;

}
.littleTittle{
  margin-bottom: 15rpx;
  font-weight: 600;
  font-size: 30rpx;
}
.content{
  margin-bottom: 15rpx;
  font-size: 28rpx;
  color: #87878A;
  margin-left: 6%;
  width: 93%;
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
    height: 100%;

  }
  .footInfo{
    display: flex;

  }
  .giveup{
    width: 40rpx;
    height: 40rpx;
  }


</style>
