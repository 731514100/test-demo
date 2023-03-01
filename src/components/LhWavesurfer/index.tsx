import { useEffect } from 'react'
// @ts-ignore
import WaveSurfer from 'wavesurfer.js'
// @ts-ignore
// import CursorPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.cursor.js'
// @ts-ignore
// import Timeline from 'wavesurfer.js/dist/plugin/wavesurfer.timeline.js'
const LhWaveSurfer = () => {
  const init = () => {
    const fileName = '中国广播之友合唱团 - 中华人民共和国国歌.mp3'
    let wavesurfer = WaveSurfer.create({
      // 需要的容器盒子
      container: '#waveform',
      // 是否出现滚动条
      scrollParent: true,
      // 播放进行时线条颜色
      cursorColor: '#fff',
      // 播放进行时线条宽度
      cursorWidth: 2,
      // 未播放的波纹颜色
      waveColor: 'transparent',
      // 已播放的波纹颜色
      progressColor: 'blue',
      // 倍速
      audioRate: 1,
      height: 400
    });
    // 加载音频文件
    wavesurfer.load(require(`@/assets/audio/${fileName}`));
    wavesurfer.on('ready', function () {
      console.log(11)
      wavesurfer.play();
    });
  }
  useEffect(() => {
    init();
  }, [])

  return <div>
    <div id="waveform"></div>
  </div>
}
export default LhWaveSurfer