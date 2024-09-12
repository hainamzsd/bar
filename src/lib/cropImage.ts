// src/lib/cropImage.ts
import Cropper from 'cropperjs';

export const getCroppedImg = (imageSrc: string, croppedAreaPixels: any) => {
  return new Promise<string>((resolve) => {
    const image = document.createElement('img');
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = croppedAreaPixels.width;
        canvas.height = croppedAreaPixels.height;
        ctx.drawImage(
          image,
          croppedAreaPixels.x,
          croppedAreaPixels.y,
          croppedAreaPixels.width,
          croppedAreaPixels.height,
          0,
          0,
          croppedAreaPixels.width,
          croppedAreaPixels.height
        );
        resolve(canvas.toDataURL());
      }
    };
  });
};
