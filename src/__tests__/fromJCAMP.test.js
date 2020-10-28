import { jcamp } from 'jcamp-data-test';

import { fromJCAMP } from '../fromJCAMP';

describe('test fromJCAMP', () => {
  it('test fromJCAMP for aspirin (bruker)', () => {
    let data = fromJCAMP(jcamp['aspirin-1h.fid.dx']);
    let info = data[0].info;
    expect(info.nucleus[0]).toStrictEqual('1H');
    expect(info.title).toStrictEqual('1H BBI');
    expect(info.sampleName).toStrictEqual('nesEX14_CMC');
    // expect(info.author).toStrictEqual('');
    expect(info.date).toStrictEqual('2006-01-31T09:24:52.000Z');
    expect(info.solvent).toStrictEqual('CDCl3');
    expect(info.temperature).toStrictEqual(298);
    expect(info.probeName).toStrictEqual(
      '5 mm Multinuclear inverse Z-grad Z8255/0040',
    );
    expect(info.fieldStrength).toBeCloseTo(7.049031799126325, 3);
    expect(info.baseFrequency).toStrictEqual(300.13);
    expect(info.pulseSequence).toStrictEqual('zg30');
    expect(info.digitalFilter).toBeCloseTo(61.020833333333336, 5);
    expect(info.pulseStrength90).toBeCloseTo(22727.272727272728, 5);
    expect(info.numberOfScans).toStrictEqual(32);
    expect(info.relaxationTime).toStrictEqual(1.2);
    expect(info.experiment).toStrictEqual('1d');
    expect(info.isComplex).toStrictEqual(true);
    expect(info.isFid).toStrictEqual(true);
    expect(info.isFt).toStrictEqual(false);
    expect(info.dimension).toStrictEqual(1);
    expect(info.originFrequency).toStrictEqual(300.132250975);
    expect(info.numberOfPoints).toStrictEqual(16384);
    expect(info.frequencyOffset).toBeCloseTo(2250.974999981281, 5);
    expect(info.spectralWidth).toBeCloseTo(15.9572055821827, 5);
    expect(info.acquisitionTime).toBeCloseTo(1.7102808, 5);
  });

  it('test fromJCAMP for Rutin (Jeol)', () => {
    let data = fromJCAMP(
      jcamp['Rutin_3080ug200uL_DMSOd6_qHNMR_400MHz_JDX.jdx'],
    );
    let info = data[0].info;
    expect(info.nucleus[0]).toStrictEqual('1H');
    expect(info.title).toStrictEqual('Rutin_RUTI01_3080u200u');
    //expect(info.sampleName).toStrictEqual('nesEX14_CM');
    // expect(info.author).toStrictEqual('');
    expect(info.date).toStrictEqual('2016/12/27 10:59:51.000');
    expect(info.solvent).toStrictEqual('DMSO-D6');
    // expect(info.temperature).toStrictEqual(298);
    // expect(info.probeName).toStrictEqual(
    //   '5 mm Multinuclear inverse Z-grad Z8255/0040',
    // );
    //expect(info.fieldStrength).toBeCloseTo(7.049031799126325, 3);
    //expect(info.baseFrequency).toStrictEqual(300.13);
    expect(info.pulseSequence).toStrictEqual('single_pulse_dec');
    //expect(info.digitalFilter).toBeCloseTo(61.020833333333336, 5);
    // expect(info.pulseStrength90).toBeCloseTo(22727.272727272728, 5);
    // expect(info.numberOfScans).toStrictEqual(32);
    // expect(info.relaxationTime).toStrictEqual(1.2);
    expect(info.isComplex).toStrictEqual(true);
    expect(info.experiment).toStrictEqual('1d');
    expect(info.isFid).toStrictEqual(false);
    expect(info.isFt).toStrictEqual(true);
    expect(info.dimension).toStrictEqual(1);
    expect(info.originFrequency).toStrictEqual(399.78219837825);
    //expect(info.numberOfPoints).toStrictEqual(16384);
    //expect(info.frequencyOffset).toBeCloseTo(2250.974999981281, 5);
    //expect(info.spectralWidth).toBeCloseTo(15.9572055821827, 5);
    // expect(info.acquisitionTime).toBeCloseTo(1.7102808, 5);
  });
});
