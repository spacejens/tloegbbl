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

    findQueryParamInOnclick(queryParam: string, onclick: string): string {
        return this.findQueryParamInHref(queryParam, onclick.substring("self.location.href='".length, onclick.length - 2));
    }

    findQueryParamInHref(queryParam: string, href: string): string {
        const queryString = href.substring(href.indexOf('?') + 1);
        let value: string = undefined;
        queryString.split('&').forEach(queryPart => {
            const param = queryPart.substring(0, queryPart.indexOf('='));
            if (param == queryParam) {
                value = queryPart.substring(queryPart.indexOf('=') + 1);
            }
        });
        return value;
    }
}
