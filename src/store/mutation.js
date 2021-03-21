const mutations = {
  updateUserInfo(state, result) {
    state.userInfo = result
  },
  insertWxUserInfo(state,result){
    state.wxUserInfo = result;
  },
  insertOrganizationPosition(state,result){
    state.globalOrganizationPosition = result;
  }
}
export default mutations
