import { RemoteSwitch } from './switches/remote/remoteSwitch'
import { RendererSwitch } from './switches/renderer/rendererSwitch'

let isElectron = false
const userAgent = navigator.userAgent.toLowerCase()
if (userAgent.indexOf(' electron/') > -1) {
  isElectron = true
}

const ElectronApi: RendererSwitch = isElectron ? require('./switches/renderer/rendererRunning').rendererRunning : require('./switches/renderer/rendererNotRunning').rendererNotRunning
const ElectronWindow: RemoteSwitch = isElectron ? require('./switches/remote/remoteRunning').remoteRunning : require('./switches/remote/remoteNotRunning').remoteNotRunning

export { ElectronApi, ElectronWindow, isElectron }
