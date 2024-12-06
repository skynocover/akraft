import { XataClient } from '../src/lib/xata/xata.mjs';
import axios from 'axios';
import FormData from 'form-data';
import { Buffer } from 'buffer';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const XATA_API_KEY = process.env.XATA_API_KEY;

const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;

async function uploadToCloudflare(fileBuffer, fileName) {
  const endpoint = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/images/v1`;

  // 創建 FormData 實例
  const formData = new FormData();
  formData.append('file', fileBuffer, { filename: fileName });

  try {
    const response = await axios.post(endpoint, formData, {
      headers: {
        Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
        ...formData.getHeaders(), // 重要：包含 formData 的 headers
      },
    });

    return response.data.result.id; // 返回 Cloudflare image ID
  } catch (error) {
    console.error(
      '上傳到 Cloudflare 時發生錯誤:',
      error.response?.data || error.message,
    );
    throw error;
  }
}

async function migrateXataToCloudflare(serviceId) {
  try {
    const xata = new XataClient({
      branch: serviceId,
      apiKey: XATA_API_KEY,
    });

    const records = await xata.db.threads
      .filter({
        $all: [{ $exists: 'image' }, { $notExists: 'imageToken' }],
      })
      .getAll();

    console.log({ records: records.length });
    // console.log({ records });
    // return;

    for (const record of records) {
      if (record.image) {
        const fileResponse = await axios.get(record.image.url, {
          responseType: 'arraybuffer',
        });
        const fileBuffer = Buffer.from(fileResponse.data);

        const cloudflareId = await uploadToCloudflare(
          fileBuffer,
          record.image.name,
        );

        await xata.db.threads.update(record.id, {
          imageToken: cloudflareId,
        });

        console.log(
          `成功將文件 ${record.image.name} 上傳到 Cloudflare，ID: ${cloudflareId}`,
        );
      }
    }

    console.log('遷移完成！');
  } catch (error) {
    console.error('遷移過程中發生錯誤:', error.response?.data || error.message);
    throw error;
  }
}

(async () => {
  // await migrateXataToCloudflare('61bc09b0e27a80b99d12c095');
  await migrateXataToCloudflare('66a6eca2bfccee3f04a52bc4');
})();
