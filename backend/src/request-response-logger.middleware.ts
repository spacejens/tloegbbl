import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class RequestResponseLoggerMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    let resContent: any;
    const sendInterceptor =
      (
        response: Response,
        originalSend: {
          (body?: any): Response<any, Record<string, any>>;
          (body?: any): Response<any, Record<string, any>>;
        },
      ) =>
      (content: any) => {
        resContent = content;
        response.send = originalSend;
        return response.send(content);
      };
    res.send = sendInterceptor(res, res.send);
    res.on('finish', () => {
      const resLength: string = res.get('content-length');
      /*
      console.log(
        `\n${req.originalUrl}\n${JSON.stringify(req.body)}\n${resContent}HTTP ${
          res.statusCode
        }, ${resLength} bytes`,
      );
      */
    });
    next();
  }
}
