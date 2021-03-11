import { convertZip as convertBruker } from 'brukerconverter';

import { version, dependencies, devDependencies } from '../package.json';

import { convertToFloatArray } from './utils/convertToFloatArray';
import { getInfoFromJCAMP } from './utils/getInfoFromJCAMP';

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
    console.log('entry', entry.meta);
    let metadata = Object.assign({}, entry.info, entry.meta);
    let meta = getInfoFromJCAMP(metadata);

    if (meta.experiment === 'wobble_curve') continue;

    let dimensions = [];
    let dependentVariables = [];

    let dependentVariable = {};

    if (meta.dimension === 1) {
      dependentVariable.components = convertToFloatArray(entry.spectra);
    } else if (meta.dimension === 2) {
      entry.minMax.z = convertToFloatArray(entry.minMax.z);
      dependentVariable.components = entry.minMax;
    }
    let dimension = {
      increment: meta.increment,
      numberOfPoints: meta.numberOfPoints,
    };

    if (meta.fid) {
      dimension.coordinatesOffset = {
        magnitude: -meta.digitalFilter * meta.increment,
        units: 'second',
      };
    } else {
      dimension.coordinatesOffset = {
        magnitude:
          meta.frequencyOffset / meta.baseFrequency - 0.5 * meta.spectraWidth,
        units: 'ppm',
      };
    }

    dimensions.push(dimension);
    dependentVariables.push(dependentVariable);
    dataStructure.push({
      dimensions,
      dependentVariables,
      info: entry.info,
      meta,
      timeStamp: new Date().valueOf(),
      version: [{ 'nmr-parser': version }, dependencies, devDependencies],
    });
  }

  return dataStructure;
}
