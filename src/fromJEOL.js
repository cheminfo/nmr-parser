import { parseJEOL } from 'jeolconverter';

import { version, dependencies, devDependencies } from '../package.json';

import { formatDependentVariable } from './formatDependentVariable';
import { formatLinearDimension } from './formatLinearDimension';
import { toKeyValue } from './utils/toKeyValue';

export function fromJEOL(buffer) {
  let parsedData = parseJEOL(buffer);
  let info = parsedData.info;
  let headers = parsedData.headers;
  let parameters = parsedData.parameters;
  let paramArray = Object.assign({}, parameters.paramArray);
  delete parameters.paramArray;
  let data = parsedData.data;

  // curation of parameters
  let newInfo = {};
  newInfo.title = `title: ${headers.title} / comment: ${headers.comment} / author:${headers.author} / site: ${headers.site}`;
  newInfo.nucleus = info.nucleus.map((x) => {
    if (x === 'Proton') {
      x = '1H';
    }
    if (x === 'Carbon13') {
      x = '13C';
    }
    if (x === 'Nitrogen15') {
      x = '15N';
    }
    return x;
  });
  newInfo.sampleName = info.sampleName;
  newInfo.date = JSON.stringify(info.creationTime);
  newInfo.author = info.author;
  //newInfo.comment = info.comment;
  newInfo.solvent = info.solvent;
  newInfo.temperature = info.temperature.magnitude;
  newInfo.probeName = info.probeId;
  newInfo.fieldStrength = info.fieldStrength.magnitude;
  newInfo.baseFrequency = info.fieldStrength.magnitude * 42.577478518;
  newInfo.pulseSequence = info.experiment;
  newInfo.temperature = info.temperature.magnitude;
  newInfo.digitalFilter = 19;
  newInfo.pulseStrength90 = 1 / (4 * info.pulseStrength90.magnitude);
  newInfo.numberOfScans = info.numberOfScans;
  newInfo.relaxationTime = info.relaxationTime;

  newInfo.isComplex = info.dataSections.includes('im');
  newInfo.isFid = info.dataUnits[0] === 'Second';
  newInfo.isFt = info.dataUnits[0] === 'Ppm';

  newInfo.dimension = info.dimension;
  newInfo.originFrequency = info.originFrequency
    .map((d) => d.magnitude / 1e6)
    .slice(0, 1);
  newInfo.numberOfPoints = info.dataPoints.slice(0, 1);
  newInfo.frequencyOffset = info.frequencyOffset
    .map((f) => f.magnitude * newInfo.baseFrequency)
    .slice(0, 1);
  newInfo.acquisitionTime = info.acquisitionTime
    .map((a) => a.magnitude)
    .slice(0, 1);
  newInfo.spectralWidth =
    (info.spectralWidth[0].magnitude / info.originFrequency[0].magnitude) * 1e6;

  // set options for dimensions
  let dimensions = [];
  let options = {};
  let increment;
  for (let d = 0; d < info.dimension; d++) {
    increment = {
      magnitude: info.acquisitionTime[d].magnitude / (info.dataPoints[d] - 1),
      unit: 's',
    };
    if (info.dataUnits[d] === 'Second') {
      options.quantityName = 'time';
      options.originOffset = { magnitude: 0, unit: 's' };
      if (d === 0) {
        options.coordinatesOffset = {
          magnitude: info.digitalFilter * increment,
          unit: 's',
        };
      } else {
        options.coordinatesOffset = { magnitude: 0, unit: 's' };
      }
      options.reciprocal = {
        originOffset: {
          magnitude: info.originFrequency[d].magnitude,
          unit: 'Hz',
        },
        quantityName: 'frequency',
        coordinatesOffset: {
          magnitude:
            (info.frequencyOffset[d].magnitude *
              info.originFrequency[d].magnitude) /
            1000000,
          unit: 'Hz',
        },
      };
    } else if (info.dataUnits[d] === 'Ppm') {
      options.quantityName = 'frequency';

      let origin = info.originFrequency[d].magnitude;
      options.originOffset = { magnitude: origin, unit: 'Hz' };

      let firstPoint = info.dataOffsetStart[0];
      let lastPoint = info.dataOffsetStop[0];
      let dataLength = lastPoint - firstPoint + 1;

      let spectralWidth = info.spectralWidth[d].magnitude;
      let incr = spectralWidth / info.dataPoints[d];
      increment = { magnitude: incr, unit: 'Hz' };

      let offset = (info.dataAxisStop[0] * origin) / 1000000;
      options.coordinatesOffset = {
        magnitude: offset,
        unit: 'Hz',
      };

      // after increment is computed with whole frequency
      // and original number of points, we recast the
      // number of point for export
      if (dataLength < info.dataPoints[d]) {
        info.dataPoints[d] = dataLength;
      }
    }

    if (d === 0) {
      options.description = 'direct dimension';
    } else {
      options.description = 'indirect dimension';
    }

    dimensions.push(
      formatLinearDimension(
        headers.dataAxisTitles[d],
        info.dataPoints[d],
        increment,
        options,
      ),
    );
  }

  // set options for dependentVariable
  options = {
    unit: 'none',
    quantityName: 'relative intensity',
    from: info.dataOffsetStart,
    to: info.dataOffsetStop,
  };

  let dependentVariables = [];
  dependentVariables.push(formatDependentVariable(data, 11, options));

  // let description = {};
  // for (let key in newInfo) {
  //   description[key] = newInfo[key];
  // }

  let description = Object.assign({}, newInfo);

  delete description.paramList;
  description.metadata = Object.assign(
    {},
    toKeyValue(headers),
    toKeyValue(parameters),
    toKeyValue(paramArray),
  );

  let dataStructure = {
    timeStamp: new Date().valueOf(),
    version: [{ 'nmr-parser': version }, dependencies, devDependencies],
    description,
    tags: ['magnetic resonance'].concat(newInfo.nucleus),
    application: {
      spectralWidthClipped:
        info.spectralWidthClipped[0].magnitude / newInfo.baseFrequency[0],
    },
    dimensions: dimensions,
    dependentVariables: dependentVariables,
  };
  return dataStructure;
}
