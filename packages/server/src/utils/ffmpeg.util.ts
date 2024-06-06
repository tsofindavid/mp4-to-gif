import ffmpeg, { ffprobe, FfprobeData } from 'fluent-ffmpeg';

export class FfmpegUtil {
  public static async ffprobe(filePath: string): Promise<FfprobeData> {
    return new Promise((resolve, reject) => {
      ffprobe(filePath, (error, data) => {
        if (error) {
          reject(error);
        } else {
          resolve(data);
        }
      });
    });
  }

  public static async ffmpegToGif(inputFilePath: string, outputFilePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      ffmpeg(inputFilePath)
        .outputOptions([
          '-vf scale=-1:400',   // Scale the height to 400px and maintain aspect ratio
          '-r 5',                // Set frame rate to 5 FPS
        ])
        .toFormat('gif')
        .output(outputFilePath)
        .on('end', resolve)
        .on('error', reject)
        .run();
    });

  }
}
