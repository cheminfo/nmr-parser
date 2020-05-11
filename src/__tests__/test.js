import { Rutin } from 'jeol-data-test';

import { DIMENSION, LinearDIMENSION } from '../DIMENSION';
import { NMRDATA } from '../NMRDATA';

describe.skip('test NMRDATA', () => {
  it('test dependentVariables fromJEOL and proton', () => {
    let data = new NMRDATA().fromJEOL(Rutin.experiment.proton).get();
    expect(data.dependentVariables[0].numericType).toStrictEqual('complex128');
    expect(data.dependentVariables[0].quantityType).toStrictEqual('scalar');
    expect(data.dependentVariables[0].dataLength).toHaveLength(1);
    expect(data.dependentVariables[0].dataLength[0]).toStrictEqual(65536);
    expect(data.dependentVariables[0].components).toHaveLength(1);
    expect(data.dependentVariables[0].components[0]).toHaveLength(65536);
    expect(data.dimensions[0].reciprocal.originOffset.magnitude).toStrictEqual(
      399782198.37825,
    );
  });

  it('test fromJEOL and processed proton', () => {
    let data = new NMRDATA().fromJEOL(Rutin.experiment.processedProton).get();
    expect(data.dependentVariables[0].numericType).toStrictEqual('complex128');
    expect(data.dependentVariables[0].quantityType).toStrictEqual('scalar');
    expect(data.dependentVariables[0].dataLength).toHaveLength(1);
    expect(data.dependentVariables[0].dataLength[0]).toStrictEqual(524288);
    expect(data.dependentVariables[0].components).toHaveLength(1);
    expect(data.dependentVariables[0].components[0]).toHaveLength(524288);
    expect(data.dimensions[0].count).toStrictEqual(262144);
    expect(data.dimensions[0].quantityName).toStrictEqual('frequency');
    expect(data.dimensions[0].increment.magnitude).toStrictEqual(
      0.028587359604503898,
    );
    expect(data.dimensions[0].increment.unit).toStrictEqual('Hz');
    expect(data.dimensions[0].reciprocal).toStrictEqual({});
  });

  it('test dimensions fromJEOL and carbon', () => {
    let data = new NMRDATA().fromJEOL(Rutin.experiment.carbon).get();
    expect(data.dimensions[0].label).toStrictEqual('Carbon13');
    expect(data.dimensions[0].type).toStrictEqual('linear');
    expect(data.dimensions[0].description).toStrictEqual('direct dimension');
    expect(data.dimensions[0].count).toStrictEqual(32768);
    expect(JSON.stringify(data.dimensions[0].increment)).toStrictEqual(
      '{"magnitude":0.00003168,"unit":"s"}',
    );
    expect(data.dimensions[0].reciprocal.originOffset.magnitude).toStrictEqual(
      100525303.3251654,
    );
    expect(data.dimensions[0].quantityName).toStrictEqual('time');
  });

  it('test dimensions fromJEOL and HMBC', () => {
    let data = new NMRDATA().fromJEOL(Rutin.experiment.hmbc).get();
    expect(data.dimensions[0].label).toStrictEqual('Proton');
    expect(data.dimensions[0].type).toStrictEqual('linear');
    expect(data.dimensions[0].description).toStrictEqual('direct dimension');
    expect(data.dimensions[0].count).toStrictEqual(4096);

    expect(data.dimensions[0].reciprocal.originOffset.magnitude).toStrictEqual(
      399782198.37825,
    );
    expect(data.dimensions[1].label).toStrictEqual('Carbon13');
    expect(data.dimensions[1].type).toStrictEqual('linear');
    expect(data.dimensions[1].description).toStrictEqual('indirect dimension');
    expect(data.dimensions[1].count).toStrictEqual(512);

    expect(data.dimensions[1].reciprocal.originOffset.magnitude).toStrictEqual(
      100525303.3251654,
    );
  });

  it('test dimensions fromJEOL and COSY', () => {
    let data = new NMRDATA().fromJEOL(Rutin.experiment.cosy).get();
    expect(data.dimensions[0].label).toStrictEqual('Proton');
    expect(data.dimensions[0].type).toStrictEqual('linear');
    expect(data.dimensions[0].description).toStrictEqual('direct dimension');
    expect(data.dimensions[0].count).toStrictEqual(5120);

    expect(data.dimensions[0].reciprocal.originOffset.magnitude).toStrictEqual(
      399782198.37825,
    );
    expect(data.dimensions[1].label).toStrictEqual('Proton');
    expect(data.dimensions[1].type).toStrictEqual('linear');
    expect(data.dimensions[1].description).toStrictEqual('indirect dimension');
    expect(data.dimensions[1].count).toStrictEqual(512);

    expect(data.dimensions[1].reciprocal.originOffset.magnitude).toStrictEqual(
      399782198.37825,
    );
  });

  it('test dimensions fromJEOL and HSQC', () => {
    let data = new NMRDATA().fromJEOL(Rutin.experiment.hsqc).get();
    expect(data.dimensions[0].label).toStrictEqual('Proton');
    expect(data.dimensions[0].type).toStrictEqual('linear');
    expect(data.dimensions[0].description).toStrictEqual('direct dimension');
    expect(data.dimensions[0].count).toStrictEqual(4096);

    expect(data.dimensions[0].reciprocal.originOffset.magnitude).toStrictEqual(
      399782198.37825,
    );
    expect(data.dimensions[1].label).toStrictEqual('Carbon13');
    expect(data.dimensions[1].type).toStrictEqual('linear');
    expect(data.dimensions[1].description).toStrictEqual('indirect dimension');
    expect(data.dimensions[1].count).toStrictEqual(256);

    expect(data.dimensions[1].reciprocal.originOffset.magnitude).toStrictEqual(
      100525303.3251654,
    );
    expect(data.dependentVariables[0].components).toHaveLength(512);
    expect(data.dependentVariables[0].components[0]).toHaveLength(8192);
  });
});

describe.skip('test NMRDATA load and toJSON', () => {
  it('test load and toJSON with proton', () => {
    let data = new NMRDATA().fromJEOL(Rutin.experiment.proton).get();
    let txt = JSON.stringify(data.toJSON());
    console.log(data);
    let newData = NMRDATA.load(JSON.parse(txt));
    console.log(newData);
    expect(newData.dependentVariables[0].numericType).toStrictEqual(
      'complex128',
    );
  });
});

describe('test DIMENSION', () => {
  it('test DIMENSION load and toJSON with proton', () => {
    let dim = new DIMENSION('label', {
      type: 'linear',
      description: 'description',
    });
    let txt = JSON.stringify(dim.toJSON());
    let newDim = DIMENSION.load(JSON.parse(txt));
    expect(newDim.label).toStrictEqual('label');
    expect(newDim.type).toStrictEqual('linear');
    expect(newDim.description).toStrictEqual('description');
  });

  it('test LinearDIMENSION load and toJSON with proton', () => {
    let dim = new LinearDIMENSION(
      'label',
      10,
      { magnitude: 1, unit: 's' },
      {
        type: 'linear',
        description: 'description',
        coordinatesOffest: 12,
      },
    );
    let txt = JSON.stringify(dim.toJSON());
    let newDim = LinearDIMENSION.load(JSON.parse(txt));
    expect(newDim.label).toStrictEqual('label');
    expect(newDim.type).toStrictEqual('linear');
    expect(newDim.description).toStrictEqual('description');
    expect(newDim.coordinatesOffest).toStrictEqual(12);
  });
});
