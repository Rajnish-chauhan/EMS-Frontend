import React, { useState, useEffect } from 'react';
import { getEmployees, deleteEmployee } from './services/api';
import EmployeeForm from './EmployeeForm';

const EmployeeList = () => {
    const [employees, setEmployees] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('All Departments');
    const [managerFilter, setManagerFilter] = useState('All Managers');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 5;

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const response = await getEmployees();
            setEmployees(response.data);
        } catch (error) {
            console.error("Error fetching employees:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteEmployee(id);
            fetchEmployees();
        } catch (error) {
            console.error("Error deleting employee:", error);
        }
    };

    const handleEdit = (employee) => {
        setEditingEmployee(employee);
        setShowForm(true);
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setEditingEmployee(null);
    };


    const filteredEmployees = employees.filter(emp => {
        const searchLower = searchQuery.toLowerCase();
        const name = emp.fullName?.toLowerCase() || "";
        const code = emp.employeeCode?.toLowerCase() || "";

        const matchesSearch = name.includes(searchLower) || code.includes(searchLower);
        const matchesDept = departmentFilter === 'All Departments' || emp.department === departmentFilter;
        const matchesManager = managerFilter === 'All Managers' || emp.manager === managerFilter;

        let matchesDate = true;
        if (emp.joiningDate) {
            const empDate = new Date(emp.joiningDate);
            if (startDate && endDate) {
                matchesDate = empDate >= new Date(startDate) && empDate <= new Date(endDate);
            } else if (startDate) {
                matchesDate = empDate >= new Date(startDate);
            } else if (endDate) {
                matchesDate = empDate <= new Date(endDate);
            }
        }

        return matchesSearch && matchesDept && matchesManager && matchesDate;
    });


    const totalPages = Math.ceil(filteredEmployees.length / rowsPerPage);
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentEmployees = filteredEmployees.slice(indexOfFirstRow, indexOfLastRow);


    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, departmentFilter, managerFilter, startDate, endDate]);

  return (
      <div className="main-layout">
         {   /*  'container' is now 'main-layout' --- */}
            
          {  /* 'list-section' wraps the left side --- */}
            <div className="list-section">
                <div className="header">
                    <h2>Employees List</h2>
                    <button className="btn-primary" onClick={() => setShowForm(true)}>+ Add Employee</button>
                </div>

                <div className="filters">
                    <input
                        type="text"
                        placeholder="Search by Name or Code"
                        className="input-field"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />

                    <select
                        className="input-field"
                        value={departmentFilter}
                        onChange={(e) => setDepartmentFilter(e.target.value)}
                    >
                        <option value="All Departments">All Departments</option>
                        <option value="Sales">Sales</option>
                        <option value="HR">HR</option>
                        <option value="IT">IT</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Finance">Finance</option>
                        <option value="Operations">Operations</option>
                    </select>

                    <select
                        className="input-field"
                        value={managerFilter}
                        onChange={(e) => setManagerFilter(e.target.value)}
                    >
                        <option value="All Managers">All Managers</option>
                        <option value="Michael Lee">Michael Lee</option>
                        <option value="Sarah Miller">Sarah Miller</option>
                        <option value="David Clark">David Clark</option>
                    </select>

                    <div className="input-field" style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '5px 10px' }}>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            style={{ border: 'none', outline: 'none', background: 'transparent' }}
                            title="Joining Date (From)"
                        />
                        <span style={{ color: '#ccc' }}>-</span>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            style={{ border: 'none', outline: 'none', background: 'transparent' }}
                            title="To Date"
                        />
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Employee Name</th>
                                <th>Employee Code</th>
                                <th>Department</th>
                                <th>Manager</th>
                                <th>Joined Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentEmployees.map(emp => (
                                <tr key={emp.id}>
                                    <td className="text-blue">{emp.fullName}</td>
                                    <td>{emp.employeeCode}</td>
                                    <td>{emp.department}</td>
                                    <td>{emp.manager}</td>
                                    <td>{emp.joiningDate}</td>
                                    <td className="actions">
                                        <button className="btn-icon" onClick={() => handleEdit(emp)}>✏️ Edit</button>
                                        <button className="btn-icon text-red" onClick={() => handleDelete(emp.id)}>🗑️</button>
                                    </td>
                                </tr>
                            ))}
                            {currentEmployees.length === 0 && (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                                        No employees found matching your filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <div className="pagination">
                        <button
                            className="btn-outline"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => prev - 1)}
                        >
                            Previous
                        </button>

                        <div className="page-indicator">
                            <span className="page-current">{currentPage}</span>
                            <span className="page-total">of {totalPages}</span>
                        </div>

                        <button
                            className="btn-outline"
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => prev + 1)}
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>

            {/*The form stays inside main-layout but outside list-section --- */}
            {showForm && (
                <EmployeeForm
                    onClose={handleCloseForm}
                    onSave={fetchEmployees}
                    employeeToEdit={editingEmployee}
                />
            )}
        </div>
    );
};

export default EmployeeList;