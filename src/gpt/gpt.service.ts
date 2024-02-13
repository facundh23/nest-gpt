import { Injectable } from '@nestjs/common';
import { orthographyCheckUsecase } from './use-cases';

@Injectable()
export class GptService {
  async orthographyCheck() {
    return await orthographyCheckUsecase();
  }
}
