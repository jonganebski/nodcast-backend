import { boolean } from 'joi';
export interface IDeleteFilesInput {
  urls: string[];
}

export interface IDeleteFilesOutput {
  ok: boolean;
  err?: string;
}
