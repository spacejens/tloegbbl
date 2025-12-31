import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';
import { ConfigService } from '@nestjs/config';

export type ApiResponseRecordingPageViewerResult = {
  apiResponses: Map<string, any>;
  hasErrorsOrWarnings: boolean;
  consoleErrors: Array<string>;
  consoleWarnings: Array<string>;
  pageErrors: Array<string>;
};

@Injectable()
export class ApiResponseRecordingPageViewerService {

  constructor(
    private readonly configService: ConfigService,
  ) {}

  async viewPage(pageUrl: string): Promise<ApiResponseRecordingPageViewerResult> {
    const responses: Map<string, any> = new Map();
    const consoleErrors: Array<string> = new Array();
    const consoleWarnings: Array<string> = new Array();
    const pageErrors: Array<string> = new Array();

    // Pretend to be a normal browser
    const browser = await puppeteer.launch({
      headless: this.configService.get('HIDE_BROWSER_UI') === 'true',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-blink-features=AutomationControlled'
      ]
    });
    const page = await browser.newPage();
    await page.setUserAgent({ userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' });
    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'webdriver', {
        get: () => undefined
      });
    });

    // Set up response recording
    const apiUrl: string = this.configService.get('TP_BACKEND_API_URL');
    page.on('requestfinished', async request => {
      const requestUrl = request.url();
      if (requestUrl.startsWith(apiUrl)) {
        responses.set(requestUrl.substring(apiUrl.length), await request.response().json());
      }
    });

    // Set up console recording
    page.on('console', msg => {
      const type = msg.type();
      const text = msg.text();
      if (type === 'error') {
        consoleErrors.push(text);
      } else if (type === 'warn') {
        consoleWarnings.push(text);
      }
    });

    // Set up page error recording
    page.on('pageerror', (error: Error) => {
      pageErrors.push(error.message);
    });

    // Visit the page
    await page.goto(pageUrl, { waitUntil: 'networkidle0' });
    await page.setViewport({width: 1080, height: 1024});
    await page.waitForNetworkIdle({ idleTime: 1000, timeout: 30000 });
    await browser.close();

    // Return the collected responses
    return {
      apiResponses: responses,
      hasErrorsOrWarnings: consoleErrors.length > 0 || consoleWarnings.length > 0 || pageErrors.length > 0,
      consoleErrors: consoleErrors,
      consoleWarnings: consoleWarnings,
      pageErrors: pageErrors,
    };
  }
}
