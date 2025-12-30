import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';

export type ApiResponseRecordingPageViewerResult = {
  apiResponses: Map<string, any>;
  // TODO Also return console logging (errors, warnings)
  // TODO Also return page errors
};

@Injectable()
export class ApiResponseRecordingPageViewerService {

  async viewPage(pageUrl: string): Promise<ApiResponseRecordingPageViewerResult> {
    const responses: Map<string, any> = new Map();

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
    await page.setUserAgent({ userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' });
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

    // Visit the page
    await page.goto(pageUrl, { waitUntil: 'networkidle0' });
    await page.setViewport({width: 1080, height: 1024});
    await page.waitForNetworkIdle({ idleTime: 1000, timeout: 30000 });
    await browser.close();

    // Return the collected responses
    return {
      apiResponses: responses,
    };
  }
}
