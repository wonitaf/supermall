<template>
  <div id="detail">
    <!--导航栏-->
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="detailNavBar"></detail-nav-bar>
    <scroll class="content" ref="scroll" :probe-type="3" @scroll="contentScroll">
      <!--轮播图-->
      <detail-swiper :top-images="topImages"></detail-swiper>
      <!--商品的基本信息-->
      <detail-base-info :goods="goods"></detail-base-info>
      <!--商家信息-->
      <detail-shop-info :shop="shop"></detail-shop-info>
      <!--商品的详细信息-->
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"></detail-goods-info>
      <!--商品的参数信息-->
      <detail-param-info :param-info="paramInfo" ref="params"></detail-param-info>
      <!--商品的评论信息-->
      <detail-comment-info :comment-info="commentInfo" ref="comment"></detail-comment-info>
      <!--推荐信息 此处体现封装的妙处，参数问题注意下-->
      <goods-list :goods="recommends" ref="recommend"></goods-list>
    </scroll>
    <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>
    <!--底部栏-->
    <detail-bottom-bar @addCart="addToCart"></detail-bottom-bar>
  </div>
</template>

<script>
  import DetailNavBar from './childComps/DetailNavBar'
  import DetailSwiper from './childComps/DetailSwiper'
  import DetailBaseInfo from './childComps/DetailBaseInfo'
  import DetailShopInfo from './childComps/DetailShopInfo'
  import DetailGoodsInfo from './childComps/DetailGoodsInfo'
  import DetailParamInfo from './childComps/DetailParamInfo'
  import DetailCommentInfo from './childComps/DetailCommentInfo'
  import DetailBottomBar from './childComps/DetailBottomBar'

  import Scroll from 'components/common/scroll/Scroll'
  import GoodsList from 'components/content/goods/GoodsList'

  import {getDetail, getRecommend, Goods, Shop, GoodsParam} from 'network/detail'

  import {itemImgListenerMixin, backTopMixin} from 'common/mixin'
  import {debounce} from "../../common/utils";

  export default {
    name: "Detail",
    data() {
      return {
        iid: null,
        topImages: [],
        goods: {},
        shop: {},
        detailInfo: {},
        paramInfo: {},
        commentInfo: {},
        recommends: [],
        // itemImgListener: null //一个函数混入解决
        themeTopYs:[],  //存储每个主题的offsetTop
        getThemeTopY: null, // 一个函数
        currentIndex:0
      }
    },
    mixins:[itemImgListenerMixin,backTopMixin],
    components: {
      DetailNavBar,
      DetailSwiper,
      DetailBaseInfo,
      DetailShopInfo,
      Scroll,
      DetailGoodsInfo,
      DetailParamInfo,
      DetailCommentInfo,
      GoodsList,
      DetailBottomBar
    },
    created() {
      // 获取动态路由参数  如果有keep-alive的话，此钩子函数不执行意味着iid的值不变
      this.iid = this.$route.params.iid
      // 获取detail数据
      getDetail(this.iid).then(res => {
        const result = res.result
        // console.log(res);
        // 1获取顶部的图片轮播数据
        this.topImages = result.itemInfo.topImages
        // 2获取商品基本信息
        this.goods = new Goods(result.itemInfo, result.columns, result.shopInfo.services)
        // 3获取店铺的信息
        this.shop = new Shop(result.shopInfo)
        // 4获取商品的详细信息
        this.detailInfo = result.detailInfo
        // 5获取参数信息
        this.paramInfo = new GoodsParam(result.itemParams.info, result.itemParams.rule)
        // 6获取评论信息
        if(result.rate.cRate !== 0) {
          // 取一条信息进行展示，有更多按钮可以进行请求一个接口
          this.commentInfo = result.rate.list[0]
        }

        // 4获取主题的offsetTop dom还没渲染完
        // this.themeTopYs = [] //每次要置空
        // this.themeTopYs.push(0)
        // this.themeTopYs.push(this.$refs.params.$el.offsetTop) //参数的offsetTop
        // this.themeTopYs.push(this.$refs.comment.$el.offsetTop) //评论的offsetTop
        // this.themeTopYs.push(this.$refs.recommend.$el.offsetTop) //推荐的offsetTop
        // console.log(this.themeTopYs);

        // dom完全渲染后执行
        // this.$nextTick(() => {
        //   // 5获取主题的offsetTop 数据已渲染
        //   // 但是图片依然没有加载完 导致offsetTop值不对
        //   this.themeTopYs = [] //每次要置空
        //   this.themeTopYs.push(0)
        //   this.themeTopYs.push(this.$refs.params.$el.offsetTop) //参数的offsetTop
        //   this.themeTopYs.push(this.$refs.comment.$el.offsetTop) //评论的offsetTop
        //   this.themeTopYs.push(this.$refs.recommend.$el.offsetTop) //推荐的offsetTop
        //   console.log(this.themeTopYs);
        // })
      })
      // 获取推荐数据
      getRecommend().then(res=>{
        // console.log(res);
        this.recommends = res.data.list

        // 6获取主题的offsetTop 数据已渲染
        // this.themeTopYs = [] //每次要置空
        // this.themeTopYs.push(0)
        // this.themeTopYs.push(this.$refs.params.$el.offsetTop) //参数的offsetTop
        // this.themeTopYs.push(this.$refs.comment.$el.offsetTop) //评论的offsetTop
        // this.themeTopYs.push(this.$refs.recommend.$el.offsetTop) //推荐的offsetTop
        // console.log(this.themeTopYs);
      })

      // 1获取主题的offsetTop
      // created处dom没有渲染，获取不到元素($refs)
      // this.themeTopYs.push(0)
      // this.themeTopYs.push(this.$refs.params.$el.offsetTop) //参数的offsetTop
      // this.themeTopYs.push(this.$refs.comment.$el.offsetTop) //评论的offsetTop
      // this.themeTopYs.push(this.$refs.recommend.$el.offsetTop) //推荐的offsetTop
      // console.log(this.themeTopYs);


      this.getThemeTopY = debounce(() => {
        // 7获取主题的offsetTop 防抖处理
        this.themeTopYs = [] //每次要置空
        this.themeTopYs.push(0)
        this.themeTopYs.push(this.$refs.params.$el.offsetTop) //参数的offsetTop
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop) //评论的offsetTop
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop) //推荐的offsetTop
        console.log(this.themeTopYs);
      },200)
    },
    mounted() {
      console.log('detail混入测试');

      // 2获取主题的offsetTop
      // mounted处dom渲染了，但数据还不一定渲染 会出现undefined
      // this.themeTopYs.push(0)
      // this.themeTopYs.push(this.$refs.params.$el.offsetTop) //参数的offsetTop
      // this.themeTopYs.push(this.$refs.comment.$el.offsetTop) //评论的offsetTop
      // this.themeTopYs.push(this.$refs.recommend.$el.offsetTop) //推荐的offsetTop
      // console.log(this.themeTopYs);

    },
    updated() {
      // 3获取主题的offsetTop
      // updated处数据会渲染多次
      // this.themeTopYs = [] //每次要置空
      // this.themeTopYs.push(0)
      // this.themeTopYs.push(this.$refs.params.$el.offsetTop) //参数的offsetTop
      // this.themeTopYs.push(this.$refs.comment.$el.offsetTop) //评论的offsetTop
      // this.themeTopYs.push(this.$refs.recommend.$el.offsetTop) //推荐的offsetTop
      // console.log(this.themeTopYs);
    },
    // 因为keep-alive不包含detail组件导致没有缓存，就没法使用deactivated和activated函数，所以使用销毁函数
    destroyed() {
      this.$bus.$off('ItemImageLoad', this.itemImgListener)
    },
    methods: {
      // 监听图片加载完成 此处监听函数在抛出时已做判断，只会抛出一次可以不用，下面的函数都使用了防抖操作
      imageLoad() {
        this.newRefresh() //调用混入的防抖函数

        this.getThemeTopY()
        // 6获取主题的offsetTop 图片加载完成后调用
        // this.themeTopYs = [] //每次要置空
        // this.themeTopYs.push(0)
        // this.themeTopYs.push(this.$refs.params.$el.offsetTop) //参数的offsetTop
        // this.themeTopYs.push(this.$refs.comment.$el.offsetTop) //评论的offsetTop
        // this.themeTopYs.push(this.$refs.recommend.$el.offsetTop) //推荐的offsetTop
        // console.log(this.themeTopYs);
      },
      // 监听标题点击—>滚动
      titleClick(index){
        this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 100)
      },
      // 滚动监听->标题
      contentScroll(position) {
        const positionY = -position.y
        let length = this.themeTopYs.length
        for(let i = 0; i < length; i++) {
          if(
            (this.currentIndex !== i) &&
            (
              (i < length -1 && positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1]) ||
              (i === length -1 && positionY >= this.themeTopYs[i])
            )
          ) {
            this.currentIndex = i
            this.$refs.detailNavBar.currentIndex = this.currentIndex
          }
        }
        // 判断backTop是否显示
        this.listenShowBackTop(position)
      },
      // 添加到购物车监听
      addToCart() {
        // 1获取当前商品的信息
        const product = {}
        product.image = this.topImages[0]
        product.title = this.goods.title
        product.desc = this.goods.desc
        product.price = this.goods.realPrice
        product.iid = this.iid

        // 将商品添加到购物车里  vuex 用new Promise来知道做了什么操作 可以用map映射
        // this.$store.commit('addCart',product)
        this.$store.dispatch('addCart',product).then(res => {
          console.log(res);
        })
      }
    }
  }
</script>

<style scoped>
  #detail {
    position: relative;
    z-index: 9;
    background-color: #fff;

    height: 100vh;
  }
  .detail-nav {
    position: relative;
    z-index: 9;
    background-color: #fff;
  }
  .content {
    background-color: #fff;
    height: calc(100% - 44px - 49px);
  }
</style>
