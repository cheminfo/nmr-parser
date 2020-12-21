import { getNucleusFrom2DExperiment } from '../getNucleusFrom2DExperiment';

describe('get nucleus from 2D experiments', () => {
  it('should returns the well array of nucleus', () => {
    expect(getNucleusFrom2DExperiment('jres')).toStrictEqual(['1H', 'Hz']);
    expect(getNucleusFrom2DExperiment('hmbc')).toStrictEqual(['1H', '13C']);
    expect(getNucleusFrom2DExperiment('hsqc')).toStrictEqual(['1H', '13C']);
    expect(getNucleusFrom2DExperiment('cosy')).toStrictEqual(['1H', '1H']);
    expect(getNucleusFrom2DExperiment('tocsy')).toStrictEqual(['1H', '1H']);
  });
});
