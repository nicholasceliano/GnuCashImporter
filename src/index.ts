require('./prototypes/date.prototype');
require('./prototypes/string.prototype');
require('./prototypes/number.prototype');
import 'reflect-metadata';
import { FilePullerService } from './services/file/filePuller.service'
import { Inversify } from './inversify.config';

export class Index {
    constructor(private filePullerService: FilePullerService) { }

    Import(): void {
        console.log('Starting...');
        this.filePullerService.ImportFilesFromDirectory();
    }
}

const filePullerService = new Inversify().container.get(FilePullerService);
new Index(filePullerService).Import();
