import { Rutin } from 'jeol-data-test';

import { fromJEOL } from '../fromJEOL';

describe('test fromJEOL', () => {
  it('test dependentVariables fromJEOL and proton', () => {
    let data = fromJEOL(Rutin.experiment.proton);
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
    let data = fromJEOL(Rutin.experiment.processedProton);
    expect(data.dependentVariables[0].numericType).toStrictEqual('complex128');
    expect(data.dependentVariables[0].quantityType).toStrictEqual('scalar');
    expect(data.dependentVariables[0].dataLength).toHaveLength(1);
    expect(data.dependentVariables[0].dataLength[0]).toStrictEqual(524288);
    expect(data.dependentVariables[0].components).toHaveLength(1);
    expect(data.dependentVariables[0].components[0]).toHaveLength(524288);
    expect(data.dimensions[0].count).toStrictEqual(262144);
    expect(data.dimensions[0].quantityName).toStrictEqual('frequency');
    expect(data.dimensions[0].originOffset.magnitude).toStrictEqual(
      399782198.37825,
    );
    expect(data.dimensions[0].coordinatesOffset.magnitude).toStrictEqual(
      2398.6931902694996,
    );
    expect(data.dimensions[0].increment.magnitude).toStrictEqual(
      0.028587359604503898,
    );
    expect(data.dimensions[0].increment.unit).toStrictEqual('Hz');
    expect(data.dimensions[0].reciprocal).toStrictEqual({});
  });

  it('test dimensions fromJEOL and carbon', () => {
    let data = fromJEOL(Rutin.experiment.carbon);
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
    let data = fromJEOL(Rutin.experiment.hmbc);
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
    let data = fromJEOL(Rutin.experiment.cosy);
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
    let data = fromJEOL(Rutin.experiment.hsqc);
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
