import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { parse, HTMLElement } from 'node-html-parser';
import { join } from 'path';

@Injectable()
export class FileReaderService {
    // TODO Get directory of data files from environment variable, input argument, or something like that
    readFile(filename: string, directory: string = '../bbldownload/bbl-site/tloeg.bbleague.se'): HTMLElement {
        const filepath = join(process.cwd(), directory, filename);
        return parse(readFileSync(filepath).toString());
    }
}
