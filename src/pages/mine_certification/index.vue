<template>
  <div class="main">
    <p class="topic">身份认证</p>
    <div class="main-div">
      <label class="label">类型</label>
        <radio-group class="radio-group" @change="radioChange">
          <label class="radio" v-for="(item, index) in items" :key="item.name">
            <radio :value="item.value"  :checked="item.checked"/> {{item.value}}
          </label>
        </radio-group>
    </div>
    <div class="main-div">
      <label class="label">类别</label>
      <radio-group class="radio-group" @change="radioChangeType">
        <label class="radio" v-for="(item1, index) in items1" :key="item1.name">
          <radio :value="item1.value" :checked="item1.checked"/> {{item1.value}}
        </label>
      </radio-group>
    </div>
    <div class="main-div">
      <label class="input-label">姓名</label>
      <input type="text" class="input-info" v-model.lazy ="Info.name" />
    </div>
    <div class="main-div">
      <label class="input-label">学号/工号</label>
      <input type="text" class="input-info" v-model.lazy="Info.studentJobNumber"/>
    </div>
    <div class="main-div">
      <label class="input-label">我的组织&nbsp&nbsp&nbsp</label>
      <div class="select-college">
        <picker @change="bindPickerOrganizationChange" :data-selecthx="myOrganization[pickerOrganizationIndex].organizationName" :range="myOrganization" :range-key="'organizationName'"
        :value="myOrganization[pickerOrganizationIndex]">
          <span>{{showOrganization}}</span>
        </picker>
      </div>
    </div>
    <div class="main-div">
      <label class="input-label">职务</label>
      <div class="select-college" style="margin-left: 112rpx">
        <picker @change="bindPickerPositionChange" :data-selecthx="positions[pickerPositionsIndex].name" :range="positions" :range-key="'name'" :value="positions[pickerPositionsIndex]">
          <span>{{showPosition}}</span>
        </picker>
      </div>
    </div>
    <div class="main-div">
      <label class="input-label">联系方式</label>
      <input type="text" class="input-info" v-model.lazy="Info.telNumber">
    </div>
    <button class="submit" @click="submit">提交</button>
  </div>
</template>

<script>
  export default {
    name: "check",
    data(){
      return{
        items: [
          {name: 1, value: '书记',checked:false},
          {name: 0, value: '党员',checked:false}
        ],
        items1:[
          {name:0,value:'学生',checked:false},
          {name:1,value:'教师',checked:false}
        ],
        Info:{},
        isFirst:1,
        ss:'1',
        // colleges:[
        //   {id:1,college:"两江人工智能学院"},
        //   {id:2,college:"会计学院"}
        // ],
        // colleges:[],
        pickerIndex:0,
        myOrganization:[
          {id:1,position:"总书记"}
        ],
        showOrganization:'请选择组织',
        showPosition:'请选择职务',
        positions:[
          {id:1,position:"总书记"},
          {id:2,position:"副书记"},
          {id:3,position:"党员"}
        ],
        pickerPositionsIndex:0,
        pickerOrganizationIndex:0,
        isSecretaryString:'',
      }
    },
    methods:{
      //清除信息
      cleanInfo(){
        this.Info={};
        for (var i = 0;i<this.items.length;i++){
          this.items[i].checked=false
        }
        for (var i = 0; i < this.items1.length; i++){
          this.items1[i].checked = false
        }
        this.showOrganization='请选择组织';
        this.showPosition='请选择职务'
      },
      radioChange(e){
        //选择书记打印
        // console.log(e);

        for (var i = 0; i < this.items.length; i++) {
          if (this.items[i].value == e.target.value){
            this.items[i].checked = true
            this.Info.isSecretary = this.items[i].name//获取书记党员的id
          }else {
            this.items[i].checked = false
          }
        }
        this.isSecretaryString = e.target.value//获取书记党员
      },
      radioChangeType(e){
        //选择学生教师打印
        // console.log(e.target.value);
        for (var i = 0; i < this.items1.length;i++){
          if (this.items1[i].value==e.target.value){
            this.items1[i].checked = true
            this.Info.type = this.items1[i].name//获取学生教师
          } else{
            this.items1[i].checked =false
          }
        }

      },
      submit(){
        //判断选的类别和职务是否符合
        var position=this.positions[this.pickerPositionsIndex].name;
        var newPosition = position.substring(position.length-2,position.length);
        if (this.isSecretaryString=='书记'){
          if (newPosition =='书记') {
            this.toInsert();//请求添加接口
          }else {
            wx.showToast({
              title:'请选择和职务相同的类别',
              icon:'none'
            })
          }
        }else{
          if (newPosition=='书记'){
            wx.showToast({
              title:'请选择和职务相同的类别',
              icon:'none'
            })
          } else {
            this.toInsert();
          }
        }

      },
      toInsert(){
        let self = this;
        this.Info.id=self.$store.state.userInfo.openId;//唯一标识
        this.Info.nickname=self.$store.state.userInfo.nickName;//昵称
        this.Info.sex = self.$store.state.userInfo.gender;//性别
        this.Info.avatarurl = self.$store.state.userInfo.avatarUrl;//头像地址
        console.log(this.Info);
        if (this.isFirst == 1){
          //如果是第一次认证
          wx.request({
            url:'http://localhost:8090/sysWxUser/insert',
            data:this.Info,
            method: "Post",
            header: {
              // 'content-type': 'application/x-www-form-urlencoded',
              "Content-Type": "application/json"
            },
            success:function(res) {
              self.cleanInfo();
              if (res.data.message == '认证成功'){

                wx.request({
                  url:'http://localhost:8090/sysWxUser/selectById',
                  data:{
                    id:self.$store.state.userInfo.openId,
                  },
                  method: "Get",
                  header: {
                    'content-type': 'application/json',
                  },
                  success:function(res) {
                    if (res.data.data!=null){
                      self.$store.commit('insertWxUserInfo', res.data.data);
                    }
                  }
                })


                wx.showToast({
                  title:res.data.message,
                  icon:'success',
                  duration:2000,
                  success:function() {
                    setTimeout(function() {
                      wx.switchTab({
                        url:'../firstView/main'
                      })
                    },2000)
                  }
                });
              }else {
                wx.showToast({
                  title:res.data.message,
                  icon:'error',
                  duration:2000,
                  success:function() {
                    setTimeout(function() {
                      wx.switchTab({
                        url:'../firstView/main'
                      })
                    },2000)
                  }
                });
              }
              // console.log(res.data)
            }
          })
        }else{
          //如果是第二次认证
          wx.request({
            url:'http://localhost:8090/sysWxUser/update',
            data:this.Info,
            method: "Post",
            header: {
              // 'content-type': 'application/x-www-form-urlencoded',
              "Content-Type": "application/json"
            },
            success:function(res) {
              self.cleanInfo();
              // console.log(res.data)
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
        }

      },
      bindPickerPositionChange:function(e) {
        //获取职务数组下标
        // console.log(e.target.value)
        this.pickerPositionsIndex = e.target.value;
        //打印数组下标为this.pickerPositionIndex下的职务的id
        // console.log(this.positions[this.pickerPositionsIndex].id)

        //赋值给Info的positionId属性
        this.Info.positionId = this.positions[this.pickerPositionsIndex].id;
        this.showPosition = this.positions[this.pickerPositionsIndex].name;
      },
      bindPickerOrganizationChange:function(e) {
        //组织
        this.pickerOrganizationIndex = e.target.value;
        this.Info.organizationId = this.myOrganization[this.pickerOrganizationIndex].organizationId;
        this.showOrganization = this.myOrganization[this.pickerOrganizationIndex].organizationName;
      }
    },
    create:function(){

    },
    onLoad:function(options){
      //是否是第一次认证
      var that = this;
      if (options.isFirst == 0){
        that.isFirst = options.isFirst
      }

      //获取组织
      wx.request({
        url:'http://localhost:8090/organizational/getOrganizations',
        method:'Get',
        success:function(res) {
          that.myOrganization = res.data.data
          console.log(res.data.data)
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
    }
  };
</script>

<style scoped>
  .main{
    width: 100%;
    height: 590px;
    background-color: #f9f6ff;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .topic{
    font-size: 25px;
    margin-bottom: 45px;
    font-weight: bolder;
  }
  .main-div{
    width: 90%;
    height: 45px;
    background-color: white;
    margin-bottom: 10px;
    border-bottom: 1px solid lightgrey;
    border-top: 1px solid lightgrey;
    display: flex;
    align-items: center;
  }
  .label{
    margin-left: 12px;
    margin-right: 30px;
  }
  .input-label{
    margin-left: 12px;
  }
  .radio{
    margin-left: 20px;
  }
  .input-info{
    margin-left: 25px;
  }
  .submit{
    width: 100%;
    margin-top: 50px;
    background-color: dodgerblue;
    color: white;
  }
  .select-college{
    height: 30px;
    width: 210px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
