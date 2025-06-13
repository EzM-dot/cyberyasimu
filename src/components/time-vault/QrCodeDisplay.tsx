
"use client";

import { QRCodeCanvas } from 'qrcode.react';
import { useEffect, useState } from 'react';

interface QrCodeDisplayProps {
  size?: number;
  level?: 'L' | 'M' | 'Q' | 'H';
  bgColor?: string;
  fgColor?: string;
}

const QrCodeDisplay: React.FC<QrCodeDisplayProps> = ({
  size = 128,
  level = 'M',
  bgColor = '#ffffff',
  fgColor = '#000000',
}) => {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    // Ensure this runs only on the client-side
    setUrl(window.location.href);
  }, []);

  if (!url) {
    return <div style={{ width: size, height: size }} className="bg-muted rounded-md animate-pulse" />;
  }

  return (
    <div className="flex flex-col items-center space-y-2">
      <QRCodeCanvas
        value={url}
        size={size}
        bgColor={bgColor}
        fgColor={fgColor}
        level={level}
        includeMargin={true}
      />
      <p className="text-xs text-muted-foreground max-w-xs text-center">
        Scan to open on your phone. Ensure your phone is on the same Wi-Fi network.
        If the URL uses 'localhost', replace it with your computer's local IP address (e.g., 192.168.x.x).
      </p>
    </div>
  );
};

export default QrCodeDisplay;
