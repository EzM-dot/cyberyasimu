
"use client";

import { useState, useEffect } from 'react';
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
  const [calculatedCost, setCalculatedCost] = useState(0);
  const [kshInput, setKshInput] = useState("10"); // Initial cost for 5 minutes

  // Effect to update cost and kshInput when time (h, m, s) changes
  useEffect(() => {
    const totalSecondsValue = hours * 3600 + minutes * 60 + seconds;
    let newCost = 0;
    if (totalSecondsValue > 0) {
      const twentyMinuteBlocks = Math.ceil(totalSecondsValue / (20 * 60));
      newCost = twentyMinuteBlocks * 10;
    }
    setCalculatedCost(newCost);
    // Update kshInput based on the new cost derived from time.
    // React's setState skips re-render if value is same, preventing loops.
    setKshInput(newCost.toString());
  }, [hours, minutes, seconds]);

  const handleKshInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setKshInput(value);

    if (value === "") {
      setHours(0);
      setMinutes(0);
      setSeconds(0);
      // useEffect for [h,m,s] will set calculatedCost to 0 and kshInput to "0"
      return;
    }

    const amountNum = parseInt(value, 10);

    if (isNaN(amountNum) || amountNum < 0) {
      // If input is not a valid non-negative number, set time to 0.
      // This will also trigger the useEffect to set cost and kshInput to "0".
      setHours(0);
      setMinutes(0);
      setSeconds(0);
      return;
    }

    // Valid number: Calculate time from Ksh amount (Ksh 1 = 2 minutes)
    const totalFocusSeconds = amountNum * 2 * 60;
    
    let newH = Math.floor(totalFocusSeconds / 3600);
    let newM = Math.floor((totalFocusSeconds % 3600) / 60);
    let newS = totalFocusSeconds % 60;

    // Cap time at 23:59:59 for sanity, aligning with H input max.
    if (newH >= 24) {
        newH = 23;
        newM = 59;
        newS = 59;
    }

    setHours(newH);
    setMinutes(newM);
    setSeconds(newS);
    // The useEffect for [hours, minutes, seconds] will then run,
    // recalculate the cost based on this new time, and update
    // `calculatedCost` and `kshInput` (e.g., if user typed Ksh 15,
    // time becomes 30min, block cost is Ksh 20, so kshInput becomes "20").
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const totalSecondsValue = hours * 3600 + minutes * 60 + seconds;
    if (totalSecondsValue <= 0) {
      alert("Please set a duration greater than 0 seconds, or an amount greater than Ksh 0.");
      return;
    }
    onTimeSet(totalSecondsValue);
  };

  const createTimeInput = (
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
        value={value.toString()} // Input expects string value
        onChange={(e) => {
          let val = parseInt(e.target.value, 10);
          if (isNaN(val)) val = min; // Default to min if parsing fails
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <p className="text-center text-muted-foreground">
        Set focus duration or enter amount.
      </p>
      
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {createTimeInput("Hours", hours, setHours, 23)}
        {createTimeInput("Minutes", minutes, setMinutes, 59)}
        {createTimeInput("Seconds", seconds, setSeconds, 59)}
      </div>

      <div className="flex flex-col space-y-1.5">
        <Label htmlFor="ksh-amount" className="text-sm font-medium text-muted-foreground">Amount (Ksh)</Label>
        <Input
          id="ksh-amount"
          type="number"
          value={kshInput}
          onChange={handleKshInputChange}
          placeholder="e.g. 10"
          className="text-center text-2xl h-16 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          min="0"
        />
      </div>
      
      <div className="text-center p-3 bg-secondary/50 rounded-md border border-secondary">
        <p className="text-sm font-medium text-secondary-foreground">Effective cost for this duration</p>
        <p className="text-2xl font-semibold text-primary">Ksh {calculatedCost}</p>
        <p className="text-xs text-muted-foreground mt-1">Billing: Ksh 10 per 20 mins (or part thereof).</p>
      </div>
      
      <Button type="submit" className="w-full text-lg py-3 h-auto" size="lg">
        <PlayCircle className="mr-2 h-6 w-6" />
        Start Timer
      </Button>
    </form>
  );
};

export default CountdownSetup;
