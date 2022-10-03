import { FileCollection } from 'filelist-utils';

interface Options {
  base64?: boolean;
  shiftX?: number;
  info?: any;
  name?: string;
}

export declare function fromBruker(
  files: FileCollection,
  options: Partial<Options>,
): Promise<Array<any>>;

export declare function fromJCAMP(
  input: string | ArrayBuffer,
  options?: any,
): Array<any>;

export declare function fromJEOL(buffer: ArrayBuffer): any;
