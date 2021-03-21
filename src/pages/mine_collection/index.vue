<template >
  <div  class="mainStyle">
    <div class="index" v-if="length<7">
      <div v-for="(item,index)  in tableData" :key="item.messageId" >
        <div style="display: flex;border-bottom: lavender 1px dashed" @click="goText(item.messageId,index)">
          <div class="Article-main">
            <div class="title"><span>{{item.title}}</span></div>
            <div class="time">{{item.checkTime}}</div>
          </div>
          <div class="Article-img">
            <img :src="item.picUrl" style="width: 160rpx;height: 160rpx">
          </div>
        </div>
      </div>
    </div>
    <div v-else class="index" >
      <swiper vertical="true" display-multiple-items="6"  class="index" >
        <div v-for="(item,index)  in tableData" :key="item.messageId">
          <swiper-item item-id="item.messageId"  @click="goText(item.messageId,index)">
            <div style="display: flex;border-bottom: aqua 1px dashed">
              <div class="Article-main">
                <div class="title"><span>{{item.title}}</span></div>
                <div class="time">{{item.checkTime}}</div>
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

    data(){
      return{
        length:1,
        tableData:[],
        list:[],
      }
    },
    methods:{
      async getTableData(){
        var url='/WxUserCollect/selectAll';
        let data={id:this.$store.state.wxUserInfo.partyId};
        let result = await request.demand(url,data);
        this.tableData=result.data;
        this.length=this.tableData.length;
        for (var i=0;i<this.length;i++) {
          this.tableData[i].checkTime=this.tableData[i].checkTime.substr(0,10)
        }
      },
      goText:function(id,index) {
        for(let i=0;i<this.length;i++){
          let temp={id:this.tableData[i].messageId,title:this.tableData[i].title}
          this.list.push(temp)
        }
        this.list=JSON.stringify(this.list);
        let url='../firstView_basicStyle/main?id='+id+'&&index='+index+'&&list='+this.list;
        this.list=[];
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
    background: #f2f1ed;
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
    height: 200rpx;
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
    height: 130rpx;
    font-size: 35rpx;
    display: flex;
    align-items: center;
    font-family: "Microsoft Tai Le Bold","Microsoft Tai Le Regular","Microsoft Tai Le";

  }
  .time{
    width: 235rpx;
    height: 60rpx;
    font-size: 28rpx;
    color: RGB(135,135,138);
  }

</style>
