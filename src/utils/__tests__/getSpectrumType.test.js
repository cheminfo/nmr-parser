import { getSpectrumType } from '../getSpectrumType';

describe('getSpectrumType', () => {
  it('should use dimension if pulse is not found', () => {
    let meta = { dimension: 1 };
    expect(getSpectrumType(meta)).toBe('1d');
  });

  it('use pulseSequence name directly', () => {
    let pulseSequence = 'zg';
    expect(getSpectrumType(pulseSequence)).toBe('1d');
  });

  it('use the first pulseSequence if it is an array', () => {
    let meta = { pulseSequence: ['zg', 'hmbc'] };
    expect(getSpectrumType(meta)).toBe('1d');
  });

  it('should use dimension if pulse is not a string', () => {
    let meta = { pulseSequence: 123, dimension: 1 };
    expect(getSpectrumType(meta)).toBe('1d');
  });

  it('should returns the respective experiment name', () => {
    let meta = {};
    let experiments = [
      { name: '1d', pulseSequences: ['udeft', 'zg', 'single_pulse_dec'] },
      { name: 'tocsy', pulseSequences: ['tocsy', 'mlev', 'dipsi'] },
      { name: 'hsqctocsy', pulseSequences: ['hsqct', 'inviml', 'invidi'] },
      { name: 'hmbc', pulseSequences: ['inv4lp', 'hmbc'] },
      { name: 'hsqc', pulseSequences: ['invi', 'hsqc'] },
      { name: 'hmqc', pulseSequences: ['hmqc'] },
      { name: 'cosy', pulseSequences: ['cosy'] },
      { name: 'jres', pulseSequences: ['jres'] },
      { name: 'noesy', pulseSequences: ['noesy'] },
      { name: 'dept', pulseSequences: ['dept'] },
      { name: 'aptjmod', pulseSequences: ['apt', 'jmod'] },
      { name: 'roesy', pulseSequences: ['roesy'] },
    ];
    for (let experiment of experiments) {
      let { pulseSequences, name } = experiment;
      for (let pulse of pulseSequences) {
        meta.pulseSequence = pulse;
        expect(getSpectrumType(meta)).toBe(name);
      }
    }
  });
});
