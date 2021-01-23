import { gyromagneticRatio } from 'nmr-processing';

import { getDigitalFilterParameters } from './getDigitalFilterParameters';
import { getNucleusFrom2DExperiment } from './getNucleusFrom2DExperiment';
import { getSpectrumType } from './getSpectrumType';

export function getInfoFromJCAMP(metaData, options = {}) {
  const { subfix = '' } = options;
  const info = {
    dimension: 0,
    nucleus: [],
    isFid: false,
    isFt: false,
    isComplex: false,
  };
  let metadataString = JSON.stringify(metaData);
  const separator = metadataString.match('\r\n') ? '\r\n' : '\n';

  let { JCAMPDX: jcampdx = '', ORIGIN: origin = '' } = metaData;
  let creator = String(jcampdx).toLowerCase() + origin.toLowerCase();

  if (creator.includes('mestre') || creator.includes('nova')) {
    creator = 'mnova';
  }
  if (creator.includes('bruker')) {
    creator = 'bruker';
  }

  if (creator === 'mnova') {
    if (metaData.LONGDATE) {
      info.date = metaData.LONGDATE;
    }
  }
  // eslint-disable-next-line dot-notation
  if (metaData[`${subfix}NUC1`]) {
    // eslint-disable-next-line dot-notation
    let nucleus = metaData[`${subfix}NUC1`];
    if (!Array.isArray(nucleus)) nucleus = [nucleus];
    nucleus = nucleus.map((value) =>
      value.replace(/[^A-Za-z0-9]/g, '').replace('NA', ''),
    );
    let beforeLength = nucleus.length;
    nucleus = nucleus.filter((value) => value);
    if (nucleus.length === beforeLength) {
      info.nucleus = nucleus;
    }
  }

  if (!info.nucleus || info.nucleus.length === 0) {
    if (metaData['.NUCLEUS']) {
      info.nucleus = metaData['.NUCLEUS'].split(',').map((nuc) => nuc.trim());
    } else if (metaData['.OBSERVENUCLEUS']) {
      info.nucleus = [metaData['.OBSERVENUCLEUS'].replace(/[^A-Za-z0-9]/g, '')];
    } else {
      info.nucleus = getNucleusFrom2DExperiment(info.experiment);
    }
  }
  if (metaData['2D_X_NUCLEUS'] && metaData['2D_Y_NUCLEUS']) {
    info.nucleus = [
      metaData['2D_X_NUCLEUS'].replace(/[^A-Za-z0-9]/g, ''),
      metaData['2D_Y_NUCLEUS'].replace(/[^A-Za-z0-9]/g, ''),
    ];
  }

  info.dimension = info.nucleus.length;
  maybeAdd(info, 'title', metaData.TITLE);
  maybeAdd(info, 'solvent', metaData['.SOLVENTNAME']);
  maybeAdd(info, 'temperature', metaData[`${subfix}TE`] || metaData['.TE']);
  maybeAdd(info, 'type', metaData.DATATYPE);

  if (info.type) {
    let typeLowerCase = info.type[0].toUpperCase();
    if (typeLowerCase.indexOf('FID') >= 0) {
      info.isFid = true;
      info.isComplex = true;
    } else if (typeLowerCase.indexOf('SPECTRUM') >= 0) {
      info.isFt = true;
      info.isComplex = true;
    }
  }

  maybeAdd(
    info,
    'pulseSequence',
    metaData['.PULSESEQUENCE'] ||
      metaData['.PULPROG'] ||
      metaData[`${subfix}PULPROG`],
  );
  maybeAdd(info, 'experiment', getSpectrumType(info, metaData, { subfix }));

  maybeAdd(info, 'originFrequency', metaData['.OBSERVEFREQUENCY']);

  if (creator === 'bruker') {
    const gyromagneticRatioConst = gyromagneticRatio[info.nucleus[0]];
    maybeAdd(info, 'probeName', metaData[`${subfix}PROBHD`]);
    maybeAdd(info, 'originFrequency', metaData[`${subfix}SFO1`]);
    maybeAdd(info, 'baseFrequency', metaData[`${subfix}BF1`]);
    const { baseFrequency, originFrequency } = info;
    let fieldStrength =
      2 * Math.PI * (baseFrequency[0] / gyromagneticRatioConst) * 1e6;
    let frequencyOffset = baseFrequency.map(
      (bf, i) => (originFrequency[i] - bf) * 1e6,
    );

    maybeAdd(info, 'fieldStrength', fieldStrength);
    maybeAdd(info, 'frequencyOffset', frequencyOffset);
    maybeAdd(info, 'spectralWidth', metaData[`${subfix}SW`]);
    maybeAdd(info, 'numberOfPoints', metaData[`${subfix}TD`]);
    maybeAdd(info, 'sampleName', metaData[`${subfix}NAME`]);

    if (metaData[`${subfix}FNTYPE`] !== undefined) {
      maybeAdd(
        info,
        'acquisitionMode',
        parseInt(metaData[`${subfix}FNTYPE`], 10),
      );
    }
    let varName = metaData[`${subfix}VARNAME`]
      ? metaData[`${subfix}VARNAME`].split(',')[0]
      : '';
    if (varName === 'TIME') {
      let value =
        typeof metaData.LAST === 'string' || metaData.LAST instanceof String
          ? metaData.LAST.replace(' ', '').split(',')[0]
          : metaData.LAST;
      maybeAdd(info, 'acquisitionTime', Number(value));
    }

    const { numberOfPoints, spectralWidth } = info;
    if (!info.acquisitionTime) {
      maybeAdd(
        info,
        'acquisitionTime',
        Number(
          (numberOfPoints[0] - 1) / (2 * spectralWidth[0] * originFrequency[0]),
        ),
      );
    }

    let pulseStrength =
      1e6 / (metaData[`${subfix}P`].split(separator)[1].split(' ')[1] * 4);
    maybeAdd(info, 'pulseStrength90', pulseStrength);
    let relaxationTime = metaData[`${subfix}D`]
      .split(separator)[1]
      .split(' ')[1];
    maybeAdd(info, 'relaxationTime', Number(relaxationTime));
    maybeAdd(info, 'numberOfScans', Number(metaData[`${subfix}NS`]));

    let increment;
    if (info.isFid) {
      maybeAdd(info, 'groupDelay', metaData[`${subfix}GRPDLY`] || 0);
      maybeAdd(info, 'DSPFVS', metaData[`${subfix}DSPFVS`]);
      maybeAdd(info, 'DECIM', metaData[`${subfix}DECIM`]);

      let { groupDelay, DSPFVS, DECIM } = info;
      let digitalFilterParameters = getDigitalFilterParameters(
        groupDelay[0],
        DSPFVS[0],
        DECIM[0],
      );
      maybeAdd(info, 'digitalFilter', digitalFilterParameters);
      increment = numberOfPoints.map((nb) => {
        return info.acquisitionTime[0] / (nb - 1);
      });
    } else {
      increment = numberOfPoints.map((nb, i) => {
        return spectralWidth[i] / (nb - 1);
      });
    }

    maybeAdd(info, 'increment', increment);
    if (metaData[`${subfix}DATE`]) {
      info.date = new Date(
        parseInt(metaData[`${subfix}DATE`], 10) * 1000,
      ).toISOString();
    }

    if (!info.solvent) {
      maybeAdd(
        info,
        'solvent',
        Array.isArray(metaData[`${subfix}SOLVENT`])
          ? metaData[`${subfix}SOLVENT`][0]
          : metaData[`${subfix}SOLVENT`],
      );
    }
  }

  if (metaData.SYMBOL) {
    let symbols = metaData.SYMBOL.split(/[, ]+/);
    if (symbols.includes('R') && symbols.includes('I')) {
      info.isComplex = true;
    }
  }

  for (let key in info) {
    if (info[key].length === 1) info[key] = info[key][0];
  }

  if (!Array.isArray(info.nucleus)) info.nucleus = [info.nucleus];

  return info;
}

function maybeAdd(obj, name, value) {
  if (value !== undefined) {
    if (Array.isArray(value)) {
      obj[name] = value.map((v) => {
        return removeUnless(v);
      });
    } else {
      obj[name] = [removeUnless(value)];
    }
  }
}

function removeUnless(value) {
  if (typeof value === 'string') {
    if (value.startsWith('<') && value.endsWith('>')) {
      value = value.substring(1, value.length - 1);
    }
    value = value.trim();
  }
  return value.match && value.match(/[A-Za-z]/g) ? value : parseFloat(value);
}
