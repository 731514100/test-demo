import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: '@umijs/max',
  },
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      name: '机器人移动',
      path: '/home',
      component: './Home',
    },
    {
      name: '红包雨功能',
      path: '/redEnvelopeRain',
      component: './RedEnvelopeRain',
    },
    {
      name: '按钮之彩带特效',
      path: '/colouredRibbonAnimation',
      component: './ColouredRibbonAnimation',
    },
    {
      name: '权限演示',
      path: '/access',
      component: './Access',
    },
    {
        name: ' CRUD 示例',
        path: '/table',
        component: './Table',
    },
  ],
  npmClient: 'npm',
});

