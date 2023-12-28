// This file is generated by Umi automatically
// DO NOT CHANGE IT MANUALLY!
/// <reference types="D:/demo/github/test-demo/node_modules/@ant-design/pro-components" />
    import type { ProLayoutProps, HeaderProps } from "D:/demo/github/test-demo/node_modules/@ant-design/pro-components";
    import type InitialStateType from '@@/plugin-initialState/@@initialState';
           type InitDataType = ReturnType<typeof InitialStateType>;
        

    import type { IConfigFromPlugins } from '@@/core/pluginConfig';

    export type RunTimeLayoutConfig = (initData: InitDataType) => Omit<
      ProLayoutProps,
      'rightContentRender'
    > & {
      childrenRender?: (dom: JSX.Element, props: ProLayoutProps) => React.ReactNode;
      unAccessible?: JSX.Element;
      noFound?: JSX.Element;
      logout?: (initialState: InitDataType['initialState']) => Promise<void> | void;
      rightContentRender?: (
        headerProps: HeaderProps,
        dom: JSX.Element,
        props: {
          userConfig: IConfigFromPlugins['layout'];
          runtimeConfig: RunTimeLayoutConfig;
          loading: InitDataType['loading'];
          initialState: InitDataType['initialState'];
          setInitialState: InitDataType['setInitialState'];
        },
      ) => JSX.Element;
      rightRender?: (
        initialState: InitDataType['initialState'],
        setInitialState: InitDataType['setInitialState'],
        runtimeConfig: RunTimeLayoutConfig,
      ) => JSX.Element;
    };
