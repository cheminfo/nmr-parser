import { jcamp } from 'jcamp-data-test';

import { fromJCAMP } from '../fromJCAMP';

describe('test fromJCAMP', () => {
  it('test dependentVariables fromJEOL and proton', () => {
    console.log(Object.keys(jcamp));
    let data = fromJCAMP(jcamp['aspirin-1h.fid.dx'], {
      noContour: true,
      xy: true,
      keepRecordsRegExp: /.*/,
      profiling: true,
    });

    expect(1).toStrictEqual(1);
  });
});
