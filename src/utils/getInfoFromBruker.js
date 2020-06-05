import { getDigitalFilterParameters } from './getDigitalFilterParameters';
import { getNucleusFrom2DExperiment } from './getNucleusFrom2DExperiment';
import { getSpectrumType } from './getSpectrumType';

export function getInfoFromBruker(metaData) {
  const info = {
    dimension: 0,
    nucleus: [],
    isFid: false,
    isFt: false,
    isComplex: false,
  };

  //console.log(metaData);
  let creator = metaData.JCAMPDX.toLowerCase();

  if (creator.includes('mestre') || creator.includes('nova')) {
    creator = 'mnova';
  }
  if (creator.includes('bruker')) {
    creator = 'bruker';
  }

  maybeAdd(info, 'title', metaData.TITLE);
  maybeAdd(info, 'solvent', metaData.$SOLVENT);
  maybeAdd(info, 'temperature', parseFloat(metaData.$TE || metaData['.TE']));
  maybeAdd(info, 'type', metaData.DATATYPE);
  maybeAdd(
    info,
    'pulseSequence',
    metaData['.PULSESEQUENCE'] || metaData['.PULPROG'] || metaData.$PULPROG,
  );
  maybeAdd(info, 'experiment', getSpectrumType(info, metaData));

  maybeAdd(
    info,
    'originFrequency',
    metaData['.OBSERVEFREQUENCY']
      ? parseFloat(metaData['.OBSERVEFREQUENCY'])
      : parseFloat(metaData.$SFO1),
  );

  maybeAdd(info, 'probeName', metaData.$PROBHD);
  maybeAdd(info, 'baseFrequency', Number(metaData.$BF1));
  maybeAdd(info, 'fieldStrength', Number(metaData.$BF1) / 42.577478518);
  maybeAdd(info, 'frequencyOffset', (metaData.$SFO1 - metaData.$BF1) * 1e6);
  maybeAdd(info, 'spectralWidth', Number(metaData.$SW));
  maybeAdd(info, 'numberOfPoints', Number(metaData.$TD));
  maybeAdd(info, 'sampleName', metaData.$NAME);

  if (metaData.$FNTYPE !== undefined) {
    maybeAdd(info, 'acquisitionMode', parseInt(metaData.$FNTYPE, 10));
  }

  //calculate the acquisition time
  let { numberOfPoints, spectralWidth, originFrequency } = info;
  maybeAdd(
    info,
    'acquisitionTime',
    Number(numberOfPoints / (2 * spectralWidth * originFrequency)),
  );
  maybeAdd(info, 'increment', info.acquisitionTime / (info.numberOfPoints - 1));
  let pulseStrength = 1e6 / (metaData.$P.split('\n')[1].split(' ')[1] * 4);
  maybeAdd(info, 'pulseStrength90', pulseStrength);
  let relaxationTime = metaData.$D.split('\n')[1].split(' ')[1];
  maybeAdd(info, 'relaxationTime', Number(relaxationTime));
  maybeAdd(info, 'numberOfScans', Number(metaData.$NS));

  if (info.type) {
    if (info.type.toUpperCase().indexOf('FID') >= 0) {
      info.isFid = true;
      info.isComplex = true;
    } else if (info.type.toUpperCase().indexOf('SPECTRUM') >= 0) {
      info.isFt = true;
      info.isComplex = true;
    }
  }

  if (info.isFid) {
    let digitalFilterParameters = getDigitalFilterParameters(
      metaData.$GRPDLY,
      metaData.$DSPFVS,
      metaData.$DECIM,
    );
    maybeAdd(info, 'digitalFilter', digitalFilterParameters);
  }

  if (metaData.$DATE) {
    info.date = new Date(metaData.$DATE * 1000).toISOString();
  }
  //   }

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

  return info;
}

function maybeAdd(obj, name, value) {
  if (value !== undefined) {
    if (typeof value === 'string') {
      if (value.startsWith('<') && value.endsWith('>')) {
        value = value.substring(1, value.length - 1);
      }
      obj[name] = value.trim();
    } else {
      obj[name] = value;
    }
  }
}
