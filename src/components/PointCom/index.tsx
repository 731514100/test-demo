import { memo, useEffect, useState } from "react";

// 点位移动花费的总时长
const allSpeedTime = 1000;
// 一次点位移动花费的时长
const oneSpeedTime = 17;
// 点位大小
const symbalSize = [30, 30];

// 每次需要移动多长的距离
const movePosition = (s: number) => {
  const n = allSpeedTime / oneSpeedTime;
  return (s / n)
}

let timer: any = null;

/**
 * 计算旋转角度
 * 
 * @param {Array} centerPoint 旋转中心坐标
 * @param {Array} startPoint 旋转起点
 * @param {Array} endPoint 旋转终点
 * 
 * @return {number} 旋转角度
 */

function getRotateAngle(centerPoint: any, startPoint: any, endPoint: any) {
  const [centerX, centerY] = centerPoint;
  const [rotateStartX, rotateStartY] = startPoint;
  const [touchX, touchY] = endPoint;
  // 两个向量
  const v1 = [rotateStartX - centerX, rotateStartY - centerY];
  const v2 = [touchX - centerX, touchY - centerY];
  const numerator = v1[0] * v2[1] - v1[1] * v2[0];
  const denominator = Math.sqrt(Math.pow(v1[0], 2) + Math.pow(v1[1], 2))
    * Math.sqrt(Math.pow(v2[0], 2) + Math.pow(v2[1], 2));
  const sin = numerator / denominator;
  return Math.asin(sin);
}

/**
 * 
 * 根据旋转起点、旋转中心和旋转角度计算旋转终点的坐标
 * 
 * @param {Array} startPoint  起点坐标
 * @param {Array} centerPoint  旋转点坐标
 * @param {number} angle 旋转角度
 * 
 * @return {Array} 旋转终点的坐标
 */

function getEndPointByRotate(startPoint: any, centerPoint: any, angle: any) {
  const [centerX, centerY] = centerPoint;
  const [x1, y1] = [startPoint[0] - centerX, startPoint[1] - centerY];
  const x2 = x1 * Math.cos(angle) - y1 * Math.sin(angle);
  const y2 = x1 * Math.sin(angle) + y1 * Math.cos(angle);
  return [x2 + centerX, y2 + centerY];
}

interface config {
  bg: string; // 图片url
  point: string; // 图片url

}

const moveDirection = ([bx, by]: any, [ex, ey]: any) => {
  const [x, y] = [ex, ey];
  const areaJudge = ([cx, cy]: any, [x, y]: any) => cx - x > 0 ? (cy - y > 0 ? 90 : 180) : cy - y > 0 ? 0 : 270;
  const a = Math.abs(y - by);
  const b = Math.abs(x - bx);
  const c = Math.sqrt(Math.pow(b, 2) + Math.pow(a, 2));
  const arrJudgeNumber = areaJudge([bx, by], [x, y]);
  let angle = 0;
  if (arrJudgeNumber < 90) {
    angle = a / c;
  } else if (arrJudgeNumber < 180) {
    angle = b / c;
  } else if (arrJudgeNumber < 270) {
    angle = a / c;
  } else {
    angle = b / c;
  }
  const end = angle * 90 + arrJudgeNumber;
  return end - 360;
}

const drawLine: any = (context: any, begin: Array<number>, end: Array<number>) => {
  const [x0, y0] = begin;
  const [x1, y1] = end;
  context.beginPath()
  context.strokeStyle = 'yellow'
  context.lineWidth = 4
  context.moveTo(x0, y0)
  context.lineTo(x1, y1)
  context.stroke()
}

const createImage = (url: any, cb: any) => {
  const imgObj = new Image();
  imgObj.src = url;
  imgObj.onload = function (e) {
    cb?.(e)
  }
  return imgObj
}
/**
 * 图片点位移动组件
 * 
 * @param {Array<number>} point 点位数组 [1,1]
 * @param {Array<Array>} lineList 线路数组 [[{x: 1, y: 1} 起点数据, {x: 1, y: 1} 终点数据]]
 */

const ImgPointSelf = memo(({ point, lineList, config }: any) => {
  const [pointImg, setPointImg] = useState(null);
  const [scale, setScale] = useState(1)
  const [oldPoint, setOldPoint] = useState( symbalSize)


  // 第一个： 起点，第二个：终点；
  const move = (img: any, [bx, by]: Array<number>, [ex, ey]: Array<number>) => {
    if (timer) clearInterval(timer)
    const canvas: any = document.getElementById('canvas');
    if (!canvas || !img) return;
    let ctx = canvas.getContext('2d');
    let moveX = bx - symbalSize[0] / 2;
    let moveY = by - symbalSize[0] / 2;
    let now = 0;
    // const rotateNumb = getRotateAngle( symbalSize, [bx, by], [ex, ey]);
    const rotateNumb = 0;
    timer = setInterval(() => {
      now += oneSpeedTime;
      // const s = Math.sqrt(Math.pow(Math.abs(ex - bx), 2) + Math.pow(Math.abs(ey - by), 2));
      const oneSX = movePosition(Math.abs(ex - bx));
      const oneSY = movePosition(Math.abs(ey - by));
      const fn = () => {
        // // 背景
        // setBgImgParams((v: any) => {
        //   ctx.clearRect(0, 0, canvas.width, canvas.height);
        //   v.length > 2 && ctx.drawImage(...v);
        //   return v
        // })
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const pointFn = () => {
          // 获取角度
          // const centerX = moveX - symbalSize[0] / 2;
          // const centerY = moveY - symbalSize[1] / 2;
          // ctx.translate(centerX, centerY)
          // ctx.rotate(rotateNumb);
          const [endx, endy] = [ex, ey];
          // const [endx, endy] = getEndPointByRotate([ex, ey], [centerX, centerY], rotateNumb);
          if (bx < endx) {
            moveX += oneSX
          } else {
            moveX -= oneSX
          }
          if (by < endy) {
            moveY += oneSY
          } else {
            moveY -= oneSY
          }
          // 最新点位
          // ctx.drawImage(img, moveX, moveY, ...symbalSize);

          // ctx.rotate(-rotateNumb);
          // ctx.translate(-centerX, -centerY)

          ctx.drawImage(img, Math.ceil(moveX), Math.ceil(moveY), ...symbalSize);
        }
        pointFn();

        if (now >= allSpeedTime) {
          clearInterval(timer)
        }
      }
      fn();
    }, oneSpeedTime)
  }
  // 初始化
  const init = () => {
    const bgCanvas: any = document.getElementById('bgCanvas');
    const canvas: any = document.getElementById('canvas');
    canvas.width = '1000';
    canvas.height = '800';
    bgCanvas.width = '1000';
    bgCanvas.height = '800';
    let bgCtx = bgCanvas.getContext('2d');
    let ctx = canvas.getContext('2d');
    // 渲染背景图
    createImage(config.bg || "http://localhost:8081/images/月饼.jpg", (e: any) => {
      const { width, height } = e.target
      const scale = width > height ? canvas.width / width : canvas.height / height
      setScale(scale);
      bgCtx.drawImage(e.target, 0, 0, width * scale, height * scale);
    })
    // 渲染点位图
    const point: any = createImage(config.point, (e: any) => {
      ctx.drawImage(e.target, 0, 0, ...symbalSize);
    })
    setPointImg(point)

  }

  useEffect(() => {
    move(pointImg, oldPoint?.map((v: any) => v * scale) ||  symbalSize, point?.map((v: any) => v * scale) ||  symbalSize)
    setOldPoint(point)
  }, [point])

  useEffect(() => {
    const bgCanvas: any = document.getElementById('bgCanvas');
    let bgCtx = bgCanvas.getContext('2d');
    const handleScale = (arr: any) => arr.map((v: any) => v * scale)
    // 划路径图
    lineList.forEach(([begin, end]: any) => drawLine(bgCtx, handleScale(begin), handleScale(end)))
  }, [lineList])


  useEffect(() => {
    init();
  }, [])
  return <div style={{ border: '1px solid #f60', position: "relative" }}>
    <canvas id="bgCanvas" width="150" height="150" style={{ zIndex: 1 }}></canvas>
    <canvas id="canvas" width="150" height="150" style={{ zIndex: 2, position: "absolute", top: 0, left: 0 }}></canvas>
  </div>
}, (pre, next) => (pre.point === next.point))

export default ImgPointSelf