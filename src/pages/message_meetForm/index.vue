<template>
  <div class="meetMainBox">
    <p style="font-size: 24px;margin-bottom: 20rpx;margin-left: 3%">消息提醒</p>

    <div v-if="isHaveMeetingMinute == 0">
      <span style="font-size: 20px;margin-left: 5%">你本次会议已完成，请上传</span>
      <span @click="show_pro()" style="color: blue;font-size: 16px">会议纪要</span>

      <!--弹窗的页面-->
      <div class="modalMask" v-if="isModel"></div>

      <div class="modalDialog" v-if="changeModel">
        <div class="modalContent">
          <div class="dialogTitle">会议纪要</div>
          <scroll-view  :style="{'height': '300rpx'}" :scroll-y="true" @scrolltolower="scrolltolower" @scroll="scroll" >
            <div class="dialogTextArea">
              <textarea fixed='textareaFixed' class="editText" maxlength="2000000" rows="15" cols="45" placeholder="请填写会议纪要" v-model="commitSummary"/>
            </div>
          </scroll-view>

          <!--<scroll-view  :style="{'height': '100rpx'}" :scroll-y="true" @scrolltolower="scrolltolower" @scroll="scroll" >-->
            <!--<div class="dialogPeople">出席人员：<span>{{meetingMinuteDetails.hostParticipateName}}</span></div>-->
          <!--</scroll-view>-->

          <scroll-view  :style="{'height': '270rpx'}" :scroll-y="true" @scrolltolower="scrolltolower" @scroll="scroll" >
            <div class="j-pic-upload">
              <span style="font-size: 16px;">上传图片：</span>
              <div class="j-upload-btn" @click="uploadImg()" :style="{'width':width || '120rpx','height':height || '120rpx'}">
                <span class="j-upload-add">+</span>
              </div>
              <img @click="previewImg(index)" v-for="(src,index) in urls" :key="src" :src="src" :style="{'width':width || '120rpx','height':height || '120rpx'}" class="img" >
            </div>
          </scroll-view>
        </div>

        <div class="modalFooter">
          <div class="btnCancel" @tap="tapCancel">取消</div>
          <div class="btnConfirm" @tap="confirmSend" @click="submit()">确定</div>
        </div>

      </div>
    </div>

    <div v-if="isHaveMeetingMinute == 1">
      <span style="font-size: 20px;margin-left: 40rpx">您已上传本次大会会议纪要</span>
      <span @click="gotoMinuteMeeting(messageDetails)" style="color: blue;font-size: 16px">点击查看</span>
    </div>
  </div>
</template>

<script>
  import request from "../../tools/service";

  export default {
    name: "index",
    props:["width","height","max","srcs"],
    data() {
      return {
        messageDetails:{meetingId:'',id:'',messageType:'',messageTitle:'',messageContent:'',messagePublishTime:''},
        minuteMeeting:{meetingId:'',minuteType:'',minuteContent:'',meetingRecorderId:''},
        commitSummary:'',
        uploadMeetForm: 0,
        changeModel: false,
        isModel: false,
        val: "",
        urls: [],
        picName:[],
        isHaveMeetingMinute:0,//用于判断该会议的会议纪要是否已经上传
      }
    },
    mounted(){
      this.messageDetails = this.$mp.query.messageDetails;
      this.messageDetails = JSON.parse(this.messageDetails);
      this.isHaveMinuteByMeetingId();
    },
    methods:{
      //  弹框取消
      tapCancel() {
        console.log("取消");
        this.changeModel = !this.changeModel;
        this.isModel = !this.isModel;
      },
      //  确认
     async confirmSend() {
        console.log("确认");
        this.changeModel = !this.changeModel;
        this.isModel = !this.isModel;

        this.minuteMeeting.meetingId = this.messageDetails.meetingId;
        this.minuteMeeting.minuteContent = this.commitSummary;
        this.minuteMeeting.meetingRecorderId = this.$store.state.wxUserInfo.partyId;

        let that = this;

        console.log("this.minuteMeeting: "+this.minuteMeeting.meetingRecordId);
        console.log(this.minuteMeeting.minuteContent);
        console.log(this.minuteMeeting.meetingId);

        wx.request({
          url:'http://localhost:8090/serviceMinuteMeeting/insertMinute',
          data:this.minuteMeeting,
          method: "Post",
          header: {
            'content-type': 'application/json',
          },

          success:function(res) {
            wx.showModal({
              title: '提示',
              content: '会议纪要已上传',
              showCancel:false,
              confirmText:'确定',
              success: function (res) {
                if (res.confirm){
                  that.commitSummary='';
                  that.urls=[];
                  that.picName=[];

                }
              }
            })
          }
        });

        wx.uploadFile({
          url: 'http://localhost:8090/serviceMinuteMeeting/uploadMinuteFile',
          filePath: this.urls,
          // name: "file",
          name:this.picName,
          formData: {
            'user': 'test'
          },
          success (res){
            that.article.picUrl= res.data;
          }
        });

        console.log(this.commitSummary)
      },
      //发送会议纪要上传的消息
      async createMinuteMessage(){
        let url='/message/insertMessage';
        let message=
          { messageTitle:'会议纪要查阅通知',
            messageContent:'请查阅你参与会议的会后纪要内容',
            messageType:2,
            meetingId:this.minuteMeeting.meetingId,
            partyId:this.minuteMeeting.meetingRecorderId
          };
        let data=message;
        let result = await request.demand(url,data,'GET');
      },

      gotoMinuteMeeting(item){
        console.log("你为什么不跳页面？？？");
        var url="";
        var message = JSON.stringify(item);
        url="/pages/message_minute_meeting_details/main?messageDetails="+ message;
        wx.navigateTo({
          url:url,
        })
      },

      //展示弹框
      show_pro(val) {
        this.changeModel = !this.changeModel;
        this.isModel = !this.isModel;
      },
      //上传图片
      uploadImg(){
        let that = this;
        wx.chooseImage({
          count: that.max || 3,
          sizeType: ['original', 'compressed'],
          sourceType: ['album', 'camera'],
          success: function (res) {
            res.tempFilePaths.forEach(v=>{
              that.urls.push(v);
              that.picName.push(v)
            });
            var tempFiles = res.tempFilePaths;
            that.$emit("choosed",{all:that.urls,currentUpload:res.tempFilePaths});
            console.log("that.urls："+that.urls)
            console.log("currentUpload: "+res.tempFilePaths);
          }
        })
      },
      //图片的预览和删除
      previewImg(index){
        let that = this;
        wx.showActionSheet({
          itemList:["预览","删除"],
          success: function(res) {
            if(res.tapIndex === 0){
              wx.previewImage({
                current:that.urls[index],
                urls:that.urls
              });
            } else {
              that.urls.splice(index,1);
              that.$emit("delete",that.urls);
            }
          },
        });
      },

      async isHaveMinuteByMeetingId(){
        this.messageDetails = this.$mp.query.messageDetails;
        this.messageDetails = JSON.parse(this.messageDetails);

        let url='/serviceMinuteMeeting/isHaveMinuteByMeetingId';
        let data={id:this.messageDetails.meetingId};
        let result = await request.demand(url,data,'GET');
        this.isHaveMeetingMinute = result.data.isHave;
      },

      onLoad:function() {
        this.commitSummary='';
        this.urls=[];
        this.picName=[];

        // this.messageDetails = this.$mp.query.messageDetails;
        // this.messageDetails = JSON.parse(this.messageDetails);
        // // let that = this;
        // console.log("meetingId:"+that.messageDetails.meetingId);
        // // wx.request({
        // //   url:'http://localhost:8090/serviceMinuteMeeting/isHaveMinuteByMeetingId',
        // //   data:that.messageDetails.meetingId,
        // //   method: "Get",
        // //   header: {
        // //     'content-type': 'application/json',
        // //   },
        // //   success:function(res) {
        // //     that.isHaveMeetingMinute = res.data.data.isHave;
        // //     console.log("isHaveMeetingMinute: "+that.isHaveMeetingMinute)
        // //   }
        // // })
        // let url='/serviceMinuteMeeting/isHaveMinuteByMeetingId';
        // let data={id:this.messageDetails.meetingId};
        // let result = await request.demand(url,data,'GET');
        // this.isHaveMeetingMinute = result.data.isHave;
        // console.log("为什么没有显示东西出来？？？");
        // console.log("isHaveMeetingMinute: ");
        // console.log(this.isHaveMeetingMinute)
      },

      async submit(){
        // wx.uploadFile({
        //   url: 'http://localhost:8090/serviceMinuteMeeting/uploadMinuteFile',
        //   filePath: this.urls,
        //   name: "file",
        //   formData: {
        //     'user': 'test'
        //   },
        //   success (res){
        //     that.article.picUrl= res.data;
        //   }
        // })
      },
    }
  };
</script>

<style scoped>
  .meetMainBox{
    margin-left: 2%;
  }
  /* 弹窗开始 */
  .modalMask {
    width: 100%;height: 100%;position: fixed;
    top: 0;left: 0;background: #000;color: #fff;
    opacity: 0.5;overflow: hidden;z-index: 9000;
  }
  .modalDialog {
    box-sizing: border-box;width: 98%;
    overflow: hidden;position: fixed;
    top: 30%;left: 0;z-index: 9999;
    background: #fff;border-radius: 8rpx;
    margin: -10% 1%;
  }
  .modalContent {
    box-sizing: border-box;display: flex;
    justify-content: center;flex-direction: column;
    /*height:600rpx;*/
    width: 100%;
    padding:6% 6%
  }
  .dialogTitle{
    border-bottom:1px solid #000;text-align: center;
    font-size: 18px;width: 96%;padding-bottom: 20rpx;
    margin-left:1%;

  }
  .dialogTextArea{
    width: 96%;padding-bottom: 20rpx;
    margin-top: 20rpx;
  }
  .editText{
    margin-left: 1%;width: 100%;padding-bottom: 20rpx;
  }
  .dialogPeople{
    border-top:1px solid #000;border-bottom:1px solid #000;
    width: 96%;padding-bottom: 20rpx;padding-top: 20rpx;
    margin-top: 20rpx;
  }
  .modalFooter {
    box-sizing: border-box;display: flex;flex-direction: row;height: 100rpx;
    border-top: 1px solid #e5e5e5;font-size: 32rpx;line-height: 100rpx;
  }
  .btnCancel {
    width: 50%;font-size: 32rpx;color: #333;
    text-align: center;border-right: 1px solid #e5e5e5;
  }
  .btnConfirm {
    font-size: 32rpx;width: 50%;color: #508cee;text-align: center;
  }
  /* 弹窗结束 */


  .j-pic-upload{
    padding: 10rpx;display: flex;flex-direction: row;
    align-items: center;flex-wrap: wrap;
  }
  .j-upload-btn{
    border: 1px dashed #ddd;display: flex;
    flex-direction: row;justify-content: center;
    align-items: center;
  }
  .j-upload-add{
    font-size: 80rpx;font-weight: 500;color:#C9C9C9;
  }
  .img{
    margin:10rpx 20rpx 10rpx 0;
  }
</style>
