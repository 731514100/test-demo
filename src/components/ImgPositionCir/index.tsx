import { useState } from 'react';
const w = 155;
const h = 155;
const positionInfo = {
  top: [w / 2, 22],
  left: [22, h / 2],
  right: [w - 22, h / 2],
  bottom: [w / 2, h - 22],
  center: [w / 2, h / 2],
}
/**
 * 圆形区域计算
 * @param param0 Array<number> 中心点位置（[centerX, centerY]）
 * @param radius number 圆半径
 * @param param2 Array<number> 鼠标当前的x轴与y轴的位置（[x, y]）
 * @returns Boolean 判断当前鼠标位置是否在给定的区域内；
 */
const cirCountRule = ([cx, cy]: Array<number>, radius: number, [x, y]: Array<number>) => Math.sqrt(Math.pow(Math.abs(cx - x), 2) + Math.pow(Math.abs(cy - y), 2)) < radius;
// 机器人车体控制 当前位置是否可被点击
const positionObj = ([x, y]: any) => ({
  top: cirCountRule(positionInfo.top, 16, [x, y]),
  left: cirCountRule(positionInfo.left, 16, [x, y]),
  right: cirCountRule(positionInfo.right, 16, [x, y]),
  bottom: cirCountRule(positionInfo.bottom, 16, [x, y]),
  center: cirCountRule(positionInfo.center, 25, [x, y]),
})
const Page = () => {
  const [cursor, setCursor] = useState(false); // true pointer；false default
  const xxMouse = (e: any) => setCursor(
    Object.values(
      positionObj([e.nativeEvent.offsetX, e.nativeEvent.offsetY])
    )
      .reduce((pre, value: any) => pre || value, false)
  );
  const xxClick = (e: any) => {
    try {
      Object.entries(
        positionObj([e.nativeEvent.offsetX, e.nativeEvent.offsetY])
      )
        .reduce((pre, [key, value]: any) => {
          // 同时只会有一种出现
          if (pre || value) {
            throw [key, value]
          }
          return pre || value;
        }, false)
    } catch (info: any) {
      // 点击后的逻辑描写处
      console.log(info[0])
    }
  }
  return <img
    src={require('@/assets/images/picture.png')}
    alt=""
    style={{
      width: '155px',
      height: '155px',
      pointerEvents: 'auto',
      cursor: !cursor ? 'auto' : 'pointer'
    }}
    onMouseMove={xxMouse}
    onClick={xxClick}
  />
}
export default Page