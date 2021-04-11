import { BehaviorSubject, timer } from "rxjs";
import { concatAll, map, toArray } from "rxjs/operators";
import { fromFetch } from "rxjs/fetch";
import { Service } from "typedi";

export interface Region {
  region_id: string;
  name: string;
}

@Service()
export class RegionsService {
  regions: BehaviorSubject<Region[]>;

  constructor() {
    let regions = timer(3000, 60000).pipe(
      map(() => {
        return fromFetch<string[]>(
          "https://esi.evetech.net/latest/universe/regions",
          {
            selector: (r) => r.json(),
          }
        )
          .pipe(
            map((el) => el.map((id) => id)),
            concatAll()
          )
          .pipe(
            map((id: string) =>
              fromFetch<Region>(
                `https://esi.evetech.net/latest/universe/regions/${id}`,
                { selector: (r) => r.json() }
              )
            ),
            concatAll(),
            toArray()
          );
      }),
      concatAll()
    );

    this.regions = new BehaviorSubject<Region[]>([]);
    regions.subscribe((region) => this.regions.next(region));
  }
}
