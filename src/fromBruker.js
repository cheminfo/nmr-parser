import { convertZip as convertBruker } from 'brukerconverter';

import packageJson from '../package.json';

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
    { ...defaultOptions, ...options },
  );
  let dataStructure = [];
  for (let element of parseData) {
    let entry = element.value;
    let metadata = Object.assign({}, entry.info, entry.meta);
    let info = getInfoFromJCAMP(metadata);

    if (info.experiment === 'wobble_curve') continue;

    let dimensions = [];
    let dependentVariables = [];

    let dependentVariable = {};

    if (info.dimension === 1) {
      for (let i = 0; i < entry.spectra.length; i++) {
        let data = entry.spectra[i].data;
        data = convertToFloatArray(data);
      }
      dependentVariable.components = entry.spectra;
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

    const { source } = entry;

    dataStructure.push({
      dimensions,
      dependentVariables,
      source,
      info: info,
      meta: metadata,
      timeStamp: new Date().valueOf(),
      version: packageJson.version,
    });
  }
  return dataStructure;
}
