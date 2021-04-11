import React from "react";
import useRegions from "../../hooks/useRegions";
import * as R from "ramda";

const sortByName = R.sortBy(R.prop("name"));

function RegionDropdown() {
  const regions = useRegions();
  return (
    <select>
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
