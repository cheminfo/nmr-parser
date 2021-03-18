import { bruker } from 'bruker-data-test';

import { fromBruker } from '../fromBruker';

describe('testfromBruker', () => {
  it('test fromBruker for aspirin (bruker)', async () => {
    // console.log(bruker['aspirin-1h.zip'])
    let data = await fromBruker(bruker['aspirin-1h.zip'], { base64: true });
    let meta = data[0].meta;
    expect(meta.nucleus[0]).toStrictEqual('1H');
    // expect(meta.title).toStrictEqual('1H BBI'); // diferente
    // expect(meta.sampleName).toStrictEqual('nesEX14_CM'); // diferente
    // expect(meta.author).toStrictEqual('');
    expect(meta.date).toStrictEqual('2006-01-31T09:24:52.000Z');
    expect(meta.solvent).toStrictEqual('CDCl3');
    expect(meta.temperature).toStrictEqual(298);
    expect(meta.probeName).toStrictEqual(
      '5 mm Multinuclear inverse Z-grad Z8255/0040',
    );
    expect(meta.fieldStrength).toBeCloseTo(7.049031799126325, 3);
    expect(meta.baseFrequency).toStrictEqual(300.13);
    expect(meta.pulseSequence).toStrictEqual('zg30');
    expect(meta.digitalFilter).toBeCloseTo(61.020833333333336, 5);
    expect(meta.pulseStrength90).toBeCloseTo(22727.272727272728, 5);
    expect(meta.numberOfScans).toStrictEqual(32);
    expect(meta.relaxationTime).toStrictEqual(1.2);
    expect(meta.isComplex).toStrictEqual(true);
    expect(meta.isFid).toStrictEqual(true);
    expect(meta.isFt).toStrictEqual(false);
    expect(meta.dimension).toStrictEqual(1);
    expect(meta.originFrequency).toStrictEqual(300.132250975);
    expect(meta.numberOfPoints).toStrictEqual(16384);
    expect(meta.frequencyOffset).toBeCloseTo(2250.974999981281, 5);
    expect(meta.spectralWidth).toBeCloseTo(15.9572055821827, 5);
    expect(meta.acquisitionTime).toBeCloseTo(1.7103852, 5);
  });
});
