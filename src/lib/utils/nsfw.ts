import * as nsfwjs from 'nsfwjs';

const NSFW_THRESHOLD = 0.5;

interface ClassifyImageResult {
  isNSFW: boolean;
  predictions: nsfwjs.PredictionType[];
}

export const classifyImage = async (
  base64Image: string,
): Promise<ClassifyImageResult> => {
  const img = document.createElement('img');
  img.src = base64Image;

  return new Promise((resolve) => {
    img.onload = async () => {
      // 創建 canvas
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;

      // 將圖片繪製到 canvas
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0);

      // 載入模型並進行分類
      const model = await nsfwjs.load();
      const predictions = await model.classify(img);

      const nsfwScore = predictions.reduce(
        (score: number, prediction: nsfwjs.PredictionType) => {
          if (['Porn', 'Hentai', 'Sexy'].includes(prediction.className)) {
            return score + prediction.probability;
          }
          return score;
        },
        0,
      );

      resolve({
        isNSFW: nsfwScore > NSFW_THRESHOLD,
        predictions,
      });
    };
  });
};
