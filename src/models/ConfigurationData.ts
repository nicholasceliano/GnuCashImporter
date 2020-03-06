import { DatabaseConnection } from './DatabaseConnection'
import { GnuCashUserDefaults } from './gnuCash/GnuCashUserDefaults'

export type ConfigurationData = {
  GnuCashDbConn: DatabaseConnection;
  GnuCashDefaults: GnuCashUserDefaults;
  AlphaVantageApiKey: string;
}
