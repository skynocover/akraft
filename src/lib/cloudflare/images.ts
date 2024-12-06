import ky from 'ky';

const NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_HASH =
  process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_HASH;
const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;

export const uploadToCloudflare = async (
  fileBuffer: Buffer,
  fileName: string,
) => {
  const endpoint = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/images/v1`;

  // 創建 FormData 實例
  const formData = new FormData();
  formData.append('file', new Blob([fileBuffer]), fileName);
  try {
    const response: any = await ky
      .post(endpoint, {
        headers: { Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}` },
        body: formData,
      })
      .json();

    return response.result.id; // 返回 Cloudflare image ID
  } catch (error: any) {
    console.error(
      '上傳到 Cloudflare 時發生錯誤:',
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const deleteFromCloudflare = async (imageId: string) => {
  const endpoint = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/images/v1/${imageId}`;

  try {
    await ky.delete(endpoint, {
      headers: { Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}` },
    });
  } catch (error: any) {
    console.error(
      '從 Cloudflare 刪除圖片時發生錯誤:',
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const getImageUrl = (imageId: string) => {
  return `https://imagedelivery.net/${NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_HASH}/${imageId}/public`;
};
