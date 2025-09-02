import React, { useState } from 'react';
import { Shift } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { ShiftForm } from './components/ShiftForm';
import { ShiftCard } from './components/ShiftCard';
import { Dashboard } from './components/Dashboard';
import { Plus, BarChart3 } from 'lucide-react';

function App() {
  const [shifts, setShifts] = useLocalStorage<Shift[]>('bartending-shifts', []);
  const [showForm, setShowForm] = useState(false);
  const [editingShift, setEditingShift] = useState<Shift | undefined>();

  const handleSaveShift = (shiftData: Shift) => {
    if (editingShift) {
      setShifts(prev => prev.map(shift => 
        shift.ID === shiftData.ID ? shiftData : shift
      ));
    } else {
      setShifts(prev => [...prev, shiftData]);
    }
    setShowForm(false);
    setEditingShift(undefined);
  };

  const handleEditShift = (shift: Shift) => {
    setEditingShift(shift);
    setShowForm(true);
  };

  const handleDeleteShift = (shiftId: string) => {
    if (confirm('Are you sure you want to delete this shift?')) {
      setShifts(prev => prev.filter(shift => shift.ID !== shiftId));
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingShift(undefined);
  };

  const sortedShifts = [...shifts].sort((a, b) => 
    new Date(b.Date).getTime() - new Date(a.Date).getTime()
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <BarChart3 className="w-8 h-8 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Bartending Shift Tracker</h1>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Shift
          </button>
        </div>

        <Dashboard shifts={shifts} />

        {shifts.length === 0 ? (
          <div className="text-center py-12">
            <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No shifts recorded yet</h3>
            <p className="text-gray-500 mb-6">Start tracking your bartending shifts to see your earnings and hours.</p>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center mx-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Record Your First Shift
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedShifts.map((shift) => (
              <ShiftCard
                key={shift.ID}
                shift={shift}
                onEdit={handleEditShift}
                onDelete={handleDeleteShift}
              />
            ))}
          </div>
        )}

        {showForm && (
          <ShiftForm
            shift={editingShift}
            onSave={handleSaveShift}
            onCancel={handleCancel}
          />
        )}
      </div>
    </div>
  );
}

export default App;