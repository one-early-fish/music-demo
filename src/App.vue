<template>
  <div id="app">
    <div class="box">
      <v-search @add-music-playList="addMusicToPlayList"></v-search>
      <v-control :playList="playList" :clearPlayStatus="clearPlayStatus"
                 @toggle-play-list="toggleMusicPlayList"></v-control>
      <v-playList :playList="playList" :isShow="isShowPlayList" @clear-play-list="clearMusicList"></v-playList>
    </div>
  </div>
</template>

<script>
  import search from 'components/search/search';
  import control from 'components/control/control';
  import playList from 'components/playList/playList';
  import {getStorge} from 'common/js/localStorge';
  import {isDuplicates} from 'common/js/util';

  export default {
    name: 'app',
    data() {
      return {
        playList: [],
        isShowPlayList: false,
        clearPlayStatus: false
      };
    },
    created() {
      this.initPlayList();
    },
    methods: {
      initPlayList() {
        this.playList = getStorge('myPlayList');
      },
      toggleMusicPlayList(status) {
        this.isShowPlayList = status;
      },
      addMusicToPlayList(id, name, singer, duration, picUrl) {
        let result = isDuplicates(this.playList, id);
        if (result === undefined) {
          let obj = {};
          obj.id = id;
          obj.name = name;
          obj.singer = singer;
          obj.duration = duration;
          obj.picUrl = picUrl;
          obj.playStatus = true;
          this.playList.push(obj);
        }
      },
      clearMusicList() {
        this.playList = [];
        this.clearPlayStatus = true;
      }
    },
    components: {
      'v-search': search,
      'v-control': control,
      'v-playList': playList
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .box
    width: 800px
    margin: 0 auto
    padding: 20px
</style>
