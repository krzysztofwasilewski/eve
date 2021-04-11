import React, { PropsWithChildren, ReactNode } from "react";
import { Services } from "../services";
import { Container } from "typedi";

const services = Container.get(Services);
export const ServicesContext = React.createContext(services);

export const ServicesContextProvider = (
  props: PropsWithChildren<ReactNode>
) => (
  <ServicesContext.Provider value={services}>
    {props.children}
  </ServicesContext.Provider>
);

export default ServicesContextProvider;
