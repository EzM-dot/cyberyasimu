"use client";

import { useState } from 'react';
import type { FC } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { PlayCircle } from 'lucide-react';

interface CountdownSetupProps {
  onTimeSet: (totalSeconds: number) => void;
}

const CountdownSetup: FC<CountdownSetupProps> = ({ onTimeSet }) => {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(5); // Default to 5 minutes
  const [seconds, setSeconds] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    if (totalSeconds <= 0) {
      // Consider using toast for better UX in a real app
      alert("Please set a duration greater than 0 seconds.");
      return;
    }
    onTimeSet(totalSeconds);
  };

  const createNumberInput = (
    label: string,
    value: number,
    setValue: (val: number) => void,
    max: number,
    min: number = 0
  ) => (
    <div className="flex flex-col space-y-1.5">
      <Label htmlFor={label.toLowerCase()} className="text-sm font-medium text-muted-foreground">{label}</Label>
      <Input
        id={label.toLowerCase()}
        type="number"
        value={value.toString()} // Ensure value is string for controlled input
        onChange={(e) => {
          let val = parseInt(e.target.value, 10);
          if (isNaN(val)) val = min; // Handle empty input or non-numeric
          val = Math.max(min, Math.min(max, val));
          setValue(val);
        }}
        min={min}
        max={max}
        className="text-center text-2xl h-16 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <p className="text-center text-muted-foreground">
        Set your focus duration.
      </p>
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {createNumberInput("Hours", hours, setHours, 23)}
        {createNumberInput("Minutes", minutes, setMinutes, 59)}
        {createNumberInput("Seconds", seconds, setSeconds, 59)}
      </div>
      <Button type="submit" className="w-full text-lg py-3 h-auto" size="lg">
        <PlayCircle className="mr-2 h-6 w-6" />
        Start Timer
      </Button>
    </form>
  );
};

export default CountdownSetup;
