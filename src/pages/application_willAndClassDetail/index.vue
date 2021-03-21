<template>
  <div class="willDetail">
    <div class="contentDetail">
      <p class="mainTitle">{{classOneData.title}}</p>
      <p class="tips">{{classOneData.meetingTime}} 发起人：{{classOneData.name}}</p>
      <p class="littleTittle">会议内容：</p>
      <text class="content">{{classOneData.mainContent}}</text>
      <p class="littleTittle">参会人员：</p>
      <p class="content">{{classOneData.participateName}}</p>
      <p class="littleTittle">会议形式：</p>
      <p class="content">{{classOneData.meetingForm}}</p>
      <p class="littleTittle">会议时间：</p>
      <p class="content">{{meetingTime}}</p>
      <p class="littleTittle">会议时长：</p>
      <p class="content">{{classOneData.meetingDuration}}</p>
      <p class="littleTittle">会议组织人：</p>
      <p class="content">{{classOneData.name}}</p>
    </div>
  </div>
</template>

<script>
  export default {
    name: "index",
    data(){
      return{
        classOneData:{},
        meetingTime:""
      }
    },
    methods:{
      selectById(id){
        let that = this;
        wx.request({
          url: 'http://localhost:8090/serviceThreeSessionOneClass/selectById?id=' + id,
          method: "Get",
          header: {
            'content-type': 'application/json',
          },
          success: function(res) {
            that.classOneData = res.data.data;
            that.meetingTime=that.classOneData.meetingTime;
            that.classOneData.meetingTime=that.classOneData.meetingTime.split(" ")[0];
            console.log(classOneData.participateName)
          }
        })
      }
    },
    mounted:function() {
      console.log(this.$root.$mp.page.options);
      this.selectById(this.$root.$mp.page.options.id);
    }
  };
</script>

<style>
  page{
    background: #facd9131;
  }
</style>
<style scoped>
  .willDetail{
    width: 100%;
    display: flex;
    justify-content: center;
  }
  .contentDetail{
    width: 89%;
    margin-top: 25rpx;
  }
  .mainTitle{
    margin-top: 20rpx;
    margin-bottom: 15rpx;
    font-weight: 700;
    font-size: 45rpx;
  }
  .tips{
    margin-bottom: 15rpx;
    color: #87878A;
    width: 90%;
    text-align: right;
    margin-left: 5%;
  }
  .littleTittle{
    margin-bottom: 15rpx;
    font-weight: 600;
    font-size: 35rpx;
    margin-top: 15rpx;
  }
  .content{
    margin-bottom: 15rpx;
    color: #87878A;
    margin-left: 6%;
    width: 93%;
  }
</style>
