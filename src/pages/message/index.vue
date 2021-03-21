<template>
  <div classs="message">

    <div class="title">
      <div ><span v-bind:class="{selected:isSelected1, notselect:notselect1}" @click="announcement()" >通知公告</span></div>
      <div ><span v-bind:class="{selected:isSelected2, notselect:notselect2}" @click="messageNotification()" >消息提醒</span></div>
    </div>

    <div v-if="isSelected1==true">
      <div v-for="(item ,index) in announcementList">
        <div class="showAnnouncementTitleTime" :class="{displayMode:item.flag==0}">
          <span @click="viewAnnouncementDetails(item.id)" class="line-limit-length" >{{item.content}}</span>
          <span class="date">{{item.publishedTime}}</span>
        </div>
      </div>
    </div>

    <div v-if="isSelected2==true">
      <div v-for="(item,index) in messageList" :key="index" @touchstart="touchStart" @touchmove="touchMove($event,index)">
        <div class="showMessageTitleTime" :class="{displayMode:item.read==0}" :data-type="item.type">
          <span @click="viewMessageDetails(item)" class="line-limit-length">{{item.messageTitle}}</span>
          <span class="date">{{item.messagePublishTime}}</span>
        </div>
        <div class="delete" @click="deleteMessage(item.messagePersonId)">删除</div>
      </div>
    </div>

  </div>
</template>

<script>
  import request from '../../tools/service'
  export default {
    name: "index",
    data(){
      return {
        announcementList:[],
        messageList:[],
        isSelected1:true,
        isSelected2:false,
        notselect1:false,
        notselect2:true,
        listIndex:1,
        organizationId:'',
        messageReceiveId:'',
        clientX1:'',//滑动开始位置
        clientX2:'',
        btnWidth:80,//删除按钮宽度
      }
    },
    mounted(){
      this.organizationId = this.$store.state.globalOrganizationPosition.organizationId;
      this.messageReceiveId = this.$store.state.wxUserInfo.partyId;
      this.announcement();
    },

    methods:{

      async announcement(){
        this.isSelected1=true;
        this.isSelected2=false;
        this.notselect1=false;
        this.notselect2=true;
        // let that=this;
        this.getAnnouncementList();
      },

      async getAnnouncementList(){
        let url='/sysAnnouncement/getSysAnnouncementById';
        let data={organizationId:this.organizationId};
        let result = await request.demand(url,data,'GET');
        this.announcementList=result.data;
        console.log(this.announcementList)
        wx.stopPullDownRefresh();
        wx.hideNavigationBarLoading();
      },

      messageNotification(){
        this.isSelected1=false;
        this.isSelected2=true;
        this.notselect1=true;
        this.notselect2=false;
        // let that=this;
        this.getMessageList();
      },

      async getMessageList(){
        let url='/message/selectMessage';
        // let data={organizationId:that.$store.state.globalOrganizationPosition.organizationId};
        let data={messageReceiveId:this.messageReceiveId};
        let result = await request.demand(url,data,'GET');
        this.messageList=result.data;
        console.log(this.messageList);
        wx.stopPullDownRefresh();
        wx.hideNavigationBarLoading();
      },

      //查看系统公告详情
      viewAnnouncementDetails(id){
        let url='/pages/message_announcement_details/main?id='+id;
        wx.navigateTo({
          url:url,
        })
      },

      //修改已读
      async updateByIsRead(id){
        let url='/messagePerson/updateByIsRead';
        let data={id:id};
        let result = await  request.demand(url,data,'GET');
        console.log("修改该消息为已读：")
      },

      //查看消息通知详情
      viewMessageDetails(item){
        if(item.read == 0){
          this.updateByIsRead(item.messagePersonId);
          this.messageNotification();
        }
        var url="";
        var messageDetails = JSON.stringify(item);
        if(item.messageType == 1||item.messageType == 2)
           url="/pages/message_details/main?messageDetails="+ messageDetails;
        // if(item.type==2)
        //    url="/pages/message_meetForm/main?id="+item.id;
        if(item.messageType == 3){
          url="/pages/message_meetForm/main?messageDetails="+messageDetails;
          console.log(item);
        }
        wx.navigateTo({
          url:url,
        })
      },

      touchStart(e){
        this.clientX1=e.clientX;
      },

      touchMove(e,index){
        // console.log(e);
        this.clientX2 = e.clientX;
        let disX = this.clientX1-this.clientX2;
        if(disX == 0 || disX<0){
          this.$set(this.messageList[index],'type',0)
        }
        else if(disX>=this.btnWidth){
          this.$set(this.messageList[index],'type',1)
        }
      },

      deleteMessage(id){
        wx.showModal({
          title: '提示',
          content: '确认要删除此条信息么？',
          async success(res) {
            if (res.confirm) {
              let url='/messagePerson/deleteByMessagePerson';
              let data={id:id};
              let result = await request.demand(url,data,'GET');
              // console.log('用户点击确定');

              this.messageNotification();

            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        });
      },

      async sureDeleteMessage(id){
        let url='/messagePerson/deleteByMessagePerson';
        let data={id:id};
        let result = await request.demand(url,data,'GET');
        console.log(result.data);
        this.messageNotification();
      },

      onLoad: function (){
        this.announcement();
      }

    },

    // 下拉刷新
    onPullDownRefresh : function (){
      //执行上拉执行的功能
      if( this.isSelected1==true&&this.isSelected2==false)
        this.getAnnouncementList();
      if(this.isSelected1==false&&this.isSelected2==true)
        this.getMessageList();
    },

    computed:{
    },
  };
</script>
<style>
  page{
    background: #FEF6EB;
    height: 100%;
  }
</style>
<style scoped>

  .message{
    display: flex;
    flex-direction:column;
    width: 750rpx;
    height: 100%;
    background-color:#FEF6EB
  }
    .title{
      display: flex;
      width: 100%;
    }
  .notselect{
    display: flex;
    align-items: center;
    justify-content: center;
    width: 250rpx;
    height: 100rpx;
    color:black;
    font-size: 30rpx;
  }
  .selected{
    display: flex;
    align-items: center;
    justify-content: center;
    width: 250rpx;
    height: 100rpx;
    background-color: RGB(253,238,216);
    color: RGB(217,0,27);
    font-size: 30rpx;
    border-bottom: 3rpx red solid ;
  }
  /*消息标题时间*/
  .showMessageTitleTime ,.showAnnouncementTitleTime{
    height: 80rpx;
    line-height: 78rpx;
    position: relative;
    margin-top:4%;
    margin-left: 3%;
    border-bottom: rgb(231,180,150) 1px dashed;
    background: rgb(254,246,235);
    color: grey;
    /*position: absolute;*/
    transition: right 0.3s ease-in-out;
    z-index: 6;
  }
  .showMessageTitleTime[data-type='0']{
    right:0
  }
  .showMessageTitleTime[data-type='1']{
    right:80px;
  }
  /*若标题过长就隐藏部分*/
  .line-limit-length{
    width:60%;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
    position: absolute;
  }
  .date{
    margin-left: 60%;
  }
  /*标题：未读加粗*/
  .displayMode{
    color:black;
  }

  .delete{
    position: absolute;
    color:#fff;
    height: 80rpx;
    text-align: center;
    width:80px;
    background: red;
    line-height: 78rpx;
    right:0;
    margin-top:-80rpx
  }

</style>
