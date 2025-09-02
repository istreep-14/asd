import React from 'react';
import { Shift } from '../types';
import { formatCurrency } from '../utils/shiftUtils';
import { DollarSign, Clock, Calendar, TrendingUp } from 'lucide-react';

interface DashboardProps {
  shifts: Shift[];
}

export function Dashboard({ shifts }: DashboardProps) {
  const totalHours = shifts.reduce((sum, shift) => sum + shift.Hours, 0);
  const totalTips = shifts.reduce((sum, shift) => sum + shift.Tips, 0);
  const totalWages = shifts.reduce((sum, shift) => sum + (shift.Hours * shift.HourlyRate), 0);
  const totalEarnings = totalTips + totalWages;
  const averageHourlyWithTips = totalHours > 0 ? totalEarnings / totalHours : 0;

  const thisWeekShifts = shifts.filter(shift => {
    const shiftDate = new Date(shift.Date);
    const today = new Date();
    const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
    return shiftDate >= weekStart;
  });

  const thisWeekEarnings = thisWeekShifts.reduce((sum, shift) => 
    sum + shift.Tips + (shift.Hours * shift.HourlyRate), 0
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Earnings</p>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(totalEarnings)}</p>
          </div>
          <DollarSign className="w-8 h-8 text-green-600" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Hours</p>
            <p className="text-2xl font-bold text-blue-600">{totalHours.toFixed(1)}</p>
          </div>
          <Clock className="w-8 h-8 text-blue-600" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Shifts</p>
            <p className="text-2xl font-bold text-purple-600">{shifts.length}</p>
          </div>
          <Calendar className="w-8 h-8 text-purple-600" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Avg $/Hour</p>
            <p className="text-2xl font-bold text-orange-600">{formatCurrency(averageHourlyWithTips)}</p>
          </div>
          <TrendingUp className="w-8 h-8 text-orange-600" />
        </div>
      </div>
    </div>
  );
}