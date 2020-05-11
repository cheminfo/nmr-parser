import { parseJEOL } from 'jeolconverter';

import { version, dependencies, devDependencies } from '../package.json';

import { InternalDEPENDENTVAR } from './DEPENDENTVAR';
import { LinearDIMENSION } from './DIMENSION';

export class NMRDATA {
  constructor(nmrdata, options = {}) {
    if (nmrdata === true) {
      const dataStructure = options;
      this.timeStamp = dataStructure.timeStamp;
      this.description = dataStructure.description;
      this.tags = dataStructure.tags;
      this.dependentVariables = dataStructure.dependentVariables;
      this.dimensions = LinearDIMENSION.load(dataStructure.dimensions);
      this.version = dataStructure.version;
      this.application = dataStructure.application;
      return;
    }
  }

  fromJEOL(buffer) {
    let parsedData = parseJEOL(buffer);
    let headers = parsedData.headers;
    let info = parsedData.info;
    let data = parsedData.data;
    //console.log(info);

    this.dimensions = [];
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
              (info.frequencyOffset[d].magnitude *
                info.frequency[d].magnitude) /
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

      this.dimensions.push(
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

    if (info.dataSections.length === 4) {
      data = {
        re: {
          re: data.reRe,
          im: data.reIm,
        },
        im: {
          re: data.imRe,
          im: data.imIm,
        },
      };
    }

    this.dependentVariables = [
      new InternalDEPENDENTVAR(0, 11, options).fromReIm(data).get(),
    ];

    let dataStructure = {
      timeStamp: new Date().valueOf(),
      version: [{ 'nmr-parser': version }, dependencies, devDependencies],
      description: `title: ${headers.title} / comment: ${headers.comment} / author:${headers.author} / site: ${headers.site}`,
      tags: ['magnetic resonance'].concat(info.nucleus),
      application: {},
      dimensions: this.dimensions,
      dependentVariables: this.dependentVariables,
    };
    return new NMRDATA(true, dataStructure);
  }

  /**
   * Load a dataStructure from a JSON
   * @param {Object} dataStructure
   * @return {NMRDATA}
   */
  static load(dataStructure) {
    if (typeof dataStructure.name !== 'string') {
      throw new TypeError('dataStructure must have a name property');
    }
    if (dataStructure.name !== 'NMRDATA') {
      throw new RangeError(`invalid dataStructure: ${dataStructure.name}`);
    }
    return new NMRDATA(true, dataStructure);
  }

  /**
   * export as a JSON
   * @return - a JSON object
   */
  toJSON() {
    return {
      name: 'NMRDATA',
      timeStamp: this.timeStamp,
      description: this.description,
      tags: this.tags,
      dependentVariables: this.description,
      dimensions: this.dimensions.map((d) => d.toJSON()),
      version: this.version,
      application: this.application,
    };
  }

  get() {
    return this;
  }
}
