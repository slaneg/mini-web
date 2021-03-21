<template>
  <div style="display: flex;flex-direction: column;height: 130rpx;">
    <div class="voteItems" v-for="voteItem in voteItems" :key="voteItem">
      <div class="voteItem" @click="jumpTo(voteItem.id,voteItem.status)">
        <div class="voteWord">
          <div class="topTitle">
            <h2 class="voteTitle">{{voteItem.title}}</h2>
            <span class="voteState" v-if="voteItem.status===1">进行中</span>
            <span class="voteState" v-if="voteItem.status===-1">已结束</span>
            <span class="voteState" v-if="voteItem.status===0">未开始</span>
          </div>
        </div>
        <div style="display: flex;margin-left: 25rpx;width: 100%">
          <div style="max-width: 300rpx;width: 300rpx;">
            <p class="voteTime">发起人：{{voteItem.name}}</p>
          </div>
          <div>
            <p class="voteTime">{{voteItem.beginTime}}-{{voteItem.endTime}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
  page{
    background: #F5F5F9;
  }
</style>
<script>
  export default {
    name: "index",
    data(){
      return{
        name:'张武',
        voteItems:[],
      }
    },
    methods:{
      jumpTo(id,status){
        if (status===1){
          wx.navigateTo({
            url:"../application_pollsDetails/main?id="+id
          });
        }else if (status===-1){
          wx.showModal({
            title: '提示',
            content: '该投票已经结束',
            showCancel:false,
            success: function (res) {
              if (res.confirm) {
                wx.navigateTo({
                  url:"../application_pollsDetails/main?id="+id+"&voteItemStatus="+status
                })
              }
            }
          })
        }else if (status===0){
          wx.showModal({
            title: '提示',
            content: '该投票未开始',
            showCancel:false,
          })
        };
      },
      getAllVote(){
        let that=this;
        wx.request({
          url:'http://localhost:8090/serviceVote/getVoteByPartyId?partyId='+this.$store.state.wxUserInfo.partyId,
          method: "Get",
          header: {
            'content-type': 'application/json',
          },
          success:function(res) {
            that.voteItems=res.data.data;
          }
        })
      }
    },
    mounted:function(){
    this.getAllVote();
  }
  };
</script>
<style>
  page{
    background: #facd9131;
  }
</style>
<style scoped>
  .voteItems{
    display: flex;
    flex-direction: column;
    justify-items: center;
    justify-content: center;
    align-items: center;
    margin-top: 70rpx;
  }
  .voteItem{
    display: flex;
    flex-direction: column;
    width: 95%;
    height: 150rpx;
    justify-content: center;
    border-bottom: 4rpx dashed #E8E8E8;
  }
  .voteWord{
    display: flex;
    flex-direction: column;
    margin-left: 25rpx;
    width: 64%;
  }
  .topTitle{
    display: flex;
    width: 100%;
    margin-bottom: 30rpx;
  }
  .voteTitle{
    font-weight:700;
    max-width: 70%;
    font-size: 30rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .voteState{
    font-weight:400;
    font-size: 25rpx;
    color: rgb(24,144,255);
    border: 1rpx solid rgb(24,144,255);
    border-radius: 4px;
    padding-left: 12rpx;
    padding-right: 12rpx;
    background-color: transparent;
    margin-left: 10rpx;
  }
  .voteTime{
    font-weight:400;
    font-size: 24rpx;
    color: rgb(135,135,138);
    margin: 0rpx;
  }
</style>
