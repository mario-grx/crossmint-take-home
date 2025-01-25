import { SolveChallenge } from '../SolveChallenge';
import { GetMapHandler } from '../../../adapters/driven/http/getMap';
import { DrawMapHandler } from '../../../adapters/driven/http/drawMap';
import { CellType, Instruction } from '../../../shared/types';
import { HttpClient } from '../../../shared/httpClient';

jest.mock('../../../adapters/driven/http/getMap');
jest.mock('../../../adapters/driven/http/drawMap');

describe('SolveChallenge', () => {
  let getMapHandlerMock: jest.Mocked<GetMapHandler>;
  let drawMapHandlerMock: jest.Mocked<DrawMapHandler>;
  let httpClientMock: jest.Mocked<HttpClient>;
  let solveChallenge: SolveChallenge;

  beforeEach(() => {
    httpClientMock = {
      makeRequest: jest.fn()
    } as jest.Mocked<HttpClient>;

    getMapHandlerMock = new GetMapHandler(httpClientMock) as jest.Mocked<GetMapHandler>;
    getMapHandlerMock.getMap = jest.fn().mockResolvedValue({
      
      goal: [
        [CellType.POLYANET, CellType.POLYANET, CellType.SPACE],
        [CellType.SPACE, CellType.SPACE, CellType.POLYANET]
      ]
    
    });

    drawMapHandlerMock = new DrawMapHandler(httpClientMock) as jest.Mocked<DrawMapHandler>;
    drawMapHandlerMock.drawMap = jest.fn().mockResolvedValue({ success: true, data: null });

    solveChallenge = new SolveChallenge(getMapHandlerMock, drawMapHandlerMock);
  });

  it('should solve the challenge successfully', async () => {
    await solveChallenge.solve();

    expect(getMapHandlerMock.getMap).toHaveBeenCalledTimes(1);
    expect(drawMapHandlerMock.drawMap).toHaveBeenCalledWith([
      { row: 0, column: 0, type: CellType.POLYANET },
      { row: 0, column: 1, type: CellType.POLYANET },
      { row: 1, column: 2, type: CellType.POLYANET },
    ]);
  });

  it('should handle errors when drawing the map', async () => {
    drawMapHandlerMock.drawMap.mockResolvedValueOnce({ success: false, data: [{ row: 1, column: 1, type: CellType.POLYANET }] });

    await expect(solveChallenge.solve()).rejects.toThrow("Error drawing map");

    expect(drawMapHandlerMock.drawMap).toHaveBeenCalled();
  });
}); 