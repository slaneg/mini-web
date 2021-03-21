<template>
  <div class="mainStyle">
    <div class="step">
      <img src="../../../static/images/stepOk.png"/><span  class="notStepSpan">转组织申请</span>
    </div>
    <div class="step">
      <img src="../../../static/images/line12.png"/></div>
    <div class="step">
      <img  :src="step2"/><span >当前所在党支部管理人审核</span>
    </div>
    <div class="step">
      <img  :src="line23"/>
    </div>
    <div class="step">
      <img :src="step3"><span class="notStepSpan">移交党支部管理人审核</span>
    </div>
  </div>
</template>

<script>
  import request from "../../tools/service";

  export default {
    name: "index",
    data(){
      return{
        state:false,
        step2:"",
        line23:"",
        step3:"",
      }
    },
    methods:{
      async getState(){
        let url='/ServiceChangeOrganization/getState';
        let data={partyId:this.$store.state.wxUserInfo.partyId};
        let result = await request.demand(url, data,'Get');
        if(result==1){
          this.step2="/static/images/stepOk.png";
          this.line23="/static/images/line12.png";
          this.step3="/static/images/step3Y.png"
        }else{

          this.step2="/static/images/step2.png";
          this.line23="/static/images/line23.png";
          this.step3="/static/images/step3.png"
        }


      }
    },
    mounted() {
      this.getState()
    }
  };
</script>

<style scoped>
  img{
    width: 64rpx;
    height: 64rpx;
  }
  .mainStyle{
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    padding-left: 46rpx;
    padding-top: 30rpx;
  }
  .notStepSpan{

    color: rgba(0, 0, 0, 0.447059);
  }
  span{
    padding-left: 20rpx;
    font-size: 28rpx;
    display: flex;
    align-items: center;
  }
  img{
    width: 64rpx;
    height: 64rpx;
    padding: 10rpx;
  }
  .step{
    display: flex;
  }

</style>
