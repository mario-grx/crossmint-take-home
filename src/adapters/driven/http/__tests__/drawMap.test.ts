import { DrawMapHandler } from '../drawMap';
import { HttpClient } from '../../../../shared/httpClient';
import { CellType, Instruction, Result } from '../../../../shared/types';
import { CONFIG } from '../../../../config';

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
    const instructions: Array<Instruction> = [
      { type: CellType.POLYANET, row: 100, column: 100 },
      { type: CellType.POLYANET, row: 101, column: 101 }
    ];

    const mockSuccessResult: Result<any> = {
      success: true,
      data: null,
      error: undefined
    };

    (drawMapHandler.makeRequest as jest.Mock).mockResolvedValue(mockSuccessResult);

    const result = await drawMapHandler.drawMap(instructions);

    expect(drawMapHandler.makeRequest).toHaveBeenCalledTimes(instructions.length);
    instructions.forEach(instruction => {
      const { row, column, type } = instruction;
      const path = (drawMapHandler as any).getPath(type);
      const url = `${TEST_BASE_URL}/${path}`;
      const payload = { candidateId: CONFIG.CANDIDATE_ID, row, column };
      expect(drawMapHandler.makeRequest).toHaveBeenCalledWith(url, 'POST', payload);
    });
    expect(result).toEqual({ success: true, data: null });
  });

  it('should handle failed instructions', async () => {
    const instructions: Array<Instruction> = [
      { type: CellType.POLYANET, row: 0, column: 0 },
      { type: CellType.POLYANET, row: 1, column: 1 },
      { type: CellType.POLYANET, row: 2, column: 2 },
      { type: CellType.POLYANET, row: 3, column: 3 }
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

    const result = await drawMapHandler.drawMap(instructions);

    expect(drawMapHandler.makeRequest).toHaveBeenCalledTimes(instructions.length);
    instructions.forEach(instruction => {
      const { row, column, type } = instruction;
      const path = (drawMapHandler as any).getPath(type);
      const url = `${TEST_BASE_URL}/${path}`;
      const payload = { candidateId: CONFIG.CANDIDATE_ID, row, column };
      expect(drawMapHandler.makeRequest).toHaveBeenCalledWith(url, 'POST', payload);
    });
    expect(result).toEqual({ success: false, data: instructions });
  });
});