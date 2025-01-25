import { GetMapHandler } from '../../../adapters/driven/http/getMap';
import { HttpClient } from '../../../shared/httpClient';
import { CellType, InputMap } from '../../../shared/types';
import { MegaverseMap } from '../MegaverseMap';

describe('MegaverseMap', () => {
  it('should parse an empty input map', () => {
    const inputMap: InputMap = [];
    const map = new MegaverseMap(new GetMapHandler(new HttpClient()));
    map.initMapFromInputMap(inputMap);
    expect(map).toBeDefined();
  });

  it('should parse a non-empty input map', () => {
    const inputMap: InputMap = [
      ['SPACE', 'SPACE'],
      ['POLYANET', 'POLYANET'],
      ['POLYANET', 'POLYANET']
    ];
    const map = new MegaverseMap(new GetMapHandler(new HttpClient())  );
    map.initMapFromInputMap(inputMap);

    expect(map).toBeDefined();
    expect(map.getNumberOfRows()).toBe(3);
    expect(map.getNumberOfColumns()).toBe(2);
    expect(map.getCellAt(0, 0)).toBe(CellType.SPACE);
    expect(map.getCellAt(1, 0)).toBe(CellType.POLYANET);
    expect(map.getCellAt(1, 1)).toBe(CellType.POLYANET);
    expect(map.getCellAt(2, 0)).toBe(CellType.POLYANET);
    // Add more assertions based on expected behavior
  });

  it('should parse a realistic input map', () => {
    const inputMap = {
      "goal": [
        [
          "SPACE",
          "SPACE",
          "SPACE",
          "SPACE",
          "SPACE",
          "SPACE",
          "SPACE",
          "SPACE",
          "SPACE",
          "SPACE",
          "SPACE"
        ],
        [
          "SPACE",
          "SPACE",
          "SPACE",
          "SPACE",
          "SPACE",
          "SPACE",
          "SPACE",
          "SPACE",
          "SPACE",
          "SPACE",
          "SPACE"
        ],
        [
          "SPACE",
          "SPACE",
          "POLYANET",
          "SPACE",
          "SPACE",
          "SPACE",
          "SPACE",
          "SPACE",
          "POLYANET",
          "SPACE",
          "SPACE"
        ],
        [
          "SPACE",
          "SPACE",
          "SPACE",
          "POLYANET",
          "SPACE",
          "SPACE",
          "SPACE",
          "POLYANET",
          "SPACE",
          "SPACE",
          "SPACE"
        ],
        [
          "SPACE",
          "SPACE",
          "SPACE",
          "SPACE",
          "POLYANET",
          "SPACE",
          "POLYANET",
          "SPACE",
          "SPACE",
          "SPACE",
          "SPACE"
        ],
        [
          "SPACE",
          "SPACE",
          "SPACE",
          "SPACE",
          "SPACE",
          "POLYANET",
          "SPACE",
          "SPACE",
          "SPACE",
          "SPACE",
          "SPACE"
        ],
        [
          "SPACE",
          "SPACE",
          "SPACE",
          "SPACE",
          "POLYANET",
          "SPACE",
          "POLYANET",
          "SPACE",
          "SPACE",
          "SPACE",
          "SPACE"
        ],
        [
          "SPACE",
          "SPACE",
          "SPACE",
          "POLYANET",
          "SPACE",
          "SPACE",
          "SPACE",
          "POLYANET",
          "SPACE",
          "SPACE",
          "SPACE"
        ],
        [
          "SPACE",
          "SPACE",
          "POLYANET",
          "SPACE",
          "SPACE",
          "SPACE",
          "SPACE",
          "SPACE",
          "POLYANET",
          "SPACE",
          "SPACE"
        ],
        [
          "SPACE",
          "SPACE",
          "SPACE",
          "SPACE",
          "SPACE",
          "SPACE",
          "SPACE",
          "SPACE",
          "SPACE",
          "SPACE",
          "SPACE"
        ],
        [
          "SPACE",
          "SPACE",
          "SPACE",
          "SPACE",
          "SPACE",
          "SPACE",
          "SPACE",
          "SPACE",
          "SPACE",
          "SPACE",
          "SPACE"
        ]
      ]
    }
    const map = new MegaverseMap(new GetMapHandler(new HttpClient()));
    map.initMapFromInputMap(inputMap.goal);

    expect(map).toBeDefined();
    expect(map.getNumberOfRows()).toBe(11);
    expect(map.getNumberOfColumns()).toBe(11);
    expect(map.getCellAt(0, 0)).toBe(CellType.SPACE);
    expect(map.getCellAt(5, 5)).toBe(CellType.POLYANET);
    expect(map.getCellAt(4, 6)).toBe(CellType.POLYANET);
    expect(map.getCellAt(6, 6)).toBe(CellType.POLYANET);

    const polyanets = map.getPolyanets();
    expect(polyanets).toBeDefined();
    expect(polyanets.length).toBe(13);
    expect(polyanets.slice(0, 3)).toEqual([[2, 2], [2, 8], [3, 3]]);
  }); 
});