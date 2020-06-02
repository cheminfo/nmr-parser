import { convert } from 'jcampconverter';

import { getInfoFromJCAMP } from './utils/getInfoFromJCAMP';

// import { version, dependencies, devDependencies } from '../package.json';

// import { formatDependentVariable } from './formatDependentVariable';
// import { formatLinearDimension } from './formatLinearDimension';
// import { toKeyValue } from './utils';

export function fromJCAMP(buffer) {
  let parsedData = convert(buffer, {
    noContour: true,
    xy: true,
    keepRecordsRegExp: /.*/,
    profiling: true,
  });
  let dataStructure = [];
  let entries = parsedData.flatten;
  for (let entry of entries) {
    if ((entry.spectra && entry.spectra.length > 0) || entry.minMax) {
      let info = getInfoFromJCAMP(entry.info);
      dataStructure.push({ info });
    }
  }

  return dataStructure;
}
