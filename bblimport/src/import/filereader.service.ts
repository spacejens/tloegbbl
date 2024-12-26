import { Injectable } from '@nestjs/common';
import { readFileSync, readdirSync } from 'fs';
import { parse, HTMLElement, Node } from 'node-html-parser';
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
}
