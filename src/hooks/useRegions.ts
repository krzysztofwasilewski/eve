import { ServicesContext } from "./../context/ServiceContext";
import { useContext, useState, useEffect } from "react";
import { Region } from "../services/regions";

export const useRegions = () => {
  const [regions, setRegions] = useState<Region[]>([]);
  const regionService = useContext(ServicesContext).regionsService;
  useEffect(() => {
    const subscription = regionService.regions.subscribe((next: Region[]) =>
      setRegions(next)
    );
    return () => subscription.unsubscribe();
  }, [regionService]);
  return regions;
};

export default useRegions;
