import { bufferTime, tap } from "rxjs/operators";
import { Marketdata } from "./../services/prices";
import { ServicesContext } from "./../context/ServiceContext";
import { useContext, useState, useEffect } from "react";

export interface priceList {
  type_id: string;
  data: readonly Marketdata[];
}

export const usePrices = (region1: string, region2: string) => {
  const [prices, setPrices] = useState<priceList[]>([]);
  const priceService = useContext(ServicesContext).pricesService;
  useEffect(() => {
    const subscription = priceService
      .pricesForRegions(region1, region2)
      .pipe(
        bufferTime(1000),
        tap(() => console.log("Subscribed to prices"))
      )
      .subscribe((next) => setPrices((p) => [...p, ...next]));
    return () => subscription.unsubscribe();
  }, [priceService, region1, region2]);
  return prices;
};

export default usePrices;
