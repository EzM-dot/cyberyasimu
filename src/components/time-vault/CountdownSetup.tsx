
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
  const [kshInput, setKshInput] = useState("10.00"); 

  // Effect to update calculatedCost when time (h, m, s) changes
  useEffect(() => {
    const totalSecondsValue = hours * 3600 + minutes * 60 + seconds;
    let newBlockCost = 0;
    if (totalSecondsValue > 0) {
      const twentyMinuteBlocks = Math.ceil(totalSecondsValue / (20 * 60));
      newBlockCost = twentyMinuteBlocks * 10;
    }
    setCalculatedCost(newBlockCost);
  }, [hours, minutes, seconds]);

  // Effect to initialize kshInput based on default time
  useEffect(() => {
    const initialTotalSeconds = hours * 3600 + minutes * 60 + seconds;
    if (initialTotalSeconds > 0) {
      const initialEquivalentKsh = initialTotalSeconds / 120; // 1 Ksh = 2 minutes = 120 seconds
      setKshInput(initialEquivalentKsh.toFixed(2));
      
      const twentyMinuteBlocks = Math.ceil(initialTotalSeconds / (20 * 60));
      setCalculatedCost(twentyMinuteBlocks * 10);
    } else {
      setKshInput("0.00"); // Or "10.00" if 0 time implies min charge
      setCalculatedCost(0); // Or 10
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only on mount to set initial kshInput from default time


  const handleKshInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setKshInput(inputValue); 

    if (inputValue.trim() === "" || inputValue === ".") {
      if (inputValue.trim() === "") {
        setHours(0); setMinutes(0); setSeconds(0);
      }
      return;
    }

    const amountNum = parseFloat(inputValue);

    if (isNaN(amountNum) || amountNum < 0) {
      setHours(0); setMinutes(0); setSeconds(0);
      return;
    }
    
    const cappedAmount = Math.min(amountNum, 10000); 

    const totalFocusSeconds = cappedAmount * 2 * 60; 
    
    let newH = Math.floor(totalFocusSeconds / 3600);
    let newM = Math.floor((totalFocusSeconds % 3600) / 60);
    let newS = Math.round(totalFocusSeconds % 60); 

    const maxTotalSeconds = (23 * 3600) + (59 * 60) + 59;
    if (newH * 3600 + newM * 60 + newS > maxTotalSeconds) {
        newH = 23; newM = 59; newS = 59;
    }

    setHours(newH);
    setMinutes(newM);
    setSeconds(newS);
  };

  const handleTimeInputChange = (
    unit: 'h' | 'm' | 's',
    newValue: number
  ) => {
    let currentH = hours;
    let currentM = minutes;
    let currentS = seconds;

    if (unit === 'h') currentH = newValue;
    else if (unit === 'm') currentM = newValue;
    else if (unit === 's') currentS = newValue;
    
    // Prevent negative values that might be typed before input clamps them
    currentH = Math.max(0, currentH);
    currentM = Math.max(0, currentM);
    currentS = Math.max(0, currentS);

    setHours(currentH);
    setMinutes(currentM);
    setSeconds(currentS);

    const newTotalSeconds = currentH * 3600 + currentM * 60 + currentS;
    const equivalentRawKsh = newTotalSeconds / 120; 
    setKshInput(equivalentRawKsh.toFixed(2));
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const totalSecondsValue = hours * 3600 + minutes * 60 + seconds;
    if (totalSecondsValue <= 0) {
      alert("Please set a duration greater than 0 seconds, or an amount greater than Ksh 0.");
      return;
    }
    // The calculatedCost already reflects the Ksh 10 minimum if any time is set.
    // We can add an explicit check for kshInput if desired, but calculatedCost is the billing truth.
    const kshAmountFromInput = parseFloat(kshInput);
    if (isNaN(kshAmountFromInput) || kshAmountFromInput < 10 && totalSecondsValue > 0) {
       // This condition means they typed less than 10 (e.g. "5") but time is positive.
       // calculatedCost will correctly be 10 or more.
       // If we want to alert based on the kshInput field directly:
       // alert("Minimum amount is Ksh 10.00. Your current settings will be billed at Ksh " + calculatedCost.toFixed(2) + ".");
       // For now, proceeding as the billing logic is sound.
    }

    onTimeSet(totalSecondsValue);
  };

  const createTimeInput = (
    label: string,
    value: number,
    unit: 'h' | 'm' | 's',
    max: number,
    min: number = 0
  ) => (
    <div className="flex flex-col space-y-1.5">
      <Label htmlFor={label.toLowerCase()} className="text-sm font-medium text-muted-foreground">{label}</Label>
      <Input
        id={label.toLowerCase()}
        type="number"
        value={value.toString()} 
        onChange={(e) => {
          let val = parseInt(e.target.value, 10);
          if (isNaN(val)) val = min; 
          val = Math.max(min, Math.min(max, val));
          handleTimeInputChange(unit, val);
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
        {createTimeInput("Hours", hours, 'h', 23)}
        {createTimeInput("Minutes", minutes, 'm', 59)}
        {createTimeInput("Seconds", seconds, 's', 59)}
      </div>

      <div className="flex flex-col space-y-1.5">
        <Label htmlFor="ksh-amount" className="text-sm font-medium text-muted-foreground">Amount (Ksh)</Label>
        <Input
          id="ksh-amount"
          type="number"
          value={kshInput}
          onChange={handleKshInputChange}
          placeholder="e.g. 10.00"
          className="text-center text-2xl h-16 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          min="10.00" // Set minimum amount
          step="0.01" 
        />
      </div>
      
      <div className="text-center p-3 bg-secondary/50 rounded-md border border-secondary">
        <p className="text-sm font-medium text-secondary-foreground">Effective cost for this duration</p>
        <p className="text-2xl font-semibold text-primary">Ksh {calculatedCost.toFixed(2)}</p>
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
