import { getDigitalFilterParameters } from './getDigitalFilterParameters';
import { getNucleusFrom2DExperiment } from './getNucleusFrom2DExperiment';
import { getSpectrumType } from './getSpectrumType';

export function getInfoFromJCAMP(metaData) {
  const info = {
    dimension: 0,
    nucleus: [],
    isFid: false,
    isFt: false,
    isComplex: false,
  };
  const separator = JSON.stringify(metaData).match('\r\n') ? '\r\n' : '\n';
  let creator = metaData.JCAMPDX.toLowerCase() + metaData.ORIGIN.toLowerCase();

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
  creator = 'bruker';
  // eslint-disable-next-line dot-notation
  if (metaData['$NUC1']) {
    // eslint-disable-next-line dot-notation
    let nucleus = metaData['$NUC1'];
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
  maybeAdd(info, 'temperature', metaData.$TE || metaData['.TE']);
  maybeAdd(info, 'type', metaData.DATATYPE);

  if (info.type) {
    let typeLowerCase = info.type[0].toUpperCase();
    if (typeLowerCase.indexOf('FID') >= 0) {
      info.isFid = true;
    } else if (typeLowerCase.indexOf('SPECTRUM') >= 0) {
      info.isFt = true;
    }
  }

  maybeAdd(
    info,
    'pulseSequence',
    metaData['.PULSESEQUENCE'] || metaData['.PULPROG'] || metaData.$PULPROG,
  );
  maybeAdd(info, 'experiment', getSpectrumType(info, metaData));

  maybeAdd(info, 'originFrequency', metaData['.OBSERVEFREQUENCY']);

  if (creator === 'bruker') {
    maybeAdd(info, 'probeName', metaData.$PROBHD);
    maybeAdd(info, 'originFrequency', metaData.$SFO1);
    maybeAdd(info, 'baseFrequency', metaData.$BF1);
    const { baseFrequency, originFrequency } = info;
    let fieldStrength = baseFrequency.map((bf) => bf / 42.577478518);
    let frequencyOffset = baseFrequency.map(
      (bf, i) => (originFrequency[i] - bf) * 1e6,
    );

    maybeAdd(info, 'fieldStrength', fieldStrength);
    maybeAdd(info, 'frequencyOffset', frequencyOffset);
    maybeAdd(info, 'spectralWidth', metaData.$SW);
    maybeAdd(info, 'numberOfPoints', metaData.$TD);
    maybeAdd(info, 'sampleName', metaData.$NAME);

    if (metaData.$FNTYPE !== undefined) {
      maybeAdd(info, 'acquisitionMode', parseInt(metaData.$FNTYPE, 10));
    }
    let varName = metaData.VARNAME ? metaData.VARNAME.split(',')[0] : '';
    if (varName === 'TIME') {
      maybeAdd(info, 'acquisitionTime', Number(metaData.LAST.split(',')[0]));
    }

    const { numberOfPoints, spectralWidth } = info;
    if (!info.acquisitionTime) {
      maybeAdd(
        info,
        'acquisitionTime',
        Number(numberOfPoints[0] / (2 * spectralWidth[0] * originFrequency[0])),
      );
    }

    let pulseStrength =
      1e6 / (metaData.$P.split(separator)[1].split(' ')[1] * 4);
    maybeAdd(info, 'pulseStrength90', pulseStrength);
    let relaxationTime = metaData.$D.split(separator)[1].split(' ')[1];
    maybeAdd(info, 'relaxationTime', Number(relaxationTime));
    maybeAdd(info, 'numberOfScans', Number(metaData.$NS));

    let increment;
    if (info.isFid) {
      let digitalFilterParameters = getDigitalFilterParameters(
        metaData.$GRPDLY,
        metaData.$DSPFVS,
        metaData.$DECIM,
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

    if (metaData.$DATE) {
      info.date = new Date(parseInt(metaData.$DATE, 10) * 1000).toISOString();
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
      value = value.substring(1, value.length - 2);
    }
    value = value.trim();
  }
  const valueAsNumber = parseFloat(value);
  return isNaN(valueAsNumber) ? value : valueAsNumber;
}
