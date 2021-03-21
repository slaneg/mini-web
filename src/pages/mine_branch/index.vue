<template>

  <div class="container">
  待开发
    <!--循环组织-->
       <div v-for="(first,index) in firstRank" class="organization1">
        <span style="font-size: 20px;font-weight: bolder;">{{first.organizationName}}</span>
        <!--循环职务-->
        <div v-for="(fir,index1) in first.organizationMemberList">
          <span>{{fir.post}}---------</span>
          <!--循环名称-->
          <span v-for="(fir1,index2) in first.organizationMemberList" >
            <span v-if="fir.post==fir1.post">{{fir1.name}}&nbsp&nbsp</span>
          </span>
        </div>
      </div>
    <div class="part"></div>


    <div v-for="(second ,index) in secondRank" class="organization2">
      <span style="font-size: 20px;font-weight: bolder;">{{second.organizationName}}</span>
      <div v-for="(sec,index1) in second.organizationMemberList">
        <span>{{sec.post}}---------</span>
        <span v-for="(sec1,index2) in second.organizationMemberList" >
            <span v-if="sec.post==sec1.post">{{sec1.name}}&nbsp&nbsp</span>
          </span>
      </div>
      <div class="part"></div>
    </div>
    <div v-for="(third,index) in thirdRank" class="organization3">
      <span style="font-size: 20px;font-weight: bolder;">{{third.organizationName}}</span>
      <div v-for="(thi,index2) in third">
        <span>{{thi.post}}</span>
      </div>
    </div>
  </div>
</template>
<script>
  export  default {
    name:'index',
    data(){
      return{
        firstRank:[],
        secondRank:[],
        thirdRank:[],
        showIndex:0,
        branch:[
          // {branchName:'重庆理工大学支部',value:[
          //     {position:'委员',name:'包嵩'},
          //     {position:'书记',name:'包嵩'},
          //     {position:'书',name:'bb'}
          //   ],rank:1},
          // {branchName:'两江支部',value:[
          //     {position:'委员',name:'包嵩'},
          //     {position:'书记',name:'包嵩'},
          //     {position:'党员',name:'包嵩'},
          //     {position:'副书记',name:'包嵩'},
          //   ],rank:2},
          // {branchName:'两江人工智能支部',value:[
          //     {position:'委员',name:'包嵩'},
          //     {position:'书记',name:'包嵩'},
          //     {position:'党员',name:'包嵩'},
          //     {position:'副书记',name:'包嵩'},
          //   ],rank:2},
          // {branchName:'教工支部',value:[
          //     {position:'炊事',name:'包子'},
          //     {position:'炊事班',name:'包子'},
          //     {position:'炊事班班长',name:'包子'}
          //   ],rank:3}
        ]
      }
    },
    methods:{
      clicked:function(e) {
        if (this.showIndex!=e.target.value){
          this.showIndex = e.target.value;
        }else {
          this.showIndex = 0;
        }

      }
    },
    created:function() {
      // var that = this;
      // wx.request({
      //   url:'http://localhost:8090/organizational/selectAllOrganization',
      //   method:'Get',
      //   success:function(res) {
      //     that.branch = res.data.data;
      //     for (var i = 0;i<that.branch.length;i++){
      //       if (that.branch[i].rank==1){
      //         that.firstRank.push(that.branch[i])
      //         console.log(that.firstRank)
      //       }
      //       if (that.branch[i].rank==2){
      //         that.secondRank.push(that.branch[i])
      //         console.log(that.secondRank)
      //       }
      //       if(that.branch[i].rank==3) {
      //         that.thirdRank.push(that.branch[i])
      //       }
      //     }
      //   }
      // })
    }
  }
</script>

<style>
  page{
    height: 100%;
  }
</style>
<style scoped>
  *{
    margin: 0;
    padding: 0;
  }
.container{
  padding-left: 2%;
  width: 98%;
  height: 100%;
  background-color: #f2f1ed;
  display: flex;
  flex-direction: column;
}
  .organization1{
    background-color: #ff7d23;
    border-radius: 5px;
  }
  .organization2{
    background-color: #ffa84a;
    border-radius: 5px;
  }
  .organization3{
    background-color: #ffc44e;
    border-radius: 5px;
  }
  .part{
    height: 10px;
    width: 100%;
    background-color: #FFFA62;
  }
</style>
