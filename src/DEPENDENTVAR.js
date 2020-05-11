import { numericTypeTable, quantityTypeTable } from './constantTables';
/**
 * a class for dependent variable
 * @param {string} name - the name of the dependent variable
 * @param {quantityType} - a number that correspond to a type of quantity {0: scalar, 1: vector}
 * @param {numericType} numericType - a number that correspond to a type of numeric used to store the components
 * @param {object} [options] - an object with options (name, unit, quantityName, componentLabels, sparseSampling, application, description)
 * @param {string} [options.name] - a name of the dependent variable
 * @param {string} [options.unit] - the unit of the dependent variable
 * @param {string} [options.quantityName] - a name of the quantity
 * @param {array} [options.componentLabels] - an array of labels for each component of the dependent variable
 * @return {DEPENDENTVAR} - an dependent variable object
 */
export class DEPENDENTVAR {
  constructor(quantityType, numericType, options = {}) {
    this.numericType = numericTypeTable[numericType];
    this.quantityType = quantityTypeTable[quantityType];

    this.name = options.name || '';
    this.unit = options.unit || '';
    this.quantityName = options.quantityName || '';
    this.componentLabels = options.components || [];
    this.sparseSampling = options.sparseSampling || {};
    this.description = options.description || '';
    this.application = options.application || {};
  }
  get() {
    return this;
  }
}

export class InternalDEPENDENTVAR extends DEPENDENTVAR {
  constructor(quantityType, numericType, options = {}) {
    super();
    this.type = 'internal';
    this.encoding = options.encoding || 'none';
    this.numericType = numericTypeTable[numericType];
    this.quantityType = quantityTypeTable[quantityType];
    this.name = options.name || '';
    this.unit = options.unit || '';
    this.quantityName = options.quantityName || '';
    this.componentLabels = options.components || [];
    this.sparseSampling = options.sparseSampling || {};
    this.description = options.description || '';
    this.application = options.application || {};

    this.check();

    this.components = [];
    this.dataLength = [];
  }

  get() {
    return this;
  }

  size() {
    return this.dataLength;
  }

  /**
   * add component to components from 1D array.
   * @param {array} array - a 1D or 2D array to import
   * @return {Float64Array} - component
   */
  add1DArray(array) {
    let component;
    component = new Float64Array(array.length);
    for (let i = 0; i < array.length; i++) {
      component[i] = array[i];
    }
    return component;
  }

  /**
   * import component to InternalDEPENDENTVAR class object from 1D or 2D array.
   * @param {array} array - a 1D or 2D array to import
   */
  fromArray(array) {
    this.dataLength[0] = array.length;
    if (typeof array[0] === 'number') {
      this.components = [this.add1DArray(array)];
    } else if (Array.isArray(array[0])) {
      this.dataLength[1] = array[0].length;
      for (let j = 0; j < this.dataLength[1]; j++) {
        this.components.push(this.add1DArray(array[j]));
      }
    } else {
      throw new Error('check the dimension or the type of data in your array');
    }
    return this;
  }

  /**
   * import component to InternalDEPENDENTVAR class object from {re:[], im:[]}.
   * @param {object} ReIm - a ReIm object to import
   */
  fromReIm(ReIm) {
    if (Array.isArray(ReIm.re) & Array.isArray(ReIm.im)) {
      if (typeof ReIm.re[0] === 'number') {
        this.dataLength[0] = ReIm.re.length * 2;
        let component = new Float64Array(this.dataLength[0]);
        for (let i = 0; i < this.dataLength[0]; i += 2) {
          component[i] = ReIm.re[i / 2];
          component[i + 1] = ReIm.im[i / 2];
        }
        this.components = [component];
        if (this.componentLabels.length === 0) {
          this.componentLabels = ['complex'];
        }
      } else if (Array.isArray(ReIm.re[0])) {
        this.dataLength[0] = ReIm.re.length;
        this.dataLength[1] = ReIm.re[0].length * 2;
        this.components = [];
        for (let j = 0; j < this.dataLength[0]; j++) {
          let component = new Float64Array(this.dataLength[1]);
          for (let i = 0; i < this.dataLength[1]; i += 2) {
            component[i] = ReIm.re[j][i / 2];
            component[i + 1] = ReIm.im[j][i / 2];
          }
          this.components.push(component);
        }
      } else {
        throw new Error('check your object');
      }
    } else if (Array.isArray(ReIm.re.re)) {
      this.dataLength[0] = ReIm.re.re.length * 2;
      let Re = this.fromReIm(ReIm.re).components;
      let Im = this.fromReIm(ReIm.im).components;
      this.components = [];
      for (let j = 0; j < this.dataLength[0]; j++) {
        this.components.push(Re[j]);
        this.components.push(Im[j]);
      }
    } else {
      throw new Error('check the dimension or the type of data in your array');
    }

    return this;
  }

  /**
   * import component to InternalDEPENDENTVAR class object from 1D or 2D array.
   * @param {array} array - a 1D or 2D array to import
   */
  check() {
    if (this.quantityType !== 'scalar') {
      throw new Error('this method only applies for scalar data');
    }

    if (
      (this.numericType !== 'float64') &
      (this.numericType !== 'complex128')
    ) {
      throw new Error('float64 and complex128 formats are preferred for NMR');
    }

    if (this.encoding !== 'none') {
      throw new Error('no encoding supported yet');
    }
  }
}
