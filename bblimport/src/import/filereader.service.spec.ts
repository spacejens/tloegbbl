import { Test, TestingModule } from '@nestjs/testing';
import { FileReaderService } from "./filereader.service";

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
            expect(fileReaderService.findQueryParamInOnclick('only', "self.location.href='page.asp?only=alone';")).toBe('alone');
        });

        it('should find first query param', () => {
            expect(fileReaderService.findQueryParamInOnclick('first', "self.location.href='file.asp?first=alpha&last=omega';")).toBe('alpha');
        });

        it('should find last query param', () => {
            expect(fileReaderService.findQueryParamInOnclick('last', "self.location.href='file.asp?first=alpha&last=omega';")).toBe('omega');
        });

        it('should find query param when there is no page', () => {
            expect(fileReaderService.findQueryParamInOnclick('key', "self.location.href='?key=value';")).toBe('value');
        });

        it('should return undefined when the query param does not exist', () => {
            expect(fileReaderService.findQueryParamInOnclick('something', "self.location.href='?other=stuff';")).toBe(undefined);
        });

        it('should return undefined when there are no query params', () => {
            expect(fileReaderService.findQueryParamInOnclick('something', "self.location.href='page.asp';")).toBe(undefined);
        });
    });

    describe('findQueryParamInHref', () => {
        it('should find only query param', () => {
            expect(fileReaderService.findQueryParamInHref('only', 'file.asp?only=alone')).toBe('alone');
        });

        it('should find first query param', () => {
            expect(fileReaderService.findQueryParamInHref('first', 'file.asp?first=alpha&last=omega')).toBe('alpha');
        });

        it('should find last query param', () => {
            expect(fileReaderService.findQueryParamInHref('last', 'file.asp?first=alpha&last=omega')).toBe('omega');
        });

        it('should find query param when there is no page', () => {
            expect(fileReaderService.findQueryParamInHref('key', '?key=value')).toBe('value');
        });

        it('should return undefined when the query param does not exist', () => {
            expect(fileReaderService.findQueryParamInHref('something', '?other=stuff')).toBe(undefined);
        });

        it('should return undefined when there are no query params', () => {
            expect(fileReaderService.findQueryParamInHref('something', 'page.asp')).toBe(undefined);
        });
    });
});
