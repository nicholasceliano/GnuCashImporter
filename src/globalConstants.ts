import { AV_JSONProperties } from './models/AV_JSONProperties'

export module GlobalConstants {
  export const COMMODITY_PROPS = {
    Header: 'Realtime Currency Exchange Rate',
    SymbolProp: '1. From_Currency Code',
    PriceProp: '5. Exchange Rate',
    DateProp: '6. Last Refreshed'
  } as AV_JSONProperties

  export const STOCK_PROPS = {
    Header: 'Global Quote',
    SymbolProp: '01. symbol',
    PriceProp: '05. price',
    DateProp: '07. latest trading day'
  } as AV_JSONProperties
}
