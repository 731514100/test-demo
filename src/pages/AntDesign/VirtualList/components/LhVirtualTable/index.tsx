import { Table } from 'antd';
import styles from './index.less'
import ResizeObserver from 'rc-resize-observer';
import React, { useEffect, useRef, useState } from 'react';
// @ts-ignore
import { VariableSizeGrid as Grid } from 'react-window';
// @ts-ignore
import _ from 'lodash';
// 获取可滚动节点的父级节点
const findNeedNode: any = (node: any, key: string = 'ant-table-body') => {
  if (node?.className === key) return node;
  console.log(node?.children, 'node?.children')
  if (node?.children) {
    let needNode: any = [];
    [...node.children].forEach((child: any) => {
      needNode.push(findNeedNode(child, key))
    })
    return needNode;
  }
}
const getByteLen = (val:string) => {
  let len = 0;
  for (let i = 0; i < val.length; i++) {
    let a = val.charAt(i);
    if (a.match(/[^\x00-\xff]/ig) != null) {
      len += 2;
    } else {
      len += 1;
    }
  }
  return len;
}
const LhVirtualTable = (props: any) => {
  const { dataSource, columns, scroll } = props;
  const [tableWidth, setTableWidth] = useState(0);
  /* 修改 --------------------------------------------------------------------------------------------------------------*/
  /**
   * lh__pagination @param {object: {pageSize: {number},pageNum: {number},total: {number}}};
   *                @describe {pageSize: '每页条数'}
   *                @describe {pageNum: '处于第几页'}
   *                @describe {total: '数据总数'}
   * lh__onScrollBottom @param { Function }
   *                    @describe 触底回调函数，注意只有数据总数变更了后才会再进行下一步
   * lh__scrollIndex @param { number }
   *                 @describe 快速跳转到表格内的第几行
   */
  const { lh__pagination, lh__onScrollBottom, lh__scrollIndex } = props;
  // 滚动加载
  const [oldDataSourceLen, setOldDataSourceLen] = useState<any>(0)
  const tableRef = useRef<any>(null)
  const _onScroll: any = (res: { scrollLeft: number, scrollTop: number }) => {
    const { scrollLeft, scrollTop } = res;
    const dom = findNeedNode(tableRef.current, 'virtual-grid')?.flat(Infinity)[0];
    const clientHeight = dom?.children[0]?.clientHeight
    if (!clientHeight) return;
    // 这个为滚动条的高度
    const scrollBarHeight = 16;
    if ((clientHeight - scroll.y) + scrollBarHeight > scrollTop + 1 + lh__pagination.pageNum) return;
    const { pageSize, pageNum, total } = lh__pagination;
    const all = pageSize * pageNum;
    if (all > total) return;
    // 表格置空不能有滚动加载
    if (dataSource.length < 1) return;
    // bug: 这块有个问题，如果后端返回列表数据接口报错后或者超时后，就无法进行滚动分页。
    if (oldDataSourceLen === dataSource.length) return;
    setOldDataSourceLen(dataSource.length)
    // 通知父组件
    lh__onScrollBottom({ ...lh__onScrollBottom, pageNum: pageNum + 1 });
  }
  // -----

  // scroll定位
  useEffect(() => {
    scrollPosition(lh__scrollIndex)
  }, [lh__scrollIndex])

  const scrollPosition = (index: number) => {
    console.log(index, 'i')
    const dom = findNeedNode(tableRef.current, 'virtual-grid')?.flat(Infinity)[0];
    gridRef.current.scrollToItem({ rowIndex: index });
    const scrollDom = dom.children[0]
    // gridRef.current.scrollTo({ scrollTop: 1200})
    setTimeout(() => {
      [...scrollDom.children].forEach((node: any, i: number) => {
        node.style.background = 'transparent';
        if (node?.id?.includes(`lh-${index}`)) {
          node.style.background = 'rgba(10, 177, 205, .6)';
        }
      })
    }, 0);
  }
  // -----

  // 表头添加与消失后兼容表内数据
  const [gridKey, setGridKey] = useState(0)
  const [mergedColumns, setMergedColumns] = useState([]);
  useEffect(() => {
    // 没有宽度的个数
    const widthColumnCount = columns!.filter(({ width }: any) => !width).length;
    // 没有宽度且被隐藏的个数
    const wCFilterHidden = columns!.filter(({ hidden, width }: any) => hidden && !width).length;
    // 已经使用的宽度
    const usedWidth = columns!.reduce((pre: number, next: { width: number, hidden: boolean }) => {
      // 如果隐藏则不计算宽度
      if (next.hidden) return pre
      return next.width ? pre + +next.width : pre;
    }, 0)
    setMergedColumns(columns.filter((v: { hidden: boolean }) => !v.hidden)!.map((column: any) => {
      if (column.width) {
        // 判断以哪种宽度去计算最终宽度（单个宽度的总值选那个）
        const widthP = +column.width;
        if (widthColumnCount === 0) return { ...column, width: (widthP / usedWidth) * tableWidth }
        return wCFilterHidden < 1 ? { ...column, width: widthP } : { ...column, width: (widthP / usedWidth) * tableWidth };
      }
      return {
        ...column,
        width: Math.floor((tableWidth - usedWidth) / widthColumnCount),
      };
    }))
    // 通知虚拟列表组件进行宽度更新
    setGridKey(gridKey + 1)
  }, [columns, tableWidth])
  // -----
  /* -------------------------------------------------------------------------------------------------------------- */
  // 虚拟列表 antdesign 官网
  // const { columns, scroll } = props;
  // const [tableWidth, setTableWidth] = useState(0);

  // const widthColumnCount = columns!.filter(({ width }: any) => !width).length;
  // const mergedColumns = columns!.map((column: any) => {
  //   if (column.width) {
  //     return column;
  //   }

  //   return {
  //     ...column,
  //     width: Math.floor(tableWidth / widthColumnCount),
  //   };
  // });

  const gridRef = useRef<any>();
  const [connectObject] = useState<any>(() => {
    const obj = {};
    Object.defineProperty(obj, 'scrollLeft', {
      get: () => {
        if (gridRef.current) {
          return gridRef.current?.state?.scrollLeft;
        }
        return null;
      },
      set: (scrollLeft: number) => {
        if (gridRef.current) {
          gridRef.current.scrollTo({ scrollLeft });
        }
      },
    });

    return obj;
  });

  const resetVirtualGrid = () => {
    gridRef.current?.resetAfterIndices({
      columnIndex: 0,
      shouldForceUpdate: true,
    });
  };

  useEffect(() => resetVirtualGrid, [tableWidth]);
  // ------

  const renderVirtualList = (rawData: object[], { scrollbarSize, ref, onScroll }: any) => {
    ref.current = connectObject;
    const totalHeight = rawData.length * 54;

    return (
      <Grid
        ref={gridRef}
        className="virtual-grid"
        key={gridKey}
        columnCount={mergedColumns.length}
        columnWidth={(index: number) => {
          const { width } = mergedColumns[index];
          return totalHeight > scroll!.y! && index === mergedColumns.length - 1
            ? (width as number) - scrollbarSize - 1
            : (width as number);
        }}
        height={scroll!.y as number}
        rowCount={rawData.length}
        rowHeight={(index: number) => {
          const width = tableRef.current?.clientWidth;
          const baseNumber = 24 * ((+(width > (1920 / 2)) +1))
          const row = rawData[index];
          if (!row) return;
          const max = Object.values(row).reduce((pre, next) => {
            let len = getByteLen(`${next}`)
            if (pre > len) return pre
            else return len
          }, 0)
          return + ((Math.ceil(max / baseNumber) * 24).toFixed(2))
        }}
        width={tableWidth}
        onScroll={(res: { scrollLeft: number }) => {
          const { scrollLeft } = res;
          onScroll({ scrollLeft });
          // 虚拟列表实现
          _onScroll(res)
        }}
      >
        {({
          columnIndex,
          rowIndex,
          style,
        }: {
          columnIndex: number;
          rowIndex: number;
          style: React.CSSProperties;
        }) => {
          const index = rowIndex;
          const column = (mergedColumns as any)[columnIndex];
          const record = (rawData[index] as any)
          const text = record[column.dataIndex]
          return (
            <div
              id={`lh-${rowIndex}-${columnIndex}`}
              className={['virtual-table-cell', columnIndex === mergedColumns.length - 1 ? 'virtual-table-cell-last' : ''].join(' ')}
              style={{ ...style, display: 'flex', alignItems: 'center' }}
              onContextMenu={(event) => {
                event.stopPropagation();
                event.preventDefault();
                // onContextMenuTable?.(record, event);
                console.log(event, record, 'am')
              }}
            >
              <div style={{ width: '100%', textAlign: column.align || 'left', lineHeight: '18px' }}>
                {
                  column.render ? column.render(text, record, index) : `${rowIndex}-${columnIndex}`
                }
              </div>
            </div>
          )
        }}
      </Grid>
    );
  };
  return <>
    <ResizeObserver
      onResize={({ width }) => {
        setTableWidth(width);
      }}
    >
      <Table
        {...props}
        className={styles['virtual-table']}
        columns={mergedColumns.filter((v: any) => !v.hidden)}
        ref={tableRef}
        pagination={false}
        components={{
          body: renderVirtualList,
        }}
      />
    </ResizeObserver>
  </>
}

export default LhVirtualTable
