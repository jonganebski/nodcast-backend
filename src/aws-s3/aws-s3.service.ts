import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import * as aws from 'aws-sdk';
import { IUploadFileOutput } from './dtos/upload-file.dto';
import { IDeleteFilesInput, IDeleteFilesOutput } from './dtos/delete-files.dto';
import { ObjectIdentifierList } from 'aws-sdk/clients/s3';

@Injectable()
export class AwsS3Service {
  async upload(file): Promise<IUploadFileOutput> {
    aws.config.update({
      credentials: {
        accessKeyId: process.env.AWS_S3_ACCESS_KEY,
        secretAccessKey: process.env.AWS_S3_SECRET_KEY,
      },
    });
    let folderName: string;
    if (file.mimetype.includes('image')) {
      folderName = 'images/';
    } else if (file.mimetype.includes('audio')) {
      folderName = 'audios/';
    } else {
      return { ok: false, err: 'Invalid file form' };
    }
    try {
      const objectName =
        folderName + uuidv4().replace(/[-]/g, '') + '-' + file.originalname;
      const result = await new aws.S3()
        .upload({
          ACL: 'public-read',
          Body: file.buffer,
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: objectName,
        })
        .promise();
      return { ok: true, url: result.Location };
    } catch (err) {
      console.log(err);
      return { ok: false, err: 'Failed to upload audio file' };
    }
  }

  async delete({ urls }: IDeleteFilesInput): Promise<IDeleteFilesOutput> {
    aws.config.update({
      credentials: {
        accessKeyId: process.env.AWS_S3_ACCESS_KEY,
        secretAccessKey: process.env.AWS_S3_SECRET_KEY,
      },
    });
    try {
      const objects: ObjectIdentifierList = urls.map((url) => {
        const key = url.split('amazonaws.com/')[1];
        return { Key: key };
      });
      const result = await new aws.S3()
        .deleteObjects({
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Delete: { Objects: objects },
        })
        .promise();
      if (result.Deleted.length !== urls.length) {
        return { ok: true, err: 'There are some not deleted files' };
      }
      return { ok: true };
    } catch (err) {
      console.log(err);
      return { ok: true, err: 'Failed to delete files' };
    }
  }
}
