import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { existsSync, mkdirSync } from 'fs';

@Injectable()
export class FileSystemService {

  constructor(
    private readonly configService: ConfigService,
  ) {}

  mkdir(dirName: string) {
    const fullDirName = this.outputDir() + dirName;
    if (!existsSync(fullDirName)) {
      mkdirSync(fullDirName, { recursive: true });
    }
  }

  private outputDir(): string {
    return 'tp-site/' + this.configService.get('OUTPUT_DIR') + '/';
  }
}
