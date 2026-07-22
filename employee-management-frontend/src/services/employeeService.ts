import type {
    Employee,
    EmployeeFormData
} from '../models/Employee'

const API_URL = 'http://localhost:8080/api/employees'

export async function getAllEmployees(): Promise<Employee[]> {
    const response = await fetch(API_URL)

    if (!response.ok) {
        throw new Error('Failed to retrieve employees')
    }

    return response.json()
}

export async function createEmployee(
    employee: EmployeeFormData
): Promise<Employee> {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(employee)
    })

    if (!response.ok) {
        throw new Error('Failed to create employee')
    }

    return response.json()
}

export async function deleteEmployee(
    id: number
): Promise<void> {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
    })

    if (!response.ok) {
        throw new Error('Failed to delete employee')
    }
}

export async function updateEmployee(
    id: number,
    employee: EmployeeFormData
): Promise<Employee> {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(employee)
    })

    if (!response.ok) {
        throw new Error('Failed to update employee')
    }

    return response.json()
}