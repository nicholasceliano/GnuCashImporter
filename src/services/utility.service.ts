import { injectable } from 'inversify';

@injectable()
export class UtilityService {
  Sleep(ms: number) {
    return new Promise(res => setTimeout(res, ms))
  }
}
