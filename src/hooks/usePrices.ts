import { bufferTime, tap } from "rxjs/operators";

import { ServicesContext } from "./../context/ServiceContext";
import { useContext, useState, useEffect } from "react";
import { priceList } from "../services/prices";

export const usePrices = (region1: string, region2: string) => {
  const [prices, setPrices] = useState<priceList[]>([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const priceService = useContext(ServicesContext).pricesService;
  useEffect(() => {
    setPrices([]);
    setError(false);
    setLoading(true);
    const subscription = priceService
      .pricesForRegions(region1, region2)
      .pipe(
        bufferTime(1000),
        tap(() => console.log("Subscribed to prices"))
      )
      .subscribe({
        next: (next) => setPrices((p) => [...p, ...next]),
        error: () => setError(true),
        complete: () => setLoading(false),
      });
    return () => subscription.unsubscribe();
  }, [priceService, region1, region2]);
  return {
    prices,
    error,
    loading,
  };
};

export default usePrices;
