import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { readFileSync, readdirSync } from 'fs';
import { parse, HTMLElement, Node } from 'node-html-parser';
import { join } from 'path';

@Injectable()
export class FileReaderService {
  constructor(
    private readonly configService: ConfigService,
  ) {}

  listFiles(
    filenameStartsWith: string,
    directory: string = this.configService.get('IMPORT_DEFAULT_DIRECTORY'),
  ): string[] {
    const files = readdirSync(join(process.cwd(), directory));
    return files.filter((filename) => filename.startsWith(filenameStartsWith));
  }

  readFile(filename: string, directory:string = this.configService.get('IMPORT_DEFAULT_DIRECTORY')): HTMLElement {
    const filepath = join(process.cwd(), directory, filename);
    return parse(readFileSync(filepath).toString());
  }

  findTeamIdInGoToTeam(onclick: string): string {
    // TODO Verify that the argument has the expected format, otherwise fail (to prevent incorrect data being imported)
    return onclick.slice("gototeam('".length, onclick.length - "')".length);
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

  findAnchorInHref(href: string): string {
    return href.substring(href.lastIndexOf('#') + 1);
  }

  /**
   * Split an array of nodes into an array of arrays, split by nodes matching the splitting node.
   * Analogouos to `String.split()` and its `separator` argument.
   *
   * @param nodes The original array to split.
   * @param splitBy An expression determining if a node is a splitting node.
   * @returns An array of arrays, being the groups of nodes between the splitting nodes.
   */
  split(
    nodes: Node[],
    splitBy: (node: Node) => boolean = this.hasTagName('BR'),
  ): Array<Node[]> {
    const output = Array<Node[]>();
    let start: number = 0;
    let current: number = 0;
    for (const node of nodes) {
      if (splitBy(node)) {
        if (current > start) {
          output.push(nodes.slice(start, current));
          start = current + 1;
        } else {
          start += 1;
        }
      }
      current += 1;
    }
    // Add any leftovers after last splitBy match (or from beginning, if no splitBy matches found)
    if (nodes.length > start) {
      output.push(nodes.slice(start));
    }
    return output;
  }

  hasTagName(tagName: string): (node: Node) => boolean {
    // Higher order function, so it can be used to create filters
    return (node: Node) =>
      node instanceof HTMLElement && node.tagName === tagName;
  }

  /**
   * Parse a date from plain text representation.
   *
   * @param source A date, e.g. 'September 24th, 2022'
   */
  parseDateFromMonthDayYear(source: string): Date {
    const parts = source.split(' ');
    if (parts.length != 3) {
      throw new Error(`Unexpected number of spaces in month-day-year date ${source}`);
    }
    const month: number = this.monthNameToNumber(parts[0]);
    const day: number = parseInt(parts[1]);
    const year: number = parseInt(parts[2]);
    return new Date(Date.UTC(year,month,day));
  }

  /**
   * Get month number from its name.
   *
   * @param name Capitalized name of month, e.g. 'September'
   * @returns Month number, 0-11 (as expected by `date` constructor)
   */
  private monthNameToNumber(name: string): number {
    switch(name) {
      case 'January':
        return 0;
      case 'February':
        return 1;
      case 'March':
        return 2;
      case 'April':
        return 3;
      case 'May':
        return 4;
      case 'June':
        return 5;
      case 'July':
        return 6;
      case 'August':
        return 7;
      case 'September':
        return 8;
      case 'October':
        return 9;
      case 'November':
        return 10;
      case 'December':
        return 11;
      default:
        throw new Error(`Unexpected month name ${name}`);
    }
  }
}
