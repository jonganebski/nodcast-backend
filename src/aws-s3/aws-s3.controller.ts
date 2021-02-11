import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AwsS3Service } from './aws-s3.service';
import { IUploadFileOutput } from './dtos/upload-file.dto';

@Controller('api/v1')
export class AwsS3Controller {
  constructor(private readonly awsS3Service: AwsS3Service) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile() uploadedFile): Promise<IUploadFileOutput> {
    return this.awsS3Service.upload(uploadedFile);
  }
}
