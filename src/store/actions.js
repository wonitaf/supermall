import {ADD_COUNTER, ADD_TO_CART} from "./mutation-type";
export default {
  addCart(context,payload) {
    // 为了让外面知道调用是否成功
    return new Promise((resolve, reject) => {
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
        resolve('当前商品数量+1')
      }else {
        payload.count = 1
        context.commit(ADD_TO_CART,payload)
        resolve('添加新的商品')
      }
    })
  }
}
