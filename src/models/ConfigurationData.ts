import { DatabaseConnection } from './DatabaseConnection'

export type ConfigurationData = {
  GnuCashDbConn: DatabaseConnection;
  AlphaVantageApiKey: string;
}
