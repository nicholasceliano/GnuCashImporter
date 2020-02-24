import * as fs from 'fs';
import { GnuCashDatabaseService } from "../gnucash/gnucashDatabase.service";
import { AllyBankService } from "../institutions/allyBank.service";
import { GnuCashTransaction } from "../../models/GnuCashTransaction";
import { BankInstitution } from '../../models/BankInstitution';
import { FileUtilityService } from './fileUtility.service';
import { environment } from '../../environments/environment';
import { TDAmeritradeService } from '../institutions/tdAmeritrade.service';
import { GnuCashImportMetaData } from '../../models/GnuCashImportMetaData';

export class FilePullerService {
    private allyBank: AllyBankService;
    private tdAmeritrade: TDAmeritradeService;
    private fileUtility: FileUtilityService;
    private gnuCash: GnuCashDatabaseService;

    constructor() {
        this.allyBank = new AllyBankService();
        this.tdAmeritrade = new TDAmeritradeService();
        this.fileUtility = new FileUtilityService();
        this.gnuCash = new GnuCashDatabaseService();
    }

    ImportFilesFromDirectory(): void {
        const dirName = environment.fileUploadDirectory;

        fs.readdir(dirName, (err, fileNames) => {
            if (err) throw err;

            fileNames.forEach((fileName) => {
                const filePath = `${dirName}/${fileName}`;

                if (this.fileUtility.IsValidFile(filePath)) {
                    fs.readFile(filePath, 'utf-8', (err, fileContent) => {
                        if (err) throw err;

                        const importMetaData = this.gnuCash.InsertTransactions(this.getTransactionsFromFile(fileName, fileContent));
                        this.archiveFile(fileName, importMetaData);
                    });
                }
            });
        });
    }

    private getTransactionsFromFile(fileName: string, fileContent: string): GnuCashTransaction[] {
        const filePrefix = this.fileUtility.GetFilePrefix(fileName);
        const fileType = this.fileUtility.GetFileType(fileName);

        switch (filePrefix) {
            case 'ALLY':
                return this.importFile(this.allyBank, fileType, fileContent);
            case 'TDAM':
                return this.importFile(this.tdAmeritrade, fileType, fileContent);
            default:
                throw ('Invalid File Prefix');
        }
    }

    private importFile(institution: BankInstitution, fileType: string, fileContent: string): GnuCashTransaction[] {
        switch (fileType) {
            case '.pdf':
                return institution.ImportPDF();
            case '.csv':
                return institution.ImportCSV(fileContent);
            default:
                throw ('Invalid File Type')
        }
    }

    private archiveFile(fileName: string, importMetaData: GnuCashImportMetaData): void {
        const filePrefix = this.fileUtility.GetFilePrefix(fileName);
        const fileType = this.fileUtility.GetFileType(fileName);
        const destFolder = `${environment.fileUploadDirectory}/${environment.archiveFolderName}`;
        const destFileName = `${filePrefix}_${importMetaData.EarliestRecordDate.getTime()}_${importMetaData.LatestRecordDate.getTime()}${fileType}`;

        fs.rename(`${environment.fileUploadDirectory}/${fileName}`, `${destFolder}/${destFileName}`, (err) => {
            if (err) throw err;
        });
    }
}