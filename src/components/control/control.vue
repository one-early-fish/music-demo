<template>
  <div class="control-wrap">
    <v-musicLrc :lrc="lrcStr"></v-musicLrc>
    <v-miniMode :isShowMiniMode="isShowMiniMode" :currentMusicInfo="currentMusicInfo"></v-miniMode>
    <div class="control">
      <!--切换歌曲、播放暂停-->
      <div class="play-col">
        <span class="prev iconfont" @click="prevPlay">&#xe695;</span>
        <span class="con iconfont" @click="togglePlayAudio" ref="pCon">&#xe635;</span>
        <span class="next iconfont" @click="nextPlay">&#xe679;</span>
      </div>
      <!--进度控制-->
      <div class="progress-col">
        <span class="currentTime" ref="currentTime">00.00</span>
        <v-musicProgress :status="musicProgressStatus" :rate="musicRate"
                         @music-progress-down="changeDownSongProgress"></v-musicProgress>
        <span class="duration" ref="duration">00:00</span>
      </div>
      <!--音量控制-->
      <div class="voice-col">
        <span class="voice iconfont" @click="Mute">&#xe60c;</span>
        <v-voiceProgress :rate="audioVoice" @changeVoiceRate="changeVoiceRateProps"></v-voiceProgress>
      </div>
      <!--播放模式-->
      <div class="mode-col" @click="togglePlayMode">
        <span ref="mode" class="mode iconfont" title="顺序播放">&#xe648;</span>
      </div>
      <!--播放列表-->
      <div class="playlist-col" title="播放列表" @click="togglePlayList">
        <div class="wrap">
          <span class="list iconfont">&#xe785;</span>
          <span class="num">{{playList.length}}</span>
        </div>
      </div>
    </div>
    <audio id="audio" ref="audio"></audio>
  </div>
</template>

<script type="text/ecmascript-6">
  import miniMode from 'components/miniMode/miniMode';
  import voiceProgress from 'components/voiceProgress/voiceProgress';
  import musicProgress from 'components/musicProgress/musicProgress';
  import musicLrc from 'components/musicLrc/musicLrc';
  import {getMusicUrl, getMusicLrc, ERR_OK} from 'API/fetch';
  import {tocar, randomNum} from 'common/js/util';
  import {parseLyric} from 'common/js/dealLrc';

  export default {
    props: {
      playList: {
        type: Array,
        default: []
      },
      clearPlayStatus: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        oldVoice: 0.8,
        audioVoice: 0.8,
        isShowPlayList: false,
        playMode: {
          currentMode: 0,
          modeArray: ['order', 'circul', 'single', 'random'],
          modeIcon: ['&#xe648;', '&#xe677;', '&#xe615;', '&#xe600;'],
          info: ['顺序播放', '循环播放', '单曲循环', '随机播放']
        },
        // 当前播放歌曲的索引, -1表示没有
        currentMusicIndex: -1,
        // 是否显示mini模式
        isShowMiniMode: false,
        // 当前播放歌曲的信息
        currentMusicInfo: {},
        // 是否能够拖动歌曲进度条
        musicProgressStatus: false,
        // 歌曲进图条定时器
        timer: null,
        // 歌曲进图条比率
        musicRate: 0,
        // 歌曲进度条是否正在拖拽
        isDownSongProgress: false,
        // 单行歌词数据
        lrcStr: ''
      };
    },
    watch: {
      audioVoice() {
        this.changeVoice();
      },
      clearPlayStatus(val) {
        if (val === true) {
          this.clearMusicStatus();
        }
      },
      playList(val) {
        if (val.length) {
          this.currentMusicIndex = this.playList.length - 1;
          let id = this.playList[this.currentMusicIndex].id;
          this.getMusicInfo(id);
          this.$refs.pCon.innerHTML = '&#xe6dc;';
        }
      }
    },
    mounted() {
      this.changeVoice();
    },
    methods: {
      // 静音
      Mute() {
        if (this.audioVoice > 0) {
          this.audioVoice = 0;
        } else {
          this.audioVoice = this.oldVoice;
        }
      },
      changeVoice() {
        this.$refs.audio.volume = this.audioVoice;
      },
      // 接收子组件传来的值，改变对应的props
      changeVoiceRateProps(val) {
        this.oldVoice = val;
        this.audioVoice = val;
      },
      // 显示隐藏播放列表
      togglePlayList() {
        this.isShowPlayList = !this.isShowPlayList;
        this.$emit('toggle-play-list', this.isShowPlayList);
      },
      // 切换播放模式
      togglePlayMode() {
        if (this.playMode.currentMode === this.playMode.modeIcon.length - 1) {
          this.playMode.currentMode = 0;
        } else {
          this.playMode.currentMode++;
        }
        this.$refs.mode.innerHTML = this.playMode.modeIcon[this.playMode.currentMode];
        this.$refs.mode.title = this.playMode.info[this.playMode.currentMode];
      },
      // 自动切换
      autoPlay() {
        let mode = this.playMode.currentMode;
        let isPlay = true;
        switch (mode) {
          case 0:
            if (this.currentMusicIndex === this.playList.length - 1) {
              isPlay = false;
              this.clearMusicStatus();
            } else {
              this.currentMusicIndex++;
            }
            break;
          case 1:
            if (this.currentMusicIndex === this.playList.length - 1) {
              this.currentMusicIndex = 0;
            } else {
              this.currentMusicIndex++;
            }
            break;
          case 2:
            break;
          case 3:
            this.currentMusicIndex = randomNum(this.playList.length, this.currentMusicIndex);
            break;
          default:
            break;
        }
        if (isPlay) {
          this.clearCurrentStatus();
          let id = this.playList[this.currentMusicIndex].id;
          this.getMusicInfo(id);
        }
      },
      // 上一首
      prevPlay() {
        if (this.playList.length === 0) {
          return;
        }
        if (this.playList.length === 1 && this.currentMusicIndex >= 0) {
          return;
        }
        let mode = this.playMode.currentMode;
        switch (mode) {
          case 3:
            this.currentMusicIndex = randomNum(this.playList.length, this.currentMusicIndex);
            break;
          default:
            if (this.currentMusicIndex <= 0) {
              this.currentMusicIndex = this.playList.length - 1;
            } else {
              this.currentMusicIndex--;
            }
            break;
        }
        this.clearCurrentStatus();
        let id = this.playList[this.currentMusicIndex].id;
        this.getMusicInfo(id);
        this.$refs.pCon.innerHTML = '&#xe6dc;';
      },
      // 下一首
      nextPlay() {
        if (this.playList.length === 0) {
          return;
        }
        if (this.playList.length === 1 && this.currentMusicIndex >= 0) {
          return;
        }
        let mode = this.playMode.currentMode;
        switch (mode) {
          case 3:
            this.currentMusicIndex = randomNum(this.playList.length, this.currentMusicIndex);
            break;
          default:
            if (this.currentMusicIndex === this.playList.length - 1) {
              this.currentMusicIndex = 0;
            } else {
              this.currentMusicIndex++;
            }
            break;
        }
        this.clearCurrentStatus();
        let id = this.playList[this.currentMusicIndex].id;
        this.getMusicInfo(id);
        this.$refs.pCon.innerHTML = '&#xe6dc;';
      },
      // 播放/暂停
      togglePlayAudio() {
        if (this.playList.length === 0) {
          return;
        }
        if (this.currentMusicIndex === -1) {
          this.currentMusicIndex = 0;
          let id = this.playList[this.currentMusicIndex].id;
          this.getMusicInfo(id);
          this.$refs.pCon.innerHTML = '&#xe6dc;';
        } else {
          if (this.$refs.audio.paused) {
            this.$refs.pCon.innerHTML = '&#xe6dc;';
            this.$refs.audio.play();
          } else {
            this.$refs.pCon.innerHTML = '&#xe635;';
            this.$refs.audio.pause();
          }
        }
      },
      // 获取音乐信息
      getMusicInfo(id) {
        getMusicUrl({
          id: id
        }).then((data) => {
          if (data.code === ERR_OK) {
            let url = data.data[0].url;
            let type = data.data[0].type;
            this.playMusic(url, type);
            this.applyMiniMode();
          }
        });
        this.getMusicLicInfo(id);
      },
      // 获取歌词
      getMusicLicInfo(id) {
        getMusicLrc({
          id: id
        }).then((data) => {
          if (data.code === ERR_OK) {
            if (data.lrc && data.lrc.lyric) {
              let result = parseLyric(data.lrc.lyric);
              this.rollMusicLyric(result);
            } else {
              this.rollMusicLyric([]);
              this.lrcStr = 'nolrc';
            }
          }
        });
      },
      // 滚动歌词
      rollMusicLyric(arr) {
        let This = this;
        this.$refs.audio.ontimeupdate = function () {
          let self = this;
          arr.forEach((item) => {
            // 当到了某个歌词时间戳时，高亮处理
            if (self.currentTime >= item.time) {
              This.lrcStr = item.text;
            }
          });
        };
      },
      // 播放音乐
      playMusic(url, type) {
        if (!this.$refs.audio.paused) {
          this.$refs.audio.pause();
        }
        this.$refs.audio.src = url;
        this.$refs.audio.play();
        this.dealMusicInfo();
      },
      // 处理音乐信息
      dealMusicInfo() {
        this.musicProgressStatus = true;
        let duration = this.$refs.duration;
        duration.innerHTML = this.playList[this.currentMusicIndex].duration;
        clearInterval(this.timer);
        this.musicProgress();
        this.timer = setInterval(() => {
          this.musicProgress();
        }, 1000);
      },
      // 音乐进度
      musicProgress() {
        let currentTime = this.$refs.currentTime;
        let audio = this.$refs.audio;
        if (!this.isDownSongProgress) {
          currentTime.innerHTML = tocar(audio.currentTime * 100 / 100);
          let rate = (audio.currentTime / audio.duration * 100 / 100);
          if (rate >= 1) {
            rate = 1;
            // 切换歌曲
            this.autoPlay();
          }
          this.musicRate = rate;
        } 
      },
      // mini播放模式的处理
      applyMiniMode() {
        this.isShowMiniMode = true;
        this.currentMusicInfo = this.playList[this.currentMusicIndex];
      },
      // 是否拖动进度条了
      changeDownSongProgress(flag, rate, type) {
        this.isDownSongProgress = flag;
        let currentTime = this.$refs.currentTime;
        let duration = this.$refs.audio.duration;
        currentTime.innerHTML = tocar(duration * rate);
        if (type === 'up') {
          this.$refs.audio.currentTime = duration * rate;
        }
      },
      // 清空播放状态
      clearMusicStatus() {
        this.$refs.audio.pause();
        this.$refs.audio.src = '';
        this.$refs.pCon.innerHTML = '&#xe635;';
        this.currentMusicIndex = -1;
        this.isShowMiniMode = false;
        this.currentMusicInfo = {};
      },
      // 清空当前状态
      clearCurrentStatus() {
        this.musicRate = 0;
        this.lrcStr = '';
      }
    },
    components: {
      'v-voiceProgress': voiceProgress,
      'v-musicProgress': musicProgress,
      'v-miniMode': miniMode,
      'v-musicLrc': musicLrc
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .control-wrap
    position: fixed
    left: 0
    bottom: 0
    min-width: 1024px
    width: 100%
    height: 40px
    line-height: 40px
    border-top: 1px solid #ddd
    box-shadow: 0 -1px 5px #ddd
    .control
      margin: 0 auto
      width: 1024px
      height: 100%
      line-height: inherit
      .play-col
        float: left
        width: 20%
        height: 100%
        margin-top: 4px
        padding: 0 20px
        text-align: center
        font-size: 0
        box-sizing: border-box
        .prev, .con, .next
          display: inline-block
          overflow: hidden
          width: 28px
          height: 28px
          text-align: center
          line-height: 28px
          font-size: 24px
          color: #fff
          background: orangered
          border-radius: 50%
          cursor: pointer
        .con
          margin: 0 15px
          width: 32px
          height: 32px
          line-height: 32px
      .progress-col
        float: left
        width: 42%
        height: 100%
        padding-left: 20px
        font-size: 0
        box-sizing: border-box
        .currentTime, .duration
          display: inline-block
          vertical-align: top
          font-size: 12px
        .progress
          margin-left: 15px
          margin-right: 15px
          width: 74%
      .voice-col
        float: left
        width: 20%
        height: 100%
        padding-left: 20px
        font-size: 0
        box-sizing: border-box
        .voice
          display: inline-block
          margin-right: 10px
          width: 30px
          font-size: 30px
          cursor: pointer
        .progress
          width: calc(100% - 40px)
          &:hover
            .hand
              opacity: 1
          .hand
            opacity: 0
            &.show
              opacity: 1
      .mode-col
        float: left
        width: calc(10% - 20px)
        margin-left: 20px
        text-align: center
        .mode
          display: inline-block
          font-size: 30px
          margin-right: 10px
          cursor: pointer
      .playlist-col
        float: left
        width: 8%
        padding: 0 15px
        text-align: center
        box-sizing: border-box
        cursor: pointer
        .list
          display: inline-block
          vertical-align: top
          width: 30px
          font-size: 36px
        .num
          display: inline-block
          vertical-align: top
          font-size: 12px
    #audio
      display: none
</style>
