import { Body, Controller, FileTypeValidator, Get, HttpStatus, MaxFileSizeValidator, Param, ParseFilePipe, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import {diskStorage} from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { GptService } from './gpt.service';
import { OrthographyDto, ProsConsDiscusserDto, TranslateDto } from './dtos';
import { Response } from 'express';
import { TextToAudioDto } from './dtos/text-to-audio.dto';
import { AudioToTextDto } from './dtos/audio-to-text.dto';

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

  @Post('audio-to-text')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination:'./generated/uploads',
        filename:(req, file, callback) => {
          const fileExtension = file.originalname.split('.').pop();
          const fileId = uuidv4();
          const fileName = `${fileId}.${fileExtension}`;
          return callback(null, fileName)
        }
      })
    })
  )
  async audioToText(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1000 * 1024 * 5,
            message:'File is bigger than 5 mb'
          }),
          new FileTypeValidator({fileType:'audio/*'})
        ]
      })
    ) file: Express.Multer.File,
    @Body('prompt') audioToTextDto:AudioToTextDto
  ){
    
    return  this.gptService.audioToText(file, audioToTextDto);
  }

}
