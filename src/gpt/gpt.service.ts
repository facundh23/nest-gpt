import { Injectable } from '@nestjs/common';
import { orthographyCheckUsecase } from './use-cases';
import { OrthographyDto } from './dtos';

@Injectable()
export class GptService {
  async orthographyCheck(orthographyDto: OrthographyDto) {
    return await orthographyCheckUsecase({
      prompt: orthographyDto.prompt,
    });
  }
}
