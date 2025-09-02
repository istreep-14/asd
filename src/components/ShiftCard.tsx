import React from 'react';
import { Shift } from '../types';
import { formatCurrency, formatDate } from '../utils/shiftUtils';
import { Clock, DollarSign, MapPin, Users, Edit, Trash2 } from 'lucide-react';

interface ShiftCardProps {
  shift: Shift;
  onEdit: (shift: Shift) => void;
  onDelete: (shiftId: string) => void;
}

export function ShiftCard({ shift, onEdit, onDelete }: ShiftCardProps) {
  const totalEarnings = (shift.Hours * shift.HourlyRate) + shift.Tips;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{formatDate(shift.Date)}</h3>
          <p className="text-gray-600 flex items-center">
            <MapPin className="w-4 h-4 mr-1" />
            {shift.Location}
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(shift)}
            className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(shift.ID)}
            className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center text-gray-600">
          <Clock className="w-4 h-4 mr-2" />
          <span>{shift.StartTime} - {shift.EndTime}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <Clock className="w-4 h-4 mr-2" />
          <span>{shift.Hours} hours</span>
        </div>
        <div className="flex items-center text-green-600">
          <DollarSign className="w-4 h-4 mr-2" />
          <span>Tips: {formatCurrency(shift.Tips)}</span>
        </div>
        <div className="flex items-center text-blue-600">
          <DollarSign className="w-4 h-4 mr-2" />
          <span>Total: {formatCurrency(totalEarnings)}</span>
        </div>
      </div>

      {shift.Tags.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {shift.Tags.map((tag, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {shift.coworkers.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
            <Users className="w-4 h-4 mr-1" />
            Coworkers ({shift.coworkers.length})
          </h4>
          <div className="space-y-1">
            {shift.coworkers.map((coworker, index) => (
              <p key={index} className="text-sm text-gray-600">
                {coworker.Name} - {coworker.Position}
              </p>
            ))}
          </div>
        </div>
      )}

      {shift.parties.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
            <Users className="w-4 h-4 mr-1" />
            Parties/Events ({shift.parties.length})
          </h4>
          <div className="space-y-1">
            {shift.parties.map((party, index) => (
              <p key={index} className="text-sm text-gray-600">
                {party.Name} - {party.Type}
              </p>
            ))}
          </div>
        </div>
      )}

      {shift.Notes && (
        <div className="border-t pt-4">
          <p className="text-sm text-gray-600">{shift.Notes}</p>
        </div>
      )}
    </div>
  );
}