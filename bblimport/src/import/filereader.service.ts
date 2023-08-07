import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';

@Injectable()
export class FileReaderService {
    // TODO Get directory of data files from environment variable, input argument, or something like that
    readFile(filename: string, directory: string = '../bbldownload/bbl-site/tloeg.bbleague.se'): string {
        const filepath = join(process.cwd(), directory, filename);
        return readFileSync(filepath).toString();
    }
}
