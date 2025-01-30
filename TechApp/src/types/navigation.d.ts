import '@react-navigation/native';

declare module '@react-navigation/native' {
  export type NavigatorScreenParams<T> = {
    [K in keyof T]: undefined extends T[K]
      ? { screen: K; params?: T[K] }
      : { screen: K; params: T[K] };
  }[keyof T];

  export interface NavigationState {
    routes: Array<{
      name: string;
      key: string;
      params?: object;
    }>;
    index: number;
    key?: string;
    routeNames: string[];
    history?: unknown[];
    type?: string;
    stale?: boolean;
  }

  export interface ParamListBase extends Record<string, object | undefined> {}
} 