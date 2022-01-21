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
    expect(dep.name).toBe('name');
    expect(dep.unit).toBe('unit');
    expect(dep.description).toBe('description');
    expect(dep.encoding).toBe('none');
    expect(dep.numericType).toBe('complex128');
    expect(dep.quantityType).toBe('scalar');
    expect(dep.components[0][0]).toBe(2);
    expect(dep.components[0][1]).toBe(5);
  });
  it('test formatDependentVariable with fake data without shift', () => {
    let dep = formatDependentVariable({ re: [1, 2, 3], im: [4, 5, 6] }, 11, {
      description: 'description',
      name: 'name',
      unit: 'unit',
      from: [0],
      to: [3],
    });
    expect(dep.name).toBe('name');
    expect(dep.unit).toBe('unit');
    expect(dep.description).toBe('description');
    expect(dep.encoding).toBe('none');
    expect(dep.numericType).toBe('complex128');
    expect(dep.quantityType).toBe('scalar');
    expect(dep.components[0][0]).toBe(1);
    expect(dep.components[0][1]).toBe(4);
  });
});
