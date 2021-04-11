import { BehaviorSubject, timer } from "rxjs";
import { concatAll, map, toArray } from "rxjs/operators";
import { fromFetch } from "rxjs/fetch";
import { Service } from "typedi";

export interface Region {
  id: string;
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
            // regionIDs.subscribe({
            //   next: (n) => console.log("next ID", n),
            // });
            // regionIDs.subscribe((next) => console.log(next));
            // let regions = regionIDs

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
  //   fetchRegions() {
  //     fetch("https://esi.evetech.net/latest/universe/regions")
  //       .then((r) => r.json())
  //       .then((data: string[]) =>
  //         Promise.all(
  //           data.map((regID) =>
  //             fetch(
  //               `https://esi.evetech.net/latest/universe/regions/${regID}`
  //             ).then((r) => r.json())
  //           )
  //         ).then((regions: Region[]) => this.regions.next(regions))
  //       );
}
