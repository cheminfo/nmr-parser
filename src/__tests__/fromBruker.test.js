import { getZipped } from 'bruker-data-test';

import { fromBruker } from '../fromBruker';

describe('testfromBruker', () => {
  it('test fromBruker for aspirin (bruker)', async () => {
    const brukerZip = await getZipped()
      .filter((file) => file.name === 'aspirin-1h.zip')[0]
      .arrayBuffer();
    let data = await fromBruker(brukerZip);
    let info = data[0].info;
    expect(info.nucleus[0]).toBe('1H');
    // expect(info.title).toStrictEqual('1H BBI'); // diferente
    // expect(info.sampleName).toStrictEqual('nesEX14_CM'); // diferente
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
    expect(info.isComplex).toBe(true);
    expect(info.isFid).toBe(true);
    expect(info.isFt).toBe(false);
    expect(info.dimension).toBe(1);
    expect(info.originFrequency).toBe(300.132250975);
    expect(info.numberOfPoints).toBe(16384);
    expect(info.frequencyOffset).toBeCloseTo(2250.974999981281, 5);
    expect(info.spectralWidth).toBeCloseTo(15.9572055821827, 5);
    expect(info.acquisitionTime).toBeCloseTo(1.7103852, 5);
  });
});
