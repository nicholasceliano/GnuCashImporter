require('./prototypes/date.prototype');
require('./prototypes/string.prototype');
require('./prototypes/number.prototype');
import { FilePullerService } from './services/file/filePuller.service'

export class Index {
    constructor(private filePullerService: FilePullerService) { }

    Import(): void {
        console.log('Starting...');
        this.filePullerService.ImportFilesFromDirectory();
    }
}