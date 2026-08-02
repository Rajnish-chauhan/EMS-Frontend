import axios from 'axios';
const API_URL = 'https://ems-backend-vqa1.onrender.com'; 
export const getEmployees = () => axios.get(API_URL);
export const createEmployee = (employee) => axios.post(API_URL, employee);
export const deleteEmployee = (id) => axios.delete(`${API_URL}/${id}`);
export const updateEmployee = (id, employee) => axios.put(`${API_URL}/${id}`, employee);