import { Container } from 'inversify';
import { GnuCashPriceService } from './services/gnucash/gnucashPrice.service';
import { FileUtilityService } from './services/file/fileUtility.service';
import { BankInstitution } from './models/BankInstitution';
import { TDAmeritradeService } from './services/institutions/tdAmeritrade.service';
import { AllyBankService } from './services/institutions/allyBank.service';
import { FilePullerService } from './services/file/filePuller.service';
import { GnuCashDatabaseService } from './services/gnucash/gnucashDatabase.service';

export const SERVICE_REFERENCES = {
    TdAmeritrade: Symbol.for('TDAmeritradeService'),
    AllyBank: Symbol.for('AllyBankService'),
};

export class Inversify {
    private static instance: Inversify;
    private _container?: Container;
    public get container(): Container {
        return this.GetContainer();
    }

    static getInstance(): Inversify {
        if (!Inversify.instance) {
            Inversify.instance = new Inversify();
        }

        return Inversify.instance;
    }

    GetContainer(): Container {
        if (this._container) {
            return this._container;
        }

        this._container = new Container();

        this._container.bind<GnuCashPriceService>(GnuCashPriceService).toSelf();
        this._container.bind<GnuCashDatabaseService>(GnuCashDatabaseService).toSelf();
        this._container.bind<FileUtilityService>(FileUtilityService).toSelf();
        this._container.bind<FilePullerService>(FilePullerService).toSelf()

        this._container.bind<BankInstitution>(SERVICE_REFERENCES.TdAmeritrade).to(TDAmeritradeService);
        this._container.bind<BankInstitution>(SERVICE_REFERENCES.AllyBank).to(AllyBankService);

        return this._container
    }
}
