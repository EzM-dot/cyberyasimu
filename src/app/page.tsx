"use client";

import { useState, useEffect, useCallback } from 'react';
import CountdownSetup from '@/components/time-vault/CountdownSetup';
import CountdownDisplay from '@/components/time-vault/CountdownDisplay';
import FullScreenLock from '@/components/time-vault/FullScreenLock';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Timer } from 'lucide-react';

type AppPhase = 'setup' | 'counting' | 'locked';

export default function HomePage() {
  const [phase, setPhase] = useState<AppPhase>('setup');
  const [duration, setDuration] = useState(0); // total seconds for the current countdown
  const [remainingTime, setRemainingTime] = useState(0); // current remaining seconds

  const resetTimerState = useCallback(() => {
    setPhase('setup');
    setRemainingTime(0);
    setDuration(0);
  }, []);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined = undefined;

    if (phase === 'counting' && remainingTime > 0) {
      intervalId = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime <= 1) { // Timer will reach 0 on the next tick
            clearInterval(intervalId!); // Clear interval immediately
            setPhase('locked'); // Change phase
            return 0; // Set remaining time to 0
          }
          return prevTime - 1;
        });
      }, 1000);
    } else if (phase === 'counting' && remainingTime === 0 && duration > 0) {
      // This handles the case where timer might have been set to 0 initially or an edge case
      setPhase('locked');
    }

    // Cleanup function to clear interval when component unmounts or dependencies change
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [phase, remainingTime, duration]); // Dependencies for the effect

  const handleTimeSet = (totalSeconds: number) => {
    // Basic validation, already handled in CountdownSetup but good for safety
    if (totalSeconds <= 0) { 
      alert("Please set a duration greater than 0 seconds.");
      return;
    }
    setDuration(totalSeconds);
    setRemainingTime(totalSeconds);
    setPhase('counting');
  };

  const handleDismissLockScreen = () => {
    resetTimerState();
  };

  const handleResetCountdown = () => {
    resetTimerState();
  };

  // If phase is 'locked', render only the FullScreenLock component
  if (phase === 'locked') {
    return <FullScreenLock onDismiss={handleDismissLockScreen} />;
  }

  // Render setup or counting UI within the main layout
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background text-foreground font-body">
      <Card className="w-full max-w-sm sm:max-w-md shadow-2xl rounded-xl overflow-hidden">
        <CardHeader className="items-center text-center bg-card pt-6 pb-4">
          <Timer className="w-12 h-12 text-primary mb-2" />
          <CardTitle className="font-headline text-3xl font-semibold">Time Vault</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {phase === 'setup' && <CountdownSetup onTimeSet={handleTimeSet} />}
          {phase === 'counting' && (
            <CountdownDisplay
              remainingTime={remainingTime}
              duration={duration}
              onReset={handleResetCountdown}
            />
          )}
        </CardContent>
      </Card>
      <footer className="text-center mt-8 text-muted-foreground text-sm px-4">
        <p>Set your focus time. Lock it in. Make every second count.</p>
      </footer>
    </main>
  );
}
