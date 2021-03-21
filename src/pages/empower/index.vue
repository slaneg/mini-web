<template>
    <div class="container">
      <img src="/static/images/index1.png">
      <p>重理工党建</p>
      <button open-type="getUserInfo" @getuserinfo="bindGetUserInfo">
        授权登录
      </button>
    </div>
</template>

<script>
  export default {
    name: "index",
    data(){
      return{
        avatarUrl:'',
        nickname:''
      }
    },
    onLoad:function(){
      this.setting();
    },
    methods:{
      setting(){
        let self = this;
        const that=this;
        wx.login({
          //用户登录
          success(res) {
            if (res.code) {
              // 发起网络请求
              console.log("res.code+" + res.code);
              var code = res.code;
              wx.getSetting({
                //查看用户是否授权
                success(res) {
                  if (res.authSetting['scope.userInfo']) {
                    //用户已经授权
                    wx.getUserInfo({
                      //获取用户信息
                      success: (res) => {
                        //通过后台获取openId
                        wx.request({
                          url:'http://localhost:8090/sysWxUser/decodeUserInfo',
                          data:{
                            code:code,
                            encryptedData:res.encryptedData,
                            iv:res.iv
                          },
                          method: "Post",
                          header: {
                            'content-type': 'application/x-www-form-urlencoded',
                          },
                          success: function (res) {
                            // console.log(res);
                            // console.log(res.data.userInfo.city)
                            self.$store.commit('updateUserInfo', res.data.userInfo);
                            //授权后信息上传
                            wx.request({
                              url:'http://localhost:8090/sysWxUser/selectById',
                              data:{
                                id:res.data.userInfo.openId,
                              },
                              method: "Get",
                              header: {
                                'content-type': 'application/json',
                              },
                              success:function(res) {
                                //通过partId查询组织职务id
                                wx.request({
                                  url:'http://localhost:8090/sysWxUserOrgPost/selectOrganizationPosition?openId='+that.$store.state.userInfo.openId,
                                  method:'Get',
                                  success:function(res) {
                                    console.log(res + '11111sss', + ' ' + that.$store.state.userInfo.openId);
                                    console.log(res , '11111sss');
                                    that.$store.commit('insertOrganizationPosition', res.data.data);

                                  },

                                });
                                if (res.data.data != null) {
                                  that.$store.commit('insertWxUserInfo', res.data.data);
                                };
                                //判断是否填写了认证信息
                                if (res.data.data == null) {
                                  wx.redirectTo({
                                    url:"../mine_certification/main"
                                  })
                                }else {
                                  wx.switchTab({
                                    url:'../firstView/main'
                                  })
                                }
                                // console.log(res)
                              }
                            })
                          },
                        });


                        //封装API请求方法
                        // that.$http.post({
                        //   url:'/sysWxUser/decodeUserInfo',
                        //   data:{
                        //     code:code,
                        //     encryptedData:res.encryptedData,
                        //     iv:res.iv
                        //   }}).then(res=>{
                        // });



                      }
                    })
                  }
                }
              })
            }
          }
        })
      },
      //引导用户授权

      bindGetUserInfo(e) {
        const that=this;
        // console.log(e.mp.detail.rawData)
        if (e.mp.detail.rawData){
          //用户按了允许授权按钮
          that.setting();
          console.log('用户按了允许授权按钮')
        } else {
          //用户按了拒绝按钮
          console.log('用户按了拒绝按钮')
        }
      }
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
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #ffce73;
  height: 100%;
}
  .container img{
    margin-top: 50px;
    height: 150px;
    width: 150px;
  }
  .container button{
    width: 90%;
  }
  .container p{
    margin-top: 40px;
    font-size: 25px;
    margin-bottom: 80px;
  }
</style>
