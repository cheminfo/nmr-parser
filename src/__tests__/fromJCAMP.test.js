import { getData } from 'jcamp-data-test';

import { fromJCAMP } from '../fromJCAMP';

describe('test fromJCAMP', () => {
  it('test fromJCAMP for aspirin (bruker)', async () => {
    let data = fromJCAMP(await getData('aspirin-1h.fid.dx'));
    let info = data[0].info;
    expect(info.nucleus[0]).toBe('1H');
    expect(info.title).toBe('1H BBI');
    expect(info.sampleName).toBe('nesEX14_CMC');
    // expect(info.author).toStrictEqual('');
    expect(info.date).toBe('2006-01-31T09:24:52.000Z');
    expect(info.solvent).toBe('CDCl3');
    expect(info.temperature).toBe(298);
    expect(info.probeName).toBe('5 mm Multinuclear inverse Z-grad Z8255/0040');
    expect(info.fieldStrength).toBeCloseTo(7.049031799126325, 3);
    expect(info.baseFrequency).toBe(300.13);
    expect(info.pulseSequence).toBe('zg30');
    expect(info.digitalFilter).toBeCloseTo(61.020833333333336, 5);
    expect(info.pulseStrength90).toBeCloseTo(22727.272727272728, 5);
    expect(info.numberOfScans).toBe(32);
    expect(info.relaxationTime).toBe(1.2);
    expect(info.experiment).toBe('proton');
    expect(info.isComplex).toBe(true);
    expect(info.isFid).toBe(true);
    expect(info.isFt).toBe(false);
    expect(info.dimension).toBe(1);
    expect(info.originFrequency).toBe(300.132250975);
    expect(info.numberOfPoints).toBe(16384);
    expect(info.frequencyOffset).toBeCloseTo(2250.974999981281, 5);
    expect(info.spectralWidth).toBeCloseTo(15.9572055821827, 5);
    expect(info.acquisitionTime).toBeCloseTo(1.7102808, 5);
  });

  it('test fromJCAMP for ibuprofen (qmagnetics)', async () => {
    let data = fromJCAMP(await getData('ibuprofen_j_ave_qmagnetics.jdx'));
    let info = data[0].info;
    expect(info).toStrictEqual({
      dimension: 1,
      nucleus: ['1H'],
      isFid: true,
      isFt: false,
      isComplex: true,
      title: 'nmr_data/ibuprofen j_ave.jdx',
      solvent: 'Neat',
      type: 'NMR FID',
      pulseSequence: 'NScanPulseAcquire',
      experiment: '1d',
      originFrequency: 123.8826,
      baseFrequency: 123.8826,
      fieldStrength: 2.9095804710021693,
      frequencyOffset: 0,
      spectralWidth: 10,
      acquisitionTime: 3.9999,
      numberOfScans: 500,
    });
  });

  it('test fromJCAMP for Rutin (Jeol)', async () => {
    let data = fromJCAMP(
      await getData('Rutin_3080ug200uL_DMSOd6_qHNMR_400MHz_JDX.jdx'),
    );
    let info = data[0].info;
    expect(info.nucleus[0]).toBe('1H');
    expect(info.title).toBe('Rutin_RUTI01_3080u200u');
    //expect(info.sampleName).toStrictEqual('nesEX14_CM');
    // expect(info.author).toStrictEqual('');
    expect(info.date).toBe('2016/12/27 10:59:51.000');
    expect(info.solvent).toBe('DMSO-D6');
    // expect(info.temperature).toStrictEqual(298);
    // expect(info.probeName).toStrictEqual(
    //   '5 mm Multinuclear inverse Z-grad Z8255/0040',
    // );
    //expect(info.fieldStrength).toBeCloseTo(7.049031799126325, 3);
    //expect(info.baseFrequency).toStrictEqual(300.13);
    expect(info.pulseSequence).toBe('single_pulse_dec');
    //expect(info.digitalFilter).toBeCloseTo(61.020833333333336, 5);
    // expect(info.pulseStrength90).toBeCloseTo(22727.272727272728, 5);
    // expect(info.numberOfScans).toStrictEqual(32);
    // expect(info.relaxationTime).toStrictEqual(1.2);
    expect(info.isComplex).toBe(true);
    expect(info.experiment).toBe('1d');
    expect(info.isFid).toBe(false);
    expect(info.isFt).toBe(true);
    expect(info.dimension).toBe(1);
    expect(info.originFrequency).toBe(399.78219837825);
    //expect(info.numberOfPoints).toStrictEqual(16384);
    //expect(info.frequencyOffset).toBeCloseTo(2250.974999981281, 5);
    //expect(info.spectralWidth).toBeCloseTo(15.9572055821827, 5);
    // expect(info.acquisitionTime).toBeCloseTo(1.7102808, 5);
  });
});
