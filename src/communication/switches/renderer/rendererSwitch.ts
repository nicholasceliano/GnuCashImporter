export interface RendererSwitch {
  /* eslint-disable */
  send(channel: string, ...args: any[]): void;
  on(channel: string, listener: (event: any, ...args: any[]) => void): void | Electron.IpcRenderer;
  removeAllListeners(channel: string): void | Electron.IpcRenderer;
}
