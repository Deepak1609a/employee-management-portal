export interface Employee {
    id: number
    firstName: string
    lastName: string
    email: string
    department: string
    jobTitle: string
    salary: number
}

export type EmployeeFormData = Omit<Employee, 'id'>