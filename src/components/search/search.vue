<template>
  <div class="search-wrap">
    <!--歌曲搜索-->
    <div class="music-search">
      <input class="search-input" type="text" name="search" placeholder="歌曲/MV" value="丁香花" @keyup.enter="getSearch"
             ref="keywords">
    </div>
    <!--音乐列表-->
    <div class="music-list">
      <div class="title">
        <span class="music-Index"></span>
        <span class="music-name">歌曲</span>
        <span class="music-author">歌手</span>
        <span class="music-special">专辑</span>
        <span class="music-time">时长</span>
      </div>
      <ul class="list-con">
        <li v-for="(item, index) in songList" class="item" :mid="item.id" v-on:dblclick="getSongInfo(item)">
          <span class="music-Index">{{index + 1}}</span>
          <span class="music-name">{{item.name}}</span>
          <span class="music-author">{{ concatArtists(item.artists) }}</span>
          <span class="music-special">{{item.album.name}}</span>
          <span class="music-time">{{item.duration | toHourTime}}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {tocar} from 'common/js/util';
  import {getSearchInfo, getMusicUrl, ERR_OK} from 'API/fetch';

  export default {
    data() {
      return {
        songList: [],
        currentMusicUrl: ''
      };
    },
    mounted() {
      this.getSearch();
    },
    filters: {
      // 将时间戳转换为具体时分秒
      toHourTime(val) {
        return tocar(val / 1000);
      }
    },
    methods: {
      // 歌曲搜索
      getSearch() {
        getSearchInfo({
          keywords: this.$refs.keywords.value,
          limit: 10
        }).then((data) => {
          if (data.code === ERR_OK) {
            this.songList = data.result.songs;
          }
        });
      },
      // 拼接歌手
      concatArtists(arr) {
        let singer = '';
        arr.forEach((item) => {
          singer += item.name + '/';
        });
        return singer.slice(0, -1);
      },
      // 双击歌曲, 获取歌曲信息
      getSongInfo(item) {
        getMusicUrl({
          id: item.id
        }).then((data) => {
          if (data.code === ERR_OK) {
            this.currentMusicUrl = data.data[0].url;
            // 通知兄弟组件加入播放列表
            this.$emit('add-music-playList', item.id, item.name, this.concatArtists(item.artists), tocar(item.duration / 1000), item.album.picUrl);
          }
        });
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .search-wrap
    .music-search
      width: 100%
      margin-bottom: 30px
    .search-input
      display: block
      width: 100%
      height: 36px
      padding-left: 20px
      border: 1px solid #eee
      box-sizing: border-box
    .music-list
      width: 100%
      max-height: 440px
      border-bottom: 1px solid #eee
      overflow: auto
      .title, .item
        padding: 1.5px 0
        font-size: 0
        border-bottom: 1px solid #eee
        .music-name, .music-author, .music-special, .music-Index, .music-time
          display: inline-block
          padding: 0 8px
          height: 36px
          line-height: 36px
          color: rgba(0, 0, 0, 0.4)
          white-space: nowrap
          overflow: hidden
          text-overflow: ellipsis
          box-sizing: border-box
        .music-Index
          width: 6%
          text-align: right
        .music-name
          width: 38%
        .music-author
          width: 20%
        .music-special
          width: 26%
        .music-time
          width: 10%
      .title
        .music-name, .music-author, .music-special, .music-Index, .music-time
          font-size: 14px
      .item
        &:nth-child(even)
          background: #eee
        &:nth-child(odd)
          background: rgba(0, 0, 0, .3)
        .music-name, .music-author, .music-special, .music-Index, .music-time
          font-size: 12px
</style>
