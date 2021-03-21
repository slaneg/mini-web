<template>
    <div class="all">
      <div class="text">
        <p class="title">{{activity.activityTitle}}</p>
        <p class="contentDetail" space="nbsp">{{sponsor}}  <span style="color: blue;">重庆理工党建</span>{{activity.releaseTime}}   阅读：{{activity.readingVolume}}</p>
        <p class="contentDetail">活动内容:</p>
        <p class="contentDetail">&nbsp&nbsp&nbsp&nbsp{{activity.activityContent}}</p>
        <p class="contentDetail">活动地点：{{activity.activityLocation}}</p>
        <p class="contentDetail">集合地点：{{activity.meetingPlace}}</p>
        <div class="bottom">
          <div class="left">
            <p class="contentDetail">组织人：{{activity.activityContact}}</p>
            <p class="contentDetail">联系方式：{{activity.contactNumber}}</p>
            <p class="contentDetail">集合时间：{{activity.activityTime}}</p>
            <p class="contentDetail">报名截止时间：{{activity.registrationDeadline}}</p>
          </div>
          <div class="right" v-if="activity.activityState==1">
            <button class="applyButton">未开始</button>
          </div>
          <div class="right" v-else-if="isSignUp==0&&activity.activityState==2">
            <button class="applyButton" @click="signUp">报名</button>
          </div>
          <div class="right" v-else-if="isSignUp==1&&activity.activityState==2">
            <button class="applyButton" >已报名</button>
          </div>
          <div class="right" v-else-if="activity.activityState==3">
            <button class="applyButton">报名截止</button>
          </div>
          <div class="right" v-else>
            <button class="applyButton">活动结束</button>
          </div>
        </div>

        <div  class="img-container">
          <img :src="activity.picture">
        </div>
        <div style="display: flex">
          <span>附件&nbsp&nbsp&nbsp&nbsp</span>
          <span @click="downLoadPic" style="color: #2fb3ff;text-decoration: #2FB3FF">更多图片.wrod</span>
        </div>
        <div style="width: 100%;display: flex;justify-content: space-between;height: 50px;">
            <span style="color: #2fb3ff;line-height: 55px;">赞&nbsp&nbsp{{activity.likeNumber}}</span>
          <div>
            <p>编辑：{{sponsor}}</p>
            <span>审核：{{reviewer}}</span>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
  export default {
    name: "index",
    data(){
      return{
        activity:'',
        sponsor:'',//活动发起人
        reviewer:'',
        isSignUp:0//是否报名
      }
    },
    methods:{
      signUp(){
        var that = this;
        wx.showModal({
          content:'报名成功，请当日准备到达',
          showCancel:true,
          cancelText:'取消',
          confirmText:'确定',
          confirmColor:'#49A9F0',
          success:function(res) {
            if (res.cancel){

            }else {
              //报名成功
              wx.request({
                url:'http://localhost:8090/ServiceActivityRegistration/add',
                data:{
                  volunteerActivityId:that.activity.id,
                  applicantId:that.$store.state.wxUserInfo.partyId
                },
                method:'Post',
                header: {
                  'content-type': 'application/json',
                },
                success:function(res) {
                  //成功后跳转上一级页面
                  wx.navigateTo({
                    url:'../application_volunteering/main'
                  })
                }
              })
            }
          }
        });
      },
      downLoadPic(){
        window.location.href=this.activity.picture
      }
    },
    mounted:function() {
      // console.log(this.$root.$mp.page.options);
    },
    onLoad:function(options) {
      var that = this;
      // console.log(options.activity);
      this.activity =JSON.parse(options.activity);
      // console.log(this.activity);
      wx.request({
        url:'http://localhost:8090/SPMInformation/selectNameByPartyId?sponsorId='+this.activity.activitySponsorId+'&reviewerId='+this.activity.reviewerId,
        method:"Get",
        success:function(res) {
          console.log(res.data);
          that.sponsor = res.data.data.sponsor;
          that.reviewer = res.data.data.reviewer;
        }
      });
      //判断是否报名
      wx.request({
        url:'http://localhost:8090/ServiceActivityRegistration/isSignUp?activityId='+this.activity.id+'&partyId='+that.$store.state.wxUserInfo.partyId,
        method:'Get',
        success:function(res) {
          // console.log(res.data);
          if (res.data.data != null){
            that.isSignUp = 1
          }
        }
      })
    }
  };
</script>

<style>
  page{
    background: #F5F5F9;
  }
</style>
<style scoped>
  .img-container{
    height:150px;
    width:300px;
  }
  .img-container img{
    width: 100%;
    height: 100%;
  }
  .text p,span,a{
    font-size: 16px;
  }
  .all{
    display: flex;
    justify-content: center;
  }
  .text{
    width: 90%;
  }
  .title{
    font-size: 45rpx;
    font-weight: 600;
  }
  .bottom{
    display: flex;
    width: 100%;
  }
  .left{
    width: 70%;
  }
  .applyButton{
    padding: 0rpx;
    border-radius: 50%;
    width: 150rpx;
    line-height: 150rpx;
    height: 150rpx;
    align-items: center;
    background-color: #199ED8;
    color: black;
    font-size: 40rpx;
    font-weight: 600;
  }
  .contentDetail{
    color: #87878A;
  }
</style>
