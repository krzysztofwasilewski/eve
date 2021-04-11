import React from "react";
import { Meta } from "@storybook/react";
import Orders from "../components/Orders/Orders";

export const AllOrders = () => <Orders region="10000006" />;
export default { title: "All Orders from 10000006", component: Orders } as Meta;
