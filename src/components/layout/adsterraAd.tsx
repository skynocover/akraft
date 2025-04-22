'use client';
import Script from 'next/script';
import Thread from '@/components/thread/Thread';
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
  CardContent,
} from '../ui/card';
import { Separator } from '../ui/separator';
import { Button } from '../ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';
import { getImageUrl } from '@/lib/cloudflare/images';
import { PostComponent, MediaContent, PostContent } from '../thread/Post';

const AdsterraAd = () => {
  const handleScriptError = () => {
    console.error('Adsterra 廣告腳本載入失敗');
    // 可選：記錄到分析工具或後端
  };

  return (
    <>
      <Script
        id="adsterra-config"
        strategy="afterInteractive"
        onError={handleScriptError}
      >
        {`
          atOptions = {
            'key': '${process.env.NEXT_PUBLIC_ADSTERRA_KEY}',
            'format': 'iframe',
            'height': 60,
            'width': 468,
            'params': {}
          };
        `}
      </Script>
      <Script
        src={`//www.highperformanceformat.com/${process.env.NEXT_PUBLIC_ADSTERRA_KEY}/invoke.js`}
        strategy="afterInteractive"
        onError={handleScriptError}
      />
      <div id="adsterra-ad" />
    </>
  );
};

const AdsterraBanner = () => {
  return (
    <>
      <Script
        async={true}
        data-cfasync="false"
        src={`//${process.env.NEXT_PUBLIC_ADSTERRA_ID}.profitableratecpm.com/${process.env.NEXT_PUBLIC_ADSTERRA_BANNER_ID}/invoke.js`}
      ></Script>
      <div id={`container-${process.env.NEXT_PUBLIC_ADSTERRA_BANNER_ID}`}></div>
    </>
  );
};

const AdsterraAdThread = () => {
  return (
    <>
      <Card
        id={'AdsterraAd'}
        className={`mb-6 overflow-hidden scroll-mt-20 transition-all duration-300 `}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-center">
            <CardTitle className={'text-2xl font-bold text-center'}>
              <>{'這是廣告'}</>
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-3">
          <div className="flex flex-col md:flex-row md:space-x-4">
            <div className="w-full md:w-1/2 mb-4 md:mb-0 h-auto">
              <AdsterraBanner />
            </div>
            <div className="w-full md:w-1/2">
              <PostContent
                content={
                  '最近伺服器用量有點高\n測試一下廣告\n\n如果詐騙太多就撤掉'
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export { AdsterraAd, AdsterraAdThread };
