import { useState } from 'react';
const zPositionInfo = {
  top: [0, 90],
  left: [90, 180],
  bottom: [180, 270],
  right: [270, 0],
}
/**
 * 圆形区域计算
 * @param param0 Array<number> 中心点位置（[centerX, centerY]）
 * @param radius number 圆半径
 * @param param2 Array<number> 鼠标当前的x轴与y轴的位置（[x, y]）
 * @returns Boolean 判断当前鼠标位置是否在给定的区域内；
 */
const cirCountRule = ([cx, cy]: Array<number>, radius: number, [x, y]: Array<number>) => Math.sqrt(Math.pow(Math.abs(cx - x), 2) + Math.pow(Math.abs(cy - y), 2)) < radius;

// 判断当前鼠标位置在哪个区域:区域如下
// 2 1
// 3 4
const areaJudge = ([cx, cy]: any, [x, y]: any) => cx - x > 0 ? (cy - y > 0 ? 90 : 180) : cy - y > 0 ? 0 : 270;
/**
 * 
 * @param param0 Array<number> 限制区域角度：（[45°, 90°]）；限制：0 - 360；
 * @param param1 Array<number> 圆中心点位置：([centerX, centerY])
 * @param param2 Array<number> 当前鼠标位置：([x, y])
 * @param innerRadio Number 内部圆圈的半径
 * @param outRadio Number 外部圆圈的半径
 * @returns 
 */
const limitCirRule = ([beginAngle, endAngle]: any, [cx, cy]: any, [x, y]: any, innerRadio: any, outRadio: any) => {
  // 内部空白宽度
  const unlessWidth = 6;
  const a = Math.abs(y - cy);
  const b = Math.abs(x - cx);
  const c = Math.sqrt(Math.pow(b, 2) + Math.pow(a, 2));
  const arrJudgeNumber = areaJudge([cx, cy], [x, y]);
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
  const resultAngle = angle * 90 + arrJudgeNumber;
  // 内部圆区域
  if (innerRadio > 0 && cirCountRule([cx, cy], innerRadio + unlessWidth, [x, y])) return false;
  if (innerRadio < 1 && c > outRadio) {
    return false
  }
  if (c > outRadio) return false;
  if (endAngle < beginAngle) return beginAngle < resultAngle || resultAngle < endAngle;
  return beginAngle < resultAngle && resultAngle < endAngle;

}
// 当前位置是否可被点击
const zPositionObj = ([x, y]: any) => ({
  topRight: limitCirRule(zPositionInfo.top, [155 / 2 + 4, 155 / 2 - 8], [x, y], 26, 155 / 2),
  LeftBottom: limitCirRule(zPositionInfo.bottom, [155 / 2 - 4, 155 / 2], [x, y], 34, 155 / 2),
  bottomRight: limitCirRule(zPositionInfo.right, [155 / 2 + 4, 155 / 2], [x, y], 34, 155 / 2),
  leftTop: limitCirRule(zPositionInfo.left, [155 / 2 - 4, 155 / 2 - 8], [x, y], 26, 155 / 2),
  center: cirCountRule([155 / 2, 155 / 2 - 4], 32, [x, y]),
})
const ImgPosition = () => {
  const [cursor, setCursor] = useState(false); // true pointer；false default
  const xxMouse = (e: any) => setCursor(
    Object.values(
      zPositionObj([e.nativeEvent.offsetX, e.nativeEvent.offsetY])
    )
      .reduce((pre, value: any) => pre || value, false)
  );
  const xxClick = (e: any) => {
    try {
      Object.entries(
        zPositionObj([e.nativeEvent.offsetX, e.nativeEvent.offsetY])
      )
        .reduce((pre, [key, value]: any) => {
          // 同时只会有一种出现
          if (pre || value) throw [key, value]
          return pre || value;
        }, false)
    } catch (info: any) {
      // 点击后的逻辑描写处
      console.log(info?.[0])
    }
  }
  return <img
    src={require('@/assets/images/picture3.jpg')}
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
export default ImgPosition