import { GetMapHandler } from '../../../adapters/driven/http/getMap';
import { HttpClient } from '../../../shared/httpClient';
import { InputMap } from '../../../shared/types';
import { CellCometh, CellPolyanet, CellSoloon, CellSpace } from '../../Cell';
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
      ['POLYANET', 'PURPLE_SOLOON'],
      ['RIGHT_COMETH', 'POLYANET']
    ];
    const map = new MegaverseMap(new GetMapHandler(new HttpClient()));
    map.initMapFromInputMap(inputMap);

    expect(map).toBeDefined();
    expect(map.getNumberOfRows()).toBe(3);
    expect(map.getNumberOfColumns()).toBe(2);
    expect(map.getCellAt(0, 0)).toStrictEqual(new CellSpace(0, 0));
    expect(map.getCellAt(1, 0)).toStrictEqual(new CellPolyanet(1, 0));
    expect(map.getCellAt(1, 1)).toStrictEqual(new CellSoloon(1, 1, "PURPLE"));
    expect(map.getCellAt(2, 0)).toStrictEqual(new CellCometh(2, 0, "RIGHT"));
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
          "PURPLE_SOLOON",
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
          "DOWN_COMETH",
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
          "UP_COMETH",
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
          "BLUE_SOLOON",
          "SPACE",
          "SPACE",
          "SPACE",
          "POLYANET",
          "SPACE",
          "POLYANET",
          "SPACE",
          "SPACE",
          "SPACE",
          "LEFT_COMETH"
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
          "WHITE_SOLOON",
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
          "RED_SOLOON",
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
    expect(map.getCellAt(0, 0)).toStrictEqual(new CellSpace(0, 0));
    expect(map.getCellAt(5, 5)).toStrictEqual(new CellPolyanet(5, 5));
    expect(map.getCellAt(4, 6)).toStrictEqual(new CellPolyanet(4, 6));
    expect(map.getCellAt(6, 10)).toStrictEqual(new CellCometh(6, 10, "LEFT"));
    expect(map.getCellAt(8, 5)).toStrictEqual(new CellSoloon(8, 5, "WHITE"));
    expect(map.getCellAt(9, 7)).toStrictEqual(new CellSoloon(9, 7, "RED"));

    const polyanets = map.getPolyanets().map(cell => cell);
    console.log(polyanets);
    expect(polyanets).toBeDefined();
    expect(polyanets.length).toBe(13);
    expect(polyanets.slice(0, 3)).toEqual([
      new CellPolyanet(2, 2),
      new CellPolyanet(2, 8),
      new CellPolyanet(3, 3)
    ]);
  });
});
