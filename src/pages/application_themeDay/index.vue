<template >
  <div  class="mainStyle">
    <div class="index" v-if="length<7">
      <div v-for="item in tableData" :key="item.id" >
        <div style="display: flex;border-bottom: aqua 1px dashed" @click="goText(item.id)">
          <div class="Article-main">
            <div class="title"><span>{{item.month}}月|{{item.title}}</span></div>
            <div class="time">{{item.releaseTime}}</div>
            <div class="owner">{{item.organizationName}}</div>
          </div>
          <div class="Article-img">
            <img :src="img" style="width: 160rpx;height: 160rpx">
          </div>
        </div>
      </div>
    </div>
    <div v-else class="index" >
      <swiper vertical="true" display-multiple-items="6"  class="index" >
        <div v-for="item in tableData" :key="item.id">
          <swiper-item item-id="item.id"  @click="goText(item.id)">
            <div style="display: flex;border-bottom: aqua 1px dashed">
              <div class="Article-main">
                <div class="title"><span>{{item.month}}月|{{item.title}}</span></div>
                <div class="time">{{item.releaseTime}}</div>
                <div class="owner">{{item.organizationName}}</div>
              </div>
              <div class="Article-img">
                <img :src="img" style="width: 160rpx;height: 160rpx">
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
        img:"/static/images/u1135.png",
        tableData:[],
        length:0
      }
    },
    methods:{
      async getTableData(){
        var url='/serviceThemeDay/selectAllThemeDay';
        let data={
          organizationId:this.$store.state.globalOrganizationPosition.organizationId
        };
        let result = await request.demand(url,data);
        this.tableData=result.data;
        for(var i =0;i<this.tableData.length;i++){
          this.tableData[i].title=this.tableData[i].title.substr(0,8)+"..."
        }
        this.length=result.data.length;
      },
      goText:function(id) {
        var url="../article/main?id="+id;
        wx.navigateTo({url})
      },
    },
    mounted(){
      this.getTableData()
    }
  };
</script>
<style>
  page{
    background:#facd9131;
    height: 100%;
  }
</style>
<style scoped>
  .mainStyle{
    display: flex;
    flex-direction:column;
    width: 750rpx;
    height: 100%;
  }

  .index{
    display: flex;
    flex-direction: column;
    width: 750rpx;
    height: 100%;
  }
  .Article-main{
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    width: 500rpx;
    padding-left: 40rpx;
  }
  .Article-img{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 200rpx;
    height: 200rpx;

  }
  .title{
    width: 450rpx;
    height: 115rpx;
    font-size: 35rpx;
    display: flex;
    align-items: center;
    font-family: "Microsoft Tai Le Bold","Microsoft Tai Le Regular","Microsoft Tai Le";

  }
  .time{
    width: 220rpx;
    height: 50rpx;
    font-size: 26rpx;
    color: RGB(135,135,138);
  }
  .owner{

    height: 50rpx;
    font-size: 26rpx;
    color: RGB(135,135,138);
  }
</style>
