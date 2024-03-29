import * as path from "path";
import * as fs from 'fs'
import { Injectable, NotFoundException } from '@nestjs/common';
import { audioToTextUseCase, orthographyCheckUsecase, prosConsDiscusserStreamUseCase, prosConsDiscusserUseCase, textToAudioUseCase, translateUseCase } from './use-cases';
import {  ProsConsDiscusserDto, TextToAudioDto } from './dtos';
import OpenAI from 'openai';
import { OrthographyDto } from './dtos/orthography.dto';
import { TranslateDto } from './dtos/translate.dto';
import { AudioToTextDto } from './dtos/audio-to-text.dto';


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
  async translateStream({prompt, lang}: TranslateDto){
    return await translateUseCase(this.openai, {prompt:prompt, lang:lang});
  }
  async textToAudio({prompt, voice}: TextToAudioDto){
    return await textToAudioUseCase(this.openai, {prompt:prompt, voice:voice});
  }

  async textToAudioGetter(fileId:string){
    const filePath = path.resolve(__dirname, '../../generated/audios/', `${fileId}.mp3`);
    const wasFound = fs.existsSync(filePath);

    if(!wasFound) throw new NotFoundException(`${fileId} not found`);

    return filePath;
  }

  async audioToText( audioFile: Express.Multer.File, audioToTextDto?:AudioToTextDto,){
    const {prompt} = audioToTextDto;
    return await audioToTextUseCase(this.openai, {audioFile, prompt})
  }
}


