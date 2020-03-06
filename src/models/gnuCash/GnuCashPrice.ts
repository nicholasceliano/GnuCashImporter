export interface GnuCashPrice {
  guid: string;
  commodity_guid: string;
  currency_guid: string;
  date: Date;
  source: string;
  type: string;
  value_num: number;
  value_denom: number;
}
