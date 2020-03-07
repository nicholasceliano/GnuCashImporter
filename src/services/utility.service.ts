import { injectable } from 'inversify'

@injectable()
export class UtilityService {
  Sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}
