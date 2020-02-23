import { FilePuller } from "./services/file/filePuller.service"

console.log('Starting...');
new FilePuller().ImportFilesFromDirectory();