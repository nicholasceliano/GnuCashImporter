import { Container } from 'inversify'
import { GnuCashPriceService } from './services/gnucash/gnucashPrice.service'
import { FileUtilityService } from './services/file/fileUtility.service'
import { TDAmeritradeService } from './services/institutions/tdAmeritrade.service'
import { AllyBankService } from './services/institutions/allyBank.service'
import { FileImportService } from './services/file/fileImport.service'
import { GnuCashDatabaseService } from './services/gnucash/gnucashDatabase.service'
import { ConfigurationService } from './services/configuration.service'
import { TransactionParserService } from './services/file/transactionParser.service'
import { AlphaVantageService } from './services/quote/alphaVantage.service'
import { QuotePullerService } from './services/quote/quotePuller.service'
import { UtilityService } from './services/utility.service'
import { USAABankService } from './services/institutions/USAABank.service'
import { WellsFargoBankService } from './services/institutions/wellsFargoBank.service'
import { FileParserService } from './services/file/fileParser.service'

const container = new Container()

container.bind<GnuCashPriceService>(GnuCashPriceService).toSelf()
container.bind<GnuCashDatabaseService>(GnuCashDatabaseService).toSelf()
container.bind<FileUtilityService>(FileUtilityService).toSelf()
container.bind<FileImportService>(FileImportService).toSelf()
container.bind<FileParserService>(FileParserService).toSelf()
container.bind<USAABankService>(USAABankService).toSelf()
container.bind<AllyBankService>(AllyBankService).toSelf()
container.bind<WellsFargoBankService>(WellsFargoBankService).toSelf()
container.bind<TDAmeritradeService>(TDAmeritradeService).toSelf()
container.bind<ConfigurationService>(ConfigurationService).toSelf().inSingletonScope()
container.bind<TransactionParserService>(TransactionParserService).toSelf()
container.bind<UtilityService>(UtilityService).toSelf()

container.bind<QuotePullerService>(QuotePullerService).toSelf()
container.bind<AlphaVantageService>(AlphaVantageService).toSelf()

export { container }
