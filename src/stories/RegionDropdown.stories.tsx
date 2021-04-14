import React from "react";
import RegionDropdown, {
  RegionDropdownProps,
} from "../components/RegionDropdown/RegionDropdown";

import { Meta, Story } from "@storybook/react";

export const RegionDropdownWithSamples: Story<RegionDropdownProps> = (args) => (
  <RegionDropdown {...args} />
);

export default { title: "Regions", component: RegionDropdown } as Meta;
