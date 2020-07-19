<template>
  <div class="toast" v-show="isShow">
    <div>{{message}}</div>
  </div>
</template>

<script>
  export default {
    name: "Toast",
    // 普通封装还需要传值
    // props: {
    //   message: {
    //     type:String,
    //     default() {
    //       return '';
    //     }
    //   },
    //   show: {
    //     type:Boolean,
    //     default() {
    //       return false;
    //     }
    //   }
    // },
    // 插件封装
    data() {
      return {
        message: '',
        isShow: false
      }
    },
    methods: {
      show(message='默认值', time=1500) {
        // 设置默认参数的值 上为es6写法
        // time = time || 1500
        // message = message || '默认值'
        this.isShow = true
        this.message = message

        setTimeout(() => {
          this.isShow = false
          this.message = message
        },time)
      }
    }
  }
</script>

<style scoped>
  .toast {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    padding: 8px 10px;
    color: #fff;
    background-color: rgba(0,0,0,0.75);
    z-index: 999;
    border-radius: 8px;
  }
</style>
