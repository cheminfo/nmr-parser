import { formatDependentVariable } from '../formatDependentVariable';

describe('test formatDependentVariable', () => {
  it('test formatDependentVariable with fake data', () => {
    let dep = formatDependentVariable({ re: [1, 2, 3], im: [4, 5, 6] }, 11, {
      description: 'description',
      name: 'name',
      unit: 'unit',
      from: [1],
      to: [3],
    });
    expect(dep.name).toStrictEqual('name');
    expect(dep.unit).toStrictEqual('unit');
    expect(dep.description).toStrictEqual('description');
    expect(dep.encoding).toStrictEqual('none');
    expect(dep.numericType).toStrictEqual('complex128');
    expect(dep.quantityType).toStrictEqual('scalar');
    expect(dep.components[0][0]).toStrictEqual(2);
    expect(dep.components[0][1]).toStrictEqual(5);
  });
  it('test formatDependentVariable with fake data without shift', () => {
    let dep = formatDependentVariable({ re: [1, 2, 3], im: [4, 5, 6] }, 11, {
      description: 'description',
      name: 'name',
      unit: 'unit',
      from: [0],
      to: [3],
    });
    expect(dep.name).toStrictEqual('name');
    expect(dep.unit).toStrictEqual('unit');
    expect(dep.description).toStrictEqual('description');
    expect(dep.encoding).toStrictEqual('none');
    expect(dep.numericType).toStrictEqual('complex128');
    expect(dep.quantityType).toStrictEqual('scalar');
    expect(dep.components[0][0]).toStrictEqual(1);
    expect(dep.components[0][1]).toStrictEqual(4);
  });
});
