import { convert } from 'jcampconverter';

// import { version, dependencies, devDependencies } from '../package.json';

// import { formatDependentVariable } from './formatDependentVariable';
// import { formatLinearDimension } from './formatLinearDimension';
// import { toKeyValue } from './utils';

export function fromJCAMP(buffer) {
  let parsedData = convert(buffer);
  let dataStructure = [];
  let entries = parsedData.flatten;
  console.log(parsedData);
  for (let entry of entries) {
    if ((entry.spectra && entry.spectra.length > 0) || entry.minMax) {
      console.log(entry);
      console.log(entry.spectra[0].data);
    }
  }

  return dataStructure;
}
