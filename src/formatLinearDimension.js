/**
 *
 * @param {*} label
 * @param {*} count
 * @param {*} increment
 * @param {*} options
 */
export function formatLinearDimension(label, count, increment, options = {}) {
  return {
    label: String(label),
    count: Number(count),
    increment: increment,
    type: 'linear',
    description: String(options.description) || '',
    application: options.application || {},
    coordinatesOffset: options.coordinatesOffset || 0,
    originOffset: options.originOffset || 0,
    quantityName: String(options.quantityName) || '',
    reciprocal: options.reciprocal || {},
    period: options.period || 0,
    complexFFT: options.complexFFT || false,
  };
}
