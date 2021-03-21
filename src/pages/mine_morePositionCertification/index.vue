<template>
    <div class="container" v-if="haveAudited==0">
      <!--显示组织职务-->
      <div class="show-organization-position">
          <p>您已有组织和职务:</p>
        <div v-for="item in have" class="show-detail">
          <span >{{item.organizationName}}----{{item.positionName}}</span><br><br>
        </div>
      </div>

      <!--输入组织职位-->
      <div class="input-organization-position">
        <p class="logo">多组织职务认证</p>

        <div class="organization-logo">
          <label>&nbsp&nbsp&nbsp&nbsp&nbsp组织:</label>
          <picker @change="bindPickerOrganizationChange" :data-selecthx="organizations[pickerOrganizationIndex].organizationName" :range="organizations" :range-key="'organizationName'"
                  :value="organizations[pickerOrganizationIndex]">
            <span>&nbsp&nbsp{{showOrganization}}&nbsp&nbsp</span>
          </picker>
        </div>
        <div class="organization-logo">
          <label>&nbsp&nbsp&nbsp&nbsp&nbsp职务:</label>
          <picker @change="bindPickerPositionChange" :data-selecthx="positions[pickerPositionsIndex].name" :range="positions" :range-key="'name'" :value="positions[pickerPositionsIndex]">
            <span>&nbsp&nbsp{{showPosition}}&nbsp&nbsp</span>
          </picker>
        </div>
      </div>

      <!--提交按钮-->
      <div>
        <button class="submit" @click="submit">提交</button>
      </div>
    </div>
    <div v-else>
      <img src="/static/images/waiting.png">
    </div>
</template>

<script>
  export default {
    name: "index",
    data(){
      return{
        Info:{},
        organizations:[{}],
        positions:[{}],
        showOrganization:'请选择组织',
        showPosition:'请选择职务',
        pickerPositionsIndex:0,
        pickerOrganizationIndex:0,
        have:[],
        haveAudited:'',//是否有正在审核的认证消息
        same:false
      }
    },
    methods:{
      bindPickerPositionChange:function(e) {
        //获取职务数组下标
        this.pickerPositionsIndex = e.target.value;
        //打印数组下标为this.pickerPositionIndex下的职务的id

        //赋值给Info的positionId属性
        this.Info.postId = this.positions[this.pickerPositionsIndex].id;
        this.showPosition = this.positions[this.pickerPositionsIndex].name;
      },
      bindPickerOrganizationChange:function(e) {
        //组织
        this.pickerOrganizationIndex = e.target.value;
        this.Info.organizationId = this.organizations[this.pickerOrganizationIndex].organizationId;
        this.showOrganization = this.organizations[this.pickerOrganizationIndex].organizationName;
      },
      insert(){
        var that = this;
        //添加多职务认证的信息
        wx.request({
          url:'http://localhost:8090/sysWxUserOrgPost/insert',
          data:this.Info,
          method:'Post',
          header:{
            "Content-Type": "application/json"
          },
          success:function() {
            that.showOrganization = '';
            that.showPosition = '';
            wx.showToast({
              title:'审核中，耐心等待',
              duration:2000,
              icon:'success',
              success:function() {
                setTimeout(function() {
                  wx.switchTab({
                    url:'../firstView/main'
                  })
                },2000)
              }
            });
          }
        })
      },
      submit(){
        let that = this;
        this.Info.isAudited = 0;
        this.Info.wxUserId = this.$store.state.userInfo.openId;
        //在认证之前进行职务认证的核对，核对是否已经认证过这个职务了

        for (var i = 0; i < that.have.length; i++){
          if (this.Info.organizationId==that.have[i].organizationId &&this.Info.postId==that.have[i].positionId){
            that.same = true
          }
        }

        if (that.same){
          wx.showToast({
            title:'该职务已经认证，请勿重复认证',
            success:function() {
              setTimeout(function() {
                wx.switchTab({
                  url:'../mine_morePositionCertification/main'
                })
              },2000)
            }
          })
          that.same = false;
        }else {
          that.insert();
        }

        // wx.request({
        //   url:'http://localhost:8090/sysWxUserOrgPost/checkIsAudited',
        //   data:that.Info,
        //   method:'Get',
        //   success:function(res) {
        //     if (res.data.data!=null){
        //       wx.showToast({
        //         title:'该职务已经认证，请勿重复认证',
        //         success:function() {
        //           setTimeout(function() {
        //             wx.switchTab({
        //               url:'../mine_morePositionCertification/main'
        //             })
        //           },2000)
        //         }
        //       })
        //     }else {
        //       //没有重复认证的话就直接添加认证
        //       that.insert();
        //     }
        //   }
        // });
      }

    },
    onLoad:function(options) {
      var that = this;

      //查看是否有正在认证的消息 通过openId 和认证状态来查找
      wx.request({
        url:'http://localhost:8090/sysWxUserOrgPost/checkAuditing',
        data:{
          wxUserId:that.$store.state.userInfo.openId,
          isAudited:0
        },
        method:'Get',
        success:function(res) {
          // console.log(res.data.data);
          if (res.data.data!=null){
            that.haveAudited=1
          }else {
            that.haveAudited=0;

            
            //获取组织
            wx.request({
              url:'http://localhost:8090/organizational/getOrganizations',
              method:'Get',
              success:function(res) {
                that.organizations = res.data.data
                // console.log(res.data.data)
              }
            });

            //获取所有职位
            wx.request({
              url:'http://localhost:8090/sysPost/selectPosts',
              method: "Get",
              success:function(res) {
                that.positions = res.data.data
                // console.log(res.data.data)
              }
            })

            //获取用户的已经认证的组织和职务,isAudited=1
            wx.request({
              url:'http://localhost:8090/sysWxUserOrgPost/selectAllOrganizationPosition',
              data:{
                wxUserId:that.$store.state.userInfo.openId,
                isAudited:1
              },
              method:'Get',
              header:{
                "Content-Type": "application/json"
              },
              success:function(res) {
                console.log(res.data.data);
                that.have = res.data.data
              }
            })
          }
        }
      });
    }
  };
</script>
<style>
  page{
    height: 100%;
  }
</style>
<style scoped>
.container{
  width: 98%;
  height: 100%;
  background-color: #f9f6ff;
  padding-left: 1%;
  padding-right: 1%;
}
  .show-organization-position{
    padding-top: 20px;
  }
  .show-organization-position p{
    margin-bottom: 10px;
  }
  .show-detail{
    margin-bottom: 5px;
  }
  .input-organization-position{
    margin-top: 30px;
    width: 100%;
    text-align: center;
    height: 200px;
  }
  .input-organization-position label{
    color: #ff9328;
  }
  .logo{
    font-size: 30px;
    font-weight: bolder;
    color: red;
    margin-bottom: 40px;
  }
.organization-logo{
  display: flex;
  height: 50px;
  align-items: center;
  margin-bottom: 30px;
  background-color: white;
  border-radius: 10px;
}
.submit{
  width: 100%;
  margin-top: 100px;
  background-color: dodgerblue;
  color: white;
}
</style>
