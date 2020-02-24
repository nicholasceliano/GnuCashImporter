import * as fs from 'fs';

export class FileUtilityService {
    GetFilePrefix(fileName: string): string {
        if (fileName.indexOf('_') > -1) {
            return fileName.split('_')[0]
        }

        throw ('File not in correct format');
    }

    GetFileType(fileName: string): string {
        if (fileName.indexOf('.') > -1) {
            return fileName.substring(fileName.lastIndexOf('.'), fileName.length);
        }

        throw ('File not in correct format');
    }

    IsValidFile(filePath: string): boolean {
        return fs.lstatSync(filePath).isFile() && (filePath.indexOf('.gitignore') === -1);
    }
}