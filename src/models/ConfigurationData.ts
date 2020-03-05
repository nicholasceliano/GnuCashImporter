import { DatabaseConnection } from './DatabaseConnection'
import { GnuCashUserDefaults } from './GnuCashUserDefaults'

export type ConfigurationData = {
  GnuCashDbConn: DatabaseConnection;
  GnuCashDefaults: GnuCashUserDefaults;
  AlphaVantageApiKey: string;
}
