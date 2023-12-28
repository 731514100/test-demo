import { useEffect, useRef, EffectCallback, DependencyList } from 'react';

export const htmlRemToPx = (rem: number | string) => {
  if (typeof window === 'undefined') return 0;
  // eslint-disable-next-line no-param-reassign
  rem = typeof rem === 'string' ? parseFloat(rem) : rem;
  const winW = window.innerWidth;
  if (winW < 769) {
    return (winW / 375) * 100 * rem;
  } else if (winW < 1200) {
    return (winW / 768) * 100 * rem;
  } else {
    return (1200 / 1200) * 100 * rem;
  }
};


export const useUpdateEffect = (fn: EffectCallback, deps: DependencyList) => {
  const didMountRef = useRef(false);

  // for react-refresh
  useEffect(() => {
    return () => {
      didMountRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
    } else {
      return fn?.();
    }
  }, deps);
};

export default useUpdateEffect;
