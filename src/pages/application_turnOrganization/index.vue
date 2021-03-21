<template>
  <div class="page">
    <div class="info"><span>姓名</span><label>
      <input v-model="name" disabled class="inputClass"/></label></div>
    <div class="info"><span>性别</span><label>
     <input v-if="sex=='1'" value="男"  disabled class="inputClass"/>
      <input v-else value="女"  disabled class="inputClass"/>
    </label></div>
    <div class="info"><span>出生日期</span><label>
      <div>
        <picker
          mode="date"
          start="1900-01-01" end="2100-01-01" @change="bindTimeChange">
          <p v-if="!bitrh" style="color: #CACACA ">2000-01-01</p>
          <p v-else>
            {{bitrh}}
          </p>
        </picker>
      </div>
    </label></div>
    <div class="info"><span>民族</span><label>
      <input v-model="userNation"  class="inputClass"/>
    </label></div>
    <div class="info"><span>工号/学号</span><label>
      <input v-model="partyId" disabled class="inputClass"/>
    </label></div>
    <div class="info"><span>原党支部</span><label>
      <input v-model="academy" disabled class="inputClass"/>
    </label></div>
    <div class="info"><span>移交党支部</span>
      <div>
        <picker
          mode="selector"
          :range="newTheme"
          @change="pickNewTheme">
          <p v-if="!newAcademy" style="color: #CACACA ">选择移交党支部</p>
          <p v-else>
            {{newAcademy}}
          </p>
        </picker>
      </div>
    </div>
    <div  class="info" style="margin-top: 102rpx;height: 174rpx;align-items: flex-start;justify-content: center">
      <textarea placeholder="请输入转移原因" v-model="changeReason" class="reason"></textarea>
    </div>
    <button @click="submitInfo()" v-if="!isSubmit">提交</button>
    <button @click="jumpTo('../application_turnProgress/main')" v-else >查看进度</button>
  </div>
</template>

<script>
  import request from '../../tools/service'
  export default {
    name: "index",
    data(){
      return{
        newTheme:[],
        isSubmit:false,
        name:this.$store.state.wxUserInfo.name,
        sex:this.$store.state.wxUserInfo.sex,
        partyId:this.$store.state.wxUserInfo.studentJobNumber,
        academy:this.$store.state.globalOrganizationPosition.organizationName,
        newAcademy:'',
        isChangeing:false,
        userNation:'',
        bitrh:'',
        changeReason:'',
      }

    },
    methods:{
      async getThemes(){
        let url='/ServiceChangeOrganization/getTheme';
        let data={};
        let result = await request.demand(url, data,'GET');
        this.newTheme = result.data;
      },

      //获取原支部
      // async getAcademy(){
      //   let url='/ServiceChangeOrganization/getThemeName';
      //   let data={partyId:this.$store.state.wxUserInfo.partyId,
      //     organizationId:this.$store.state.globalOrganizationPosition.organizationId,
      //     postId:this.$store.state.globalOrganizationPosition.positionId}
      //   let result = await request.demand(url, data,'GET');
      //   this.academy = result;
      // },

      async submitInfo(){
        if(this.userNation==""){
          wx.showToast({
            title: "请填写名族信息",
            icon:"none"
          });
        }else if(!this.newAcademy||!this.bitrh){
          wx.showToast({
            title: "请选择出生日期和移交目标支部",
            icon:"none"
          });
        }else{
          let url='/ServiceChangeOrganization/insertChangeOrganization';
          let data={
            userNumber:this.$store.state.wxUserInfo.studentJobNumber,
            userName:this.$store.state.wxUserInfo.name,
            userSex:this.$store.state.wxUserInfo.sex,
            orginOrganizationId:this.academy,
            targetOrganizationId:this.newAcademy,
            userNation:this.userNation,
            changeReason:this.changeReason,
            birthday:this.bitrh
          };
          let result = await request.demand(url, data,'POST');
          this.isSubmit = result.data;
          if(this.isSubmit){
            wx.showToast({
              title: "提交成功",
              icon:"success"
            });
          }else{
            wx.showToast({
              title: "提交失败",
              icon:"loading"
            });
          }
        }

      },
      bindTimeChange(e) {
        this.bitrh = e.mp.detail.value
      },
      pickNewTheme(e){
        this.newAcademy=this.newTheme[e.mp.detail.value]
      },
      jumpTo(url){
        wx.navigateTo({
          url:url
        })
      }

    },
    mounted(){

      this.getThemes();
      this.name=this.$store.state.wxUserInfo.name;
      this.sex=this.$store.state.wxUserInfo.sex;
      this.partyId=this.$store.state.wxUserInfo.studentJobNumber;
      this.academy=this.$store.state.globalOrganizationPosition.organizationName;
    },

  };
</script>

<style scoped>
  .page{
    background-color:  RGB(245,245,249);
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .info{
    display: flex;
    align-items: center;
    width: 94%;
    background-color: white;
    border:1px solid  rgb(228, 228, 228);
    height: 90rpx;
    margin-bottom: 24rpx;
  }
  span{
    width: 200rpx;
    color:#CACACA ;
    font-size: 34rpx;
    padding-left: 34rpx;
  }
  picker{
    width: 280rpx;
    text-align: center;
  }
  .inputClass{

    text-align: center;
  }
  button{
    width: 94%;
    background-color: #118EE9;
    color: white;
  }
  .reason{
    height: 100%;
  }


</style>
