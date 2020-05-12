import { parseJEOL } from 'jeolconverter';

import { version, dependencies, devDependencies } from '../package.json';

import { InternalDEPENDENTVAR } from './DEPENDENTVAR';
import { LinearDIMENSION } from './DIMENSION';

export function fromJEOL(buffer) {
  let parsedData = parseJEOL(buffer);
  let headers = parsedData.headers;
  let info = parsedData.info;
  let data = parsedData.data;

  let dimensions = [];
  let options = {};
  let increment;
  for (let d = 0; d < info.dataDimension; d++) {
    if (info.dataUnits[d] === 'Second') {
      options.quantityName = 'time';
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
      options.quantityName = 'frequency';
      increment = {
        magnitude: info.spectralWidth[d].magnitude / info.dataPoints[d],
        unit: 'Hz',
      };
    }

    if (d === 0) {
      options.description = 'direct dimension';
      options.coordinatesOffest = {
        magnitude: info.digitalFilter * increment,
        unit: 's',
      };
    } else {
      options.description = 'indirect dimension';
    }

    dimensions.push(
      new LinearDIMENSION(
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
  dependentVariables.push(
    new InternalDEPENDENTVAR(0, 11, options).fromReIm(data),
  );
  let dataStructure = {
    timeStamp: new Date().valueOf(),
    version: [{ 'nmr-parser': version }, dependencies, devDependencies],
    description: `title: ${headers.title} / comment: ${headers.comment} / author:${headers.author} / site: ${headers.site}`,
    tags: ['magnetic resonance'].concat(info.nucleus),
    application: {},
    dimensions: dimensions,
    dependentVariables: dependentVariables,
  };
  return dataStructure;
}
