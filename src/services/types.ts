import { ObservedValueOf, of, range, ReplaySubject } from "rxjs";
import { fromFetch } from "rxjs/fetch";
import { bufferTime, map, mergeAll, mergeMap, retry } from "rxjs/operators";
import { Service } from "typedi";
import * as R from "ramda";

const MAX_CONCURRENT_CONNECTIONS = 500;

export interface Type {
  capacity?: number;

  description?: string;

  graphic_id?: number;

  group_id?: number;

  icon_id?: number;
  market_group_id?: number;
  mass?: number;
  name: string;
  packaged_volume?: number;

  portion_size?: number;

  published?: boolean;
  radius?: number;
  type_id: number;

  volume?: number;
}

@Service()
class TypesService {
  typeIDsForRegion = (regionId: string) =>
    of(regionId).pipe(
      map((id) => `https://esi.evetech.net/latest/markets/${id}/types`),
      mergeMap((url) => fromFetch(url, { method: "HEAD" }).pipe(retry(3))),
      mergeMap((response) =>
        range(1, parseInt(response.headers.get("x-pages") || "1"))
      ),
      mergeMap((page) =>
        fromFetch<number[]>(
          `https://esi.evetech.net/latest/markets/${regionId}/types?page=${page}`,
          { selector: (r) => r.json() }
        ).pipe(retry(3))
      ),
      mergeAll()
    );

  typesForRegion = R.memoizeWith(R.identity, (regionId: string) => {
    const typesStream = this.typeIDsForRegion(regionId).pipe(
      mergeMap(
        (regionID) =>
          fromFetch<Type>(
            `https://esi.evetech.net/latest/universe/types/${regionID}`,
            { selector: (r) => r.json() }
          ).pipe(retry(3)),

        MAX_CONCURRENT_CONNECTIONS
      )
    );
    const typesSubject = new ReplaySubject<
      ObservedValueOf<typeof typesStream>
    >();
    typesStream.subscribe(typesSubject);
    return typesSubject;
  });
  typesForRegionBuffered = (regionId: string) =>
    this.typesForRegion(regionId).pipe(bufferTime(1000));
}

export default TypesService;
