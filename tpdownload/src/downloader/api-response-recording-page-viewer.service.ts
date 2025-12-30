import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';

export type ApiResponseRecordingPageViewerResult = {
  apiResponses: Map<string, any>;
  consoleErrors: Array<string>;
  consoleWarnings: Array<string>;
  pageErrors: Array<string>;
};

@Injectable()
export class ApiResponseRecordingPageViewerService {

  async viewPage(pageUrl: string): Promise<ApiResponseRecordingPageViewerResult> {
    const responses: Map<string, any> = new Map();
    const consoleErrors: Array<string> = new Array();
    const consoleWarnings: Array<string> = new Array();
    const pageErrors: Array<string> = new Array();

    // Pretend to be a normal browser
    const browser = await puppeteer.launch({
      headless: false, // TODO Configurable if browser should be visible or not
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
    page.on('requestfinished', async request => {
      const requestUrl = request.url();
      // TODO Refine which requests to record responses for (configurable?)
      if (requestUrl.includes('/api/')) {
        responses.set(requestUrl, await request.response().json());
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
      consoleErrors: consoleErrors,
      consoleWarnings: consoleWarnings,
      pageErrors: pageErrors,
    };
  }
}
