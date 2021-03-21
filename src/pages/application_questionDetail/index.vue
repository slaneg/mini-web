<template>
  <div class="all">
    <div class="content">
      <div class="title">
        <p>{{examinationByIdData.title}}</p>
      </div>
      <div class="detail">
        <p style="max-width: 15%;width: 15%;">{{examinationByIdData.founderName}}</p>
        <p style="max-width: 32%;width: 32%;color: #1890FF;">重庆理工党建</p>
        <p style="max-width: 40%;width: 40%;">{{examinationByIdData.beginTime}}</p>
        <div style="max-width: 35%;width: 35%;">已完成:
          <span v-if="examinationByIdData.correctQuestionNumber">{{examinationByIdData.questionTotalNumber}}</span>
          <span v-if="examinationByIdData.correctQuestionNumber==null">{{userAnswerLen}}</span>
        </div>
      </div>
      <div v-for="(ques,i) in questions" :key="i" class="question">
        <span>{{i+1}}、{{ques.title}}{{ques.question}}</span>
        <div v-if="examinationByIdData.correctQuestionNumber==null">
          <radio-group v-if="ques.questionType==='1'" class="select" @change="radioChange($event,i)">
            <radio class="radio"
                   v-for="aq in ques.answerDescription" :key="aq"
                   :value="aq">
              <p>{{aq}}</p>
            </radio>
          </radio-group>
          <input v-if="ques.questionType==='2'" @change="radioChange($event,i)"
                 class="inputBox inputMargin" type="text" placeholder="请回答" />
        </div>
        <div v-if="examinationByIdData.correctQuestionNumber!=null" style="width: 100%;">
          <div v-for="(answer,a) in AnswerRecordDetails" :key="answer" style="width: 100%;">
            <div v-if="ques.id==answer.questionId" class="select">
              <radio-group v-if="ques.questionType==='1'" class="selectOne" v-for="aq in ques.answerDescription" :key="aq" @change="radioChange($event,i)">
                  <div v-if="aq===answer.answerContent" class="selectOne">
                    <radio class="radio radioOne" :value="aq" checked="checked"><p>{{aq}}</p></radio>
                  </div>
                  <div v-else class="selectOne">
                    <radio class="radio radioOne" :value="aq" disabled="true"><p>{{aq}}</p></radio>
                  </div>
              </radio-group>
              <div v-if="ques.questionType==='2'" style="width: 100%">
                <input class="inputBox" :value="answer.answerContent" type="text" disabled="true">
              </div>
            </div>
          </div>
          <span class="rightSpan">正确答案: {{rightAnswer[i]}}</span>
        </div>
      </div>
      <div style="width: 85%" v-if="examinationByIdData.correctQuestionNumber==null&&examinationByIdData.state!='3'">
        <button class="submit" @click="submitAnswer">提交</button>
      </div>
    </div>
  </div>

</template>

<script>
  import Check from "../mine_certification/index";
  export default {
    name: "index",
    components: { Check },
    data(){
      return{
        id:"",
        questions: {
          id: "",
          answerDescription:"",
          picture:"",
          question: "",
          questionType: "",
          title: "",
        },
        questionIds:[],
        rightAnswer:[],
        userAnswer:[],
        examinationByIdData:[],
        checked:false,
        isDisabled:true,
        AnswerRecordDetails:[],
        userAnswerLen:0
      }
    },
    methods:{
      selectExaminationQuestionById(id){
        var that = this;
        wx.request({
          url:'http://localhost:8090/serviceQuestion/selectExaminationQuestionById?examinationId='+id,
          method: "Get",
          header: {
            'content-type': 'application/json',
          },
          success:function(res) {
            that.questions=res.data.data;
              for (var i=0;i<that.questions.length;i++){
                that.questionIds[i]=that.questions[i].id;
                if (that.questions[i].questionType==='1'){
                  that.questions[i].answerDescription=that.questions[i].answerDescription.split(";");
                } ;
              };
            if (that.examinationByIdData.correctQuestionNumber!=null) {
              that.selectByAnswerRecordId(that.examinationByIdData.answerRecordId);
              for (var i = 0; i < that.questions.length; i++) {
                that.rightAnswer[i] = that.questions[i].correctAnswer;
              };
            }
            for (var i=0;i<that.questions.length;i++){
              that.userAnswer.push("");//初始化
            } ;
            }
        })
      },
      selectExaminationById(id){
        var that = this;
        wx.request({
          url:'http://localhost:8090/serviceExaminationManagement/selectExaminationById?userId='+this.$store.state.wxUserInfo.partyId+
            "&id="+id,
          method: "Get",
          header: {
            'content-type': 'application/json',
          },
          success:function(res) {
            that.examinationByIdData=res.data.data;
          }
        })
      },
      selectByAnswerRecordId(answerRecordId){
        var that = this;
        wx.request({
          url:'http://localhost:8090/serviceAnswerDetails/selectByAnswerRecordId?answerRecordId='+answerRecordId,
          method: "Get",
          header: {
            'content-type': 'application/json',
          },
          success:function(res) {
            that.AnswerRecordDetails=res.data.data;
          }
        })
      },
      radioChange(e,i) {
        var that = this;
        if (e.mp.detail.value!=null&&e.mp.detail.value!==""){
          that.userAnswer[i]=e.mp.detail.value;
        };
        that.userAnswerLength();
      },
      submitAnswer(){
        var that = this;
        if (that.userAnswerLen===that.questions.length){
          wx.request({
            url:'http://localhost:8090/serviceAnswerRecord/insertServiceAnswerRecord',
            data:{
              examinationId:that.id,
              userId:this.$store.state.wxUserInfo.partyId,
              questionId:that.questionIds.join(';'),
              answerContent:that.userAnswer.join(';'),
            },
            method: "Post",
            header: {
              'content-type': 'application/json',
            },
            success:function(res) {
              wx.showModal({
                content:'恭喜你答对'+res.data.data+'道题',
                showCancel:false,
                confirmText:'确定',
                confirmColor:'#49A9F0',
                success: function (res) {
                  if (res.confirm) {
                    wx.navigateTo({
                      url:"../application_answerQuestion/main"
                    })
                  }
                }
              });
            }
          });
        }else {
          wx.showModal({
            content:'你还有'+(that.questions.length- that.userAnswerLen)+'道题没答哦,请继续作答',
            showCancel:false,
            confirmText:'确定',
            confirmColor:'#49A9F0',
          });
        };
      },
      userAnswerLength(){
        var that=this;
        var len=0;
        for (var i=0;i<that.userAnswer.length;i++){
          if (that.userAnswer[i]!=""){
            len++;
          } ;
        };
        that.userAnswerLen=len;
      }
    },
    onLoad:function(){
      this.userAnswerLen=0;
      this.userAnswer=[];
      this.id=this.$mp.query.id;
      this.selectExaminationById(this.$mp.query.id);
      this.selectExaminationQuestionById(this.$mp.query.id);
    },
    onUnload:function(){
      this.userAnswerLen=0;
      this.userAnswer=[];
    }
  };
</script>

<style>
  page{
    background: #facd9131;
  }
</style>
<style scoped>
  .all{
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: center;
  }
  .content{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
  }
  .title{
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 30rpx;
  }
  .title>p{
    max-width: 300rpx;
    font-weight: 600;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .detail{
    display:flex;
    width:98%;
    justify-content:center;
    align-items:center;
    height:80rpx;
    border-bottom:3rpx solid #E4E4E4;
    padding-left:40rpx;

  }
  .detail>p{
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 28rpx;
  }
  .question{
    display:flex;
    flex-direction:column;
    width:88%;
    justify-content:left;
    align-items:left;
    font-size:30rpx;
    margin-top:20rpx;
    margin-left:20rpx;

  }
  .question>p{
    justify-content: left;
    left: 0rpx;
    width: 100%;
    margin-top: 25rpx;
  }
  .selectOne{
    display: flex;
    width: 100%;
  }
  .select{
    margin-top: 20rpx;
    display: flex;
    width: 100%;
    align-items: center;
    flex-wrap: wrap;
  }
  .radio{
    display: flex;
    width: 100%;
    align-items: center;
    margin-bottom:5rpx;
  }
  .radioOne{
    width: 100%;
  }
  .inputBox{
    background-color:#FFFFFF;
    width:75%;
    border:1px solid #E4E4E4;
    height:90rpx;
    border-radius:17rpx;
    padding-left:15rpx;
    margin-left:55rpx;
  }
  .inputMargin{
    margin-top:30rpx;
  }
  .submit{
    margin-top: 40rpx;
    border-radius: 10rpx;
    background-color: #118EE9;
    color: #FFFFFF;
  }
  .rightSpan{
    color:red;
    margin-top:15rpx;
    display:flex;
  }
</style>
