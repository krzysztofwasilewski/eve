import { Service, Inject } from "typedi";
import { RegionsService } from "./regions";
import PricesService from "./prices";
import TypesService from "./types";

@Service()
export class Services {
  @Inject(() => RegionsService)
  regionsService: RegionsService;
  @Inject(() => TypesService)
  typesService: TypesService;
  @Inject(() => PricesService)
  pricesService: PricesService;
}
