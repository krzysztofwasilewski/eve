import React from "react";
import RegionDropdown from "../components/RegionDropdown/RegionDropdown";

import { Meta } from "@storybook/react";

const regions = [
  { id: "1", name: "Alpha" },
  { id: "2", name: "Beta" },
  { id: "3", name: "Gamma" },
];
export const RegionDropdownWithSamples = () => <RegionDropdown />;

export default { title: "Regions", component: RegionDropdown } as Meta;
