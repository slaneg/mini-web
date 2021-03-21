<template>
  <div class="bodyDiv">
    <div class="head">
      <div class="headPicture" :style="imgBase">
       <div @click="jumpTo('../mine_certification/main')">
         <button v-if="this.$store.state.wxUserInfo.partyId"  class="a" >
           点击认证
           <img class="aImg" src="/static/images/pen.png">
         </button>
       </div>
      </div>
      <div class="simpleNavigation">
        <button class="simpleButton" @click="jumpTo('../application_willAndClass/main')">三会一课</button>
        <p class="simpleButton">|</p>
        <button class="simpleButton" @click="jumpTo('../application_themeDay/main')">党主题日</button>
      </div>
    </div>
    <p class="title">基层党建</p>
    <div class="applicationNavigation">
      <div class="nav">
        <div class="navItem" @click="jumpTo('../application_willAndClass/main')">
          <img src="/static/images/three.png">
          <p>三会一课</p>
        </div>
        <div @click="jumpTo('../application_themeDay/main')" class="navItem">
          <img src="/static/images/themeDay.png">
          <p>党主题日</p>
        </div>
        <div class="navItem" @click="jumpTo('../mine_branch/main')">
          <img src="/static/images/myBranch.png">
          <p>我的支部</p>
        </div>
      </div>
      <div class="nav">
        <div class="navItem" @click="isChange()">
          <img src="/static/images/turnOrganization.png">
          <p>校内转组织</p>
        </div>
        <div @click="jumpTo('../application_answerQuestion/main')" class="navItem">
          <img src="/static/images/answerQuestion.png">
          <p>趣味答题</p>
        </div>
        <div @click="jumpTo('../application_volunteering/main')" class="navItem">
          <img src="/static/images/activityVolunteer.png">
          <p>志愿活动</p>
        </div>
      </div>
      <div class="nav">
       <div @click="jumpTo('../application_leaveWord/main')" class="navItem">
         <img src="/static/images/onlineMessage.png">
         <p>在线留言</p>
       </div>
       <div @click="jumpTo('../application_polls/main')" class="navItem">
         <img src="/static/images/poll.png">
         <p>投票调查</p>
       </div>
       <div @click="jumpTo('../application_publishedArticles/main')" class="navItem">
         <img src="/static/images/publishedArticles.png">
         <p>文章发布</p>
       </div>
     </div>
    </div>
  </div>
</template>

<script>
  import request from '../../tools/service'
  export default {
    name: "index",
    data(){
      return{
        imgBase:""
      }
    },
    methods:{
      async isChange(){
        let url='/ServiceChangeOrganization/isChangeing';
        if(this.$store.state.wxUserInfo.studentJobNumber!=null){
          let data={studentJobNumber:this.$store.state.wxUserInfo.studentJobNumber}
          let result = await request.demand(url, data,'GET');
          if(result.data==false){
            this.jumpTo('../application_turnOrganization/main')
          }else{
            this.jumpTo('../application_turnProgress/main')
          }
        }else{
          wx.showModal({
            title: '提示',
            content: '请先认证',
            success: function (res) {
              if (res.confirm) {
                wx.navigateTo({
                  url:"../mine_certification/main"
                })
              } else {
                wx.switchTab({
                  url:"../application/main"
                })
              }
            }
          })
        }
      },
      jumpTo(url){
        if (this.$store.state.wxUserInfo.partyId==null&&url!="../mine_certification/main"){
            wx.showModal({
              title: '提示',
              content: '请先认证',
              success: function (res) {
                if (res.confirm) {
                  wx.navigateTo({
                    url:"../mine_certification/main"
                  })
                } else {
                  wx.switchTab({
                    url:"../application/main"
                  })
                }
              }
            })
        }else {
            wx.navigateTo({
              url:url
            });
        };
      }
    },
    onLoad:function() {
      var img= wx.getFileSystemManager().readFileSync('/static/images/headImg.jpg', "base64");
      this.imgBase="background:url('data:image/jpeg;base64,"+img+"') 2rpx/750rpx no-repeat";

    }
  };
</script>
<style>
  page{
    height: 100%;
  }
</style>
<style scoped>
  button::after{
    border: none;
  }
  .bodyDiv{
    margin: 0 auto;
    background-color: #f2f1ed;
    height:100%;
  }
  .head{
    width: 100%;
    height: 320rpx;
    margin: 0 auto;
  }
  .headPicture{
    width: 100%;
    height: 70%;
    display:flex;
    justify-content: flex-end;
  }
  .simpleNavigation{
    display: flex;
    background-color: #cc3300;
    align-items: center;
    justify-content: center;
    height: 25%;
  }
  .simpleButton{
    color: white;
    background-color: Transparent;
    border-style: none;
    outline: none;
    font-family:Lisu;
  }
  .title{
    margin:10rpx;
    color:#a59193;
    font-weight:700;
    justify-content:center;
    font-family:Lisu;
    font-size:40rpx;
    display:flex;
    margin:10rpx;
  }
  .applicationNavigation{
    flex-wrap:wrap;
    justify-content:center;
    margin:0 auto;
    background-color:white;
    width:85%;
    padding:5rpx 15rpx 15rpx 15rpx;
    height:50%;
    box-shadow:7rpx 7rpx 25rpx 1rpx rgba(0,0,0,0.1);
    border-radius:8rpx;
  }
  .nav{
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding-bottom: 20rpx;
    border-bottom:1rpx solid #f3f5f4 ;
    margin-top: 25rpx;
  }
  .navItem{
    width: 33%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .navItem>img{
    width:90rpx;
    height:79rpx;
  }
  .a{
    width:210rpx;
    height:45rpx;
    background-color:#ffb036;
    font-size:26rpx;
    color:white;
    display:flex;
    justify-content:flex-end;
    align-items:center;
    margin:10rpx 10rpx 0 0;
    border-radius:25rpx;
    padding:0 15rpx 0 30rpx;

  }
  .aImg{
    width: 40rpx;
    height: 30rpx;
    margin-left: 15rpx;
  }
</style>
