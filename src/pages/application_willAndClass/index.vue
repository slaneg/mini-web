<template>
  <div>
    <div v-if="false">
      还未参加课程
    </div>
    <div class="mainContent" v-if="len" v-for="(item,i) in classData" :key="i">
      <div class="classItem" @click="jumpTo(item.id)">
        <p class="title">{{item.title}}</p>
        <p v-if="isStart[i]==='0'" class="flagTrue">未开始</p>
        <p v-if="isStart[i]==='1'" class="flagTrue">进行中</p>
        <p v-if="isStart[i]==='2'" class="flagFalse">已结束</p>
        <p class="date">{{item.meetingTime}}</p>
      </div>
    </div>
    <div v-if="!len" class="noClass">
      还未参加课程
    </div>
  </div>
</template>

<script>
  export default {
    name: "index",
    data(){
      return{
        classData:{},
        len:"",
        isStart:[],
      }
    },
    methods:{
      jumpTo(id){
        wx.navigateTo({
          url:"../application_willAndClassDetail/main?id="+id
        })
      },
      selectByParticipateId() {
        let that = this;
        wx.request({
          url: 'http://localhost:8090/serviceThreeSessionOneClass/selectByParticipateId?participateId=' + this.$store.state.wxUserInfo.partyId,
          method: "Get",
          header: {
            'content-type': 'application/json',
          },
          success: function(res) {
            that.classData = res.data.data;
            that.len = that.classData.length;
            for (let i=0;i< that.len;i++){
              if (that.classData[i].status===0){
                that.isStart[i]="0";
              }else if (that.classData[i].status===2){
                that.isStart[i]="2";
              }else if (that.classData[i].status===1){
                that.isStart[i]="1";
              };
              console.log(that.isStart)
              that.classData[i].meetingTime=that.classData[i].meetingTime.split(" ")[0].split("-").join("/")
            };
          }
        })
      }
    },
    onLoad:function(){
      this.selectByParticipateId();
    }
  };
</script>

<style>
  page{
    background: #facd9131;
  }
</style>
<style scoped>
  .mainContent{
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: center;
    margin-top: 40rpx;
  }
  .classItem{
    display: flex;
    align-items: center;
    width: 90%;
    height: 90rpx;
    margin-top: 8rpx;
    padding-bottom: 8rpx;
    border-bottom: 4rpx solid #D9D9D9;
  }
  .title{
    width: 45%;
    max-width: 45%;
    color: #27B2F1;
    font-size: 35rpx;
  }
  .flagTrue{
    background-color: #D0E71D;
    margin: 0rpx;
    width: 15%;
    line-height: 50rpx;
    text-align: center;
    font-size: 25rpx;
  }
  .flagFalse{
    background-color: red;
    margin: 0rpx;
    width: 15%;
    line-height: 50rpx;
    text-align: center;
    font-size: 25rpx;
  }
  .date{
    margin-left: 10%;
    width: 20%;
    text-align: center;
    color: #717172;
    font-size: 25rpx;
  }
  .noClass{
    margin-top: 60rpx;
    margin-left: 100rpx;
    font-size: 40rpx;
    color: #A9A9A9;
  }
</style>
