import { Injectable } from '@nestjs/common';
import { orthographyCheckUsecase, prosConsDiscusserStreamUseCase, prosConsDiscusserUseCase } from './use-cases';
import {  ProsConsDiscusserDto } from './dtos';
import OpenAI from 'openai';
import { OrthographyDto } from './dtos/orthography.dto';

@Injectable()
export class GptService {
  private openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  async orthographyCheck(orthographyDto: OrthographyDto) {
    return await orthographyCheckUsecase(this.openai, {
      prompt: orthographyDto.prompt,
    });
  }
  async prosConsDiscusser(prosConsDiscusserDto: ProsConsDiscusserDto){
    return await prosConsDiscusserUseCase(this.openai, {prompt:prosConsDiscusserDto.prompt,});
  }

  async prosConsDiscusserStream(prosConsDiscusserDto: ProsConsDiscusserDto){
    return await prosConsDiscusserStreamUseCase(this.openai, {prompt:prosConsDiscusserDto.prompt,});
  }
}
