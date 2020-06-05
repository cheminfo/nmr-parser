import { convert } from 'jcampconverter';

import { version, dependencies, devDependencies } from '../package.json';

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
      let info = getInfoFromJCAMP(entry.info);
      let dependentVariables = [
        {
          components: entry.spectra,
        },
      ];
      let dimensions = [];
      let dimension = {
        increment: info.increment,
        dataPoints: info.dataPoints,
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
      dataStructure.push({
        dimensions,
        dependentVariables,
        info,
        timeStamp: new Date().valueOf(),
        version: [{ 'nmr-parser': version }, dependencies, devDependencies],
      });
    }
  }

  return dataStructure;
}
