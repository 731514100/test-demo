import React, { Component } from 'react';
// import './index.css';
import money1 from '@/assets/images/picture.png';
import money2 from '@/assets/images/picture2.jpg';
import money3 from '@/assets/images/picture3.jpg';
import {
  loadImage,
  positionX,
  randomRange,
} from './utils';
type minMax = [number, number];
const config = {
  // speed value area
  speedLimit: [1, 4] as minMax,
  // display quantity
  density: [5, 15] as minMax,
  imgInfo: {
    // image width
    w: 50,
    // image height
    h: 50,
    // image rotate value area
    randomLimit: [0.8, 1] as minMax,
  },
  // image number max show
  numberMaxLimit: 100,
};
const { speedLimit, imgInfo, numberMaxLimit, density } = config;

export default class CanvasCom extends Component {
  // ratio = null;
  ctx: any = null;

  wid = 0;
  hei = 0;
  packedArr: ReturnType<typeof this.createPack>[] = [];
  // display quantity
  density = {
    min: density[0],
    max: density[1],
  };

  clearTime: any = null;
  img: any = [];

  componentDidMount() {
    this.loadingImg();
  }
  loadingImg() {
    Promise.all([
      loadImage(money1),
      loadImage(money2),
      loadImage(money3),
      // loadImage(money4.src),
    ]).then((res) => {
      this.img = res;
      this.wid = window.innerWidth;
      this.hei = window.innerHeight;
      this.initCanvas();
      this.start();
    });
  }
  getPixelRatio = (context: any) => {
    const backingStore =
      context.backingStorePixelRatio ||
      context.webkitBackingStorePixelRatio ||
      context.mozBackingStorePixelRatio ||
      context.msBackingStorePixelRatio ||
      context.oBackingStorePixelRatio ||
      context.backingStorePixelRatio ||
      1;
    return (window.devicePixelRatio || 1) / backingStore;
  };
  initCanvas() {
    const canvas: HTMLCanvasElement | any = document.getElementById('canvas');
    canvas.width = this.wid;
    canvas.height = this.hei;
    if (canvas.getContext) {
      // 判断是否有此方法，如果有才能进入
      this.ctx = canvas.getContext('2d');
      // this.ratio = this.getPixelRatio(this.ctx);
    }
  }
  createPack() {
    const imgRandom = randomRange(...imgInfo.randomLimit);
    return {
      x: positionX(),
      y: 0,
      img: this.img[Math.floor(randomRange(0, 3))],
      // rotate
      rotate: randomRange(-45, 45),
      direction: Math.random(),
      speed: randomRange(...speedLimit),
      // rotate speed
      round: 0,
      roundSpeed: randomRange(1, 2),
      imgInfo: {
        w: imgInfo.w * imgRandom,
        h: imgInfo.h * imgRandom,
      },
    };
  }
  pushPackArr = () => {
    const { max, min } = this.density;
    const random = Math.floor(Math.random() * (max - min) + min);
    this.packedArr.push(
      ...new Array(random).fill('').map(() => this.createPack())
    );
    this.clearTime = setTimeout(() => {
      if (this.packedArr.length > numberMaxLimit)
        return clearTimeout(this.clearTime);
      this.pushPackArr();
    }, 300);
  };
  drawPacked = () => {
    this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    this.packedArr.forEach((item, index) => {
      const r = ((item.rotate + item.round) * Math.PI) / 180;
      const temp = item.y - item.x * Math.tan(r);
      const top = temp * Math.cos(r);
      const left = item.x / Math.cos(r) + temp * Math.sin(r);
      this.ctx.save();
      this.ctx.rotate(r);
      this.ctx.drawImage(
        item.img,
        left - item.imgInfo.w / 2,
        top - item.imgInfo.h / 2,
        item.imgInfo.w,
        item.imgInfo.h
      );
      this.ctx.restore();
      if (item.direction < 0.5) {
        item.round -= item.roundSpeed;
      } else {
        item.round += item.roundSpeed;
      }
      if (item.y + item?.speed <= window.innerHeight) {
        item.y = item.y + item?.speed || 0;
      } else {
        // init
        item.y = 0 + item?.speed || 0;
        item.x = positionX();
        Object.assign(item, this.createPack());
      }
    });
    window.requestAnimationFrame(this.drawPacked);
  };

  start = () => {
    this.pushPackArr();
    this.drawPacked();
  };

  render() {
    return (
      <div style={{ position: 'absolute', left: 0, top: 0 }}>
        <canvas id="canvas"></canvas>
      </div>
    );
  }
}
