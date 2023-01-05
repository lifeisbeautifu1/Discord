import {
  Controller,
  Delete,
  Param,
  Post,
  UploadedFile,
  Req,
  UseInterceptors,
  UseGuards,
} from "@nestjs/common";
import { v2 as cloudinary } from "cloudinary";
import { createReadStream } from "streamifier";
import { FileInterceptor } from "@nestjs/platform-express";
import { AuthenticatedGuard } from "src/auth/utils/guards";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

@Controller("upload")
export class UploadController {
  @Post("")
  @UseGuards(AuthenticatedGuard)
  @UseInterceptors(FileInterceptor("file"))
  async uploadImage(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const streamUpload = (req: Request) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream((error, result) => {
          if (result) resolve(result);
          else reject(error);
        });
        if (createReadStream) createReadStream(file.buffer).pipe(stream);
      });
    };
    const result = await streamUpload(req);
    return result;
  }

  @UseGuards(AuthenticatedGuard)
  @Delete(":id")
  async deleteImage(@Param("id") id: string) {
    await cloudinary.uploader.destroy(id, function (result) {
      console.log(result);
    });
    return {
      message: "deleted",
    };
  }
}
