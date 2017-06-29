<template>
  <div class="musicList-current" v-if="isShow">
    <div class="tab">
      <span class="play-list active" title="播放列表">播放列表</span>
      <span class="history" title="历史记录">历史记录</span>
    </div>
    <div class="list-info">
      <span class="totalCount">共{{playList.length}}首</span>
      <span class="clear" title="清空列表" @click="clearList">清空列表</span>
    </div>
    <p class="empty-info" v-if="!playList.length">
      播放列表空空如也，快去添加歌曲吧
    </p>
    <ul class="list" v-if="playList.length">
      <li class="item" v-for="item in playList">
        <span class="status"></span>
        <span class="name">{{item.name}}</span>
        <span class="singer">{{item.singer}}</span>
        <span class="time">{{item.duration}}</span>
      </li>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
  import {setStorge, removeStorge} from 'common/js/localStorge';
  export default {
    props: {
      isShow: {
        type: Boolean
      },
      playList: {
        type: Array,
        default: []
      }
    },
    watch: {
      playList() {
        setStorge('myPlayList', this.playList);
      }
    },
    methods: {
      clearList() {
        removeStorge('myPlayList');
        this.$emit('clear-play-list');
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .musicList-current
    position: fixed
    right: 0
    bottom: 41px
    width: 560px
    height: 560px
    background: #fff
    box-shadow: -1px -1px 5px rgba(0, 0, 0, .4)
    z-index: 100
    &.hide
      display: none
    .tab
      width: 100%
      height: 40px
      text-align: center
      font-size: 0
      padding-top: 5px
      background: #f4f4f6
      border-bottom: 1px solid #e1e1e2
      box-sizing: border-box
      .play-list, .history
        display: inline-block
        width: 108px
        height: 24px
        font-size: 14px
        text-align: center
        line-height: 24px
        color: #888
        border: 1px solid #e5e5e5
        cursor: pointer
        &.active
          color: #fff
          border-color: #7c7d85
          background: #7c7d85
      .play-list
        border-right: none
        border-radius: 5px 0 0 5px
      .history
        border-left: none
        border-radius: 0 5px 5px 0
    .list-info
      padding: 0 5%
      width: 90%
      height: 28px
      line-height: 28px
      border-bottom: 1px solid #eee
      .totalCount, .clear
        font-size: 12px
        color: #666
      .totalCount
        float: left
      .clear
        float: right
        cursor: pointer
    .list
      overflow: auto
    .item
      height: 24px
      line-height: 24px
      font-size: 0
      &:nth-child(even)
        background: #f5f5f7
      .status, .name, .singer, .time
        display: inline-block
        font-size: 14px
      .status
        width: 5%
      .name
        width: 45%
        color: #333
      .singer
        width: 40%
        color: #888
      .time
        width: 10%
        color: #666

    .empty-info
      font-size: 14px
      color: #ddd
      text-align: center
      padding-top: 150px
</style>
