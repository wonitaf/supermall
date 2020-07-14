import {debounce} from './utils'
import BackTop from 'components/content/backTop/BackTop'
import {BACK_POSITION} from 'common/const'
// 混入案例
export  const itemImgListenerMixin = {
  data() {
    return {
      itemImgListener: null, //一个函数
      newRefresh: null
    }
  },
  mounted() {
    // 防抖函数的保存
    this.newRefresh = debounce(this.$refs.scroll.refresh, 500)
    // 对监听函数进行保存
    this.itemImgListener = () => {
      this.newRefresh()
    }
    this.$bus.$on('ItemImageLoad', this.itemImgListener)
    console.log('我是混入的内容');
  }
}


export const backTopMixin = {
  components: {
    BackTop
  },
  data() {
    return{
      isShowBackTop: false
    }
  },
  methods: {
    backClick() {
      // 通过ref来访问组件的属性方法
      this.$refs.scroll.scrollTo(0,0,500)
    },
    listenShowBackTop(position) {
      this.isShowBackTop = (-position.y) > BACK_POSITION
    }
  }
}
