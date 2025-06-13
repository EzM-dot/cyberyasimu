
"use client";

import { useState, useEffect, useCallback } from 'react';
import CountdownSetup from '@/components/time-vault/CountdownSetup';
import CountdownDisplay from '@/components/time-vault/CountdownDisplay';
import FullScreenLock from '@/components/time-vault/FullScreenLock';
// import QrCodeDisplay from '@/components/time-vault/QrCodeDisplay'; // Removed import
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Timer, Smartphone } from 'lucide-react';

type AppPhase = 'setup' | 'counting' | 'locked';

export default function HomePage() {
  const [phase, setPhase] = useState<AppPhase>('setup');
  const [duration, setDuration] = useState(0); // total seconds for the current countdown
  const [remainingTime, setRemainingTime] = useState(0); // current remaining seconds
  const [isMinimized, setIsMinimized] = useState(false);

  const resetTimerState = useCallback(() => {
    setPhase('setup');
    setRemainingTime(0);
    setDuration(0);
    setIsMinimized(false);
  }, []);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined = undefined;

    if (phase === 'counting' && remainingTime > 0) {
      intervalId = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(intervalId!);
            setPhase('locked');
            setIsMinimized(false); // Ensure full screen lock is not competing with minimized view
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else if (phase === 'counting' && remainingTime === 0 && duration > 0) {
      setPhase('locked');
      setIsMinimized(false);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [phase, remainingTime, duration]);

  const handleTimeSet = (totalSeconds: number) => {
    if (totalSeconds <= 0) { 
      alert("Please set a duration greater than 0 seconds.");
      return;
    }
    setDuration(totalSeconds);
    setRemainingTime(totalSeconds);
    setPhase('counting');
    setIsMinimized(false); // Start in expanded view
  };

  const handleDismissLockScreen = () => {
    resetTimerState();
  };

  const handleResetCountdown = () => {
    resetTimerState();
  };

  const handleToggleMinimize = () => {
    setIsMinimized(prev => !prev);
  };

  if (phase === 'locked') {
    return <FullScreenLock onDismiss={handleDismissLockScreen} />;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background text-foreground font-body">
      <Card className="w-full max-w-sm sm:max-w-md shadow-2xl rounded-xl overflow-hidden">
        <CardHeader className="items-center text-center bg-card pt-6 pb-4">
          <div className="flex items-center justify-center w-auto h-12 text-primary mb-2 space-x-1">
            <Smartphone className="w-9 h-9" />
            <Timer className="w-9 h-9" />
          </div>
          <CardTitle className="font-headline text-3xl font-semibold">Cyber ya Simu</CardTitle>
        </CardHeader>
        <CardContent className="p-6 relative min-h-[300px]"> {/* Ensure CardContent can host the display */}
          {phase === 'setup' && <CountdownSetup onTimeSet={handleTimeSet} />}
          {phase === 'counting' && (
            <CountdownDisplay
              remainingTime={remainingTime}
              duration={duration}
              onReset={handleResetCountdown}
              isMinimized={isMinimized}
              onToggleMinimize={handleToggleMinimize}
            />
          )}
        </CardContent>
      </Card>
      <footer className="text-center mt-8 text-muted-foreground text-sm px-4">
        <p>Set your focus time. Lock it in. Make every second count.</p>
        <p className="text-xs mt-1">Billing: Ksh 10 per 20 minutes (or part thereof).</p>
        {/* QR Code Display and associated text removed */}
      </footer>
    </main>
  );
}
