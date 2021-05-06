import { convert } from 'jcampconverter';

import packageJson from '../package.json';

import { assignDeep } from './utils/assignDeep';
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
  let entries = parsedData.entries;

  for (let entry of entries) {
    const { dataType = '', dataClass = '' } = entry;
    const processor = chooseProcessor(dataType, dataClass);
    if (!processor) continue;
    processor(entry, dataStructure);
  }
  return dataStructure.map((_data) => {
    if (_data.spectra) return _data.spectra[0];
    return _data;
  });
}

function chooseProcessor(dataType, dataClass) {
  switch (dataType.toLowerCase()) {
    case 'link':
      return extractFromLink;
    case 'nmr spectrum':
      switch (dataClass.toLowerCase()) {
        case 'peak table':
          return extractPeaks;
        case 'xydata':
        case 'ntuples':
        default:
          return extractSpectrum;
      }
    case 'nmr peak assignments':
      return;
    default:
      return;
  }
}

function extractPeaks(entry, dataStructure) {
  let { info, meta: metadata } = entry;

  let dimensions = [];
  let dependentVariables = [];

  let dependentVariable = {};

  for (let i = 0; i < entry.spectra.length; i++) {
    let data = entry.spectra[i].data;
    data = convertToFloatArray(data);
  }
  dependentVariable.components = entry.spectra;

  let dimension = {
    increment: info.increment,
    numberOfPoints: info.numberOfPoints,
  };

  dimension.coordinatesOffset = {
    magnitude:
      info.frequencyOffset / info.baseFrequency - 0.5 * info.spectraWidth,
    units: 'ppm',
  };

  dimensions.push(dimension);
  dependentVariables.push(dependentVariable);

  dataStructure = {
    dimensions,
    dependentVariables,
    info,
    meta: metadata,
    timeStamp: new Date().valueOf(),
    version: packageJson.version,
  };

  return dataStructure;
}

function extractFromLink(entry, dataStructure) {
  let block = { info: {}, meta: {}, spectra: [] };
  for (const child of entry.children) {
    const { info = {}, meta = {}, dataType = '', dataClass = '' } = child;
    const processor = chooseProcessor(dataType, dataClass);
    if (processor) {
      processor(child, block.spectra);
    } else {
      block.info = assignDeep(block.info, info);
      block.meta = assignDeep(block.meta, meta);
    }
  }
  dataStructure.push(block);
}

function extractSpectrum(entry, dataStructure) {
  if ((entry.spectra && entry.spectra.length > 0) || entry.minMax) {
    let metadata = Object.assign({}, entry.info, entry.meta);
    let info = getInfoFromJCAMP(metadata);

    if (info.experiment === 'wobble_curve') return;

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
