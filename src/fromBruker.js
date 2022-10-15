import { convertFileCollection } from 'brukerconverter';

import packageJson from '../package.json';

import { convertToFloatArray } from './utils/convertToFloatArray';
import { getInfoFromJCAMP } from './utils/getInfoFromJCAMP';

/**
 * convert/export all the file with a Bruker structure like. It is a wrapper of brukerconverter
 * the same options you can pass.
 */

const defaultOptions = {
  converter: {
    xy: true,
    noContour: true,
    keepRecordsRegExp: /.*/,
    profiling: true,
  },
};

export async function fromBruker(fileCollection, options = {}) {
  let parseData = await convertFileCollection(fileCollection, {
    ...defaultOptions,
    ...options,
  });
  let dataStructure = [];
  for (let entry of parseData) {
    let metadata = { ...entry.info, ...entry.meta };
    let info = getInfoFromJCAMP(metadata);

    let dimensions = [];
    let dependentVariables = [];

    let dependentVariable = {};

    if (info.dimension === 1) {
      dependentVariable.components = entry.spectra;
    } else if (info.dimension === 2) {
      for (const key in entry.minMax) {
        entry.minMax[key].z = convertToFloatArray(entry.minMax[key].z);
      }
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

    const { source } = entry;

    dataStructure.push({
      dimensions,
      dependentVariables,
      source,
      info,
      meta: metadata,
      timeStamp: new Date().valueOf(),
      version: packageJson.version,
    });
  }
  return dataStructure;
}
