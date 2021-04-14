import React, { ChangeEventHandler, useCallback } from "react";
import useRegions from "../../hooks/useRegions";
import * as R from "ramda";

const sortByName = R.sortBy(R.prop("name"));

export interface RegionDropdownProps {
  regionChanged: (region: string) => void;
  // value: string;
}

function RegionDropdown(props: RegionDropdownProps) {
  const { regionChanged } = props;
  const regions = useRegions();
  const callback: ChangeEventHandler<HTMLSelectElement> = useCallback(
    (e) => regionChanged(e.target.value),
    [regionChanged]
  );
  return (
    <select onChange={callback} defaultValue="loading">
      {regions.length ? (
        sortByName(regions).map((region) => (
          <option key={region.region_id} value={region.region_id}>
            {region.name}
          </option>
        ))
      ) : (
        <option key="loading" value="loading" disabled>
          Loading…
        </option>
      )}
    </select>
  );
}

export default RegionDropdown;
