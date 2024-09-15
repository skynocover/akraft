import Script from 'next/script';
import React from 'react';

export default function GoogleAdsense() {
  return (
    <Script
      id="adsbygoogle-init"
      strategy="afterInteractive"
      crossOrigin="anonymous"
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4832588143134491"
    />
  );
}
