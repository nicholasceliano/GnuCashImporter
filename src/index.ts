require('./prototypes/date.prototype');
require('./prototypes/string.prototype');
require('./prototypes/number.prototype');
import { FilePullerService } from "./services/file/filePuller.service"

console.log('Starting...');
new FilePullerService().ImportFilesFromDirectory();