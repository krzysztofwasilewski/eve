import { BehaviorSubject, from, merge, of, timer } from "rxjs";
import {
  concatAll,
  concatMap,
  map,
  mergeAll,
  mergeMap,
  toArray,
} from "rxjs/operators";
import { fromFetch } from "rxjs/fetch";
import { Inject, Service } from "typedi";
import TypesService from "./types";
import * as R from "ramda";

const applyIntersection = R.apply<string[], string[]>(R.intersection);

@Service()
class PricesService {
  @Inject(() => TypesService)
  types: TypesService;
  commonTypesForRegions = (region1: string, region2: string) =>
    from([region1, region2]).pipe(
      mergeMap((region) => this.types.typeIDsForRegion(region).pipe(toArray())),
      toArray(),
      map(applyIntersection)
    );
}
export default PricesService;
