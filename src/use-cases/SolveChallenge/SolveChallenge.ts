import { DrawMapHandler } from "../../adapters/driven/http/drawMap";
import { GetMapHandler } from "../../adapters/driven/http/getMap";
import { MegaverseMap } from "../../models/MegaverseMap/MegaverseMap";

export class SolveChallenge {
  private map: MegaverseMap;

  constructor(private readonly getMapHandler: GetMapHandler, private readonly drawMapHandler: DrawMapHandler) {
    this.map = new MegaverseMap(this.getMapHandler);
  }

  public async initMap() {
    try {
      await this.map.initMap();
    } catch (error) {
      throw new Error(`Failed to initialize the map: ${error}`);
    }
  }

  public async solve() {
    await this.initMap();

    this.map.print();
    const instructions = [
      // ...this.map.getPolyanets(),
      ...this.map.getSoloons(),
      ...this.map.getComeths()
    ];


    const drawMapResult = await this.drawMapHandler.drawMap(instructions);

    if (drawMapResult.success) {
      console.log("Map drawn successfully");
    } else {
      console.log(`Error drawing map - Failed ${drawMapResult.data?.length} instructions: `, JSON.stringify(drawMapResult.data, null, 2));
      // should we delete the map?

      throw new Error("Error drawing map");
    }
  }
}
