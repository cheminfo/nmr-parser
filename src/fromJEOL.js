import { parseJEOL } from 'jeolconverter';

import { version, dependencies, devDependencies } from '../package.json';

import { formatDependentVariable } from './formatDependentVariable';
import { formatLinearDimension } from './formatLinearDimension';

export function fromJEOL(buffer) {
  let parsedData = parseJEOL(buffer);
  let headers = parsedData.headers;
  let info = parsedData.info;
  let data = parsedData.data;

  info.title = `title: ${headers.title} / comment: ${headers.comment} / author:${headers.author} / site: ${headers.site}`;
  info.nucleus = info.nucleus.map((x) => (x === 'Proton' ? '1H' : null));

  let description = {
    info,
    metadata: {
      headers,
      parameters: parsedData.parameters,
    },
  };

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
        magnitude: info.acquisitionTime[d].magnitude / info.dataPoints[d],
        unit: 's',
      };
    } else if (info.dataUnits[d] === 'Ppm') {
      options.originOffset = {
        magnitude: info.frequency[d].magnitude,
        unit: 'Hz',
      };
      options.quantityName = 'frequency';
      options.coordinatesOffset = {
        magnitude:
          (info.frequencyOffset[d].magnitude * info.frequency[d].magnitude) /
          1000000,
        unit: 'Hz',
      };
      increment = {
        magnitude: info.spectralWidth[d].magnitude / info.dataPoints[d],
        unit: 'Hz',
      };
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

  options = {
    unit: 'none',
    quantityName: 'relative intensity',
  };

  let dependentVariables = [];
  dependentVariables.push(formatDependentVariable(data, 11, options));

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
