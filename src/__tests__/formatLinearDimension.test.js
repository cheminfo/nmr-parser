import { formatLinearDimension } from '../formatLinearDimension';

describe('test formatLinearDimension', () => {
  it('test formatLinearDimension with fake data', () => {
    let dim = formatLinearDimension(
      'label',
      10,
      { magnitude: 1, unit: 's' },
      {
        type: 'linear',
        description: 'description',
        coordinatesOffest: 12,
      },
    );
    expect(dim.label).toStrictEqual('label');
    expect(dim.type).toStrictEqual('linear');
    expect(dim.description).toStrictEqual('description');
    expect(dim.coordinatesOffest).toStrictEqual(12);
  });
});
