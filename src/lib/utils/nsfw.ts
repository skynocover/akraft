// module 太大 無法在 worker 使用

// 前端程式碼
// if (file) {
//   const reader = new FileReader();
//   const nsfwCheck = new Promise((resolve, reject) => {
//     reader.onload = async () => {
//       try {
//         const base64 = reader.result as string;
//         const { isNSFW, predictions } = await classifyImage(base64);

//         if (isNSFW) {
//           reject(
//             new Error('Image appears to contain inappropriate content'),
//           );
//         }
//         resolve(true);
//       } catch (error) {
//         reject(error);
//       }
//     };
//     reader.onerror = () => reject(new Error('Failed to read image file'));
//   });

//   reader.readAsDataURL(file);
//   await nsfwCheck;
// }

//////////
// import * as nsfwjs from 'nsfwjs';

// const NSFW_THRESHOLD = 0.5;

// interface ClassifyImageResult {
//   isNSFW: boolean;
//   predictions: nsfwjs.PredictionType[];
// }

// export const classifyImage = async (
//   base64Image: string,
// ): Promise<ClassifyImageResult> => {
//   const img = document.createElement('img');
//   img.src = base64Image;

//   return new Promise((resolve) => {
//     img.onload = async () => {
//       // 創建 canvas
//       const canvas = document.createElement('canvas');
//       canvas.width = img.width;
//       canvas.height = img.height;

//       // 將圖片繪製到 canvas
//       const ctx = canvas.getContext('2d');
//       ctx?.drawImage(img, 0, 0);

//       // 載入模型並進行分類
//       const model = await nsfwjs.load();
//       const predictions = await model.classify(img);

//       const nsfwScore = predictions.reduce(
//         (score: number, prediction: nsfwjs.PredictionType) => {
//           if (['Porn', 'Hentai', 'Sexy'].includes(prediction.className)) {
//             return score + prediction.probability;
//           }
//           return score;
//         },
//         0,
//       );

//       resolve({
//         isNSFW: nsfwScore > NSFW_THRESHOLD,
//         predictions,
//       });
//     };
//   });
// };
