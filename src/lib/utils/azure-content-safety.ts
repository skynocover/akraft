import ContentSafetyClient, {
  isUnexpected,
} from '@azure-rest/ai-content-safety';
import { AzureKeyCredential } from '@azure/core-auth';

const endpoint = process.env['CONTENT_SAFETY_ENDPOINT'] || '<endpoint>';
const key = process.env['CONTENT_SAFETY_API_KEY'] || '<key>';
const credential = new AzureKeyCredential(key);
const client = ContentSafetyClient(endpoint, credential);

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
  const analyzeImageOption = { image: { content: base64Image } };
  const analyzeImageParameters = { body: analyzeImageOption };

  const result = await client
    .path('/image:analyze')
    .post(analyzeImageParameters);

  if (isUnexpected(result)) {
    throw result;
  }

  const totalSeverity = result.body.categoriesAnalysis.reduce(
    (sum, analysis) => sum + (analysis.severity || 0),
    0,
  );

  const isNSFW = totalSeverity >= 6;

  return {
    isNSFW,
    details: result.body.categoriesAnalysis.map((analysis) => ({
      category: analysis.category,
      severity: analysis.severity || 0,
    })),
  };
};
