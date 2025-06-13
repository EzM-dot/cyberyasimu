"use client";

import type { FC } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { useEffect, useState } from 'react';

interface CountdownDisplayProps {
  remainingTime: number; // in seconds
  duration: number; // total duration in seconds, for animation
  onReset: () => void;
}

const formatTime = (totalSeconds: number): string => {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

const CountdownDisplay: FC<CountdownDisplayProps> = ({ remainingTime, duration, onReset }) => {
  const [displayTime, setDisplayTime] = useState(formatTime(remainingTime));
  
  useEffect(() => {
    setDisplayTime(formatTime(remainingTime));
  }, [remainingTime]);

  const progress = duration > 0 ? ((duration - remainingTime) / duration) * 100 : 0;
  const circumference = 2 * Math.PI * 45; // r = 45

  return (
    <div className="flex flex-col items-center space-y-8">
      <div className="relative w-60 h-60 sm:w-64 sm:h-64">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
          {/* Background track */}
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="hsl(var(--muted))"
            strokeWidth="7"
            fill="transparent"
          />
          {/* Progress arc */}
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="hsl(var(--primary))"
            strokeWidth="7"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - progress / 100)}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
            style={{ transition: 'stroke-dashoffset 1s linear' }}
          />
          {/* Pulsing circle */}
          <circle
            cx="50"
            cy="50"
            r="40" // Slightly smaller radius for the pulse
            fill="hsl(var(--accent) / 0.2)" // Using accent color from theme
            className="animate-pulse-subtle"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="font-headline text-5xl sm:text-6xl font-bold text-primary tabular-nums">
            {displayTime}
          </p>
        </div>
      </div>
      <Button onClick={onReset} variant="outline" size="lg" className="w-full text-lg py-3 h-auto">
        <RotateCcw className="mr-2 h-6 w-6" />
        Reset Timer
      </Button>
    </div>
  );
};

export default CountdownDisplay;
