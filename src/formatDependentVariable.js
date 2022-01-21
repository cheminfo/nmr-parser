import { isAnyArray } from 'is-any-array';

import { numericTypeTable, quantityTypeTable } from './constantTables';
/**
 * a class for dependent variable
 * @param {object || array} data - the dependent variable
 * @param {numericType} numericType - a number that correspond to a type of numeric used to store the components
 * @param {object} [options] - an object with options (name, unit, quantityName, componentLabels, sparseSampling, application, description)
 * @param {string} [options.name] - a name of the dependent variable
 * @param {string} [options.unit] - the unit of the dependent variable
 * @param {string} [options.quantityName] - a name of the quantity
 * @param {array} [options.componentLabels] - an array of labels for each component of the dependent variable
 * @return {object} - an dependent variable
 */
export function formatDependentVariable(data, numericType, options = {}) {
  let {
    quantityType = 0,
    encoding = 'none',
    name = '',
    unit = '',
    quantityName = '',
    componentLabels = [],
    sparseSampling = {},
    from = 0,
    to = -1,
  } = options;

  let components;
  if (isAnyArray(data)) {
    throw new Error('not yet implemented');
  } else if (Object.keys(data).length === 2) {
    components = fromReIm(data, from, to);
  }

  if (componentLabels.length === 0) {
    componentLabels = components.componentLabels;
  }

  return {
    type: 'internal',
    quantityType: quantityTypeTable[quantityType],
    numericType: numericTypeTable[numericType],
    encoding,
    name,
    unit,
    quantityName,
    componentLabels,
    sparseSampling,
    description: options.description || '',
    application: options.application || '',
    components: components.components,
    dataLength: components.dataLength,
  };
}

/**
 * import object {re:[], im:[]} to component
 * @param {object} reIm - a reIm object to import
 * @param {number} from - lower limit
 * @param {number} to - upper limit
 * @return {array} - components
 */
function fromReIm(reIm, from, to) {
  let dataLength = [];
  let componentLabels = [];
  let components = [];
  if (isAnyArray(reIm.re) & isAnyArray(reIm.im)) {
    if (typeof reIm.re[0] === 'number') {
      // if 1D
      dataLength[0] = setLengthComplex(from[0], to[0], reIm.re.length);
      let component = new Float64Array(dataLength[0]);
      for (let i = 0; i < dataLength[0]; i += 2) {
        let idx = i + from[0] * 2;
        component[i] = reIm.re[idx / 2];
        component[i + 1] = reIm.im[idx / 2];
      }
      components.push(component);
      componentLabels.push('complex');
    } else if (isAnyArray(reIm.re[0])) {
      // if 2D
      dataLength[0] = setLength(from[1], to[1], reIm.re.length);
      dataLength[1] = setLengthComplex(from[0], to[0], reIm.re[0].length);

      for (let j = 0; j < dataLength[0]; j++) {
        let component = new Float64Array(dataLength[1]);
        for (let i = 0; i < dataLength[1]; i += 2) {
          let idx = i + from[0] * 2;
          component[i] = reIm.re[j][idx / 2];
          component[i + 1] = reIm.im[j][idx / 2];
        }
        components.push(component);
      }
    } else {
      throw new Error('check your object');
    }
  } else if (isAnyArray(reIm.re.re)) {
    dataLength[0] = reIm.re.re.length * 2;
    let re = fromReIm(reIm.re, from, to).components;
    let im = fromReIm(reIm.im, from, to).components;
    for (let j = 0; j < dataLength[0] / 2; j++) {
      components.push(re[j]);
      components.push(im[j]);
    }
  } else {
    throw new Error('check the dimension or the type of data in your array');
  }

  return {
    dataLength,
    componentLabels,
    components,
  };
}

function setLength(from, to, length) {
  if (to - from + 1 < length) {
    return to - from + 1;
  } else {
    return length;
  }
}

function setLengthComplex(from, to, length) {
  if (to - from + 1 < length) {
    return (to - from + 1) * 2;
  } else {
    return length * 2;
  }
}

// /**
//  * add component to components from 1D array.
//  * @param {array} array - a 1D or 2D array to import
//  * @return {Float64Array} - component
//  */
// function add1DArray(array) {
//   let component;
//   component = new Float64Array(array.length);
//   for (let i = 0; i < array.length; i++) {
//     component[i] = array[i];
//   }
//   return component;
// }

// /**
//  * import component to InternalDEPENDENTVAR class object from 1D or 2D array.
//  * @param {array} array - a 1D or 2D array to import
//  */
// function fromArray(array) {
//   this.dataLength[0] = array.length;
//   if (typeof array[0] === 'number') {
//     this.components = [this.add1DArray(array)];
//   } else if (Array.isArray(array[0])) {
//     this.dataLength[1] = array[0].length;
//     for (let j = 0; j < this.dataLength[1]; j++) {
//       this.components.push(this.add1DArray(array[j]));
//     }
//   } else {
//     throw new Error('check the dimension or the type of data in your array');
//   }
//   return this;
// }
