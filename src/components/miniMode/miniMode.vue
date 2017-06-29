<template>
  <div class="mini-mode" :class="{ show: isShowMiniMode }">
    <div class="pic">
      <img class="current-img" :src="currentMusicInfo.picUrl" alt="">
    </div>
    <div class="info">
      <p class="name">{{currentMusicInfo.name}}</p>
      <p class="singer">{{currentMusicInfo.singer}}</p>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      isShowMiniMode: {
        type: Boolean
      },
      currentMusicInfo: {
        type: Object,
        default: {}
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .mini-mode
    display: none
    position: absolute
    left: 0
    bottom: 41px
    width: 200px
    height: 80px
    border-top: 1px solid #ddd
    border-right: 1px solid #ddd
    &.show
      display: block
    .pic
      float: left
      vertical-align: top
      width: 80px
      height: 100%
      .current-img
        width: 100%
        height: 100%
    .info
      float: left
      width: 120px
      height: 100%
      padding: 20px 10px
      box-sizing: border-box
      .name, .singer
        white-space: nowrap
        overflow: hidden
        text-overflow: ellipsis
        line-height: 1
      .name
        font-size: 14px
        margin-bottom: 15px
      .singer
        font-size: 12px
</style>
