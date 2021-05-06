import { convert } from 'jcampconverter';

import packageJson from '../package.json';

import { convertToFloatArray } from './utils/convertToFloatArray';
import { getInfoFromJCAMP } from './utils/getInfoFromJCAMP';

const expectedTypes = [
  'nd nmr spectrum',
  'nd nmr fid',
  'nmr spectrum',
  'nmr fid',
];

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
    if (!isSpectraData(entry)) continue;
    if ((entry.spectra && entry.spectra.length > 0) || entry.minMax) {
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
      dataStructure.push({
        dimensions,
        dependentVariables,
        info,
        meta: metadata,
        timeStamp: new Date().valueOf(),
        version: packageJson.version,
      });
    }
  }

  return dataStructure;
}

function isSpectraData(entry) {
  const { dataType = '', dataClass = '' } = entry;
  const inputDataType = dataType.toLowerCase();
  const inputDataClass = dataClass.toLowerCase();
  return (
    expectedTypes.some((type) => type === inputDataType) &&
    inputDataClass !== 'peak table'
  );
}
