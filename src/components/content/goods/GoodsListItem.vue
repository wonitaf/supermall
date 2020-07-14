<template>
  <div class="goods-item" @click="itemClick">
    <img :src="showImage" alt="" @load="imageLoad">
    <div class="goods-info">
      <p>{{goodsItem.title}}</p>
      <span class="price">{{goodsItem.price}}</span>
      <span class="collect">{{goodsItem.cfav}}</span>
    </div>
  </div>
</template>

<script>
  export default {
    name: "GoodsListItem",
    props: {
      goodsItem: {
        type:Object,
        default() {
          return {}
        }
      }
    },
    computed: {
      // 此处解决组件复用时数据的结构不同时的解决方案
      showImage() {
        return this.goodsItem.image || this.goodsItem.show.img
      }
    },
    methods: {
      imageLoad() {
        // console.log('图片加载完成');
        // bus总线
        // 复用时产生事件传给谁监听的问题
        // 方法一
        // if(this.$route.path.indexOf('/home')){
        //   this.$bus.$emit('ItemImageLoad')
        // }else if(this.$route.path.indexOf('/detail')){
        //   this.$bus.$emit('DetailItemImageLoad')
        // }
        //方法二 利用bus取消事件
        this.$bus.$emit('ItemImageLoad')
      },
      itemClick() {
        console.log('跳转商品详情页面');
        // 路由传参 动态
        this.$router.push('/detail/' + this.goodsItem.iid)

        // query
        // this.$router.push({
        //   path:'/detail',
        //   query: {
        //     iid: this.goodsItem.iid
        //   }
        // })

        // 路由正常配置，在detail页面取值
        // this.$route.query.iid
      }
    }

  }
</script>

<style scoped>
  .goods-item {
    padding-bottom: 40px;
    position: relative;
    width: 48%;
  }
  .goods-item img {
    width: 100%;
    border-radius: 5px;
  }
  .goods-info {
    font-size: 12px;
    position: absolute;
    bottom:5px;
    left: 0;
    right: 0;
    overflow: hidden;
    text-align: center;
  }
  .goods-info p {
    overflow: hidden;
    /*文字过多出现省略号*/
    text-overflow:ellipsis;
    white-space: nowrap;
    margin-top: 3px;
  }
  .goods-info .price {
    color: var(--color-high-text);
    margin-right: 20px;
  }
  .goods-info .collect {
    position: relative;
  }
  /*????*/
  .goods-info .collect::before {
    content:'';
    position: absolute;
    left: -15px;
    top:-1px;
    width: 14px;
    height: 14px;
    background: url("~assets/img/common/collect.svg") 0 0/14px 14px;
  }
</style>
