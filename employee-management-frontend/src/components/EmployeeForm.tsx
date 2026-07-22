import { useState } from 'react'
import type {
    ChangeEvent,
    SyntheticEvent
} from 'react'
import type {
    Employee,
    EmployeeFormData
} from '../models/Employee'
import {
    createEmployee,
    updateEmployee
} from '../services/employeeService'

interface EmployeeFormProps {
    employeeToEdit: Employee | null
    onEmployeeSaved: (employee: Employee) => void
    onCancelEdit: () => void
}

const initialFormData: EmployeeFormData = {
    firstName: '',
    lastName: '',
    email: '',
    department: '',
    jobTitle: '',
    salary: 0
}

function getInitialFormData(
    employee: Employee | null
): EmployeeFormData {
    if (!employee) {
        return initialFormData
    }

    return {
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
        department: employee.department,
        jobTitle: employee.jobTitle,
        salary: employee.salary
    }
}

function EmployeeForm({
                          employeeToEdit,
                          onEmployeeSaved,
                          onCancelEdit
                      }: EmployeeFormProps) {
    const [formData, setFormData] =
        useState<EmployeeFormData>(() =>
            getInitialFormData(employeeToEdit)
        )

    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')

    function handleInputChange(
        event: ChangeEvent<HTMLInputElement>
    ) {
        const { name, value } = event.target

        setFormData((currentData) => ({
            ...currentData,
            [name]: name === 'salary' ? Number(value) : value
        }))
    }

    async function handleSubmit(
        event: SyntheticEvent<HTMLFormElement>
    ) {
        event.preventDefault()
        setSubmitting(true)
        setError('')

        try {
            const savedEmployee = employeeToEdit
                ? await updateEmployee(employeeToEdit.id, formData)
                : await createEmployee(formData)

            onEmployeeSaved(savedEmployee)
            setFormData(initialFormData)
        } catch {
            setError(
                employeeToEdit
                    ? 'Unable to update employee'
                    : 'Unable to create employee'
            )
        } finally {
            setSubmitting(false)
        }
    }

    function handleCancel() {
        setFormData(initialFormData)
        setError('')
        onCancelEdit()
    }

    return (
        <form className="employee-form" onSubmit={handleSubmit}>
            <h2>
                {employeeToEdit ? 'Edit Employee' : 'Add Employee'}
            </h2>

            {error && <p className="error-message">{error}</p>}

            <div className="form-grid">
                <label>
                    First Name
                    <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                    />
                </label>

                <label>
                    Last Name
                    <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                    />
                </label>

                <label>
                    Email
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                    />
                </label>

                <label>
                    Department
                    <input
                        type="text"
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                    />
                </label>

                <label>
                    Job Title
                    <input
                        type="text"
                        name="jobTitle"
                        value={formData.jobTitle}
                        onChange={handleInputChange}
                    />
                </label>

                <label>
                    Salary
                    <input
                        type="number"
                        name="salary"
                        value={formData.salary}
                        onChange={handleInputChange}
                        min="1"
                        step="0.01"
                        required
                    />
                </label>
            </div>

            <div className="form-actions">
                <button type="submit" disabled={submitting}>
                    {submitting
                        ? 'Saving...'
                        : employeeToEdit
                            ? 'Update Employee'
                            : 'Add Employee'}
                </button>

                {employeeToEdit && (
                    <button
                        type="button"
                        className="cancel-button"
                        onClick={handleCancel}
                    >
                        Cancel
                    </button>
                )}
            </div>
        </form>
    )
}

export default EmployeeForm