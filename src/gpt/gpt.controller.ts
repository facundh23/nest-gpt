import { Body, Controller, Get, HttpStatus, Param, Post, Res } from '@nestjs/common';
import { GptService } from './gpt.service';
import { OrthographyDto, ProsConsDiscusserDto, TranslateDto } from './dtos';
import { Response } from 'express';
import { TextToAudioDto } from './dtos/text-to-audio.dto';

@Controller('gpt')
export class GptController {
  constructor(private readonly gptService: GptService) {}
  @Post('orthography-check')
  orthographyCheck(@Body() orthographyDto: OrthographyDto) {
    return this.gptService.orthographyCheck(orthographyDto);
  }
  
  @Post('pros-cons-discusser')
  prosConsDicusser(@Body() prosConsDiscusserDto:ProsConsDiscusserDto){
    return this.gptService.prosConsDiscusser(prosConsDiscusserDto);
  }
  @Post('pros-cons-discusser-stream')
  async prosConsDicusserStream(@Body() prosConsDiscusserDto:ProsConsDiscusserDto, @Res() res: Response,){
    const stream = await this.gptService.prosConsDiscusserStream(prosConsDiscusserDto);
    res.setHeader('Content-type', 'application/json');
    res.status(HttpStatus.OK)

    for await (const chunk of stream){
      const piece = chunk.choices[0].delta.content || '';
      console.log(piece);
      res.write(piece)
    }

    res.end();
  }
  // @Post('translate')
  // async trasnlateStream(@Body() translateDto:TranslateDto, @Res() res: Response,){
  //   const stream = await this.gptService.translateStream(translateDto);
  //   res.setHeader('Content-type', 'application/json');
  //   res.status(HttpStatus.OK)

  //   for await (const chunk of stream){
  //     const piece = chunk.choices[0].delta.content || '';
  //     console.log(piece);
  //     res.write(piece)
  //   }

  //   res.end();
  // }
  @Post('translate')
  translate(@Body() translateDto:TranslateDto){
    return this.gptService.translateStream(translateDto);
  }

  @Post('text-to-audio')
  async textToAudio(@Body() textToAudioDto:TextToAudioDto, @Res() res:Response){
    const filePath =  await this.gptService.textToAudio(textToAudioDto);

    res.setHeader('Content-type', 'audio/mp3');
    res.status(HttpStatus.OK);
    res.sendFile(filePath);
  }
  @Get(`text-to-audio/:fileId`)
  async textToAudioGetter( @Res() res:Response, @Param('fileId') fileId:string){
    const filePath =  await this.gptService.textToAudioGetter(fileId);

    res.setHeader('Content-type', 'audio/mp3');
    res.status(HttpStatus.OK);
    res.sendFile(filePath);
  }
}
