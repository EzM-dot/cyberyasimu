
"use client";

import type { FC } from 'react';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Hand } from 'lucide-react';

interface FullScreenLockProps {
  onDismiss: () => void;
}

const FullScreenLock: FC<FullScreenLockProps> = ({ onDismiss }) => {
  useEffect(() => {
    // Using a publicly available, royalty-free sound.
    // This is a simple alarm clock sound from Google's sound library.
    // Replace with any other non-copyrighted sound URL if desired.
    const soundUrl = 'https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg';
    const audio = new Audio(soundUrl);
    audio.play().catch(error => {
      console.error("Failed to play sound:", error);
      // Optionally, inform the user that the sound couldn't play, though for a simple alert, console logging might be enough.
    });
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  return (
    <div className="fixed inset-0 bg-primary z-[100] flex flex-col items-center justify-center text-primary-foreground p-4 sm:p-8 font-body">
      <div className="text-center">
        <h1 className="font-headline text-6xl xs:text-7xl sm:text-8xl md:text-9xl font-black animate-bounce">
          TIMES UP!
        </h1>
      </div>
      <Button
        onClick={onDismiss}
        variant="secondary"
        size="lg"
        className="mt-12 sm:mt-16 text-lg sm:text-xl py-3 px-6 sm:py-4 sm:px-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow h-auto"
      >
        <Hand className="mr-2 sm:mr-3 h-6 w-6 sm:h-7 sm:w-7" />
        Dismiss & Reset
      </Button>
    </div>
  );
};

export default FullScreenLock;
