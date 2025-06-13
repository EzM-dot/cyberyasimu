
"use client";

import type { FC } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw, MinusSquare, Maximize2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface CountdownDisplayProps {
  remainingTime: number; // in seconds
  duration: number; // total duration in seconds, for animation
  onReset: () => void;
  isMinimized: boolean;
  onToggleMinimize: () => void;
}

const formatTime = (totalSeconds: number, compact: boolean = false): string => {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  if (compact) {
    if (h > 0) return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

const CountdownDisplay: FC<CountdownDisplayProps> = ({ remainingTime, duration, onReset, isMinimized, onToggleMinimize }) => {
  const [displayTime, setDisplayTime] = useState(formatTime(remainingTime));
  
  useEffect(() => {
    setDisplayTime(formatTime(remainingTime, isMinimized));
  }, [remainingTime, isMinimized]);

  const progress = duration > 0 ? ((duration - remainingTime) / duration) * 100 : 0;
  const circumference = 2 * Math.PI * 45; // r = 45

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50 bg-card p-3 rounded-lg shadow-xl border border-border">
        <div className="flex items-center space-x-3">
          <p className="font-mono text-lg font-semibold text-primary tabular-nums">
            {displayTime}
          </p>
          <Button onClick={onToggleMinimize} variant="ghost" size="icon" className="h-8 w-8">
            <Maximize2 className="h-5 w-5" />
            <span className="sr-only">Expand Timer</span>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="relative w-60 h-60 sm:w-64 sm:h-64">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="hsl(var(--muted))"
            strokeWidth="7"
            fill="transparent"
          />
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
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="hsl(var(--accent) / 0.2)"
            className="animate-pulse-subtle"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="font-headline text-5xl sm:text-6xl font-bold text-primary tabular-nums">
            {displayTime}
          </p>
        </div>
      </div>
      <div className="w-full space-y-3">
        <Button onClick={onReset} variant="outline" size="lg" className="w-full text-lg py-3 h-auto">
          <RotateCcw className="mr-2 h-6 w-6" />
          Reset Timer
        </Button>
        <Button onClick={onToggleMinimize} variant="secondary" size="lg" className="w-full text-lg py-3 h-auto">
          <MinusSquare className="mr-2 h-6 w-6" />
          Minimize
        </Button>
      </div>
    </div>
  );
};

export default CountdownDisplay;
