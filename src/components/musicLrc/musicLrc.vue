<template>
  <div class="lrc-wrap">
    <p class="lrc-item" ref="item"></p>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      lrc: {
        type: String
      }
    },
    watch: {
      lrc() {
        this.showDealLrc(this.lrc);
      }
    },
    methods: {
      showDealLrc(str) {
        if (str !== 'nolrc') {
          this.$refs.item.innerHTML = str;
        } else {
          this.$refs.item.innerHTML = '纯音乐，无歌词';
        }
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .lrc-wrap
    position: absolute
    left: 200px
    bottom: 41px
    width: 100%
    height: 50px
    padding: 10px
    .lrc-item
      width: calc(100% - 200px)
      height: 30px
      padding: 10px 0
      text-align: center
      letter-spacing: 2px
      font-size: 30px
      line-height: 30px
      color: #fff
      text-shadow: 1px 1px 5px #000
      transition: all .3s
</style>
