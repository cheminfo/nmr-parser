import { formatDependentVariable } from '../formatDependentVariable';

describe('test formatDependentVariable', () => {
  it('test formatDependentVariable with fake data', () => {
    let dep = formatDependentVariable({ re: [1, 2, 3], im: [4, 5, 6] }, 11, {
      description: 'description',
      name: 'name',
      unit: 'unit',
    });
    expect(dep.name).toStrictEqual('name');
    expect(dep.unit).toStrictEqual('unit');
    expect(dep.description).toStrictEqual('description');
    expect(dep.encoding).toStrictEqual('none');
  });
});
