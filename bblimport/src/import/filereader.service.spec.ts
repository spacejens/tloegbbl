import { Test, TestingModule } from '@nestjs/testing';
import { FileReaderService } from './filereader.service';
import { HTMLElement, TextNode } from 'node-html-parser';

describe('FileReaderService', () => {
  let fileReaderService: FileReaderService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [FileReaderService],
    }).compile();

    fileReaderService = app.get<FileReaderService>(FileReaderService);
  });

  // TODO Test cases for readFile

  describe('findQueryParamInOnclick', () => {
    it('should find only query param', () => {
      expect(
        fileReaderService.findQueryParamInOnclick(
          'only',
          "self.location.href='page.asp?only=alone';",
        ),
      ).toBe('alone');
    });

    it('should find first query param', () => {
      expect(
        fileReaderService.findQueryParamInOnclick(
          'first',
          "self.location.href='file.asp?first=alpha&last=omega';",
        ),
      ).toBe('alpha');
    });

    it('should find last query param', () => {
      expect(
        fileReaderService.findQueryParamInOnclick(
          'last',
          "self.location.href='file.asp?first=alpha&last=omega';",
        ),
      ).toBe('omega');
    });

    it('should find query param when there is no page', () => {
      expect(
        fileReaderService.findQueryParamInOnclick(
          'key',
          "self.location.href='?key=value';",
        ),
      ).toBe('value');
    });

    it('should return undefined when the query param does not exist', () => {
      expect(
        fileReaderService.findQueryParamInOnclick(
          'something',
          "self.location.href='?other=stuff';",
        ),
      ).toBe(undefined);
    });

    it('should return undefined when there are no query params', () => {
      expect(
        fileReaderService.findQueryParamInOnclick(
          'something',
          "self.location.href='page.asp';",
        ),
      ).toBe(undefined);
    });
  });

  describe('findQueryParamInHref', () => {
    it('should find only query param', () => {
      expect(
        fileReaderService.findQueryParamInHref('only', 'file.asp?only=alone'),
      ).toBe('alone');
    });

    it('should find first query param', () => {
      expect(
        fileReaderService.findQueryParamInHref(
          'first',
          'file.asp?first=alpha&last=omega',
        ),
      ).toBe('alpha');
    });

    it('should find last query param', () => {
      expect(
        fileReaderService.findQueryParamInHref(
          'last',
          'file.asp?first=alpha&last=omega',
        ),
      ).toBe('omega');
    });

    it('should find query param when there is no page', () => {
      expect(fileReaderService.findQueryParamInHref('key', '?key=value')).toBe(
        'value',
      );
    });

    it('should return undefined when the query param does not exist', () => {
      expect(
        fileReaderService.findQueryParamInHref('something', '?other=stuff'),
      ).toBe(undefined);
    });

    it('should return undefined when there are no query params', () => {
      expect(
        fileReaderService.findQueryParamInHref('something', 'page.asp'),
      ).toBe(undefined);
    });
  });

  describe('split', () => {
    it('should handle empty input', () => {
      expect(fileReaderService.split([])).toEqual([]);
    });

    it('should return empty if input is just a splitter', () => {
      const splitter = new HTMLElement('BR', {});
      expect(fileReaderService.split([splitter])).toEqual([]);
    });

    it('should return input unchanged when there are no splitters', () => {
      const pic = new HTMLElement('IMG', { class: 'pic' });
      const txt = new TextNode('txt');
      expect(fileReaderService.split([pic, txt])).toEqual([[pic, txt]]);
    });

    it('should split where there are splitters', () => {
      const pic = new HTMLElement('IMG', { class: 'pic' });
      const splitter1 = new HTMLElement('BR', {});
      const txt = new TextNode('txt');
      const span = new HTMLElement('SPAN', {});
      const splitter2 = new HTMLElement('BR', {});
      const link = new HTMLElement('A', {});
      const bold = new HTMLElement('B', {});
      expect(
        fileReaderService.split([
          pic,
          splitter1,
          txt,
          span,
          splitter2,
          link,
          bold,
        ]),
      ).toEqual([[pic], [txt, span], [link, bold]]);
    });
  });

  describe('hasTagName', () => {
    it('should be false for text nodes', () => {
      expect(fileReaderService.hasTagName('BR')(new TextNode('txt'))).toBe(
        false,
      );
    });

    it('should be true for HTML nodes of correct tag type', () => {
      expect(
        fileReaderService.hasTagName('BR')(new HTMLElement('BR', {})),
      ).toBe(true);
    });

    it('should be false for HTML nodes of wrong tag type', () => {
      expect(
        fileReaderService.hasTagName('BR')(new HTMLElement('IMG', {})),
      ).toBe(false);
    });
  });
});
