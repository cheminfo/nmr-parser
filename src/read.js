import { fromBruker } from './fromBruker';
import { fromJCAMP } from './fromJCAMP';
import { fromJEOL } from './fromJEOL';

export async function read(fileList, options = {}) {
  const {
    bruker: BrukerOptions = {},
    jcamp: jcampOptions = {},
    jeol: jeolOptions = {},
  } = options;

  const result = await fromBruker(fileList, BrukerOptions);
  for (const file of fileList) {
    const extension = getFileExtension(file.name);
    let processed = [];
    if (extension === 'jdf') {
      processed = fromJEOL(await file.arrayBuffer(), jeolOptions);
    } else if (extension.match(/dx/) || extension === 'jcamp') {
      processed = fromJCAMP(await file.arrayBuffer(), jcampOptions);
    }

    if (processed.length > 0) result.push(...processed);
  }
  return result;
}

function getFileExtension(name) {
  return name.replace(/^.*\./, '').toLowerCase();
}
