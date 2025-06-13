
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
  const [kshInput, setKshInput] = useState("0.00"); 

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

  // Effect to initialize kshInput and calculatedCost based on default time
  useEffect(() => {
    // Default time is already set by useState: hours(0), minutes(5), seconds(0)
    const initialTotalSeconds = hours * 3600 + minutes * 60 + seconds;
    
    if (initialTotalSeconds > 0) {
      const rawEquivalentKsh = initialTotalSeconds / 120;
      const twentyMinuteBlocks = Math.ceil(initialTotalSeconds / (20 * 60));
      const effectiveCost = twentyMinuteBlocks * 10;

      setCalculatedCost(effectiveCost);

      // If the effective cost for the default time is the minimum (10), 
      // and the raw ksh equivalent is less than 10, display 10.00 in kshInput.
      // This makes the initial display consistent with the minimum charge.
      if (effectiveCost === 10 && rawEquivalentKsh < 10) {
        setKshInput("10.00");
      } else {
        // Otherwise, kshInput shows the raw Ksh equivalent of the default time
        setKshInput(rawEquivalentKsh.toFixed(2));
      }
    } else {
      setKshInput("0.00");
      setCalculatedCost(0);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only on mount to set initial kshInput and cost from default time


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
    
    currentH = Math.max(0, currentH);
    currentM = Math.max(0, currentM);
    currentS = Math.max(0, currentS);

    setHours(currentH);
    setMinutes(currentM);
    setSeconds(currentS);

    const newTotalSeconds = currentH * 3600 + currentM * 60 + currentS;
    // When time changes, update kshInput to reflect the raw equivalent Ksh for that time.
    // The calculatedCost field will show the actual block-based billing.
    if (newTotalSeconds > 0) {
        const equivalentRawKsh = newTotalSeconds / 120; 
        setKshInput(equivalentRawKsh.toFixed(2));
    } else {
        setKshInput("0.00");
    }
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const totalSecondsValue = hours * 3600 + minutes * 60 + seconds;
    if (totalSecondsValue <= 0) {
      alert("Please set a duration greater than 0 seconds, or an amount greater than Ksh 0.");
      return;
    }
    // The calculatedCost already reflects the Ksh 10 minimum if any time is set.
    // The min="10.00" on kshInput helps with form validation.
    // We can ensure that if kshInput is explicitly set below 10 by the user,
    // but time is > 0, the submission still respects calculatedCost.
    // The current logic already handles this as onTimeSet uses totalSecondsValue
    // and calculatedCost determines the billing.

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
          min="10.00" 
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

    