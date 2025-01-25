import { DrawMapHandler } from "./adapters/driven/http/drawMap";
import { GetMapHandler } from "./adapters/driven/http/getMap";
import { HttpClient } from "./shared/httpClient";
import { SolveChallenge } from "./use-cases/SolveChallenge/SolveChallenge";

const httpClient = new HttpClient();
const getMapHandler = new GetMapHandler(httpClient);
const drawMapHandler = new DrawMapHandler(httpClient);

const solveChallenge = new SolveChallenge(getMapHandler, drawMapHandler);

solveChallenge.solve();
