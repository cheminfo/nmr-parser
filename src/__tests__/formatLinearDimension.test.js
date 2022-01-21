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
        coordinatesOffset: 12,
      },
    );
    expect(dim.label).toBe('label');
    expect(dim.type).toBe('linear');
    expect(dim.description).toBe('description');
    expect(dim.coordinatesOffset).toBe(12);
  });
});
