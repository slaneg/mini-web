<template>
  <div style="display: flex;flex-direction: column;height: 130rpx;margin-top: 25rpx;">
    <div style="width: 100%;">
      <!--<button class="releaseButton1" @click="jumpBack" style="padding-left: 0"> 首页</button>-->
      <button class="releaseButton" @click="jumpToCreate">发布活动</button>
    </div>
    <div class="activityItems" v-for="activity in activities">
        <div class="activityItem" @click="jumpTo(activity)">
          <div class="activityWord">
            <div class="topTitle">
              <h2 class="activityTitle">{{activity.activityTitle}}</h2>
              <span class="activityState" v-if="activity.activityState==1">未发布</span>
              <span class="activityState" v-else-if="activity.activityState==2">报名中</span>
              <span class="activityState" v-else-if="activity.activityState==3">报名截止</span>
              <span class="activityState" v-else>活动结束</span>
            </div>
            <p class="activityTime">发布时间：{{activity.releaseTime}}</p>
          </div>
          <img class="activityImg" :src="activity.picture">
        </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "index",
    data(){
      return{
        date:new Date(),
        activities:'',
        activity:{}
      }
    },
    methods:{
      jumpBack(){
        wx.switchTab({
          url:"../application/main"
        })
      },
      jumpToCreate(){
        var flag = "0"
        wx.navigateTo({
          url: '../application_createActivity/main?flag=' + flag
        })
      },
      //跳转详情页面
      jumpTo(activity){
        //将对象转换为json字符串
       var str = JSON.stringify(activity);
          wx.navigateTo({
            url:"../application_activityDetails/main?activity="+str
          })

      }
    },
    onLoad:function() {
      var that = this;
      wx.request({
        url:'http://localhost:8090/ServiceVolunteerActivity/getAllVolunteerActivities',
        method:'Get',
        success:function(res) {
          // console.log(res.data.data);
          that.activities = res.data.data;
        }
      })
    },
    // onUnload: function () {
    //   wx.reLaunch({
    //     url: '../application/main',
    //   })
    // },
  };
</script>

<style>
  page{
    background: #FEF6EB;
  }
</style>
<style scoped>
  .releaseButton1{
    line-height: 90rpx;
    background-color: Transparent;
    outline: none;
    float: left;
    color: #1890FF;
  }
  .releaseButton{
    line-height: 90rpx;
    right: 28rpx;
    background-color: Transparent;
    outline: none;
    float: right;
    color: #1890FF;
  }
  .releaseButton::after{
    border: none;
  }
  .releaseButton1::after{
    border: none;
  }
  .activityItems{
    /*display: flex;*/
    /*flex-direction: column;*/
    justify-items: center;
    justify-content: center;
    align-items: center;
    margin-top: 12rpx;
  }
  .activityItem{
    display: flex;
    width: 100%;
    height: 150rpx;
    align-items: center;
    border-bottom: 1rpx solid #E8E8E8;
    padding-bottom: 10rpx;
  }
  .activityWord{
    margin-left: 25rpx;
    width: 64%;
  }
  .topTitle{
    display: flex;
    width: 100%;
    margin-bottom: 30rpx;
  }
  .activityTitle{
    font-weight:700;
    max-width: 320rpx;
    font-size: 35rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .activityState{
    font-weight:400;
    font-size: 24rpx;
    color: rgb(24,144,255);
    border: 1rpx solid rgb(24,144,255);
    border-radius: 4px;
    padding-left: 12rpx;
    padding-right: 12rpx;
    background-color: transparent;
    margin-left: 10rpx;
  }
  .activityTime{
    font-weight:400;
    font-size: 28rpx;
    color: rgb(135,135,138);
  }
  .activityImg{
    width: 200rpx;
    height: 200rpx;
  }
</style>
