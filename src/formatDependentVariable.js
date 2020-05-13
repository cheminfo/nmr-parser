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
  } = options;

  let components;
  if (Array.isArray(data)) {
    throw new Error('not yet implemented');
  } else if (Object.keys(data).length === 2) {
    components = fromReIm(data);
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
 * @return {array} - components
 */
function fromReIm(reIm) {
  let dataLength = [];
  let componentLabels = [];
  let components = [];
  if (Array.isArray(reIm.re) & Array.isArray(reIm.im)) {
    if (typeof reIm.re[0] === 'number') {
      dataLength[0] = reIm.re.length * 2;
      let component = new Float64Array(dataLength[0]);
      for (let i = 0; i < dataLength[0]; i += 2) {
        component[i] = reIm.re[i / 2];
        component[i + 1] = reIm.im[i / 2];
      }
      components.push(component);
      componentLabels.push('complex');
    } else if (Array.isArray(reIm.re[0])) {
      dataLength[0] = reIm.re.length;
      dataLength[1] = reIm.re[0].length * 2;
      for (let j = 0; j < dataLength[0]; j++) {
        let component = new Float64Array(dataLength[1]);
        for (let i = 0; i < dataLength[1]; i += 2) {
          component[i] = reIm.re[j][i / 2];
          component[i + 1] = reIm.im[j][i / 2];
        }
        components.push(component);
      }
    } else {
      throw new Error('check your object');
    }
  } else if (Array.isArray(reIm.re.re)) {
    dataLength[0] = reIm.re.re.length * 2;
    let re = fromReIm(reIm.re).components;
    let im = fromReIm(reIm.im).components;
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
