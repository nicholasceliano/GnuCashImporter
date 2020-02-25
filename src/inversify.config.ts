import { Container } from 'inversify';
import { GnuCashPriceService } from './services/gnucash/gnucashPrice.service';
import { FileUtilityService } from './services/file/fileUtility.service';
import { TDAmeritradeService } from './services/institutions/tdAmeritrade.service';
import { AllyBankService } from './services/institutions/allyBank.service';
import { FilePullerService } from './services/file/filePuller.service';
import { GnuCashDatabaseService } from './services/gnucash/gnucashDatabase.service';

const container = new Container();

container.bind<GnuCashPriceService>(GnuCashPriceService).toSelf();
container.bind<GnuCashDatabaseService>(GnuCashDatabaseService).toSelf();
container.bind<FileUtilityService>(FileUtilityService).toSelf();
container.bind<FilePullerService>(FilePullerService).toSelf()
container.bind<AllyBankService>(AllyBankService).toSelf();
container.bind<TDAmeritradeService>(TDAmeritradeService).toSelf();

export { container };