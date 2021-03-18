import { getNucleusFromMetadata } from '../getNucleusFromMetadata';

describe('get nucleus from 2D experiments', () => {
  it('should returns the well array of nucleus', () => {
    expect(
      getNucleusFromMetadata({}, { experiment: 'jres' }, ''),
    ).toStrictEqual(['1H', 'Hz']);
    expect(
      getNucleusFromMetadata({}, { experiment: 'hmbc' }, ''),
    ).toStrictEqual(['1H', '13C']);
    expect(
      getNucleusFromMetadata({}, { experiment: 'hsqc' }, ''),
    ).toStrictEqual(['1H', '13C']);
    expect(
      getNucleusFromMetadata({}, { experiment: 'cosy' }, ''),
    ).toStrictEqual(['1H', '1H']);
    expect(
      getNucleusFromMetadata({}, { experiment: 'tocsy' }, ''),
    ).toStrictEqual(['1H', '1H']);
  });
});
