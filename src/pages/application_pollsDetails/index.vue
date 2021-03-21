<template>
  <div>
    <div class="pollsWord">
      <div style="width: 88%;display: flex;flex-direction: column;align-items: center;">
        <p class="pollsTitle">{{VoteData.title}}</p>
        <p class="pollsContent">{{VoteData.content}}</p>
      </div>
    </div>
    <div v-if="!userOption" class="options">
      <radio-group class="radio-group" @change="radioChange">
        <radio class="radio"
               v-for="item in optionDtos" :key="item.name"
               :value=item.id
               :checked=item.checked>
          <p style="font-weight: 500;font-size: 30rpx;">{{item.theOption}}、{{item.optionContent}}</p>
        </radio>
      </radio-group>
    </div>
    <div v-if="userOption" class="options">
      <radio-group class="radio-group" @change="radioChange">
        <div v-for="item in optionDtos" :key="item.name" :value=item.id class="radio">
          <radio v-if="item.id==userOption" :value=item.id checked="checked">
            <p style="font-weight: 500;font-size: 30rpx;">{{item.theOption}}、{{item.optionContent}}</p>
          </radio>
          <radio v-else  :value=item.id disabled="true">
            <p style="font-weight: 500;font-size: 30rpx;">{{item.theOption}}、{{item.optionContent}}</p>
          </radio>
        </div>
      </radio-group>
    </div>
    <div style="padding:20rpx;color:#A9A9A9;font-size: 30rpx">
      <p>发起人：{{VoteData.name}}（{{VoteData.organizationName}}）</p>
      <p class="timeDiv">{{VoteData.voteBeginTime}}-{{VoteData.voteEndTime}}</p>
    </div>
    <div v-if="!userOption&&voteItemStatus!=-1" class="pollButtonDiv">
      <button type="primary" @click="insertVoteOption">提交</button>
    </div>
  </div>
</template>

<script>
  export default {
    name: "index",
    data(){
      return{
        VoteData:[],
        optionDtos:[],
        thisVoteId:"",
        thisOptionId:"",
        userOption:"",
        voteItemStatus:1,
      }
    },
    methods:{
      radioChange(e) {
        let that=this;
        that.thisOptionId=e.mp.detail.value;
        console.log('radio发生change事件，携带value值为：', e.mp.detail.value)
      },
      getVoteById(id){
        let that=this;
        wx.request({
          url:'http://localhost:8090/serviceVote/getVoteByVoteId?voteId='+id,
          method: "Get",
          header: {
            'content-type': 'application/json',
          },
          success:function(res) {
            that.VoteData=res.data.data;
            that.optionDtos=res.data.data.optionDtos;
          }
        })
      },
      isOptioned(id){
        let that=this;
        wx.request({
          url:'http://localhost:8090/serviceVote/isOptioned?voteId='+id+"&partyId="+this.$store.state.wxUserInfo.partyId,
          method: "Get",
          header: {
            'content-type': 'application/json',
          },
          success:function(res) {
            if (res.data.data!==false){
              that.getVoteById(id);
              that.userOption=res.data.data;
            }else{
              that.getVoteById(id);
            };
          }
        })
      },
      insertVoteOption(){
        let that=this;
        if (that.voteItemStatus!=-1){
          if (that.thisOptionId!=""&&that.thisOptionId!=null){
            wx.request({
              url:'http://localhost:8090/serviceVote/insertVoteOption',
              data:{
                voteId:that.thisVoteId,
                optionId:that.thisOptionId,
                partyId:this.$store.state.wxUserInfo.partyId,
              },
              method:"Post",
              header: {
                'content-type': 'application/json',
              },
              success:function(res) {
                wx.showModal({
                  title: '提示',
                  content: '投票已提交',
                  showCancel:false,
                  success: function (res) {
                    wx.navigateTo({
                      url:"../application_polls/main"
                    })
                  }
                })
              }
            });
          }else{
            wx.showModal({
              title: '提示',
              content: '未进行投票，请选择'
            })
          };
        }else {
          wx.showModal({
            title: '提示',
            content: '投票已结束'
          })
        };

      }
    },
    mounted:function(){
      this.thisVoteId=this.$root.$mp.page.options.id;
      this.voteItemStatus=this.$root.$mp.page.options.voteItemStatus;
      this.isOptioned(this.$root.$mp.page.options.id);
    }
  };
</script>

<style>
  page{
    background: #facd9131;
  }
</style>
<style scoped>
  .pollsWord{
    display: flex;
    justify-content: center;
    width: 100%;
    margin-bottom: 50rpx;
  }
  .pollsTitle{
    font-size: 36rpx;
    font-weight: 600;
    margin-top: 45rpx;
    margin-bottom: 40rpx;
  }
  .radio-group{
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .radio{
    width: 80%;
    line-height: 90rpx;
    border-bottom: 4rpx solid #E4E4E4;
  }
  .timeDiv{
    float:right;
    margin-right:50rpx;
    margin-top:20rpx;
  }
  .pollsContent{
    word-break:break-all;
  }
  .pollButtonDiv{
    margin-top:25%;
    width:90%;
    margin-left:4%;
  }
</style>
