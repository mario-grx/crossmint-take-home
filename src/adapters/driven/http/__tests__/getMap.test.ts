import { CONFIG } from '../../../../config';
import { HttpClient } from '../../../../shared/httpClient';
import { InputMap, Result } from '../../../../shared/types';
import { GetMapHandler } from '../getMap';

jest.mock('../../../../shared/httpClient');

describe('GetMapHandler', () => {
  let httpClientMock: jest.Mocked<HttpClient>;
  let getMapHandler: GetMapHandler;

  beforeEach(() => {
    httpClientMock = new HttpClient() as jest.Mocked<HttpClient>;
    getMapHandler = new GetMapHandler(httpClientMock);
  });

  it('should fetch the map successfully', async () => {
    const mockMapData: Result<{ goal: InputMap }> = {
      success: true,
      data: { goal: [['A', 'B'], ['C', 'D']] },
      error: undefined
    };
    httpClientMock.makeRequest.mockResolvedValue(mockMapData);

    const url = `${CONFIG.BASE_URL}/${CONFIG.GET_MAP_PATH}/${CONFIG.CANDIDATE_ID}/goal`;
    const mapData = await getMapHandler.getMap();

    expect(httpClientMock.makeRequest).toHaveBeenCalledWith(url, 'GET', {});
    expect(mapData).toEqual(mockMapData.data);
  });

  it('should handle errors when fetching the map', async () => {
    const mockError: Result<any> = {
      success: false,
      data: null,
      error: new Error('Failed to fetch map')
    };
    httpClientMock.makeRequest.mockResolvedValue(mockError);

    const url = `${CONFIG.BASE_URL}/${CONFIG.GET_MAP_PATH}/${CONFIG.CANDIDATE_ID}/goal`;

    await expect(getMapHandler.getMap()).rejects.toThrow('Failed to get map: Error: Failed to fetch map');
    expect(httpClientMock.makeRequest).toHaveBeenCalledTimes(3);
    expect(httpClientMock.makeRequest).toHaveBeenNthCalledWith(1, url, 'GET', {});
    expect(httpClientMock.makeRequest).toHaveBeenNthCalledWith(2, url, 'GET', {});
    expect(httpClientMock.makeRequest).toHaveBeenNthCalledWith(3, url, 'GET', {});
  });
}); 