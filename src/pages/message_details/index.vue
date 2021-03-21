<template>
  <div>
      <h2 style="margin-left:3% ; font-size: 20px">消息通知</h2>

    <div class="newMessage" v-if="messageDetails.messageType==1">
        <h3 style="margin-left:-1% ; margin-bottom:4%; margin-toop:4%; font-size: 34rpx">{{messageDetails.messageTitle}}</h3>
        <!--<scroll-view  scroll-y  :style="{height:'scroll_height'}" @scrolltolower="scrolltolower" @scroll="scroll" >-->
          <div class="details">
           {{messageDetails.messageContent}}
        </div>
        <!--</scroll-view>-->
      </div>


      <div class="newMessage" v-if="messageDetails.messageType == 2">
        <h3 style="margin-left:-1% ; margin-bottom:4%; margin-toop:15px; font-size: 34rpx">请查阅"{{meetingMinuteDetails.meetingTitle}}"的会后纪要内容。</h3>
        <!--<scroll-view  scroll-y  :style="{height:'scroll_height'}" @scrolltolower="scrolltolower" @scroll="scroll" >-->
        <div class="details">
          {{meetingMinuteDetails.minuteContent}}
        </div>
        <div class="rightBottom">
          <h2 style="margin-top:6px">参与人员：{{meetingMinuteDetails.hostParticipateName}}</h2>
          <h2 style="margin-top:6px">记录人员：{{meetingMinuteDetails.meetingRecorderName}}</h2>
          <h2 style="margin-top:6px">时间：{{meetingMinuteDetails.recorderTime}}</h2>
        </div>

      </div>
  </div>
</template>

<script>
  // import Upload from "@/components/upload"
  import request from "../../tools/service";

  export default {
    name: "index",
    data(){
      return{
        // id:'',
        messageDetails:{messageTitle:'',messageContent:'',messagePublishTime:'',messageType:'',meetingId:''},
        meetingMinuteDetails:{},
        scroll_height:0,
      }
    },
    mounted(){

      this.getMessageDetail();
      if(this.messageDetails.messageType==2){
        this.selectMinuteInfoByMinuteId();
      }
      // console.log("this.id"+this.id);
      // this.urls = this.srcs || [];
      // if(this.id != ''){
      //   this.getDetailsById()
      // }
    },

    methods:{
      onLoad: function (options) {
        let windowHeight = wx.getSystemInfoSync().windowHeight;// 屏幕的高度
        let windowWidth = wx.getSystemInfoSync().windowWidth;// 屏幕的宽度
        var that=this;
        that.setData({
          scroll_height: windowHeight * 750 / windowWidth - (本页面除了scroll以外其他组件的高度rpx) - 30,
        });

      },


      // async getAnnouncementDetailsById(){
      //   let that=this;
      //   let url='/sysAnnouncement/getSysAnnouncementByIdOne';
      //   let data={id:this.id};
      //   console.log("详情的id: ");
      //   console.log(data);
      //   let result = await request.demand(url,data,'GET');
      //   this.message=result.data;
      //   console.log("this.message");
      //   console.log(this.message)
      // },

      async getMessageDetail(){
        this.messageDetails = this.$mp.query.messageDetails;
        this.messageDetails = JSON.parse(this.messageDetails);
        console.log("this.messageDetails:"+this.messageDetails)
      },

      async selectMinuteInfoByMinuteId(){
          let url='/serviceMinuteMeeting/selectMinuteInfoByMeetingId';
          let data={id:this.messageDetails.meetingId};
          console.log("meetingId: "+this.messageDetails.meetingId)
          let result = await request.demand(url,data,'GET');
          this.meetingMinuteDetails = result.data;
          console.log("meetingMinuteDetails: ");
          console.log(this.meetingMinuteDetails)
      },

      scrolltolower(){
        console.log(7)
      },
      scroll(e) {
        console.log(6);
        console.log(e)
      },
    }
  };
</script>
<style>
  page{
    background: #FEF6EB;
    height: 100%;
  }
</style>
<style scoped>

  .beizhu{
    /*display: flex;*/
    margin-top: 6%;
    margin-left: 58%;
    font-size: 34rpx;
  }
  .newMessage{
    width: 84%;
    height:84%;
    margin-top: 3%;
    margin-left: 8%;
  }

  .details{
    margin-top: 20px;
    font-size: 30rpx;
  }

  .rightBottom{
    margin-top:20px;
    font-size: 30rpx;
  }
</style>
