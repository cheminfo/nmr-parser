/**
 * a number that correspond to a type of numeric
 * @typedef {number} numericType
 * @const
 */
export const numericTypeTable = {
  0: 'uint8',
  1: 'uint16',
  2: 'uint32',
  3: 'uint64',
  4: 'int8',
  5: 'int16',
  6: 'int32',
  7: 'int64',
  8: 'float32',
  9: 'float64',
  10: 'complex64',
  11: 'complex128',
};

/**
 * a number that corresponds to a type of quantity
 * @typedef {number} quantityType
 * @const
 */
export const quantityTypeTable = {
  0: 'scalar',
  1: 'vector',
  2: 'matrix',
  3: 'symetricMatrix',
  4: 'pixel',
};
