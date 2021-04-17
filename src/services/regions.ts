import { BehaviorSubject, timer } from "rxjs";
import {
  concatAll,
  concatMap,
  filter,
  map,
  mergeAll,
  mergeMap,
  toArray,
} from "rxjs/operators";
import { fromFetch } from "rxjs/fetch";
import { Service } from "typedi";
import * as R from "ramda";

export interface Region {
  region_id: string;
  name: string;
}

function toJson<T>(response: Response): Promise<T> {
  return response.json();
}

@Service()
export class RegionsService {
  regions: BehaviorSubject<Region[]>;

  constructor() {
    let regions = timer(3000, 60000).pipe(
      concatMap(() =>
        fromFetch<string[]>("https://esi.evetech.net/latest/universe/regions", {
          selector: toJson,
        }).pipe(
          mergeAll(),
          filter<string>(R.both(R.gte(R.__, 10000000), R.lt(R.__, 11000000))),
          map((id) => `https://esi.evetech.net/latest/universe/regions/${id}`),
          mergeMap((url: string) =>
            fromFetch<Region>(url, { selector: toJson })
          ),
          toArray()
        )
      )
    );

    this.regions = new BehaviorSubject<Region[]>([]);
    regions.subscribe(this.regions.next.bind(this.regions));
  }
}
