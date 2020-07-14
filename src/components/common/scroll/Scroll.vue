<template>
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'
  export default {
    name: "Scroll",
    props: {
      // 监听滚动
      probeType: {
        type: Number,
        default() {
          return 0
        }
      },
      // 监听下拉
      pullUpLoad: {
        type: Boolean,
        default() {
          return false
        }
      }
    },
    data() {
      return {
        scroll:null
      }
    },
    mounted() {
      // document.querySelector('.content') vue不建议
      // 1.创建BScroll对象
      this.scroll = new BScroll(this.$refs.wrapper, {
        click:true,
        probeType: this.probeType,
        pullUpLoad: this.pullUpLoad
      })

      // 2.监听滚动
      this.scroll.on('scroll', position => {
        // console.log(position);
        this.$emit('scroll',position)
      })

      // 3.监听上拉加载
      this.scroll.on('pullingUp', ()=> {
       // console.log('上拉加载');
        this.$emit('pullingUp')
      })
    },
    methods: {
      // 滚动到那个位置
      scrollTo(x, y, time) {
        this.scroll && this.scroll.scrollTo(x,y,time)
      },
      // 加载完成后结束加载，可以继续下一次加载
      finishPullUp() {
        this.scroll.finishPullUp()
      },

      refresh() {
        // console.log('防抖函数的效果执行次数.......');
        this.scroll && this.scroll.refresh()
      },
      // 获取滚动位置
      getScrollY() {
        // console.log(this.scroll.y);
        return this.scroll ? this.scroll.y : 0
      }

    }
  }
</script>

<style scoped>

</style>
