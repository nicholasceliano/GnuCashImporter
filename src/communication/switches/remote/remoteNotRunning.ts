import { RemoteSwitch } from './remoteSwitch'

class RemoteNotRunning implements RemoteSwitch {
  private remoteNotRunning = 'Electon must be connected to use this function';

  close() {
    console.log(this.remoteNotRunning)
  }

  maximizeResize() {
    console.log(this.remoteNotRunning)
  }

  minimize() {
    console.log(this.remoteNotRunning)
  }
}

const remoteNotRunning = new RemoteNotRunning()

export { remoteNotRunning }
