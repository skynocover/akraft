import ky from 'ky';

const endpoint = process.env['CONTENT_SAFETY_ENDPOINT'] || '<endpoint>';
const key = process.env['CONTENT_SAFETY_API_KEY'] || '<key>';

interface CategoryAnalysis {
  category: string;
  severity: number;
}

interface ContentSafetyResponse {
  isNSFW: boolean;
  details: CategoryAnalysis[];
}

export const azureContentSafety = async (
  base64Image: string,
): Promise<ContentSafetyResponse> => {
  const data: any = await ky
    .post(`${endpoint}/contentsafety/image:analyze?api-version=2024-09-01`, {
      json: { image: { content: base64Image } },
      headers: {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': key,
      },
    })
    .json();

  const totalSeverity = data.categoriesAnalysis.reduce(
    (sum: number, analysis: CategoryAnalysis) => sum + (analysis.severity || 0),
    0,
  );

  const isNSFW = totalSeverity >= 6;

  return {
    isNSFW,
    details: data.categoriesAnalysis.map((analysis: CategoryAnalysis) => ({
      category: analysis.category,
      severity: analysis.severity || 0,
    })),
  };
};
