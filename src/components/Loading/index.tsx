import styles from './index.less'
import { useState, useEffect } from 'react'
import React from 'react'
const Loading = (component: any, flag: boolean = false) => {
  const { children } = component.props;
  const [show, setShow] = useState(false)
  useEffect(() => {
    changeShow(flag)
  }, [flag])

  const changeShow = (flagS: any) => {
    if (flagS) return setShow(true)
    setTimeout(() => {
      setShow(false)
    }, 300);
  }
  return {
    ...component,
    props: {
      ...component.props,
      children: React.Children.map(children, (x) => [
        <div className={styles['loading-g']} style={{
          opacity: flag ? '1' : '0',
          display: show ? '' : 'none',
        }}>
          加载中...
        </div>,
        x,
      ])
    }
  }
}
export default Loading