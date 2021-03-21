<template>
  <div class="mainStyle">
    <div class="title">
      <div id="title">{{tableData.title}}</div>
      <div>
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
          <div v-if="tableData.picUrl!=null&&tableData.picUrl!=''" class="imgs">
            <img style=" width: 625rpx;height:250rpx ;" :src="tableData.picUrl">
          </div>
          <div id="content">
            <text style="overflow-wrap: break-word;" decord="true">{{tableData.content}}</text>
          </div>
        </div>
        <div class="footInfo">
          <div class="moreInfo">
            <div>
              <p>来源：{{tableData.organizationName}}</p>
              <p>编辑：{{tableData.contributorName}}</p>
              <p>审核：{{tableData.reviewerName}}</p>
            </div>
          </div>
          <div style="width: 95%;display: flex;justify-content: space-between;margin-top: 60rpx;">
            <div>
              <div v-show="!isPraise" @click="doGiveUp(id)" >
                <span  class="span_style" v-if="tableData.praiseAmount!=null">赞:  {{tableData.praiseAmount}}</span>
                <span  class="span_style" v-else>赞: 0</span>
              </div>
              <div v-show="isPraise" @click="doNotGiveUp(id)" >
                <span class="span_style"><img src="/static/images/giveUp(s).png"  class="giveup"></span>
              </div>
            </div>
            <div class="nextWord">
              <text >下一章：</text>
              <div v-if="nextId"  style="border-bottom: cornflowerblue solid 2rpx;"  @click="goNext(nextId,index)">{{nextTitle}}...</div>
              <div v-else style="color:RGB(22,155,213);" >最后一章啦</div>
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
        index:0,
        list:[],
        length:0,
        nextId:0,
        nextTitle:'',
      }
    },
    methods: {
      async getText(id) {
        let url = '/dynamicArticleManagement/selectArticleByPrimaryKey';
        let data = { id: id };
        let result = await request.demand(url, data, 'GET');
        this.tableData = result.data;
        this.goTop();
      },


      goTop: function () {
        wx.pageScrollTo({
          scrollTop: 0,
          duration: 300
        })
      },
        goNext:function(id,index) {
          this.getText(id);
          this.aboutPraiseRecord(id);
          this.aboutCollectRecord(id)
        this.index++;
        if(this.index==this.list.length){
          this.nextId=false;
        }else{
          this.nextId = this.list[this.index].id;
          this.nextTitle=this.list[this.index].title.substr(0,9);
        }

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
          let data = { articleId: articleId, userId: this.$store.state.wxUserInfo.partyId,praiseType:1 };
          let result = await request.demand(url, data, 'GET');
          this.isPraise = result.data;
        }
      },
      async doNotGiveUp(articleId) {
        let url = '/dynamicPraiseRecord/deletePraiseRecord';
        let data = { articleId: articleId, userId: this.$store.state.wxUserInfo.partyId,praiseType:1 };
        let result = await request.demand(url, data, 'POST');
        this.isPraise = result.data;

      },
      //附件下载
      getEnclosure(url) {
        console.log(url);
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
      this.list=JSON.parse(this.$mp.query.list);
      this.index=this.$mp.query.index;
      this.index++;
      if(this.index==this.list.length){
        this.nextId=false;
      }else{
        this.nextId = this.list[this.index].id;
        this.nextTitle=this.list[this.index].title.substr(0,9);
      }
      this.getText(this.$mp.query.id);
      this.aboutPraiseRecord(this.$mp.query.id);
      this.aboutCollectRecord(this.$mp.query.id)
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
    height: 100%;
  }
  .title{
    display: flex;
    height: 100rpx;
    align-items: center;
    justify-content: space-between;
    margin-top: 20rpx;
  }
  #title{
    /*width:560rpx;*/
    font-size: 35rpx;
    font-family: 黑体;

  }
  .collection{
    /*width: 130rpx;*/
    font-size: 27rpx;
    font-family: 黑体;
    color:RGB(219,15,40) ;
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
    /*width: 750rpx;*/
    height:260rpx ;
  }
  #content{
    margin-left: 10rpx;
    color:  RGB(135,135,138);
    font-size: 28rpx;
    /*width: 650rpx;*/
    line-height: 50rpx;
    /*height: 100%;*/

  }
  .footInfo{
    display: flex;
    margin-bottom: 50rpx;
    flex-direction:column;
  }
  .giveup{
    width: 40rpx;
    height: 40rpx;
  }
  .nextWord{
    display: flex;
    font-size: 28rpx;
    color:RGB(22,155,213);
  }
  .moreInfo{
    margin-top: 20rpx;
    font-size: 26rpx;
    color: #666666;
    display:flex;
    justify-content:flex-end;
  }
</style>
