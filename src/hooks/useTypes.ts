import { ServicesContext } from "./../context/ServiceContext";
import { useContext, useState, useEffect } from "react";
import { Type } from "../services/types";
import { concat } from "ramda";

export const useTypes = (regionID: string) => {
  const [types, setTypes] = useState<Type[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const regionService = useContext(ServicesContext).typesService;
  useEffect(() => {
    setTypes([]);
    setLoading(true);
    const subscription = regionService
      .typesForRegionBuffered(regionID)
      .subscribe(
        (next: Type[]) => setTypes((t) => concat(t, next)),
        () => {
          setFailed(true);
          setLoading(false);
        },
        () => setLoading(false)
      );
    return () => subscription.unsubscribe();
  }, [regionID, regionService]);
  return { types, failed, loading };
};

export default useTypes;
