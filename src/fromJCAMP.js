import { convert } from 'jcampconverter';

import { version, dependencies, devDependencies } from '../package.json';

import { convertToFloatArray } from './utils/convertToFloatArray';
import { getInfoFromJCAMP } from './utils/getInfoFromJCAMP';

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
      let metadata = Object.assign({}, entry.info, entry.meta);
      let info = getInfoFromJCAMP(metadata);

      if (info.experiment === 'wobble_curve') continue;

      let dimensions = [];
      let dependentVariables = [];

      let dependentVariable = {};
      if (info.dimension === 1) {
        dependentVariable.components = convertToFloatArray(entry.spectra);
      } else if (info.dimension === 2) {
        entry.minMax.z = convertToFloatArray(entry.minMax.z);
        dependentVariable.components = entry.minMax;
      }
      let dimension = {
        increment: info.increment,
        numberOfPoints: info.numberOfPoints,
      };

      if (info.fid) {
        dimension.coordinatesOffset = {
          magnitude: -info.digitalFilter * info.increment,
          units: 'second',
        };
      } else {
        dimension.coordinatesOffset = {
          magnitude:
            info.frequencyOffset / info.baseFrequency - 0.5 * info.spectraWidth,
          units: 'ppm',
        };
      }

      dimensions.push(dimension);
      dependentVariables.push(dependentVariable);
      dataStructure.push({
        dimensions,
        dependentVariables,
        info,
        meta: metadata,
        timeStamp: new Date().valueOf(),
        version: [{ 'nmr-parser': version }, dependencies, devDependencies],
      });
    }
  }

  return dataStructure;
}
