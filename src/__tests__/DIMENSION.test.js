import { DIMENSION, LinearDIMENSION } from '../DIMENSION';

describe('test DIMENSION', () => {
  it('test DIMENSION load and toJSON with proton', () => {
    let dim = new DIMENSION('label', {
      type: 'linear',
      description: 'description',
    });
    let txt = JSON.stringify(dim);
    let newDim = DIMENSION.load(JSON.parse(txt));
    expect(newDim.label).toStrictEqual('label');
    expect(newDim.type).toStrictEqual('linear');
    expect(newDim.description).toStrictEqual('description');
  });

  it('test LinearDIMENSION load and toJSON with proton', () => {
    let dim = new LinearDIMENSION(
      'label',
      10,
      { magnitude: 1, unit: 's' },
      {
        type: 'linear',
        description: 'description',
        coordinatesOffest: 12,
      },
    );
    let txt = JSON.stringify(dim);
    let newDim = LinearDIMENSION.load(JSON.parse(txt));
    expect(newDim.label).toStrictEqual('label');
    expect(newDim.type).toStrictEqual('linear');
    expect(newDim.description).toStrictEqual('description');
    expect(newDim.coordinatesOffest).toStrictEqual(12);
  });
});
