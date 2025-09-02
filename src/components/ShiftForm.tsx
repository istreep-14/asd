import React, { useState, useEffect } from 'react';
import { Shift, Coworker, Party } from '../types';
import { generateShiftId, calculateHours } from '../utils/shiftUtils';
import { X, Plus, Clock, DollarSign, MapPin, Users, Calendar } from 'lucide-react';

interface ShiftFormProps {
  shift?: Shift;
  onSave: (shift: Shift) => void;
  onCancel: () => void;
}

export function ShiftForm({ shift, onSave, onCancel }: ShiftFormProps) {
  const [formData, setFormData] = useState<Shift>({
    ID: '',
    Date: '',
    StartTime: '',
    EndTime: '',
    Location: '',
    Tips: 0,
    Notes: '',
    Tags: [],
    Hours: 0,
    HourlyRate: 15,
    coworkers: [],
    parties: []
  });

  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    if (shift) {
      setFormData(shift);
    } else {
      setFormData(prev => ({
        ...prev,
        ID: generateShiftId(),
        Date: new Date().toISOString().split('T')[0]
      }));
    }
  }, [shift]);

  useEffect(() => {
    const hours = calculateHours(formData.StartTime, formData.EndTime);
    setFormData(prev => ({ ...prev, Hours: hours }));
  }, [formData.StartTime, formData.EndTime]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const addTag = () => {
    if (newTag.trim() && !formData.Tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        Tags: [...prev.Tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      Tags: prev.Tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addCoworker = () => {
    const newCoworker: Coworker = {
      ShiftID: formData.ID,
      Name: '',
      Position: '',
      Location: formData.Location,
      StartTime: formData.StartTime,
      EndTime: formData.EndTime
    };
    setFormData(prev => ({
      ...prev,
      coworkers: [...prev.coworkers, newCoworker]
    }));
  };

  const updateCoworker = (index: number, field: keyof Coworker, value: string) => {
    setFormData(prev => ({
      ...prev,
      coworkers: prev.coworkers.map((coworker, i) =>
        i === index ? { ...coworker, [field]: value } : coworker
      )
    }));
  };

  const removeCoworker = (index: number) => {
    setFormData(prev => ({
      ...prev,
      coworkers: prev.coworkers.filter((_, i) => i !== index)
    }));
  };

  const addParty = () => {
    const newParty: Party = {
      ShiftID: formData.ID,
      Name: '',
      Type: '',
      Details: '',
      StartTime: '',
      EndTime: '',
      Bartenders: []
    };
    setFormData(prev => ({
      ...prev,
      parties: [...prev.parties, newParty]
    }));
  };

  const updateParty = (index: number, field: keyof Party, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      parties: prev.parties.map((party, i) =>
        i === index ? { ...party, [field]: value } : party
      )
    }));
  };

  const removeParty = (index: number) => {
    setFormData(prev => ({
      ...prev,
      parties: prev.parties.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {shift ? 'Edit Shift' : 'New Shift'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Shift Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Date
              </label>
              <input
                type="date"
                value={formData.Date}
                onChange={(e) => setFormData(prev => ({ ...prev, Date: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                Location
              </label>
              <input
                type="text"
                value={formData.Location}
                onChange={(e) => setFormData(prev => ({ ...prev, Location: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Restaurant/Bar name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                Start Time
              </label>
              <input
                type="time"
                value={formData.StartTime}
                onChange={(e) => setFormData(prev => ({ ...prev, StartTime: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                End Time
              </label>
              <input
                type="time"
                value={formData.EndTime}
                onChange={(e) => setFormData(prev => ({ ...prev, EndTime: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="w-4 h-4 inline mr-1" />
                Tips
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.Tips}
                onChange={(e) => setFormData(prev => ({ ...prev, Tips: parseFloat(e.target.value) || 0 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="w-4 h-4 inline mr-1" />
                Hourly Rate
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.HourlyRate}
                onChange={(e) => setFormData(prev => ({ ...prev, HourlyRate: parseFloat(e.target.value) || 0 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="15.00"
              />
            </div>
          </div>

          {/* Hours Display */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              <Clock className="w-4 h-4 inline mr-1" />
              Total Hours: <span className="font-semibold">{formData.Hours}</span>
            </p>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
            <textarea
              value={formData.Notes}
              onChange={(e) => setFormData(prev => ({ ...prev, Notes: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Any additional notes about the shift..."
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.Tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add a tag..."
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          {/* Coworkers */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                <Users className="w-5 h-5 inline mr-2" />
                Coworkers
              </h3>
              <button
                type="button"
                onClick={addCoworker}
                className="flex items-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Coworker
              </button>
            </div>
            
            <div className="space-y-3">
              {formData.coworkers.map((coworker, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-medium text-gray-900">Coworker {index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removeCoworker(index)}
                      className="text-red-600 hover:bg-red-100 p-1 rounded"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={coworker.Name}
                      onChange={(e) => updateCoworker(index, 'Name', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Name"
                    />
                    <input
                      type="text"
                      value={coworker.Position}
                      onChange={(e) => updateCoworker(index, 'Position', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Position"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Parties */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                <Users className="w-5 h-5 inline mr-2" />
                Parties/Events
              </h3>
              <button
                type="button"
                onClick={addParty}
                className="flex items-center px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Party
              </button>
            </div>
            
            <div className="space-y-3">
              {formData.parties.map((party, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-medium text-gray-900">Party {index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removeParty(index)}
                      className="text-red-600 hover:bg-red-100 p-1 rounded"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={party.Name}
                      onChange={(e) => updateParty(index, 'Name', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Party name"
                    />
                    <input
                      type="text"
                      value={party.Type}
                      onChange={(e) => updateParty(index, 'Type', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Party type"
                    />
                    <input
                      type="time"
                      value={party.StartTime}
                      onChange={(e) => updateParty(index, 'StartTime', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="time"
                      value={party.EndTime}
                      onChange={(e) => updateParty(index, 'EndTime', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <textarea
                      value={party.Details}
                      onChange={(e) => updateParty(index, 'Details', e.target.value)}
                      className="md:col-span-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Party details..."
                      rows={2}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              {shift ? 'Update Shift' : 'Save Shift'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}