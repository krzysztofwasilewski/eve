import React from "react";

interface RegionDropdownProps {
  regions: string[];
}

function RegionDropdown(props: RegionDropdownProps) {
  const { regions } = props;
  return (
    <select>
      {regions.map((region) => (
        <option key={region} value={region}>
          {region}
        </option>
      ))}
    </select>
  );
}

export default RegionDropdown;
