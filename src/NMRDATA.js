import { InternalDEPENDENTVAR } from './DEPENDENTVAR';
import { LinearDIMENSION } from './DIMENSION';
import { fromJEOL } from './fromJEOL';

export class NMRDATA {
  constructor(nmrdata, options = {}) {
    if (nmrdata === true) {
      const dataStructure = options;
      this.timeStamp = dataStructure.timeStamp;
      this.description = dataStructure.description;
      this.tags = dataStructure.tags;
      if (dataStructure.dependentVariables[0].type === 'internal') {
        this.dependentVariables = dataStructure.dependentVariables.map((dep) =>
          InternalDEPENDENTVAR.load(dep),
        );
      } else {
        throw new Error('only internal dependent variables supported yet');
      }
      if (dataStructure.dimensions[0].type === 'linear') {
        this.dimensions = dataStructure.dimensions.map((dim) =>
          LinearDIMENSION.load(dim),
        );
      } else {
        throw new Error('only linear dimensions supported yet');
      }
      this.version = dataStructure.version;
      this.application = dataStructure.application;
      return;
    }
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

  get() {
    return this;
  }

  fromJEOL(buffer) {
    let dataStructure = fromJEOL(buffer);
    return new NMRDATA(true, dataStructure);
  }
}
