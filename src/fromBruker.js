import { convertZip as convertBruker } from 'brukerconverter';

import { version, dependencies, devDependencies } from '../package.json';

import { getInfoFromBruker } from './utils/getInfoFromBruker';

const defaultOptions = {
  noContour: true,
  xy: true,
  keepRecordsRegExp: /.*/,
  profiling: true,
};

export async function fromBruker(zipFile, options = {}) {
  let parseData = await convertBruker(
    zipFile,
    Object.assign({}, defaultOptions, options),
  );
  let dataStructure = [];
  for (let element of parseData) {
    let entry = element.value;
    let info = getInfoFromBruker(entry.info);
    info = Object.assign({}, entry.info, info);
    let dimensions = [];
    let dependentVariables = [];

    let dependentVariable = {};

    if (info.dimension === 1) {
      dependentVariable.components = entry.spectra;
    } else if (info.dimension === 2) {
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
      timeStamp: new Date().valueOf(),
      version: [{ 'nmr-parser': version }, dependencies, devDependencies],
    });
  }

  return dataStructure;
}
