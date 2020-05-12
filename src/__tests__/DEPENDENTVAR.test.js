import { DEPENDENTVAR, InternalDEPENDENTVAR } from '../DEPENDENTVAR';

describe('test DEPENDENTVAR', () => {
  it('test DEPENDENTVAR load and toJSON with proton', () => {
    let dep = new DEPENDENTVAR(0, 9, {
      name: 'name',
      description: 'description',
    });
    let txt = JSON.stringify(dep);
    let newDep = DEPENDENTVAR.load(JSON.parse(txt));
    expect(newDep.name).toStrictEqual('name');
    expect(newDep.quantityType).toStrictEqual('scalar');
    expect(newDep.description).toStrictEqual('description');
  });

  it('test InternalDEPENDENTVAR load and toJSON with proton', () => {
    let dep = new InternalDEPENDENTVAR(0, 11, {
      description: 'description',
      name: 'name',
      unit: 'unit',
    });
    let txt = JSON.stringify(dep);
    let newDep = InternalDEPENDENTVAR.load(JSON.parse(txt));
    expect(newDep.name).toStrictEqual('name');
    expect(newDep.unit).toStrictEqual('unit');
    expect(newDep.description).toStrictEqual('description');
    expect(newDep.encoding).toStrictEqual('none');
  });
});
