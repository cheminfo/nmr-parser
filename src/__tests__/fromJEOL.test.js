import { experiments } from 'jeol-data-test';

import { fromJEOL } from '../fromJEOL';

describe('test fromJEOL', () => {
  it('test dependentVariables fromJEOL and proton', () => {
    let data = fromJEOL(
      experiments['Rutin_3080ug200uL_DMSOd6_qHNMR_400MHz_Jeol.jdf'],
    )[0];
    //console.log(data.description);
    expect(data.description.nucleus[0]).toBe('1H');
    expect(data.description.fieldStrength).toBe(9.389766);
    expect(data.dependentVariables[0].numericType).toBe('complex128');
    expect(data.dependentVariables[0].quantityType).toBe('scalar');
    expect(data.dependentVariables[0].dataLength).toHaveLength(1);
    expect(data.dependentVariables[0].dataLength[0]).toBe(65536);
    expect(data.dependentVariables[0].components).toHaveLength(1);
    expect(data.dependentVariables[0].components[0]).toHaveLength(65536);
    expect(data.dimensions[0].reciprocal.originOffset.magnitude).toBe(
      399782198.37825,
    );
  });

  it('test fromJEOL and processed proton', () => {
    let data = fromJEOL(
      experiments['8PA_SynLK_5360u150uDMSO_snc1811_qH_SpinOn-1-2.jdf'],
    )[0];
    expect(data.description.nucleus[0]).toBe('1H');
    expect(data.dependentVariables[0].numericType).toBe('complex128');
    expect(data.dependentVariables[0].quantityType).toBe('scalar');
    expect(data.dependentVariables[0].dataLength).toHaveLength(1);
    expect(data.dependentVariables[0].dataLength[0]).toBe(419430);
    expect(data.dependentVariables[0].components).toHaveLength(1);
    expect(data.dependentVariables[0].components[0]).toHaveLength(419430);
    expect(data.dimensions[0].count).toBe(209715);
    expect(data.dimensions[0].quantityName).toBe('frequency');
    expect(data.dimensions[0].originOffset.magnitude).toBe(
      399782198.37825,
    );
    expect(data.dimensions[0].coordinatesOffset.magnitude).toStrictEqual(
      -598.8915757799654,
    );
    expect(data.dimensions[0].increment.magnitude).toBe(
      0.028587359604503898,
    );
    expect(data.dimensions[0].increment.unit).toBe('Hz');
    expect(data.dimensions[0].reciprocal).toStrictEqual({});

    // const upperLimit =
    //   (data.description.dataAxisStart[0] *
    //     data.description.frequency[0].magnitude) /
    //   1000000;
    // const lowerLimit =
    //   (data.description.dataAxisStop[0] *
    //     data.description.frequency[0].magnitude) /
    //   1000000;
    // let result =
    //   lowerLimit +
    //   data.dimensions[0].increment.magnitude * (data.dimensions[0].count - 1);
    // expect(result).toStrictEqual(upperLimit);
  });

  it('test dimensions fromJEOL and carbon', () => {
    let data = fromJEOL(
      experiments['Rutin_3080ug200uL_DMSOd6_13CNMR_400MHz_Jeol.jdf'],
    )[0];
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
  });

  it('test dimensions fromJEOL and HMBC', () => {
    let data = fromJEOL(
      experiments['Rutin_3080ug200uL_DMSOd6_HMBC_400MHz_Jeol.jdf'],
    )[0];
    expect(data.dimensions[0].label).toBe('Proton');
    expect(data.dimensions[0].type).toBe('linear');
    expect(data.dimensions[0].description).toBe('direct dimension');
    expect(data.dimensions[0].count).toBe(4096);

    expect(data.dimensions[0].reciprocal.originOffset.magnitude).toBe(
      399782198.37825,
    );
    expect(data.dimensions[1].label).toBe('Carbon13');
    expect(data.dimensions[1].type).toBe('linear');
    expect(data.dimensions[1].description).toBe('indirect dimension');
    expect(data.dimensions[1].count).toBe(512);

    expect(data.dimensions[1].reciprocal.originOffset.magnitude).toBe(
      100525303.3251654,
    );
  });

  it('test dimensions fromJEOL and COSY', () => {
    let data = fromJEOL(
      experiments['Rutin_3080ug200uL_DMSOd6_COSY_400MHz_Jeol.jdf'],
    )[0];
    expect(data.dimensions[0].label).toBe('Proton');
    expect(data.dimensions[0].type).toBe('linear');
    expect(data.dimensions[0].description).toBe('direct dimension');
    expect(data.dimensions[0].count).toBe(5120);

    expect(data.dimensions[0].reciprocal.originOffset.magnitude).toBe(
      399782198.37825,
    );
    expect(data.dimensions[1].label).toBe('Proton');
    expect(data.dimensions[1].type).toBe('linear');
    expect(data.dimensions[1].description).toBe('indirect dimension');
    expect(data.dimensions[1].count).toBe(512);

    expect(data.dimensions[1].reciprocal.originOffset.magnitude).toBe(
      399782198.37825,
    );
  });

  it('test dimensions fromJEOL and HSQC', () => {
    let data = fromJEOL(
      experiments['Rutin_3080ug200uL_DMSOd6_HSQC_400MHz_Jeol.jdf'],
    )[0];
    expect(data.description.nucleus[0]).toBe('1H');
    expect(data.description.nucleus[1]).toBe('13C');
    expect(data.dimensions[0].label).toBe('Proton');
    expect(data.dimensions[0].type).toBe('linear');
    expect(data.dimensions[0].description).toBe('direct dimension');
    expect(data.dimensions[0].count).toBe(4096);

    expect(data.dimensions[0].reciprocal.originOffset.magnitude).toBe(
      399782198.37825,
    );
    expect(data.dimensions[1].label).toBe('Carbon13');
    expect(data.dimensions[1].type).toBe('linear');
    expect(data.dimensions[1].description).toBe('indirect dimension');
    expect(data.dimensions[1].count).toBe(256);

    expect(data.dimensions[1].reciprocal.originOffset.magnitude).toBe(
      100525303.3251654,
    );
    expect(data.dependentVariables[0].components).toHaveLength(512);
    expect(data.dependentVariables[0].components[0]).toHaveLength(8192);
  });
});
