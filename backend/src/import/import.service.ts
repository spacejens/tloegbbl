import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class ImportService<E> {
  abstract import(requested: E): Promise<E>
}
