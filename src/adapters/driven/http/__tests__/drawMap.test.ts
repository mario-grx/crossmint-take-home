import { CellCometh, CellInterface, CellPolyanet, CellSoloon } from '../../../../models/Cell';
import { HttpClient } from '../../../../shared/httpClient';
import { Result } from '../../../../shared/types';
import { DrawMapHandler } from '../drawMap';

jest.mock('../../../../shared/httpClient');

describe('DrawMapHandler', () => {
  let httpClientMock: jest.Mocked<HttpClient>;
  let drawMapHandler: DrawMapHandler;
  const TEST_BASE_URL = 'http://test-url.com';

  beforeEach(() => {
    httpClientMock = new HttpClient() as jest.Mocked<HttpClient>;
    drawMapHandler = new DrawMapHandler(httpClientMock);
    (drawMapHandler as any).baseURL = TEST_BASE_URL;
    drawMapHandler.makeRequest = jest.fn();
  });

  it('should draw the map successfully', async () => {
    const instructions = [
      new CellPolyanet(100, 100),
      new CellPolyanet(101, 101),
      new CellSoloon(102, 102, "PURPLE"),
      new CellCometh(103, 103, "RIGHT")
    ];

    const mockSuccessResult: Result<any> = {
      success: true,
      data: null,
      error: undefined
    };

    (drawMapHandler.makeRequest as jest.Mock).mockResolvedValue(mockSuccessResult);

    const result = await drawMapHandler.drawMap(instructions as any);

    expect(drawMapHandler.makeRequest).toHaveBeenCalledTimes(instructions.length);
    instructions.forEach(instruction => {
      const path = (drawMapHandler as any).getPath(instruction.getType());
      const url = `${TEST_BASE_URL}/${path}`;
      const payload = instruction.toPayload();
      expect(drawMapHandler.makeRequest).toHaveBeenCalledWith(url, 'POST', payload);
    });
    expect(result).toEqual({ success: true, data: null });
  });

  it('should handle failed instructions', async () => {
    const instructions = [
      new CellPolyanet(0, 0),
      new CellPolyanet(1, 1),
      new CellPolyanet(2, 2),
      new CellPolyanet(3, 3)
    ];

    const mockFailureResult: Result<any> = {
      success: false,
      data: null,
      error: new Error('Request failed')
    };

    (drawMapHandler.makeRequest as jest.Mock)
      .mockResolvedValueOnce(mockFailureResult)
      .mockResolvedValueOnce(mockFailureResult)
      .mockResolvedValueOnce(mockFailureResult)
      .mockResolvedValueOnce(mockFailureResult);

    const result = await drawMapHandler.drawMap(instructions as CellInterface[]);

    expect(drawMapHandler.makeRequest).toHaveBeenCalledTimes(instructions.length);
    instructions.forEach(instruction => {
      const path = (drawMapHandler as any).getPath(instruction.getType());
      const url = `${TEST_BASE_URL}/${path}`;
      const payload = instruction.toPayload();
      expect(drawMapHandler.makeRequest).toHaveBeenCalledWith(url, 'POST', payload);
    });
    expect(result).toEqual({ success: false, data: instructions });
  });
});