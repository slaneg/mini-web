<template>
  <div>
    <div>
      <button class="submitButton" @click="submitWord">提交</button>
    </div>
    <div class="inputBox">
      <textarea @input='input' placeholder="请输入内容" rows="8" maxlength="150" v-model="leaveWordsContent"  class="inputArea"></textarea>
      <text decode="true" class="currentWordNumber">{{currentNoteLen|0}}/{{noteMaxLen}}个字</text>
    </div>
    <p class="userName">姓名：{{userName}}</p>
  </div>
</template>

<script>
  export default {
    name: "index",
    data(){
      return{
        userName:'',
        leaveWordsContent:"",
        noteMaxLen: 150,  //字数限制
        currentNoteLen: 0, //输入的字数
      }
    },
    methods:{
      submitWord(){
        var that = this;
        if (that.leaveWordsContent!==""){
          wx.request({
            url:'http://localhost:8090/serviceLeaveWords/insertLeaveWords',
            data:{
              wxUserId:this.$store.state.wxUserInfo.partyId,
              leaveWordsContent:that.leaveWordsContent,
              leaveOrganizationId:this.$store.state.globalOrganizationPosition.organizationId,
              leavePostId:this.$store.state.globalOrganizationPosition.positionId
            },
            method:"Post",
            header: {
              'content-type': 'application/json',
            },
            success:function(res) {
              wx.showModal({
                title: '提示',
                content: '留言已提交',
                showCancel:false,
                success: function (res) {
                  that.leaveWordsContent="";
                  that.currentNoteLen=0;
                }
              })
            }
          });
        }else{
          wx.showModal({
            title: '提示',
            content: '还没有填写留言，请先填写',
            showCancel:false,
          })
        };
      },
      input(event) {
        var value = event.mp.detail.value;
        var len = parseInt(value.length);
        let that = this;
        that.currentNoteLen=len;
      }
    },
    onLoad(){
      this.userName=this.$store.state.wxUserInfo.name
    }
  };
</script>

<style>
  page{
    background: #facd9131;
  }
</style>
<style scoped>
  .submitButton{
    line-height: 90rpx;
    right: 25rpx;
    top: 25rpx;
    background-color: Transparent;
    outline: none;
    float: right;
    color: blue;
    font-size:27rpx;
  }
  .submitButton::after{
    border: none;
  }
  .inputBox{
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height:400rpx;
    flex-direction: column;
  }
  .inputArea{
    border: none;
    width: 88%;
    padding: 20rpx;
    background-color: white;
  }
  .userName{
    float: right;
    margin: 0rpx;
    margin-right:30px;
  }
  .currentWordNumber{
    color: #999999;
    font-size: 24rpx;
    position: absolute;
    right: 35rpx;
    top: 400rpx;
  }
</style>
