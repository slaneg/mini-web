<template>
  <div style="background-color: #f9f6ff;position: absolute;z-index: -3;width: 100%;height: 100%">
    <img src="/static/images/person-bac.jpg" id="personImg">


    <div class="person-information" v-if="isChecked">
      <div @click="check1">
        <span>个人信息</span>
      </div>

        <div @click="moreChecks" class="more-position">
          <span>多职务认证</span>
        </div>
    </div>

    <div class="person-information" v-else>
      <div @click="check">
        <span style="line-height: 30px;">身份认证</span>
      </div>
    </div>

    <div class="person">
      <div class="portrait">
        <img :src="avatarUrl">
      </div>
      <div class="user-name">
        <span style="font-weight: bolder;margin-bottom: 5px;">{{nickname}}</span>
        <span style="color: red;font-weight: bolder">我的组织生活</span>
      </div>
    </div>

    <div class="menu">
      <div @click="toMyBranch">
        <img src="/static/images/person.png">
        <span>我的支部</span>
      </div>
      <div>
        <div></div>
      </div>
      <div @click="myCollection">
        <img src="/static/images/collection.png">
        <span>我的收藏</span>
      </div>
    </div>

    <div class="nothing" v-if="partyId==0">
      <p>
        您未参加活动
      </p>
    </div>

    <div v-else>
      <scroll-view scroll-y="true" style="height:300px;">
        <div class="content" v-for="activity in activities">
          <div class="content-detail" @click="jumpTo(activity)">
            <div class="title">
              <div style="margin-bottom: 20px;">
                <div>
                  <span style="font-weight: bolder">{{activity.activityTitle}}</span>
                </div>
                <div class="state" v-if="activity.activityState==1">
                  <span style="font-size: 14px;color: blue;">未发布</span>
                </div>
                <div class="state" v-else-if="activity.activityState==2">
                  <span style="font-size: 14px;color: blue;">报名中</span>
                </div>
                <div class="state" v-else-if="activity.activityState==3">
                  <span style="font-size: 14px;color: blue;">报名截止</span>
                </div>
                <div class="state" v-else>
                  <span style="font-size: 14px;color: blue;">活动结束</span>
                </div>
              </div>
              <div>
                <span style="font-size: 14px;color: gray">发布时间:{{activity.releaseTime}}</span>
              </div>
            </div>
            <!--<div class="title-pic"></div>-->
            <img :src="activity.picture" class="title-pic">
          </div>
        </div>
      </scroll-view>
    </div>


  </div>
</template>

<script>
  export default {
    name: "index",
    data(){
      return{
        isChecked:false,
        nickname:'',
        avatarUrl:'',
        activityTitle:'',
        releaseTime:'',
        activityState:'',
        pictureUrl:'',
        activities:'',
        partyId:1
      }
    },
    methods:{
      //跳转详情页面
      jumpTo(activity){
        //将对象转换为json字符串
        var str = JSON.stringify(activity);
        wx.navigateTo({
          url:"../application_activityDetails/main?activity="+str
        })

      },
      moreChecks(){
        wx.navigateTo({
          url:'../mine_morePositionCertification/main'
        })
      },
      check(){
        wx.navigateTo({
          url:"../mine_certification/main?isFirst=0"
        })
      },
      check1(){
        wx.navigateTo({
          url:"../mine_personalInformation/main?isFirst=0"
        })
      },
      myCollection(){
        if (this.$store.state.wxUserInfo.partyId == null){
          wx.showModal({
            title: '提示',
            content: '请先注册',
            success: function (res) {
              if (res.confirm) {
                wx.navigateTo({
                  url:'../mine_certification/main'
                })
              } else {
                wx.switchTab({
                  url:'../mine/main'
                })
              }
            }
          })
        }else {
          wx.navigateTo({
            url:"../mine_collection/main"
          })
        }
      },
      toMyBranch(){
        if (this.$store.state.wxUserInfo.partyId == null){
          wx.showModal({
            title: '提示',
            content: '请先注册',
            success: function (res) {
              if (res.confirm) {
                wx.navigateTo({
                  url:'../mine_certification/main'
                })
              } else {
                wx.switchTab({
                  url:'../mine/main'
                })
              }
            }
          })
        }else {
          wx.navigateTo({
            url:'../mine_branch/main'
          })
        }
      }
    },
    onLoad:function() {
      let that = this;
      //查看是否认证,判断partyId是否为空
      wx.request({
        url:'http://localhost:8090/sysWxUser/selectById?id='+this.$store.state.userInfo.openId,
        method: "Get",
        success:function(res) {
          // console.log(res.data.data)
          if (res.data.data.partyId!=null){
            that.isChecked = true
          }else{
            that.isChecked = false
          }
        }
      });

      this.nickname = this.$store.state.userInfo.nickName;
      this.avatarUrl=this.$store.state.userInfo.avatarUrl;

      // console.log(this.$store.state.wxUserInfo.partyId)
      //通过自己的党员id显示自己参加的活动
      if (this.$store.state.wxUserInfo.partyId==null){
        this.partyId = 0;
      }else {
        wx.request({
          url:'http://localhost:8090/ServiceActivityRegistration/selectActivityIdByPartyId?partyId='+this.$store.state.wxUserInfo.partyId,
          method:"Get",
          success:function(res) {
            if (res.data.data == ''){
              that.partyId=0;
            }
            else {
              that.activities = res.data.data;
            }
            console.log(res.data.data);
            console.log('ddd')
          }
        })
      }

    }
  };
</script>

<style scoped>
  #personImg{
    height: 100px;
    width: 100%;
    position: absolute;
    z-index: -2;
  }
  .title-pic{
    width: 87px;
    height: 87px;
  }
  .person-information{
    float: right;
    margin-right: 15rpx;
    font-size: 25rpx;
    margin-top: 15rpx;
  }
  .person-information div{
    /*float: right;*/
    height: 50rpx;
    width: 160rpx;
    background-color: #ffd68f;
    border-radius: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .person-information div:nth-child(2){
    height: 50rpx;
    width: 160rpx;
    background-color: #ffd68f;
    border-radius: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 15rpx;
  }
  .person{
    margin-left: 10px;
    height: 70px;
    display: flex;
    margin-top: 25px;
  }
  .portrait{
    height: 100px;
    width: 60px;
  }
  .portrait img{
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background-color: red;
  }
  .user-name{
    text-align: right;
    display: flex;
    flex-direction: column;
    width: 150px;
    height: 70px;
  }
  .menu{
    background-color: red;
    height: 80px;
    display: flex;
    text-align: center;
  }
  .menu div{
    width: 200px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .menu div:nth-child(2){
    width: 1px;
  }
  .menu div:nth-child(2) div{
    width: 1px;
    height: 50px;
    border: 1px solid white;
    justify-content: center;
  }
  .menu img{
    width: 30px;
    height: 30px;
  }
  .menu span{
    font-size: 14px;
    color: white;
  }
  .nothing{
    height: 30px;
    width: 88%;
    margin: 10px 0 0 20px;
    background-color: white;
    border-radius: 5px;
    box-shadow: 2px 2px 2px gray;
    text-align: center;
    padding-top: 10px;
  }
  .content{
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .content-detail{
    justify-content: space-between;
    padding: 5px 0px 0px 5px;
    display: flex;
    margin-top: 20px;
    width: 88%;
    height: 88px;
    background-color: #ebf2ff;
  }
  .title{
    display: flex;
    flex-direction: column;
  }
  .title div:nth-child(1){
    display: flex;
  }
  .state{
    height: 30px;
    width: 70px;
    background-color: #c4f7ff;
    margin-left: 15px;
    border-radius: 20px;
    border: 1px solid blue;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
