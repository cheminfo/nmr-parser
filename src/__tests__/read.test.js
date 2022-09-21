import { getZipped } from 'bruker-data-test';
import { fileListFromZip } from 'filelist-utils';
import { getFile } from 'jeol-data-test';

import { read } from '../read';

describe('global reader', () => {
  it('use bruker and jeol data', async () => {
    const fileList = await fileListFromZip(
      (await getZipped())
        .filter((file) => file.name === 'aspirin-1h.zip')[0]
        .arrayBuffer(),
    );
    fileList.push(
      await getFile('Rutin_3080ug200uL_DMSOd6_13CNMR_400MHz_Jeol.jdf'),
    );

    const spectraData = await read(fileList);
    runExpectOfBruker(spectraData[0]);
    runExpectOfJEOL(spectraData[spectraData.length - 1]);
  });
});

function runExpectOfJEOL(data) {
  expect(data.dimensions[0].label).toBe('Carbon13');
  expect(data.dimensions[0].type).toBe('linear');
  expect(data.dimensions[0].description).toBe('direct dimension');
  expect(data.dimensions[0].count).toBe(32768);
  expect(JSON.stringify(data.dimensions[0].increment)).toBe(
    '{"magnitude":0.0000316809668263802,"unit":"s"}',
  );
  expect(data.dimensions[0].reciprocal.originOffset.magnitude).toBe(
    100525303.3251654,
  );
  expect(data.dimensions[0].quantityName).toBe('time');
}

function runExpectOfBruker(data) {
  let infoBruker = data.info;

  expect(infoBruker.nucleus[0]).toBe('1H');
  expect(infoBruker.date).toBe('2006-01-31T09:24:52.000Z');
  expect(infoBruker.solvent).toBe('CDCl3');
  expect(infoBruker.temperature).toBe(298);
  expect(infoBruker.probeName).toBe(
    '5 mm Multinuclear inverse Z-grad Z8255/0040',
  );
  expect(infoBruker.fieldStrength).toBeCloseTo(7.049031799126325, 3);
  expect(infoBruker.baseFrequency).toBe(300.13);
  expect(infoBruker.pulseSequence).toBe('zg30');
  expect(infoBruker.digitalFilter).toBeCloseTo(61.020833333333336, 5);
  expect(infoBruker.pulseStrength90).toBeCloseTo(22727.272727272728, 5);
  expect(infoBruker.numberOfScans).toBe(32);
  expect(infoBruker.relaxationTime).toBe(1.2);
  expect(infoBruker.isComplex).toBe(true);
  expect(infoBruker.isFid).toBe(true);
  expect(infoBruker.isFt).toBe(false);
  expect(infoBruker.dimension).toBe(1);
  expect(infoBruker.originFrequency).toBe(300.132250975);
  expect(infoBruker.numberOfPoints).toBe(16384);
  expect(infoBruker.frequencyOffset).toBeCloseTo(2250.974999981281, 5);
  expect(infoBruker.spectralWidth).toBeCloseTo(15.9572055821827, 5);
  expect(infoBruker.acquisitionTime).toBeCloseTo(1.7103852, 5);
}
