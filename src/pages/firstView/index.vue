<template >
  <div  class="mainStyle">
    <div class="topSelect">
      <div ><span v-bind:class="{selected:isSelected1, notselect:notselect1}" @click="select1()" >基层风采</span></div>
      <div ><span v-bind:class="{selected:isSelected2, notselect:notselect2}" @click="select2()" >党员先锋</span></div>
      <div><span  v-bind:class="{selected:isSelected3, notselect:notselect3}" @click="select3()" >党校培训</span></div>
    </div>
    <div class="index" v-if="length<6">
      <div v-for="(item,index) in tableData" :key="item.id">
        <div style="display: flex;border-bottom: lavender 1px dashed;padding-left: 20rpx;padding-right: 20rpx;" @click="goText(item.id,index)">
          <div class="Article-main">
            <div style="display: flex;align-items: center;">
              <div class="title">{{item.title}}</div>
              <div class="istop" v-if="!istrain&&item.topSort==0">置顶</div>
            </div>
            <div style="display: flex">
              <div class="time" v-if="istrain">{{item.publishTime}}</div>
              <div class="time" v-else>{{item.checkTime}}</div>
              <div class="owner" v-if="istrain">{{item.editorName}}</div>
              <div class="owner" v-else>{{item.organizationName}}</div>
            </div>
          </div>
          <div class="Article-img" v-if="item.picUrl!=null&&item.picUrl!=''">
            <img :src="item.picUrl" style="width: 160rpx;height: 160rpx">
          </div>
        </div>
      </div>
    </div>
    <div v-else class="index" >
      <swiper vertical="true" display-multiple-items="5"  class="index" >
        <div v-for="(item,index) in tableData" :key="item.id">
          <swiper-item item-id="item.id"  @click="goText(item.id,index)">
            <div style="display: flex;border-bottom: lavender 1px dashed;padding-left: 20rpx">
              <div class="Article-main">
                <div class="title">{{item.title}}</div>
                <div class="time" v-if="istrain">{{item.publishTime}}</div>
                <div class="time" v-else>{{item.checkTime}}</div>
                <div class="owner" v-if="istrain">{{item.editorName}}</div>
                <div class="owner" v-else>{{item.organizationName}}</div>
              </div>
              <div class="Article-img">
                <img :src="item.picUrl" style="width: 160rpx;height: 160rpx">
              </div>
            </div>
          </swiper-item>
        </div>
      </swiper>
    </div>

  </div>

</template>

<script>
  import request from '../../tools/service'
  export default {
    name: "index",
    data(){
      return{
        isSelected1:true,
        isSelected2:false,
        isSelected3:false,
        notselect1:false,
        notselect2:true,
        notselect3:true,
        tableData:[],
        list:[],
        type:1,
        length:0,
        istrain:false,
      }
    },
    methods:{
      async getTableData(type){
        let data;
        let url='/dynamicArticleManagement/selectArticleBySource';
        if(this.$store.state.globalOrganizationPosition==null||this.$store.state.globalOrganizationPosition==''){
          data={
            source:type,
            organizationId:'2477224e1f9d47acb2813047371b81a1'
          }
        }else{
          data={
            source:type,
            organizationId:this.$store.state.globalOrganizationPosition.organizationId
          }
        }
        let result = await request.demand(url,data);
        this.tableData=result.data;
        this.length=result.data.length;
      },
      async getTrain(){
        let url='/dynamicTrainManagement/selectTrainAll';
        let data={};
        let result = await request.demand(url,data);
        this.tableData=result.data;
        this.length=this.tableData.length;
      },
      goText:function(id,index) {
        let url;
        if(this.type==1){
          for(let i=0;i<this.length;i++){
            let temp={id:this.tableData[i].id,title:this.tableData[i].title}
            this.list.push(temp)
          }
          this.list=JSON.stringify(this.list);
          //基层风采
          url='../firstView_basicStyle/main?id='+id+'&&index='+index+'&&list='+this.list;

        }else if(this.type==2){
          //党员先锋
          for(let i=0;i<this.length;i++){
            let temp={id:this.tableData[i].id,title:this.tableData[i].title}
            this.list.push(temp)
          }
          this.list=JSON.stringify(this.list);
          //党员先锋
          url='../firstView_pioneer/main?id='+id+'&&index='+index+'&&list='+this.list;
        }else if(this.type==3){
          //党校培训
          url='../firstView_partyTraining/main?id='+id;
        }
        wx.navigateTo ({url})
        this.list=[];
      },
      select1(){
        this.type=1;
        this.istrain=false;
        this.getTableData(1);
        this.isSelected1=true;
        this.isSelected2=false;
        this.isSelected3=false;
        this.notselect1=false;
        this.notselect2=true;
        this.notselect3=true;
      },
      select2(){
        this.type=2;
        this.istrain=false;
        this.getTableData(2);
        this.isSelected1=false;
        this.isSelected2=true;
        this.isSelected3=false;
        this.notselect1=true;
        this.notselect2=false;
        this.notselect3=true;
      },
      select3(){
        this.type=3;
        this.istrain=true;
        this.getTrain();
        this.isSelected1=false;
        this.isSelected2=false;
        this.isSelected3=true;
        this.notselect1=true;
        this.notselect2=true;
        this.notselect3=false;
      },
    },
    mounted(){
      this.select1();
    },
    // onLoad:function() {
      // var that = this;
      // //获取党员id及微信用户的所有信息
      // wx.request({
      //   url:'http://localhost:8090/sysWxUser/selectById?id='+this.$store.state.userInfo.openId,
      //   method:'Get',
      //   success:function(res) {
      //     //通过partId查询组织职务id
      //     wx.request({
      //       url:'http://localhost:8090/sysWxUserOrgPost/selectOrganizationPosition?openId='+that.$store.state.userInfo.openId,
      //       method:'Get',
      //       success:function(res) {
      //         // console.log(res.data.data);
      //         that.$store.commit('insertOrganizationPosition', res.data.data);
      //         that.select1();
      //
      //       },
      //
      //     });
      //     that.$store.commit('insertWxUserInfo', res.data.data);
      //   }
      // });

   // }
  };
</script>

<style>
  page{
    background: #FEF6EB;
    height: 100%;
  }
</style>
<style scoped>
  .mainStyle{
    display: flex;
    flex-direction:column;
    width: 750rpx;
    height: 100%;
    background-color:#FEF6EB

  }
  .topSelect{
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
  .index{
    display: flex;

    flex-direction: column;
    width: 750rpx;
    height: 100%;
  }
  .Article-main{
    display: flex;
    flex-direction: column;
    height: 200rpx;
  }
  .Article-img{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 28%;
    height: 200rpx;
  }
  .title{
    /*width: 430rpx;*/
    height: 130rpx;
    font-size: 35rpx;
    display: flex;
    align-items: center;
    font-family: 黑体;

  }
  .time{
    width: 220rpx;
    height: 60rpx;
    font-size: 26rpx;
    color: RGB(135,135,138);
  }
  .owner{

    height: 60rpx;
    font-size: 26rpx;
    color: RGB(135,135,138);
  }
  .istop{
    font-weight: 400;
    font-size: 26rpx;
    border-radius: 30rpx;
    padding-left: 14rpx;
    padding-right: 5rpx;
    padding-bottom: 8rpx;
    padding-top: 6rpx;
    background-color: #D9001B;
    margin-left: 5rpx;
    color: yellow;
    width: 66rpx;
  }
</style>
