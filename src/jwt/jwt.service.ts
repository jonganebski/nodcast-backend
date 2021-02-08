import { Inject, Injectable } from '@nestjs/common';
import { sign, verify } from 'jsonwebtoken';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import { JwtModuleOptions } from './jwt.interface';

@Injectable()
export class JwtService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: JwtModuleOptions,
  ) {}
  sign(userId: number) {
    return sign({ id: userId }, this.options.privateKey);
  }
  verify(token: string) {
    return verify(token, this.options.privateKey);
  }
}
