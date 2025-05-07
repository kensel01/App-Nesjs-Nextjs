'use client';

import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Textarea } from '@/components/ui/textarea';

export function TestCalendarComponent() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  return (
    <div className="space-y-4">
      <h2>Calendar Component Test</h2>
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md border"
      />
      
      <h2>Textarea Component Test</h2>
      <Textarea placeholder="Enter text here..." />
    </div>
  );
} 