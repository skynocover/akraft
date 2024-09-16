'use client';

import React, { useEffect } from 'react';

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

const GoogleAd: React.FC = () => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error('Error loading Google AdSense:', err);
    }
  }, []);

  return (
    <>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-4832588143134491"
        data-ad-slot="8716171458"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </>
  );
};

export default GoogleAd;
