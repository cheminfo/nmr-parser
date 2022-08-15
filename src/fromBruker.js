import { convertFileList } from 'brukerconverter';
import { fileListFromZip } from 'filelist-utils';

import packageJson from '../package.json';

import { convertToFloatArray } from './utils/convertToFloatArray';
import { getInfoFromJCAMP } from './utils/getInfoFromJCAMP';

const defaultOptions = {
  converter: {
    xy: true,
    noContour: true,
    keepRecordsRegExp: /.*/,
    profiling: true,
  },
};

export async function fromBruker(zipFile, options = {}) {
  const fileList = await fileListFromZip(zipFile);
  let parseData = await convertFileList(fileList, {
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
      info,
      meta: metadata,
      timeStamp: new Date().valueOf(),
      version: packageJson.version,
    });
  }
  return dataStructure;
}
