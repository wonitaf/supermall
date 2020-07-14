<template>
  <div class="cart">
    <!--导航-->
    <nav-bar class="nav-bar">
      <div slot="center">购物车({{length}})</div>
    </nav-bar>
    <!--商品的列表-->
    <scroll class="content" ref="scroll">
      <cart-list></cart-list>
    </scroll>
    <!--底部汇总-->
    <cart-bottom-bar></cart-bottom-bar>
  </div>
</template>

<script>
  import NavBar from 'components/common/navbar/NavBar'
  import Scroll from 'components/common/scroll/Scroll'

  import CartList from './childComps/CartList'
  import CartBottomBar from './childComps/CartBottomBar'
  import { mapGetters } from 'vuex'
  export default {
    name: "Cart",
    components: {
      NavBar,
      Scroll,
      CartList,
      CartBottomBar
    },
    computed: {
      // cartLength() {
      //   return this.$store.state.cartList.length
      // }

      // 运用vuex 将getters内容转化成计算属性
      // 一种方式
      //...mapGetters(['cartLength', 'cartList']),
      // 另一种方式
      ...mapGetters({
        length: 'cartLength',
        list:'cartList'
      })
    },
    activated() {
      this.$refs.scroll.refresh()
    }
  }
</script>

<style scoped>
  .cart {
    position: relative;
    height: 100vh;
  }
  .nav-bar {
    background-color: var(--color-tint);
    color: #fff;
  }
  .content {
    background-color: #fff;
    overflow: hidden;
    height: calc(100% - 44px - 49px - 40px)
  }
</style>
