import {ADD_COUNTER, ADD_TO_CART} from "./mutation-type";

export default {
  [ADD_COUNTER](state,payload) {
    payload.count++
  },
  [ADD_TO_CART](state, payload) {
    payload.checked = true //加入购物车默认选中
    state.cartList.push(payload)
  }
}
