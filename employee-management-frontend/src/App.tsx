import { useEffect, useState } from 'react'
import './App.css'
import EmployeeForm from './components/EmployeeForm'
import type { Employee } from './models/Employee'
import {
    deleteEmployee,
    getAllEmployees
} from './services/employeeService'

type SortOption =
    | 'name-asc'
    | 'name-desc'
    | 'department-asc'
    | 'salary-asc'
    | 'salary-desc'

function App() {
    const [employees, setEmployees] = useState<Employee[]>([])

    const [editingEmployee, setEditingEmployee] =
        useState<Employee | null>(null)

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [searchTerm, setSearchTerm] = useState('')

    const [sortOption, setSortOption] =
        useState<SortOption>('name-asc')

    const normalizedSearch = searchTerm.trim().toLowerCase()

    const filteredEmployees = employees.filter((employee) => {
        const searchableEmployee = [
            employee.firstName,
            employee.lastName,
            employee.email,
            employee.department,
            employee.jobTitle
        ]
            .join(' ')
            .toLowerCase()

        return searchableEmployee.includes(normalizedSearch)
    })

    const sortedEmployees = [...filteredEmployees].sort(
        (firstEmployee, secondEmployee) => {
            switch (sortOption) {
                case 'name-desc':
                    return secondEmployee.firstName.localeCompare(
                        firstEmployee.firstName
                    )

                case 'department-asc':
                    return firstEmployee.department.localeCompare(
                        secondEmployee.department
                    )

                case 'salary-asc':
                    return firstEmployee.salary - secondEmployee.salary

                case 'salary-desc':
                    return secondEmployee.salary - firstEmployee.salary

                case 'name-asc':
                default:
                    return firstEmployee.firstName.localeCompare(
                        secondEmployee.firstName
                    )
            }
        }
    )

    useEffect(() => {
        async function loadEmployees() {
            try {
                const employeeData = await getAllEmployees()
                setEmployees(employeeData)
            } catch {
                setError('Unable to load employees')
            } finally {
                setLoading(false)
            }
        }

        loadEmployees()
    }, [])

    function handleEmployeeSaved(savedEmployee: Employee) {
        setEmployees((currentEmployees) => {
            const employeeExists = currentEmployees.some(
                (employee) => employee.id === savedEmployee.id
            )

            if (employeeExists) {
                return currentEmployees.map((employee) =>
                    employee.id === savedEmployee.id
                        ? savedEmployee
                        : employee
                )
            }

            return [...currentEmployees, savedEmployee]
        })

        setEditingEmployee(null)
        setError('')
    }

    function handleEditEmployee(employee: Employee) {
        setEditingEmployee(employee)

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }

    async function handleDeleteEmployee(id: number) {
        const confirmed = window.confirm(
            'Are you sure you want to delete this employee?'
        )

        if (!confirmed) {
            return
        }

        try {
            await deleteEmployee(id)

            setEmployees((currentEmployees) =>
                currentEmployees.filter(
                    (employee) => employee.id !== id
                )
            )

            if (editingEmployee?.id === id) {
                setEditingEmployee(null)
            }

            setError('')
        } catch {
            setError('Unable to delete employee')
        }
    }

    return (
        <div>
            <header className="app-header">
                <h1>Employee Management Portal</h1>
                <p>
                    Manage employee records using React and Spring Boot
                </p>
            </header>

            <main className="app-content">
                <EmployeeForm
                    key={editingEmployee?.id ?? 'new'}
                    employeeToEdit={editingEmployee}
                    onEmployeeSaved={handleEmployeeSaved}
                    onCancelEdit={() => setEditingEmployee(null)}
                />

                <section className="employee-section">
                    <div className="employee-section-header">
                        <h2>Employees</h2>

                        <div className="list-controls">
                            <input
                                className="search-input"
                                type="search"
                                placeholder="Search employees..."
                                value={searchTerm}
                                onChange={(event) =>
                                    setSearchTerm(event.target.value)
                                }
                            />

                            <select
                                className="sort-select"
                                value={sortOption}
                                onChange={(event) =>
                                    setSortOption(
                                        event.target.value as SortOption
                                    )
                                }
                            >
                                <option value="name-asc">
                                    Name: A–Z
                                </option>

                                <option value="name-desc">
                                    Name: Z–A
                                </option>

                                <option value="department-asc">
                                    Department: A–Z
                                </option>

                                <option value="salary-asc">
                                    Salary: Low to High
                                </option>

                                <option value="salary-desc">
                                    Salary: High to Low
                                </option>
                            </select>
                        </div>
                    </div>

                    {loading && <p>Loading employees...</p>}

                    {error && (
                        <p className="error-message">{error}</p>
                    )}

                    {!loading && !error && employees.length === 0 && (
                        <p>No employees found.</p>
                    )}

                    {!loading &&
                        !error &&
                        employees.length > 0 &&
                        filteredEmployees.length === 0 && (
                            <p>No employees match your search.</p>
                        )}

                    {!loading &&
                        !error &&
                        sortedEmployees.length > 0 && (
                            <div className="table-container">
                                <table className="employee-table">
                                    <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Department</th>
                                        <th>Job Title</th>
                                        <th>Salary</th>
                                        <th>Actions</th>
                                    </tr>
                                    </thead>

                                    <tbody>
                                    {sortedEmployees.map((employee) => (
                                        <tr key={employee.id}>
                                            <td>
                                                {employee.firstName}{' '}
                                                {employee.lastName}
                                            </td>

                                            <td>{employee.email}</td>

                                            <td>{employee.department}</td>

                                            <td>{employee.jobTitle}</td>

                                            <td>
                                                ${employee.salary.toLocaleString()}
                                            </td>

                                            <td>
                                                <div className="table-actions">
                                                    <button
                                                        className="edit-button"
                                                        onClick={() =>
                                                            handleEditEmployee(employee)
                                                        }
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        className="delete-button"
                                                        onClick={() =>
                                                            handleDeleteEmployee(
                                                                employee.id
                                                            )
                                                        }
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                </section>
            </main>
        </div>
    )
}

export default App