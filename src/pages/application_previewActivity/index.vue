<template>
  <div>
    <div class="previewDiv">
      <h3>{{activity.activityTitle}}</h3>
      <p style="margin-top: 20rpx">{{this.$store.state.wxUserInfo.partyId}}  重庆理工党建  {{time}}</p>
      <!--活动联系人-->
      <p>活动联系人:{{activity.activityContact}}</p>
      <!--联系电话-->
      <p>联系电话:{{activity.contactNumber}}</p>
      <!--活动地点-->
      <p>活动地点:{{activity.activityLocation}}</p>
      <!--集合地点-->
      <p>集合地点:{{activity.meetingPlace}}</p>
      <!--报名截止时间-->
      <p>报名截止时间:{{activity.lastDate}}</p>
      <!--活动时间-->
      <p>活动时间:{{activity.gatherDate}}</p>

      <!--活动内容-->
      <p>活动内容:</p>
      <text decode="true" style="width: 90%;text-indent: 10rpx">{{activity.activityContent}}</text>
      <image v-if="activity.picUrl" class="image" :src="activity.picUrl"></image>

    </div>
    <div v-if="activity.pluginUrl" style="margin: 20rpx;color: blue">
      <p @click="seePluginUrl">点击查看附件</p>
    </div>
    <div>
      <button @click="submit" type="primary">提交</button>
      <!--<button @click="returnPage" type="primary" style="width: 100px">返回</button>-->
    </div>
  </div>
</template>

<script>
  export default {
    data(){
      return{
        activity:{},
        time:""
      }
    },
    methods:{

      // returnPage(){
      //   let str = JSON.stringify(this.activity)
      //   wx.redirectTo({
      //     url:"../application_createActivity/main?activity="+str
      //   })
      // },

      getTime(){
        var taht=this;
        var timestamp = Date.parse(new Date());
        var date = new Date(timestamp);
        var Y =date.getFullYear();
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
        var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
        taht.time=Y + '年'  + M+ '月' + D+ '日'
      },
      submit(){
        var that = this;
        that.activity.activitySponsorId = that.$store.state.wxUserInfo.partyId;

        wx.request({
          url:'http://localhost:8090/ServiceVolunteerActivity/insertActivity',
          data: that.activity,
          method:'POST',
          header:{
            'content-type': 'application/json'
          },
          success:function (res) {
            wx.showModal({
              title: '提示',
              content: '活动审核中，请耐心等待',
              showCancel:false,
              confirmText:'确定',
              success: function (res) {
                wx.switchTab({
                  url: '../application/main'
                })
              }
            })
          }
        });

        // console.log(this.activity)
      },
      seePluginUrl(){
        var taht=this;
        let filename=taht.activity.pluginUrl;
        if(!filename){
          return false
        };
        let a = filename.split('').reverse().join('');
        let b = a.substring(0,a.search(/\./)).split('').reverse().join('');
        wx.downloadFile({
          url: taht.activity.pluginUrl, // 后台返回的地址。
          success: function (res) {
            var filePath = res.tempFilePath; // 小程序中文件的临时文件
            console.log(filePath);
            wx.openDocument({
              filePath: filePath,
              // 文档打开格式记得写上，否则可能不能打开文档。 文档类型只能是一个
              // 若是想打开多种类型的文档，可以解析文档地址中的文档格式，动态复制到fileTpye参数
              fileType: b,
              success: function (res) {
                console.log('打开文档成功')
              },
              fail: (e) => {
                console.log(e);
              }
            })
          }
        })
      }
    },
    onLoad:function(options) {
      this.getTime();
      this.activity=JSON.parse(decodeURIComponent(options.activity));
      this.activity.activitySponsorId=this.$store.state.wxUserInfo.partyId;
      this.activity.organizationId=this.$store.state.globalOrganizationPosition.organizationId;
    }
  };
</script>
<style>
  page{
    background: #f2f1ed;
  }
</style>
<style scoped>
  .image{
    width: 90%;
    margin-top:20rpx;
  }
  .previewDiv{
    width:100%;
    margin-top: 35rpx;
    /*display:flex;*/
    /*flex-direction:column;*/
    /*align-items:center;*/
  }
</style>
