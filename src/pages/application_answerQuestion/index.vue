<template>
  <div>
    <div class="searchBox">
      <span style="line-height:90rpx;vertical-align:top;">类型:</span>
      <picker class="picker" v-on:change="bindPickerChange" :value="index" :range="questionTypeName">
        <view>
          <div class="pickerDiv">
            <span>{{questionTypeName[index]}}</span>
          </div>
          <img src="/static/images/down.png" class="pickerImg">
        </view>
      </picker>
    </div>
    <div>
      <div v-for="(item,id) in examinationData" :key="id" class="questionItem" @click="jumpTo(item.id,item.state)">
        <div class="questionMessage">
          <div class="titleMessage">
            <p class="title">{{item.title}}</p>
            <p v-if="item.correctQuestionNumber||item.correctQuestionNumber===0" class="achieve">已完成</p>
            <p v-if="item.correctQuestionNumber==null" class="unfinished">未完成</p>
            <p class="type">{{item.questionCategoryName}}</p>
          </div>
          <div class="placeAndTime" v-if="item.correctQuestionNumber||item.correctQuestionNumber===0">
            <p class="place">{{item.organizationName}}</p>
            <p class="time">{{item.beginTime}}</p>
          </div>
        </div>
        <div class="grade">
          <p v-if="item.correctQuestionNumber||item.correctQuestionNumber===0" class="gradeWord">{{(item.correctQuestionNumber/item.questionTotalNumber)*100 | rounding}}%</p>
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
        questionTypeName:[],
        questionTypeId:[],
        flag:true,
        index:0,
        examinationData:[]
      }
    },
    methods:{
      selectExaminationAll(){
        var that = this;
        wx.request({
          url:'http://localhost:8090/serviceExaminationManagement/selectExaminationAll?userId='+this.$store.state.wxUserInfo.partyId,
          method: "Get",
          header: {
            'content-type': 'application/json',
          },
          success:function(res) {
            that.examinationData=res.data.data;
          }
        })
      },
      bindPickerChange: function(e) {
        var that = this;
        that.index=e.mp.detail.value;
       if (e.mp.detail.value!=0){
         wx.request({
           url:'http://localhost:8090/serviceExaminationManagement/selectExaminationByCategory?userId='+this.$store.state.wxUserInfo.partyId+
             "&questionCategoryId="+that.questionTypeId[e.mp.detail.value-1],
           method: "Get",
           header: {
             'content-type': 'application/json',
           },
           success:function(res) {
             that.examinationData=res.data.data;
           }
         })
       }else {
         that.selectExaminationAll();
       }
      },
      jumpTo(id,state){
        if (state==2){
          wx.showModal({
            title: '提示',
            content: '该答题还未开始',
            showCancel:false,
          })
        }else {
          wx.navigateTo({
            url:"../application_questionDetail/main?id="+id
          })
        };
      },
      rounding(value){
        return Math.round(value)
      },
      selectAllCategory(){
        var that = this;
        wx.request({
          url:'http://localhost:8090/serviceQuestionCategory/selectAllCategory',
          method: "Get",
          header: {
            'content-type': 'application/json',
          },
          success:function(res) {
            for (var i=0;i<res.data.data.length;i++){
              that.questionTypeId.push(res.data.data[i].id);
              that.questionTypeName.push(res.data.data[i].categoryName)
            }
            that.questionTypeName.unshift("请选择")
          }
        })
      }

    },
    mounted(){
      this.selectExaminationAll();
      this.selectAllCategory();
    }
  };
</script>

<style>
  page{
    background: #facd9131;
  }
</style>
<style scoped>
  .questionItem{
    display: flex;
    width: 100%;
    border-bottom: 3rpx dashed #E8E8E8;
    align-items: center;
    justify-content: center;
    padding-bottom:20rpx;
    padding-top:30rpx;
  }
  .questionMessage{
    display: flex;
    flex-direction: column;
    width: 68%;
  }
  .titleMessage{
    display: flex;
    margin-bottom: 15rpx;
  }
  .title{
    font-weight: 600;
    font-size: 29rpx;
    max-width: 45%;
    margin: 0rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .achieve{
    width: 20%;
    font-size: 26rpx;
    margin-left: 3%;
    border-radius: 12rpx;
    color: #FFFFFF;
    background-color: #1890FF;
    text-align: center;
    line-height: 38rpx;

  }
  .unfinished{
    width: 20%;
    font-size: 26rpx;
    margin-left: 3%;
    border: 3rpx solid #D9D9D9;
    border-radius: 12rpx;
    background-color: #F5F5F5;
    text-align: center;
    line-height: 38rpx;
  }
  .type{
    margin-left:5%;
    background-color:#F5222D;
    border-radius:12rpx;
    color:#FFFFFF;
    font-size:26rpx;
    text-align:center;
    line-height:38rpx;
    padding:3rpx;
  }
  .placeAndTime{
    display: flex;
    margin-top: 15rpx;
  }
  .place{
    max-width: 50%;
    color: #87878A;
    font-size: 26rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .time{
    max-width: 50%;
    margin-left: 5%;
    color: #87878A;
    font-size: 26rpx;
  }
  .grade{
    width: 20%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .gradeWord{
    font-weight: 800;
    color: #FF3333;
    font-size: 60rpx;
  }
  .picker{
    display: flex;
    display: inline-block;
    width: 85%;
    margin: 10rpx;
  }
  .pickerDiv{
    display: flex;
    border:2rpx solid #CCC;
    display:inline-block;
    width:80%;
    height:50rpx;
    padding:8rpx;
    border-radius:10rpx;
  }
  .pickerImg {
    display: flex;
    width:35rpx;
    height:35rpx;
    position:absolute;
    top:3%;
    left:74%;
  }
  .searchBox{
    display: flex;
    margin: 10rpx 10rpx 0rpx 20rpx;
  }

</style>
