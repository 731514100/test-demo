import Guide from '@/components/Guide';
import { trim } from '@/utils/format';
import { PageContainer } from '@ant-design/pro-components';
import { Button } from 'antd'
import { useModel } from '@umijs/max';
import styles from './index.less';
import { useEffect, useState } from "react";
import Loading from '@/components/Loading';
// import ImgPosition from '@/components/ImgPosition'; 
// import ImgPositionCir from '@/components/ImgPositionCir';
// import ImgPosition2 from '@/components/ImgPosition2';
// import LhWaveSurfer from '@/components/LhWavesurfer';
// import ImgLine from '@/components/ImgLine';
import ImgLine from '@/components/PointCom';
import _ from 'lodash'

const HomePage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { name } = useModel('global');
  const clickEvent = () => {
    setLoading(true)
    setTimeout(() => { setLoading(false) }, 1000)
  }

  const [point, setPoint] = useState([0, 0]);
  const [lineList, setLineList] = useState<any>([])
  useEffect(() => {
    const _point: any = [];
    setLineList(new Array(30).fill('').reduce((pre) => {
      console.log(pre)
      const lastIndex = pre.length - 1;
      return [
        ...pre,
        [pre?.[lastIndex]?.[1] ? pre[lastIndex][1] : [_.random(0, 1600), _.random(0, 400)], [_.random(0, 1600), _.random(0, 400)]]
      ];
    }, []))
    setLineList((v: any) => {
      v.forEach(([begin, end]: any, i: number) => {
        if (!i) _point.push([30, 30], begin);
        _point.push(end)
      })
      let number = 0;
      const timer: any = setInterval(() => {
        number++;
        if (!_point[number]) return clearInterval(timer)
        setPoint(_point[number])
      }, 1000)
      return v
    })
    // setInterval(() => {
    //   setPoint([_.random(0, 1500), _.random(0, 200)])
    // }, 1000)
  }, [])

  return (
    <PageContainer ghost>
      <div className={styles.container}>
        {
          Loading(<div style={{ width: '1000px', height: '400px' }}>
            {/* <Button onClick={clickEvent.bind({})}>test</Button> */}
            {/* <ImgPosition></ImgPosition> */}
            {/* <ImgPositionCir></ImgPositionCir> */}
            {/* <ImgPosition2></ImgPosition2> */}
            {/* <LhWaveSurfer /> */}
            <ImgLine point={point} lineList={lineList} config={{ bg: "http://localhost:8081/images/月饼.jpg", point: require('@/assets/images/pointCon/机器人.png') }} />
          </div >, loading)
        }
        <Guide name={trim(name)} />
      </div>
    </PageContainer>
  );
};

export default HomePage;
