<template>
  <div class="progress" ref="progress">
    <div class="line" ref="line">
      <div class="hand" ref="hand"></div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import draw from 'common/js/js-draw';
  export default {
    props: {
      rate: {
        type: Number,
        default: 0
      },
      status: {
        type: Boolean
      }
    },
    data() {
      return {
        isDown: false,
        returnRate: 0
      };
    },
    watch: {
      rate() {
        this.changeLine(this.rate);
      },
      status() {
        this.drawProgress();
      }
    },
    mounted() {
      this.changeLine(this.rate);
    },
    methods: {
      changeLine(num) {
        this.$refs.line.style.width = num * 100 + '%';
      },
      drawProgress() {
        if (!this.status) {
          return;
        }
        draw.init({
          el: this.$refs.hand,
          area: this.$refs.progress,
          drawY: false,
          callback_move: (data) => {
            let moveX = data.move.X - data.start.X;
            this.returnRate = parseInt((moveX / data.total.X) * 100) / 100;
            this.changeLine(this.returnRate);
            this.isDown = true;
            this.$emit('music-progress-down', this.isDown, this.returnRate, 'move');
          },
          callback_up: () => {
            this.isDown = false;
            this.$emit('music-progress-down', this.isDown, this.returnRate, 'up');
          }
        });
      }
    }
  };

</script>

<style lang="stylus" rel="stylesheet/stylus">
  .progress
    position: relative
    display: inline-block
    vertical-align: top
    margin: 18px 0
    height: 4px
    background: rgba(0, 0, 0, .3)
    border-radius: 5px
    .line
      position: relative
      width: 0
      height: 100%
      background: orangered
      border-radius: 5px
      -webkit-transition: width .3s linear
      transition: width .3s
      .hand
        position: absolute
        right: -6px
        top: -4px
        width: 10px
        height: 10px
        background: #fff
        border: 1px solid #ddd
        border-radius: 50%
        cursor: pointer
        &::after
          content: ""
          position: absolute
          left: 3px
          top: 3px
          width: 4px
          height: 4px
          background: orangered
          border-radius: 50%
</style>
