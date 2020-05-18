import { parseJEOL } from 'jeolconverter';

import { version, dependencies, devDependencies } from '../package.json';

import { formatDependentVariable } from './formatDependentVariable';
import { formatLinearDimension } from './formatLinearDimension';

export function fromJEOL(buffer) {
  let parsedData = parseJEOL(buffer);
  let info = parsedData.info;
  let headers = parsedData.headers;
  let parameters = parsedData.parameters;
  let data = parsedData.data;

  // curation of parameters
  info.title = `title: ${headers.title} / comment: ${headers.comment} / author:${headers.author} / site: ${headers.site}`;
  info.nucleus = info.nucleus.map((x) => {
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
  info.field = { magnitude: info.field.magnitude * 42.577478518, unit: 'MHz' };

  // set options for dimensions
  let dimensions = [];
  let options = {};
  let increment;
  for (let d = 0; d < info.dataDimension; d++) {
    if (info.dataUnits[d] === 'Second') {
      options.quantityName = 'time';
      options.originOffset = { magnitude: 0, unit: 's' };
      if (d === 0) {
        options.coordinatesOffest = {
          magnitude: info.digitalFilter * increment,
          unit: 's',
        };
      } else {
        options.coordinatesOffest = { magnitude: 0, unit: 's' };
      }
      options.reciprocal = {
        originOffset: { magnitude: info.frequency[d].magnitude, unit: 'Hz' },
        quantityName: 'frequency',
        coordinatesOffset: {
          magnitude:
            (info.frequencyOffset[d].magnitude * info.frequency[d].magnitude) /
            1000000,
          unit: 'Hz',
        },
      };

      increment = {
        magnitude: info.acquisitionTime[d].magnitude / (info.dataPoints[d] - 1),
        unit: 's',
      };
    } else if (info.dataUnits[d] === 'Ppm') {
      options.quantityName = 'frequency';

      let origin = info.frequency[d].magnitude;
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

  let description = {};
  for (let key in info) {
    description[key] = info[key];
  }
  description.metadata = { headers, parameters };

  let dataStructure = {
    timeStamp: new Date().valueOf(),
    version: [{ 'nmr-parser': version }, dependencies, devDependencies],
    description,
    tags: ['magnetic resonance'].concat(info.nucleus),
    application: {},
    dimensions: dimensions,
    dependentVariables: dependentVariables,
  };
  return dataStructure;
}
