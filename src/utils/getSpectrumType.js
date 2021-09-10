/**
 * Returns an experiment string based on a pulse sequence
 * @param {string} pulse
 * @return {string}
 */
export function getSpectrumType(meta = {}, info = {}, options = {}) {
  const { subfix = '' } = options;

  if (meta === null) meta = {};
  if (typeof meta === 'string') meta = { pulseSequence: meta };

  let spectyp = info[`${subfix}SPECTYP`];
  spectyp = (Array.isArray(spectyp) ? spectyp[0] : spectyp || '')
    .replace(/^<(.*)>$/, '$1') // eslint-disable-line prefer-named-capture-group
    .toLowerCase();

  if (spectyp.length > 0 && spectyp !== 'undefined') return spectyp;

  let pulse = Array.isArray(meta.pulseSequence)
    ? meta.pulseSequence[0]
    : meta.pulseSequence || '';

  if (typeof pulse !== 'string') {
    return meta.dimension ? `${meta.dimension}d` : '';
  }

  pulse = pulse.toLowerCase();
  if (
    pulse.includes('zg') ||
    pulse.includes('single_pulse_dec') ||
    pulse.includes('udeft')
  ) {
    return '1d';
  }

  if (
    pulse.includes('hsqct') ||
    (pulse.includes('invi') && (pulse.includes('ml') || pulse.includes('di')))
  ) {
    return 'hsqctocsy';
  }

  if (pulse.includes('hsqc') || pulse.includes('invi')) {
    return 'hsqc';
  }

  if (
    pulse.includes('hmbc') ||
    (pulse.includes('inv4') && pulse.includes('lp'))
  ) {
    return 'hmbc';
  }

  if (pulse.includes('hmqc')) {
    return 'hmqc';
  }

  if (pulse.includes('cosy')) {
    return 'cosy';
  }

  if (pulse.includes('jres')) {
    return 'jres';
  }

  if (
    pulse.includes('tocsy') ||
    pulse.includes('mlev') ||
    pulse.includes('dipsi')
  ) {
    return 'tocsy';
  }

  if (pulse.includes('noesy')) {
    return 'noesy';
  }

  if (pulse.includes('roesy')) {
    return 'roesy';
  }

  if (pulse.includes('dept')) {
    return 'dept';
  }

  if (pulse.includes('jmod') || pulse.includes('apt')) {
    return 'aptjmod';
  }

  if (pulse.includes('inad')) {
    return 'inadequate';
  }

  if (pulse.includes('adeq')) {
    return 'adequate';
  }

  return meta.dimension ? `${meta.dimension}d` : '';
}
