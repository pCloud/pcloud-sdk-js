// flow-typed signature: 7600e198a1f1c02b2ecbe41fac2aaac6
// flow-typed version: c6154227d1/rimraf_v2.x.x/flow_>=v0.104.x

declare module 'rimraf' {
  declare type Options = {
    maxBusyTries?: number,
    emfileWait?: number,
    glob?: boolean,
    disableGlob?: boolean,
    ...
  };
  
  declare type Callback = (err: ?Error, path: ?string) => void;

  declare module.exports: {
    (f: string, opts?: Options | Callback, callback?: Callback): void,
    sync(path: string, opts?: Options): void,
    ...
  };
}
