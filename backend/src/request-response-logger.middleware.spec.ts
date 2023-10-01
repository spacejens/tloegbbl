import { RequestResponseLoggerMiddleware } from './request-response-logger.middleware';

describe('RequestResponseLoggerMiddleware', () => {
  it('should be defined', () => {
    expect(new RequestResponseLoggerMiddleware()).toBeDefined();
  });
});
