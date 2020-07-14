import {ADD_COUNTER, ADD_TO_CART} from "./mutation-type";
export default {
  addCart(context,payload) {
    // let oldProduct = null
    // for(let item of state.cartList){
    //   if(item.iid === payload.iid){
    //     oldProduct = item
    //   }
    // }
    // for循环优化
    let oldProduct = context.state.cartList.find(item => item.iid === payload.iid)


    if(oldProduct) {
      context.commit(ADD_COUNTER,oldProduct)
    }else {
      payload.count = 1
      context.commit(ADD_TO_CART,payload)
    }
  }
}
