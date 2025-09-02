<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Bartending Shift Tracker</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }

        .header {
            background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }

        .header h1 {
            font-size: 2.5rem;
            font-weight: 300;
            margin-bottom: 10px;
        }

        .header p {
            opacity: 0.9;
            font-size: 1.1rem;
        }

        .content {
            padding: 30px;
        }

        .controls {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
            flex-wrap: wrap;
            gap: 15px;
        }

        .btn {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
            font-weight: 500;
            transition: all 0.3s ease;
            text-decoration: none;
            display: inline-block;
        }

        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
        }

        .btn-danger {
            background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
        }

        .btn-danger:hover {
            box-shadow: 0 8px 20px rgba(231, 76, 60, 0.3);
        }

        .btn-edit {
            background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%);
            padding: 8px 16px;
            font-size: 14px;
        }

        .btn-edit:hover {
            box-shadow: 0 6px 15px rgba(243, 156, 18, 0.3);
        }

        .btn-delete {
            background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
            padding: 8px 16px;
            font-size: 14px;
        }

        .table-container {
            overflow-x: auto;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        table {
            width: 100%;
            border-collapse: collapse;
            background: white;
        }

        th {
            background: linear-gradient(135deg, #34495e 0%, #2c3e50 100%);
            color: white;
            padding: 15px 12px;
            text-align: left;
            font-weight: 600;
            border-bottom: 3px solid #667eea;
        }

        td {
            padding: 15px 12px;
            border-bottom: 1px solid #ecf0f1;
            transition: background-color 0.2s ease;
        }

        tr:hover {
            background-color: #f8f9fa;
        }

        tr:nth-child(even) {
            background-color: #fdfdfd;
        }

        tr:nth-child(even):hover {
            background-color: #f0f0f0;
        }

        .modal {
            display: none;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(4px);
        }

        .modal-content {
            background-color: white;
            margin: 5% auto;
            padding: 0;
            border-radius: 12px;
            width: 90%;
            max-width: 600px;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
            animation: modalSlideIn 0.3s ease-out;
        }

        @keyframes modalSlideIn {
            from {
                opacity: 0;
                transform: translateY(-50px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .modal-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px 30px;
            border-radius: 12px 12px 0 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .modal-header h2 {
            font-size: 1.5rem;
            font-weight: 500;
        }

        .close {
            color: white;
            font-size: 28px;
            font-weight: bold;
            cursor: pointer;
            line-height: 1;
            transition: opacity 0.2s ease;
        }

        .close:hover {
            opacity: 0.7;
        }

        .modal-body {
            padding: 30px;
        }

        .form-group {
            margin-bottom: 20px;
        }

        .form-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
            color: #2c3e50;
            font-size: 14px;
        }

        .form-group input,
        .form-group textarea {
            width: 100%;
            padding: 12px;
            border: 2px solid #ecf0f1;
            border-radius: 8px;
            font-size: 16px;
            transition: border-color 0.3s ease;
        }

        .form-group input:focus,
        .form-group textarea:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .form-group textarea {
            resize: vertical;
            min-height: 80px;
        }

        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
        }

        .modal-footer {
            padding: 20px 30px;
            background: #f8f9fa;
            border-radius: 0 0 12px 12px;
            display: flex;
            justify-content: flex-end;
            gap: 10px;
        }

        .btn-secondary {
            background: #6c757d;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            transition: background-color 0.2s ease;
        }

        .btn-secondary:hover {
            background: #5a6268;
        }

        .loading {
            display: none;
            text-align: center;
            padding: 40px;
            color: #6c757d;
        }

        .empty-state {
            text-align: center;
            padding: 60px 20px;
            color: #6c757d;
        }

        .empty-state h3 {
            font-size: 1.5rem;
            margin-bottom: 10px;
            color: #495057;
        }

        .actions {
            display: flex;
            gap: 8px;
        }

        .currency {
            color: #27ae60;
            font-weight: 600;
        }

        .hours {
            color: #3498db;
            font-weight: 600;
        }

        .error-message {
            background-color: #f8d7da;
            color: #721c24;
            padding: 12px;
            border-radius: 6px;
            margin-bottom: 20px;
            border: 1px solid #f5c6cb;
        }

        .success-message {
            background-color: #d4edda;
            color: #155724;
            padding: 12px;
            border-radius: 6px;
            margin-bottom: 20px;
            border: 1px solid #c3e6cb;
        }

        .debug-info {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 6px;
            margin: 20px 0;
            font-family: monospace;
            font-size: 12px;
            border: 1px solid #dee2e6;
            display: none;
        }

        @media (max-width: 768px) {
            .controls {
                flex-direction: column;
                align-items: stretch;
            }

            .form-row {
                grid-template-columns: 1fr;
            }

            .modal-content {
                margin: 10% auto;
                width: 95%;
            }

            .header h1 {
                font-size: 2rem;
            }

            th, td {
                padding: 10px 8px;
                font-size: 14px;
            }

            .actions {
                flex-direction: column;
                gap: 5px;
            }

            .btn-edit, .btn-delete {
                padding: 6px 12px;
                font-size: 12px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🍸 Bartending Shift Tracker</h1>
            <p>Track your shifts, tips, and earnings</p>
        </div>
        
        <div class="content">
            <div class="controls">
                <div>
                    <strong id="totalShifts">0 shifts tracked</strong>
                </div>
                <div>
                    <button class="btn" onclick="loadShifts()">🔄 Refresh Data</button>
                    <button class="btn" onclick="openAddModal()">+ Add New Shift</button>
                </div>
            </div>

            <div id="errorContainer"></div>
            <div id="successContainer"></div>

            <div class="debug-info" id="debugInfo">
                <h4>Debug Information:</h4>
                <div id="debugContent"></div>
            </div>

            <div class="loading" id="loading">
                <p>Loading shifts...</p>
            </div>

            <div class="table-container" id="tableContainer" style="display: none;">
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Hours</th>
                            <th>Location</th>
                            <th>Tips</th>
                            <th>Tips/Hour</th>
                            <th>Notes</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="shiftsTableBody">
                    </tbody>
                </table>
            </div>

            <div class="empty-state" id="emptyState" style="display: none;">
                <h3>No shifts tracked yet</h3>
                <p>Click "Add New Shift" to get started tracking your bartending shifts</p>
                <br>
                <button class="btn" onclick="testGoogleScript()">🔧 Test Connection</button>
            </div>
        </div>
    </div>

    <!-- Modal for Add/Edit Shift -->
    <div id="shiftModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h2 id="modalTitle">Add New Shift</h2>
                <span class="close" onclick="closeModal()">&times;</span>
            </div>
            <div class="modal-body">
                <form id="shiftForm">
                    <input type="hidden" id="shiftId" value="">
                    
                    <div class="form-group">
                        <label for="shiftDate">Date</label>
                        <input type="date" id="shiftDate" required>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="startTime">Start Time</label>
                            <input type="time" id="startTime" required>
                        </div>
                        <div class="form-group">
                            <label for="endTime">End Time</label>
                            <input type="time" id="endTime" required>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="tips">Tips ($)</label>
                            <input type="number" id="tips" step="0.01" min="0" required>
                        </div>
                        <div class="form-group">
                            <label for="location">Location</label>
                            <input type="text" id="location" required>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="notes">Notes</label>
                        <textarea id="notes" placeholder="Any additional notes about the shift..."></textarea>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn-secondary" onclick="closeModal()">Cancel</button>
                <button type="button" class="btn" onclick="saveShift()">Save Shift</button>
            </div>
        </div>
    </div>

    <script>
        let shifts = [];
        let editingShiftId = null;
        let isGoogleAppsScript = false;

        // Initialize the app
        document.addEventListener('DOMContentLoaded', function() {
            // Check if we're running in Google Apps Script environment
            isGoogleAppsScript = (typeof google !== 'undefined' && google.script && google.script.run);
            
            debugLog('App initialized. Google Apps Script available: ' + isGoogleAppsScript);
            loadShifts();
        });

        function debugLog(message) {
            console.log('[Debug] ' + message);
            const debugContent = document.getElementById('debugContent');
            if (debugContent) {
                debugContent.innerHTML += '<div>' + new Date().toLocaleTimeString() + ': ' + message + '</div>';
            }
        }

        function showError(message) {
            const container = document.getElementById('errorContainer');
            container.innerHTML = '<div class="error-message">' + message + '</div>';
            setTimeout(() => {
                container.innerHTML = '';
            }, 5000);
        }

        function showSuccess(message) {
            const container = document.getElementById('successContainer');
            container.innerHTML = '<div class="success-message">' + message + '</div>';
            setTimeout(() => {
                container.innerHTML = '';
            }, 3000);
        }

        function toggleDebug() {
            const debugInfo = document.getElementById('debugInfo');
            debugInfo.style.display = debugInfo.style.display === 'none' ? 'block' : 'none';
        }

        function loadShifts() {
            document.getElementById('loading').style.display = 'block';
            document.getElementById('tableContainer').style.display = 'none';
            document.getElementById('emptyState').style.display = 'none';

            debugLog('Starting loadShifts()');
            
            try {
                if (isGoogleAppsScript) {
                    debugLog('Calling getAllShifts via Google Apps Script');
                    google.script.run
                        .withSuccessHandler(function(data) {
                            debugLog('getAllShifts success: ' + JSON.stringify(data));
                            onShiftsLoaded(data);
                        })
                        .withFailureHandler(function(error) {
                            debugLog('getAllShifts error: ' + JSON.stringify(error));
                            onError(error);
                        })
                        .getAllShifts();
                } else {
                    debugLog('Google Apps Script not available, using mock data');
                    // For testing purposes, use mock data
                    setTimeout(() => {
                        const mockData = [
                            {
                                id: 'mock1',
                                date: '2025-01-15',
                                startTime: '18:00',
                                endTime: '02:00',
                                hours: 8,
                                location: 'Downtown Bar',
                                tips: 150.75,
                                tipsPerHour: 18.84,
                                notes: 'Busy Friday night'
                            }
                        ];
                        onShiftsLoaded(mockData);
                    }, 1000);
                }
            } catch (error) {
                debugLog('Exception in loadShifts: ' + error.message);
                onError(error);
            }
        }

        function onShiftsLoaded(data) {
            debugLog('onShiftsLoaded called with data type: ' + typeof data);
            debugLog('Data is array: ' + Array.isArray(data));
            debugLog('Data length: ' + (data ? data.length : 'null/undefined'));
            
            // Ensure data is an array
            if (!Array.isArray(data)) {
                debugLog('Data is not an array, converting...');
                data = data ? [data] : [];
            }
            
            shifts = data;
            debugLog('Processed shifts array length: ' + shifts.length);
            
            document.getElementById('loading').style.display = 'none';
            
            if (shifts.length === 0) {
                debugLog('No shifts found, showing empty state');
                document.getElementById('emptyState').style.display = 'block';
                document.getElementById('tableContainer').style.display = 'none';
            } else {
                debugLog('Shifts found, rendering table');
                document.getElementById('emptyState').style.display = 'none';
                document.getElementById('tableContainer').style.display = 'block';
                renderShiftsTable();
            }
            
            updateStats();
        }

        function renderShiftsTable() {
            debugLog('Rendering table with ' + shifts.length + ' shifts');
            const tbody = document.getElementById('shiftsTableBody');
            tbody.innerHTML = '';

            shifts.forEach((shift, index) => {
                debugLog('Rendering shift ' + index + ': ' + JSON.stringify(shift));
                
                const row = tbody.insertRow();
                
                // Safely handle data that might be null/undefined
                const date = shift.date || '';
                const startTime = shift.startTime || '';
                const endTime = shift.endTime || '';
                const location = shift.location || '';
                const tips = parseFloat(shift.tips) || 0;
                const notes = shift.notes || '';
                
                // Calculate hours and tips per hour
                let hours = parseFloat(shift.hours) || 0;
                let tipsPerHour = parseFloat(shift.tipsPerHour) || 0;
                
                // Recalculate if not provided
                if (hours === 0 && startTime && endTime) {
                    const startDateTime = new Date(`${date}T${startTime}`);
                    const endDateTime = new Date(`${date}T${endTime}`);
                    
                    // Handle shifts that end past midnight
                    if (endDateTime < startDateTime) {
                        endDateTime.setDate(endDateTime.getDate() + 1);
                    }
                    
                    hours = (endDateTime - startDateTime) / (1000 * 60 * 60);
                    tipsPerHour = hours > 0 ? (tips / hours) : 0;
                }

                row.innerHTML = `
                    <td>${formatDate(date)}</td>
                    <td>${formatTime(startTime)}</td>
                    <td>${formatTime(endTime)}</td>
                    <td class="hours">${hours.toFixed(1)}h</td>
                    <td>${location}</td>
                    <td class="currency">${tips.toFixed(2)}</td>
                    <td class="currency">${tipsPerHour.toFixed(2)}</td>
                    <td>${notes || '-'}</td>
                    <td>
                        <div class="actions">
                            <button class="btn-edit" onclick="editShift('${shift.id}')">Edit</button>
                            <button class="btn-delete" onclick="deleteShift('${shift.id}')">Delete</button>
                        </div>
                    </td>
                `;
            });
        }

        function updateStats() {
            const totalShifts = shifts.length;
            const totalTips = shifts.reduce((sum, shift) => sum + (parseFloat(shift.tips) || 0), 0);
            const totalHours = shifts.reduce((sum, shift) => sum + (parseFloat(shift.hours) || 0), 0);
            
            document.getElementById('totalShifts').innerHTML = 
                `${totalShifts} shift${totalShifts !== 1 ? 's' : ''} tracked<br>
                <small>${totalTips.toFixed(2)} total tips | ${totalHours.toFixed(1)} hours</small>`;
        }

        function openAddModal() {
            editingShiftId = null;
            document.getElementById('modalTitle').textContent = 'Add New Shift';
            document.getElementById('shiftForm').reset();
            document.getElementById('shiftId').value = '';
            
            // Set default date to today
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('shiftDate').value = today;
            
            document.getElementById('shiftModal').style.display = 'block';
        }

        function editShift(id) {
            debugLog('Editing shift with ID: ' + id);
            const shift = shifts.find(s => s.id === id);
            if (!shift) {
                showError('Shift not found');
                return;
            }

            editingShiftId = id;
            document.getElementById('modalTitle').textContent = 'Edit Shift';
            document.getElementById('shiftId').value = id;
            document.getElementById('shiftDate').value = shift.date;
            document.getElementById('startTime').value = shift.startTime;
            document.getElementById('endTime').value = shift.endTime;
            document.getElementById('tips').value = shift.tips;
            document.getElementById('location').value = shift.location;
            document.getElementById('notes').value = shift.notes || '';
            
            document.getElementById('shiftModal').style.display = 'block';
        }

        function closeModal() {
            document.getElementById('shiftModal').style.display = 'none';
            editingShiftId = null;
        }

        function saveShift() {
            const form = document.getElementById('shiftForm');
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }

            const shiftData = {
                id: document.getElementById('shiftId').value || generateId(),
                date: document.getElementById('shiftDate').value,
                startTime: document.getElementById('startTime').value,
                endTime: document.getElementById('endTime').value,
                tips: parseFloat(document.getElementById('tips').value),
                location: document.getElementById('location').value,
                notes: document.getElementById('notes').value
            };

            debugLog('Saving shift: ' + JSON.stringify(shiftData));

            try {
                if (isGoogleAppsScript) {
                    const operation = editingShiftId ? 'updateShift' : 'addShift';
                    debugLog('Calling ' + operation + ' via Google Apps Script');
                    
                    google.script.run
                        .withSuccessHandler(function(result) {
                            debugLog('Save success: ' + JSON.stringify(result));
                            onShiftSaved();
                        })
                        .withFailureHandler(function(error) {
                            debugLog('Save error: ' + JSON.stringify(error));
                            onError(error);
                        })
                        [operation](shiftData);
                } else {
                    debugLog('Google Apps Script not available, simulating save');
                    // Add to local array for testing
                    if (editingShiftId) {
                        const index = shifts.findIndex(s => s.id === editingShiftId);
                        if (index !== -1) {
                            shifts[index] = shiftData;
                        }
                    } else {
                        shifts.push(shiftData);
                    }
                    setTimeout(() => onShiftSaved(), 500);
                }
            } catch (error) {
                debugLog('Exception in saveShift: ' + error.message);
                onError(error);
            }
        }

        function onShiftSaved() {
            debugLog('Shift saved successfully');
            showSuccess('Shift saved successfully!');
            closeModal();
            loadShifts();
        }

        function deleteShift(id) {
            if (confirm('Are you sure you want to delete this shift?')) {
                debugLog('Deleting shift: ' + id);
                
                try {
                    if (isGoogleAppsScript) {
                        google.script.run
                            .withSuccessHandler(function(result) {
                                debugLog('Delete success: ' + JSON.stringify(result));
                                onShiftDeleted();
                            })
                            .withFailureHandler(function(error) {
                                debugLog('Delete error: ' + JSON.stringify(error));
                                onError(error);
                            })
                            .deleteShift(id);
                    } else {
                        debugLog('Google Apps Script not available, simulating delete');
                        // Remove from local array for testing
                        shifts = shifts.filter(s => s.id !== id);
                        setTimeout(() => onShiftDeleted(), 500);
                    }
                } catch (error) {
                    debugLog('Exception in deleteShift: ' + error.message);
                    onError(error);
                }
            }
        }

        function onShiftDeleted() {
            debugLog('Shift deleted successfully');
            showSuccess('Shift deleted successfully!');
            loadShifts();
        }

        function onError(error) {
            debugLog('Error occurred: ' + JSON.stringify(error));
            const errorMessage = error.message || error.toString() || 'An unknown error occurred';
            showError('Error: ' + errorMessage);
            document.getElementById('loading').style.display = 'none';
        }

        function testGoogleScript() {
            debugLog('Testing Google Apps Script connection...');
            
            if (!isGoogleAppsScript) {
                showError('Google Apps Script not available in this environment');
                return;
            }

            try {
                google.script.run
                    .withSuccessHandler(function(result) {
                        debugLog('Test success: ' + JSON.stringify(result));
                        showSuccess('Connection successful! ' + JSON.stringify(result));
                        loadShifts();
                    })
                    .withFailureHandler(function(error) {
                        debugLog('Test error: ' + JSON.stringify(error));
                        showError('Connection failed: ' + (error.message || error.toString()));
                    })
                    .testSetup();
            } catch (error) {
                debugLog('Exception in testGoogleScript: ' + error.message);
                onError(error);
            }
        }

        function formatDate(dateString) {
            if (!dateString) return '-';
            try {
                const date = new Date(dateString);
                return date.toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    month: 'short', 
                    day: 'numeric' 
                });
            } catch (e) {
                return dateString;
            }
        }

        function formatTime(timeString) {
            if (!timeString) return '-';
            try {
                const [hours, minutes] = timeString.split(':');
                const date = new Date();
                date.setHours(parseInt(hours), parseInt(minutes));
                return date.toLocaleTimeString('en-US', { 
                    hour: 'numeric', 
                    minute: '2-digit',
                    hour12: true 
                });
            } catch (e) {
                return timeString;
            }
        }

        function generateId() {
            return 'shift_' + Date.now().toString() + '_' + Math.random().toString(36).substr(2, 9);
        }

        // Close modal when clicking outside
        window.onclick = function(event) {
            const modal = document.getElementById('shiftModal');
            if (event.target === modal) {
                closeModal();
            }
        }

        // Handle escape key
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                closeModal();
            }
        });

        // Enable debug mode with Ctrl+D
        document.addEventListener('keydown', function(event) {
            if (event.ctrlKey && event.key === 'd') {
                event.preventDefault();
                toggleDebug();
            }
        });
    </script>
</body>
</html>
