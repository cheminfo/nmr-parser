# nmr-parser

[![NPM version][npm-image]][npm-url]
[![build status][ci-image]][ci-url]
[![Test coverage][codecov-image]][codecov-url]
[![npm download][download-image]][download-url]

This package has born from the necessity to find a common data structure for NMR spectra (1D and 2D) originally stored in different formats as an entry point for processing pipelines. Reading and parsing data in original format represents an important work load for open source projects that usually seek to propose improved data analysis pipelines. This package aims at reading any NMR format and create a JSON object that is human readable, with a scientifically meaningful structure and variable names, strongly inspired by the [work](https://doi.org/10.1371/journal.pone.0225953) by Grandinetti and coworkers, but with a few liberties. For instance, _camelCase_ variable naming has been preferred over the one proposed in the original work.

### supported input formats

- JCAMP-DX (may include several spectra)
- Bruker data foler (as a zip file)
- JEOL data format (.jdf)

### data formats under developpment

- [nmredata](http://nmredata.org/)

### What this package isn't?

- This package is not promoting a new format
- This package is not a JavaScript implementation of [CSDM](https://doi.org/10.1371/journal.pone.0225953)
- This data structure in not intended for storage
- This package is not intended to be a converter between formats

## Installation

`$ npm i nmr-parser`

## Usage

### JCAMP

```js
// import JCAMP parser
import { fromJCAMP } from 'nmr-parser';

// import test data
import { jcamp } from 'jcamp-data-test';

let data = fromJCAMP(jcamp['aspirin-1h.fid.dx']);
```

### Bruker

```js
// import JCAMP parser
import { fromBruker } from 'nmr-parser';

// import burker data
import { bruker } from 'bruker-data-test';

let data = await fromBruker(bruker['aspirin-1h.zip'], { base64: true });
```

### JEOL

```js
// import JEOL parser
import { fromJEOL } from 'nmr-parser';

// import test data
import { experiments } from 'jeol-data-test';

let data = fromJEOL(
  experiments['Rutin_3080ug200uL_DMSOd6_qHNMR_400MHz_Jeol.jdf'],
);
// result is a JSON object
// {
//         timeStamp: 1593098292162,
//         version: '1.0.0'
//         description: {
//           title: 'title: Rutin_RUTI01_3080u200u / comment: qHNMR Spinning GARP Gated 13C Decoupled 20p 9pCntr 32K 90deg aq+d1=60s NS=128 / author:gfp / site: UIC ECZ400',
//           nucleus: [ '1H' ],
//           sampleName: 'Rutin_RUTI01_308',
//           date: '{"year":2016,"month":12,"day":21}',
// ...
//           spectralWidth: 25.05370594702938,
//           metadata: {...
```

## [API Documentation](https://cheminfo.github.io/nmr-parser/)

## License

[MIT](./LICENSE)

[npm-image]: https://img.shields.io/npm/v/nmr-parser.svg
[npm-url]: https://www.npmjs.com/package/nmr-parser
[ci-image]: https://github.com/cheminfo/nmr-parser/workflows/Node.js%20CI/badge.svg?branch=master
[ci-url]: https://github.com/cheminfo/nmr-parser/actions?query=workflow%3A%22Node.js+CI%22
[codecov-image]: https://img.shields.io/codecov/c/github/cheminfo/nmr-parser.svg
[codecov-url]: https://codecov.io/gh/cheminfo/nmr-parser
[download-image]: https://img.shields.io/npm/dm/nmr-parser.svg
[download-url]: https://www.npmjs.com/package/nmr-parser
