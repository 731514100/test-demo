export const loadImage = (url: string) => {
  if (!window?.Image) return null;
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = url;
    img.onload = () => {
      resolve(img);
    };
    img.onerror = () => {
      reject(new Error('load image error!'));
    };
  });
};
export const positionX = () => Math.random() * window.innerWidth;
export const randomRange = (start: number, end: number) => {
  const random = (end - start) * Math.random() + start;
  const number = 1;
  const arr = new Array(number).fill('').map((v, i) => random / (i + 1));
  return arr[Math.floor(Math.random() * number)];
};
