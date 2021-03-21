<template>
  <div style="height: 100%;width: 100%">
    <div class="main">
      <span class="topic">个人信息</span>
      <span style="margin: -10px 0 45px 260px;color: dodgerblue" @click="submit">提交</span>
      <div class="info-part">
        <label class="show-label">类型</label>
        <input type="text" class="input-info" v-model="Info.isSecretary" disabled="disabled">
      </div>
      <div class="info-part">
        <label class="show-label">类别</label>
        <input type="text" class="input-info" v-model="Info.type" disabled="disabled">
      </div>
      <div class="info-part">
        <label class="show-label">姓名</label>
        <input type="text" class="input-info" v-model="Info.name" disabled="disabled">
      </div>
      <div class="info-part">
        <label class="show-label">学号/工号</label>
        <input type="text" class="input-info" v-model="Info.studentJobNumber" disabled="disabled">
      </div>
      <div class="info-part">
        <label class="show-label">我的组织</label>
        <picker @change="bindPickerOrganizationChange" :data-selecthx="myOrganizations[pickerOrganizationIndex].organizationName"
        :range="myOrganizations" :range-key="'organizationName'" :value="myOrganizations[pickerOrganizationIndex]">
          <span class="input-info">{{showOrganization}}</span>
        </picker>
      </div>
      <div class="info-part">
        <label class="show-label">职务</label>
        <picker @change="bindPickerPositionChange" :data-selecthx="positions[pickerPositionIndex].positionName"
        :range="positions" :range-key="'positionName'" :value="positions[pickerPositionIndex]">
          <span class="input-info">{{showPosition}}</span>
        </picker>
      </div>
      <div class="info-part">
        <label class="show-label">联系方式</label>
        <input type="text" class="input-info" v-model="Info.telNumber" disabled="disabled">
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: "personalInfo",
    data(){
      return{
        Info:{},
        myOrganizations:[],
        myOrganization:{},
        positions:[],
        position:{},
        pickerOrganizationIndex:0,
        pickerPositionIndex:0,
        showOrganization:'',
        showPosition:'',
        globalOrganizationPosition:{},
      }
    },
    methods:{
      submit(){
        //修改职务组织信息到全局变量
        this.$store.commit('insertOrganizationPosition', this.globalOrganizationPosition);
        wx.showToast({
          title:'切换成功',
          icon:'success',
          success:function() {
            setTimeout(function() {
              wx.switchTab({
                url:'../firstView/main'
              })
            },2000)
          }
        })
      },
      bindPickerOrganizationChange:function(e) {
        //组织修改存全局变量
        this.pickerOrganizationIndex = e.target.value;
        this.showOrganization = this.myOrganizations[this.pickerOrganizationIndex].organizationName;
        this.globalOrganizationPosition.organizationId = this.myOrganizations[this.pickerOrganizationIndex].organizationId;
        this.globalOrganizationPosition.organizationName = this.myOrganizations[this.pickerOrganizationIndex].organizationName;
      },
      bindPickerPositionChange:function(e) {
        //职位修改存全局变量
        this.pickerPositionIndex = e.target.value;
        this.showPosition=this.positions[this.pickerPositionIndex].positionName;
        this.globalOrganizationPosition.positionId = this.positions[this.pickerPositionIndex].positionId;
        this.globalOrganizationPosition.positionName = this.positions[this.pickerPositionIndex].positionName;
      }
    },
    onLoad:function() {
      var that = this;
      wx.request({
        //通过openId查询信息
        url:'http://localhost:8090/sysWxUser/selectByOpenId?openId='+this.$store.state.userInfo.openId,
        method: "Get",
        success:function(res) {
          // console.log(res.data.data);
          that.Info.isSecretary = res.data.data.isSecretary;
          that.Info.type=res.data.data.type;
          that.Info.name=res.data.data.name;
          that.Info.studentJobNumber = res.data.data.studentJobNumber;
          that.Info.telNumber = res.data.data.telNumber;
          that.organizationPosition = res.data.data.organizationPosition;
          that.showOrganization = res.data.data.organizationPosition[0].organizationName;
          that.showPosition = res.data.data.organizationPosition[0].positionName;
          for (var i = 0; i < res.data.data.organizationPosition.length; i++){
            //将组织和职务分开
            that.myOrganization.organizationId = res.data.data.organizationPosition[i].organizationId;
            that.myOrganization.organizationName = res.data.data.organizationPosition[i].organizationName;
            that.myOrganizations.push(that.myOrganization);
            that.myOrganization = {};
            that.position.positionId = res.data.data.organizationPosition[i].positionId;
            that.position.positionName = res.data.data.organizationPosition[i].positionName;
            that.positions.push(that.position);
            that.position = {};
          }
        }
      })
    }
  };
</script>
<style>
  page{
    height: 100%;
  }
</style>
<style scoped>
  .main{
    width: 100%;
    height: 100%;
    background-color: #f9f6ff;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .topic{
    font-size: 25px;
    /*margin-bottom: 45px;*/
    font-weight: bolder;
  }
  .info-part{
    width: 90%;
    height: 45px;
    background-color: white;
    margin-bottom: 10px;
    border-bottom: 1px solid lightgrey;
    border-top: 1px solid lightgrey;
    display: flex;
    align-items: center;
    margin-bottom: 15px;
  }
  .show-label{
    margin-left: 12px;
  }
  .input-info{
    margin-left: 25px;
  }
</style>
