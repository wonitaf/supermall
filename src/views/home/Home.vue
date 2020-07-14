<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
<!--此处想不到吧-->
    <tab-control
      :titles="['流行','新款','精选']"
      @itemClick="itemClick"
      ref="tabControl1"
      class="tab-control"
      v-show="isTabFixed"
    >
    </tab-control>
    <scroll
      class="content"
      ref="scroll"
      :probe-type="3"
      :pull-up-load="true"
      @scroll="contentScroll"
      @pullingUp="contentPullingUp"
    >
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"></home-swiper>
      <recommend-view :recommends="recommends"></recommend-view>
      <feature-view></feature-view>
      <tab-control
        :titles="['流行','新款','精选']"
        @itemClick="itemClick"
        ref="tabControl2"
      >
      </tab-control>
      <goods-list :goods="showGoods"></goods-list>
    </scroll>
    <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>
  </div>
</template>

<script>
  import NavBar from 'components/common/navbar/NavBar'
  import Scroll from 'components/common/scroll/Scroll'

  import TabControl from 'components/content/tabControl/TabControl'
  import GoodsList from 'components/content/goods/GoodsList'



  import HomeSwiper from './childComps/HomeSwiper'
  import RecommendView from './childComps/RecommendView'
  import FeatureView from './childComps/FeatureView'

  import {getHomeMultidata,getHomeGoods} from 'network/home';
  import {itemImgListenerMixin,backTopMixin} from 'common/mixin'


  export default {
    name: "Home",
    components: {
      NavBar,
      HomeSwiper,
      RecommendView,
      FeatureView,
      TabControl,
      GoodsList,
      Scroll
    },
    mixins:[itemImgListenerMixin, backTopMixin],
    data() {
      return {
        banners:[],
        recommends:[],
        goods: {
          pop:{page:0,list:[]},
          new:{page:0,list:[]},
          sell:{page:0,list:[]},
        },
        currentType: 'pop',
        tabOffsetTop: 0,
        isTabFixed: false,
        saveY: 0,

        // itemImgListener: null //一个函数 混入解决
      }
    },
    computed: {
      showGoods() {
        return this.goods[this.currentType].list
      }
    },
    // 没有路由标签keep-alive缓存,会打印
    destroyed() {
      console.log('home destroyed');
    },
    // 获取home页面离开时的位置，返回时继续在离开的位置
    activated() {
      this.$refs.scroll.scrollTo(0,this.saveY,0)
      this.$refs.scroll.refresh()
    },
    deactivated() {
      // 保存y值
      this.saveY = this.$refs.scroll.getScrollY()
      // 取消全局事件的监听,如果只有一个函数名就是取消所有的此函数的监听，所以要指定函数
      this.$bus.$off('ItemImageLoad', this.itemImgListener)
    },
    created() {
      // 1.请求多个数据
      this.getHomeMultidata()

      // 2.请求商品数据 主要是根据数据结构来梳理封装数据的请求
      this.getHomeGoods('pop')
      this.getHomeGoods('new')
      this.getHomeGoods('sell')
    },
    mounted() {
      // 3.组件创建完后监听组件抛出的bus总线
      // this.$bus.$on('ItemImageLoad', () => {
      //   // 解决图片加载完成刷新
      //   this.$refs.scroll.refresh()
      // })
      // 对3优化,图片加载完成的事件监听
      // const refresh = debounce(this.$refs.scroll.refresh, 500)
      // // 对监听函数进行保存
      // this.itemImgListener = () => {
      //   refresh()
      // }
      // this.$bus.$on('ItemImageLoad', this.itemImgListener)
      console.log('home混入测试');
    },
    methods: {
      /**
       * 事件监听方法
       */
      swiperImageLoad() {
        // 获取tabControl的offsetTop
        // 所有的组件都有一个属性$el: 用户获取组件中的元素
        this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop;
      },
      itemClick(index) {
        switch (index) {
          case 0:
            this.currentType ='pop'
            break
          case 1:
            this.currentType = 'new'
            break
          case 2:
            this.currentType = 'sell'
            break
        }
        // 同步tabControl的点击事件
        this.$refs.tabControl1.currentIndex = index
        this.$refs.tabControl2.currentIndex = index

        // 还是一个问题就是，当点击流行和精选时位置会一样
        // this.$refs.scroll.scrollTo(0,this.tabOffsetTop,0)
      },
      contentScroll(position) {
         // console.log(position);
        // 1判断backTop是否显示
        // this.isShowBackTop = (-position.y) > BACK_POSITION 混入封装
        this.listenShowBackTop(position)

        // 2.判断tabControl是否吸顶(position: fixed)
        this.isTabFixed = (-position.y) > this.tabOffsetTop
      },
      contentPullingUp() {
        // 此处体现了封装的妙处
        // console.log('上拉加载');
        this.getHomeGoods(this.currentType)
      },
      /**
       * 网路请求数据方法
       */
      getHomeMultidata() {
        getHomeMultidata().then(res => {
          this.banners = res.data.banner.list
          this.recommends = res.data.recommend.list
        })
      },
      getHomeGoods(type) {
        const page = this.goods[type].page + 1
        getHomeGoods(type,page).then(res =>{
          // console.log(res);
          this.goods[type].list.push(...res.data.list)
          this.goods[type].page += 1
          // 上拉下载加载默认只执行一次，所以在此执行加载一次完成一次上拉加载
          this.$refs.scroll.finishPullUp()
        })
      }
    }
  }
</script>

<style scoped>
  #home {
    /*padding-top: 44px;*/
    position: relative;
    height: 100vh;
  }
  .home-nav {
    background-color: var(--color-tint);
    color: #fff;
    /*在使用原生滚动时，为了让导航不跟随一起滚动所以固定，但部分滚动不需要了*/
    /*position: fixed;*/
    /*left: 0;*/
    /*right: 0;*/
    /*top: 0;*/
    /*z-index: 2;*/
  }
  /*在滚动时此属性不起作用*/
  /*.tab-control {*/
  /*  !*浏览器会解析，当到达44px时position的属性值会是fixed*!*/
  /*  position: sticky;*/
  /*  top: 44px;*/
  /*  z-index: 2;*/
  /*}*/
  /*使用定位来确定内容的位置1*/
  .content {
    overflow: hidden;
    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }
  .tab-control {
    position: relative;
    z-index: 2;
  }
  /*使用定位来确定内容的位置2计算*/
  /*.content {*/
  /*  height: calc(100% - 93px);*/
  /*  overflow: hidden;*/
  /*  margin-top: 44px;*/
  /*}*/
</style>
