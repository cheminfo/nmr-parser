export class DIMENSION {
  constructor(label, options = {}) {
    if (label === true) {
      const dimension = options;
      this.label = dimension.label;
      this.type = dimension.type;
      this.description = dimension.description;
      this.application = dimension.application;
      return;
    }
    this.label = label;
    this.type = options.type || '';
    this.description = options.description || '';
    this.application = options.application || {};
    return this;
  }

  static load(dimension) {
    return new DIMENSION(true, dimension);
  }

  toJSON() {
    return this;
  }
}

export class LinearDIMENSION extends DIMENSION {
  constructor(label, count, increment, options = {}) {
    super();
    if (label === true) {
      const dimension = count;
      this.label = dimension.label;
      this.type = dimension.type;
      this.description = dimension.description;
      this.application = dimension.application;
      this.coordinatesOffest = dimension.coordinatesOffest;
      this.originOffset = dimension.originOffset;
      this.quantityName = dimension.quantityName;
      this.reciprocal = dimension.reciprocal;
      this.period = dimension.period;
      this.complexFFT = dimension.complexFFT;
      return;
    }

    this.label = String(label);
    this.count = Number(count);
    this.increment = increment;
    this.type = 'linear';
    this.description = String(options.description) || '';
    this.application = options.application || {};
    this.coordinatesOffest = options.coordinatesOffest || 0;
    this.originOffset = options.originOffset || 0;
    this.quantityName = String(options.quantityName) || '';
    this.reciprocal = options.reciprocal || {};
    this.period = options.period || 0;
    this.complexFFT = options.complexFFT || false;
    return this;
  }

  static load(dimension) {
    return new LinearDIMENSION(true, dimension);
  }
}
