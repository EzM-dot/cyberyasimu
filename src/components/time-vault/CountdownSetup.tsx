
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

  useEffect(() => {
    const totalSecondsValue = hours * 3600 + minutes * 60 + seconds;
    let newBlockCost = 0;
    if (totalSecondsValue > 0) {
      const twentyMinuteBlocks = Math.ceil(totalSecondsValue / (20 * 60));
      newBlockCost = twentyMinuteBlocks * 10;
    }
    setCalculatedCost(newBlockCost);
  }, [hours, minutes, seconds]);

  useEffect(() => {
    const initialTotalSeconds = 0 * 3600 + 5 * 60 + 0 * seconds; // Corresponds to initial state: hours(0), minutes(5), seconds(0)
    
    if (initialTotalSeconds > 0) {
      const rawEquivalentKsh = initialTotalSeconds / 120; // Ksh 1 = 2 mins = 120 secs
      const twentyMinuteBlocks = Math.ceil(initialTotalSeconds / (20 * 60));
      const effectiveCost = twentyMinuteBlocks * 10;

      setCalculatedCost(effectiveCost);

      if (effectiveCost === 10 && rawEquivalentKsh < 10) {
        setKshInput("10.00");
      } else {
        setKshInput(rawEquivalentKsh.toFixed(2));
      }
    } else {
      setKshInput("0.00");
      setCalculatedCost(0);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const handleKshInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const currentValue = e.target.value;

    // Regex allows: empty string, "0", "123", "0.1", "123.45", "123." (intermediate typing)
    // Rejects: "123.456" (more than 2 decimal places), "abc", "1.2.3" (invalid number formats)
    // Allows leading zero only if it's "0" or "0.xx"
    const strictPattern = /^(0|[1-9]\d*)(\.\d{0,2})?$/; 
    const intermediatePattern = /^(0|[1-9]\d*)\.$/; // Allows "123."
    const isEmpty = currentValue === "";

    if (isEmpty || strictPattern.test(currentValue) || intermediatePattern.test(currentValue)) {
        setKshInput(currentValue);

        // If the input is empty or just a number ending with a dot (incomplete for calculation)
        if (currentValue === "" || currentValue.endsWith('.')) {
            if (currentValue === "") {
                setHours(0);
                setMinutes(0);
                setSeconds(0);
            }
            // For "number." or just ".", don't calculate time yet
            return;
        }

        const amountNum = parseFloat(currentValue);

        if (isNaN(amountNum) || amountNum < 0) { 
            setHours(0); setMinutes(0); setSeconds(0);
            return;
        }
        
        const cappedAmount = Math.min(amountNum, 10000); // Cap at Ksh 10,000
        const totalFocusSeconds = cappedAmount * 2 * 60; // Ksh 1 = 2 minutes = 120 seconds
        
        let newH = Math.floor(totalFocusSeconds / 3600);
        let newM = Math.floor((totalFocusSeconds % 3600) / 60);
        let newS = Math.round(totalFocusSeconds % 60); // Round seconds

        const maxTotalSeconds = (23 * 3600) + (59 * 60) + 59; // Max time: 23h 59m 59s
        if (newH * 3600 + newM * 60 + newS > maxTotalSeconds) {
            newH = 23; newM = 59; newS = 59;
        }

        setHours(newH);
        setMinutes(newM);
        setSeconds(newS);

    } 
    // Else: input is invalid (e.g. "12.345", "abc"), do nothing.
    // The input field will not update because setKshInput was not called with the invalid value.
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
    if (newTotalSeconds > 0) {
        const equivalentRawKsh = newTotalSeconds / 120; // Ksh 1 = 2 mins
        setKshInput(equivalentRawKsh.toFixed(2));
    } else {
        setKshInput("0.00");
    }
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const totalSecondsValue = hours * 3600 + minutes * 60 + seconds;
    if (totalSecondsValue <= 0) {
      alert("Please set a duration greater than 0 seconds, or an amount that results in a cost of at least Ksh 10.00.");
      return;
    }
    // Ensure calculatedCost meets minimum if time is set
    if (calculatedCost < 10 && totalSecondsValue > 0) {
      alert("The minimum charge is Ksh 10.00 for any active timer.");
      return;
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
          type="text" // Change to text to allow more control with regex, browser number spinners can be an issue
          inputMode="decimal" // Hint for mobile keyboards
          value={kshInput}
          onChange={handleKshInputChange}
          placeholder="e.g. 10.00"
          className="text-center text-2xl h-16 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          min="10.00" // Still useful for semantic and some browser cues, though regex is primary
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
