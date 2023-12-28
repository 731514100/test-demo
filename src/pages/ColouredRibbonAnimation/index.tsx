
import { htmlRemToPx, useUpdateEffect } from './utils';
import { useEffect, useState } from 'react';
import style from './index.less'
let animation: any;
let canvas: any;
let ctx: any;
const button = { offsetHeight: 0, offsetWidth: htmlRemToPx('1.83rem') };

let disabled = false;
// add Confetti/Sequince objects to arrays to draw them
const confetti: any[] = [];
const sequins: any[] = [];

// ammount to add on each button press
const confettiCount = 150;
const sequinCount = 100;

// "physics" variables
const gravityConfetti = 0.4;
const gravitySequins = 0.55;
const dragConfetti = 0.06;
const dragSequins = 0.02;
const terminalVelocity = 4;
// colors, back side is darker for confetti flipping
const colors = [
  {
    front: '#4cc2f0',
    back: '#43b9ec',
  },
  {
    front: '#0488d5',
    back: '#43b9ec',
  },
  {
    front: '#43b9ec',
    back: '#0488d5',
  },
  {
    front: '#9d08fe',
    back: '#ffd008',
  },
  {
    front: '#ffd008',
    back: '#9d08fe',
  },
  {
    front: '#d50005', // red
    back: '#faf820',
  },
  {
    front: '#8d0a0b', // red
    back: '#345dd1',
  },
];
// helper function to pick a random number within a range
const randomRange = (min: number, max: number) =>
  Math.random() * (max - min) + min;

// helper function to get initial velocities for confetti
// this weighted spread helps the confetti look more realistic
const initConfettoVelocity = (xRange: number[], yRange: number[]) => {
  const x = randomRange(xRange[0], xRange[1]);
  const range = yRange[1] - yRange[0] + 1;
  let y =
    yRange[1] - Math.abs(randomRange(0, range) + randomRange(0, range) - range);
  if (y >= yRange[1] - 1) {
    // Occasional confetto goes higher than the max
    y += Math.random() < 0.25 ? randomRange(1, 3) : 0;
  }
  return {
    x: x,
    y: -y,
  };
};

class Confetto {
  randomModifier: any;
  color: any;
  dimensions: any;
  position: any;
  rotation: any;
  scale: any;
  velocity: any;
  constructor() {
    this.randomModifier = randomRange(0, 99);
    this.color = colors[Math.floor(randomRange(0, colors.length))];
    this.dimensions = {
      x: randomRange(5, 9),
      y: randomRange(8, 15),
    };
    this.position = {
      x: randomRange(
        canvas.width / 2 - button.offsetWidth / 4,
        canvas.width / 2 + button.offsetWidth / 4
      ),
      y: randomRange(
        htmlRemToPx(2.6) + button.offsetHeight / 2 + 8,
        htmlRemToPx(2.6) + 1.5 * button.offsetHeight - 8
      ),
    };
    this.rotation = randomRange(0, 2 * Math.PI);
    this.scale = {
      x: 1,
      y: 1,
    };
    this.velocity = initConfettoVelocity([-9, 9], [6, 11]);
  }
  update() {
    // apply forces to velocity
    this.velocity.x -= this.velocity.x * dragConfetti;
    this.velocity.y = Math.min(
      this.velocity.y + gravityConfetti,
      terminalVelocity
    );
    this.velocity.x += Math.random() > 0.5 ? Math.random() : -Math.random();

    // set position
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    // spin confetto by scaling y and set the color, .09 just slows cosine frequency
    this.scale.y = Math.cos((this.position.y + this.randomModifier) * 0.09);
  }
}

class Sequin {
  color: any;
  radius: any;
  position: any;
  velocity: any;
  constructor({ canvas, button: { offsetWidth, offsetHeight } }: any) {
    this.color = colors[Math.floor(randomRange(0, colors.length))].back;
    this.radius = randomRange(1, 2);
    this.position = {
      x: randomRange(
        canvas.width / 2 - offsetWidth / 3,
        canvas.width / 2 + offsetWidth / 3
      ),
      y: randomRange(
        htmlRemToPx(2.6) + offsetHeight / 2 + 8,
        htmlRemToPx(2.6) + 1.5 * offsetHeight - 8
      ),
    };
    this.velocity = {
      x: randomRange(-6, 6),
      y: randomRange(-8, -12),
    };
  }
  update() {
    // apply forces to velocity
    this.velocity.x -= this.velocity.x * dragSequins;
    this.velocity.y = this.velocity.y + gravitySequins;

    // set position
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}
// Confetto Class
const ColouredRibbonAnimation = ({
  play,
  onSuccess,
}: {
  play: number;
  onSuccess?: () => void;
}) => {
  const [opacity, setOpacity] = useState(1);
  // add elements to arrays to be drawn
  const initBurst = () => {
    for (let i = 0; i < confettiCount; i++) {
      confetti.push(new Confetto());
    }
    for (let i = 0; i < sequinCount; i++) {
      sequins.push(new Sequin({ canvas, button }));
    }
  };
  const render = () => {
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    confetti.forEach((confetto) => {
      const width = confetto.dimensions.x * confetto.scale.x;
      const height = confetto.dimensions.y * confetto.scale.y;

      // move canvas to position and rotate
      ctx.translate(confetto.position.x, confetto.position.y);
      ctx.rotate(confetto.rotation);

      // update confetto "physics" values
      confetto.update();

      // get front or back fill color
      ctx.fillStyle =
        confetto.scale.y > 0 ? confetto.color.front : confetto.color.back;

      // draw confetto
      ctx.fillRect(-width / 2, -height / 2, width, height);

      // reset transform matrix
      ctx.setTransform(1, 0, 0, 1, 0, 0);

      // clear rectangle where button cuts off
      if (confetto.velocity.y < 0) {
        ctx.clearRect(
          canvas.width / 2 - button.offsetWidth / 2,
          canvas.height / 2 + button.offsetHeight / 2,
          button.offsetWidth,
          button.offsetHeight
        );
      }
    });

    sequins.forEach((sequin) => {
      // move canvas to position
      ctx.translate(sequin.position.x, sequin.position.y);

      // update sequin "physics" values
      sequin.update();

      // set the color
      ctx.fillStyle = sequin.color;

      // draw sequin
      ctx.beginPath();
      ctx.arc(0, 0, sequin.radius, 0, 2 * Math.PI);
      ctx.fill();

      // reset transform matrix
      ctx.setTransform(1, 0, 0, 1, 0, 0);

      // clear rectangle where button cuts off
      if (sequin.velocity.y < 0) {
        ctx.clearRect(
          canvas.width / 2 - button.offsetWidth / 2,
          canvas.height / 2 + button.offsetHeight / 2,
          button.offsetWidth,
          button.offsetHeight
        );
      }
    });

    // remove confetti and sequins that fall off the screen
    // must be done in seperate loops to avoid noticeable flickering
    confetti.forEach((confetto, index) => {
      if (confetto.position.y >= canvas.height) confetti.splice(index, 1);
    });
    sequins.forEach((sequin, index) => {
      if (sequin.position.y >= canvas.height) sequins.splice(index, 1);
    });

    animation = window.requestAnimationFrame(render);
  };
  const clickButton = () => {
    console.log('run')
    if (!disabled) {
      if (animation) return;
      disabled = true;
      // Loading stage
      // setTimeout(() => {
      // Completed stage
      setTimeout(() => {
        initBurst();
        render();
        setTimeout(() => {
          setOpacity(0);
        }, 1000);
        setTimeout(() => {
          // Reset button so user can select it again
          disabled = false;
          cancelAnimationFrame(animation as number);
          animation = null;
          setOpacity(1);
          onSuccess?.();
        }, 4000);
      }, 320);
      // }, 1800);
    }
  };
  // re-init canvas if the window size changes
  const resizeCanvas = () => {
    // canvas.width = window.innerWidth;
    canvas.width = Math.min(htmlRemToPx('4.6rem'), window.innerWidth);
    canvas.height = window.innerHeight;
    // cx = ctx.canvas.width / 2;
    // cy = ctx.canvas.height / 2;
  };

  useUpdateEffect(() => {
    clickButton();
  }, [play]);

  useEffect(() => {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    canvas.width = Math.min(htmlRemToPx('4.6rem'), window.innerWidth);
    // canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    window.addEventListener('resize', resizeCanvas);
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
    // canvas.width = 375;
    // canvas.height = 500;
  }, []);
  return (
    <>
      <button type='button' className={style['btn']} style={{
        position: 'absolute',
        zIndex: '1',
        left: '340px',
        top: '250px',
        width: '183px',
        background: 'transparent',
        border: 'none',
        color: '#fff',
        backgroundImage:
          'linear-gradient(90deg, #FEAD6A 1.09%, #FE4C59 66.36%, #F36A70 100.55%)',
        borderRadius: '0.15rem',
        boxShadow: '0px 4px 4px -2px #9e8765',
        transition: 'all 0.3s',
        userSelect: 'none',
        cursor: 'pointer',
      }} onClick={clickButton}>点击查看特效</button>
      <div
        style={{
          pointerEvents: opacity === 0 ? 'inherit' : 'none',
          zIndex: '2',
          position: 'absolute',
          left: `200px`,
          top: '0',
          height: '50px',
          opacity: opacity,
          transition: 'all 2s'
        }}
      >
        <canvas id="canvas"></canvas>
      </div>
    </>
  );
};

export default ColouredRibbonAnimation;
