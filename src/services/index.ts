import { Service, Inject } from "typedi";
import { RegionsService } from "./regions";

@Service()
export class Services {
  @Inject(() => RegionsService)
  regionsService: RegionsService;
}
