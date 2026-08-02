import React, { useState, useEffect } from 'react';
import { createEmployee, updateEmployee } from './services/api';


const EmployeeForm = ({ onClose, onSave, employeeToEdit }) => {
    const [employee, setEmployee] = useState({
        fullName: '', employeeCode: '', department: '',
        manager: '', joiningDate: '', email: '', phone: ''
    });

    useEffect(() => {
        if (employeeToEdit) {
            setEmployee(employeeToEdit);
        }
    }, [employeeToEdit]);

    const handleChange = (e) => {
        setEmployee({ ...employee, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {

            if (employeeToEdit && employeeToEdit.id) {
                await updateEmployee(employeeToEdit.id, employee);
            } else {
                await createEmployee(employee);
            }
            onSave();
            onClose();
        } catch (error) {
            console.error("Error saving employee:", error);
        }
    };
return (
        
        <div className="form-section">
            <div className="modal-header">
                <h3>{employeeToEdit ? "Edit Employee" : "Add Employee"}</h3>
                <button className="close-btn" onClick={onClose}>✕</button>
            </div>
            <form onSubmit={handleSubmit} className="form-layout">

                <div className="form-group">
                    <label>Full Name</label>
                    <input type="text" name="fullName" className="input-field" value={employee.fullName} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label>Employee Code</label>
                    <input type="text" name="employeeCode" className="input-field" value={employee.employeeCode} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label>Department</label>
                    <select name="department" className="input-field" value={employee.department} onChange={handleChange} required>
                        <option value="">Select Department</option>
                        <option value="Sales">Sales</option>
                        <option value="HR">HR</option>
                        <option value="IT">IT</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Finance">Finance</option>
                        <option value="Operations">Operations</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Manager</label>
                    <select name="manager" className="input-field" value={employee.manager} onChange={handleChange} required>
                        <option value="">Select Manager</option>
                        <option value="Michael Lee">Michael Lee</option>
                        <option value="Sarah Miller">Sarah Miller</option>
                        <option value="David Clark">David Clark</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Joining Date</label>
                    <input type="date" name="joiningDate" className="input-field" value={employee.joiningDate} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label>Email Address</label>
                    <input type="email" name="email" className="input-field" value={employee.email} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label>Phone Number</label>
                    <input type="text" name="phone" className="input-field" value={employee.phone} onChange={handleChange} required />
                </div>

                <div className="form-actions">
                    <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
                    <button type="submit" className="btn-primary">
                        {employeeToEdit ? "Update Employee" : "Save Employee"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EmployeeForm;