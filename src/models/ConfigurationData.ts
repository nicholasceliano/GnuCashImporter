import { DatabaseConnection } from './DatabaseConnection'
import { GnuCashUserDefaults } from './gnuCash/GnuCashUserDefaults'
import { LocalDatabaseBackup } from './LocalDatabaseBackup'

export type ConfigurationData = {
  GnuCashDbConn: DatabaseConnection;
  GnuCashDefaults: GnuCashUserDefaults;
  LocalDbBackup: LocalDatabaseBackup;
  AlphaVantageApiKey: string;
  SshConnection: string;
}
