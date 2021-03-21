<template>
  <div>
    <h2 style="margin-left:2% ; font-size: 20px">系统公告</h2>

    <div class="newMessage">
      <h3 style="margin-left:-1% ; margin-bottom:4%; margin-toop:4%; font-size: 34rpx"></h3>
      <!--<scroll-view  scroll-y  :style="{height:'scroll_height'}" @scrolltolower="scrolltolower" @scroll="scroll" >-->
      <div class="details">
        {{message.content}}
      </div>
      <!--</scroll-view>-->
    </div>

    <div class="beizhu">
      {{message.publishedTime}}
      <!--<h2>参与人员：李一花 王蒙 历一百</h2>-->
      <!--<h2>记录人员：李一花</h2>-->
      <!--<h2>时间：2019-10-31</h2>-->
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
        id:'',
        message:{},
        scroll_height:0,
      }
    },
    mounted(){
      this.id=this.$mp.query.id;
      console.log("this.id"+this.id)
      // this.urls = this.srcs || [];
      if(this.id != ''){
        this.getAnnouncementDetailsById()
      }
    },

    methods:{

      onLoad: function (options) {
        let windowHeight = wx.getSystemInfoSync().windowHeight // 屏幕的高度
        let windowWidth = wx.getSystemInfoSync().windowWidth // 屏幕的宽度
        this.setData({
          scroll_height: windowHeight * 750 / windowWidth - (本页面除了scroll以外其他组件的高度rpx) - 30
        })
      },


      async getAnnouncementDetailsById(){
        let that=this;
        let url='/sysAnnouncement/getSysAnnouncementByIdOne';
        let data={id:this.id};
        console.log("详情的id: ");
        console.log(data);
        let result = await request.demand(url,data,'GET');
        this.message=result.data;
        console.log("this.message");
        console.log(this.message)
      },

      scrolltolower(){
        console.log(7)
      },
      scroll(e) {
        console.log(6)
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
    margin-top: 1%;
    font-size: 34rpx;
  }
</style>
