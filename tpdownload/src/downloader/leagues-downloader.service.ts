import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';
import { ApiResponseRecordingPageViewerService } from './api-response-recording-page-viewer.service';

@Injectable()
export class LeaguesDownloaderService {

  constructor(
    readonly pageViewerService: ApiResponseRecordingPageViewerService,
  ) {}

  async downloadAllLeagues(): Promise<void> {
    // TODO Get list of league URLs from local config
    await this.downloadLeague('https://tourplay.net/en/blood-bowl/-ogretoberfest-12--/scores');
  }

  private async downloadLeague(url: string): Promise<void> {
    const leaguePageResult = await this.pageViewerService.viewPage(url);
    leaguePageResult.apiResponses.forEach(async (response, requestUrl) => {
      console.log(`${requestUrl} : ${JSON.stringify(response)}`);
    });
    if (leaguePageResult.hasErrorsOrWarnings) {
      console.log('Something went wrong!');
    }
  }

  private async downloadLeagueProofOfConcept(url: string): Promise<void> {
    const browser = await puppeteer.launch({
      headless: false, // Set to true if you don't need to see the browser
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
    await page.setRequestInterception(true); // TODO Interception probably not needed

    // TODO CDP probably not needed
    const client = await page.createCDPSession();
    await client.send('Network.enable');
    client.on('Network.requestWillBeSent', params => {
      console.log(`CDP Request: ${params.request.method} ${params.request.url}`);
    });
    client.on('Network.responseReceived', params => {
      console.log(`CDP Response: ${params.response.status} ${params.response.url}`);
    });

    // Capture requests and responses
    page.on('request', request => {
      console.log(`Starting ${request.method()} ${request.url()}`);
      // Must call continue() when interception is enabled, otherwise the request will be blocked
      request.continue();
    });
    const responses: Map<string, any> = new Map();
    page.on('requestfinished', async request => {
      const requestUrl = request.url();
      console.log(`Finished ${request.method()} ${requestUrl}`);
      if (requestUrl.includes('/api/')) {
        responses.set(requestUrl, await request.response().json());
      }
    });
    page.on('console', msg => {
      const type = msg.type();
      const text = msg.text();
      if (type === 'error') {
        console.log(`PAGE ${type.toUpperCase()}: ${text}`);
      }
    });
    page.on('pageerror', (error: Error) => {
      console.log(`PAGE ERROR: ${error.message}`);
    });
    await page.goto(url, { waitUntil: 'networkidle0' });
    await page.setViewport({width: 1080, height: 1024});
    await page.waitForNetworkIdle({ idleTime: 1000, timeout: 30000 });
    await browser.close();

    // Output JSON responses at the end here, to avoid delaying between requests
    console.log('RESPONSE JSON STARTS HERE');
    responses.forEach(async (response, requestUrl) => {
      console.log(`${requestUrl} : ${JSON.stringify(response)}`);
    });
  }
}
