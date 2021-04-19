import { from, ObservedValueOf, of, ReplaySubject } from "rxjs";
import {
  concatAll,
  filter,
  map,
  mergeMap,
  retry,
  toArray,
  zipAll,
} from "rxjs/operators";
import { fromFetch } from "rxjs/fetch";
import { Inject, Service } from "typedi";
import TypesService from "./types";
import * as R from "ramda";

const applyIntersection = R.apply<number[], number[]>(R.intersection);

export interface priceList {
  type_id: number;
  data: readonly Marketdata[];
}

export interface Marketdata {
  average?: number;
  date: string;
  highest?: number;
  lowest?: number;
  order_count?: number;
  volume?: number;
}

@Service()
class PricesService {
  @Inject(() => TypesService)
  private types: TypesService;
  commonTypesForRegions = (...regions: [string, string]) =>
    from(regions).pipe(
      mergeMap((region) => this.types.typeIDsForRegion(region).pipe(toArray())),
      toArray(),
      map(applyIntersection),
      concatAll()
    );
  pricesForRegions = R.memoizeWith(
    R.identity,
    (...regions: [string, string]) => {
      const pricesStream = this.commonTypesForRegions(...regions).pipe(
        mergeMap((type_id) =>
          from(regions).pipe(
            map(
              (region_id) =>
                `https://esi.evetech.net/latest/markets/${region_id}/history?type_id=${type_id}`
            ),

            mergeMap((url) =>
              fromFetch<Marketdata[]>(url, {
                selector: (res) => (res.ok ? res.json() : of([])),
              }).pipe(retry(3))
            ),
            map((marketData) =>
              of(
                R.reduce(
                  R.maxBy(R.prop<"date", string>("date")),
                  {
                    date: "1900-01-01",
                  } as Marketdata,
                  marketData
                )
              )
            ),

            zipAll<Marketdata>(),
            filter(R.all<Marketdata>(R.has("average"))),
            map((marketData) => ({ type_id, data: marketData }))
          )
        )
      );
      const subject = new ReplaySubject<ObservedValueOf<typeof pricesStream>>();
      pricesStream.subscribe(subject);
      return subject;
    }
  );
}
export default PricesService;
