import { Injectable } from '@nestjs/common';
import { readFileSync, readdirSync } from 'fs';
import { parse, HTMLElement } from 'node-html-parser';
import { join } from 'path';

@Injectable()
export class FileReaderService {
  // TODO Get directory of data files from environment variable, input argument, or something like that
  private defaultDirectory = '../bbldownload/bbl-site/tloeg.bbleague.se';

  listFiles(
    filenameStartsWith: string,
    directory = this.defaultDirectory,
  ): string[] {
    const files = readdirSync(join(process.cwd(), directory));
    return files.filter((filename) => filename.startsWith(filenameStartsWith));
  }

  readFile(filename: string, directory = this.defaultDirectory): HTMLElement {
    const filepath = join(process.cwd(), directory, filename);
    return parse(readFileSync(filepath).toString());
  }

  findQueryParamInOnclick(queryParam: string, onclick: string): string {
    // TODO Verify that the onclick attribute has the expected format (prefix, suffic), otherwise fail (to prevent incorrect data being imported)
    return this.findQueryParamInHref(
      queryParam,
      onclick.substring(
        "self.location.href='".length,
        onclick.length - "';".length,
      ),
    );
  }

  findQueryParamInHref(queryParam: string, href: string): string {
    const queryString = href.substring(href.indexOf('?') + 1);
    let value: string = undefined;
    queryString.split('&').forEach((queryPart) => {
      const param = queryPart.substring(0, queryPart.indexOf('='));
      if (param == queryParam) {
        value = queryPart.substring(queryPart.indexOf('=') + 1);
      }
    });
    return value;
  }
}
