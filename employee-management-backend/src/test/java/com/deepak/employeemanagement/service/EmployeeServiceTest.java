package com.deepak.employeemanagement.service;

import com.deepak.employeemanagement.entity.Employee;
import com.deepak.employeemanagement.repository.EmployeeRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import com.deepak.employeemanagement.exception.DuplicateEmailException;

import com.deepak.employeemanagement.exception.ResourceNotFoundException;
import java.util.Optional;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EmployeeServiceTest {

    @Mock
    private EmployeeRepository employeeRepository;

    @InjectMocks
    private EmployeeService employeeService;

    @Test
    void createEmployee_whenEmailDoesNotExist_shouldSaveEmployee() {
        Employee employeeToCreate = new Employee(
                null,
                "Deepak",
                "Alikatte",
                "deepak@example.com",
                "Engineering",
                "Java Developer",
                new BigDecimal("85000.00")
        );

        Employee savedEmployee = new Employee(
                1L,
                "Deepak",
                "Alikatte",
                "deepak@example.com",
                "Engineering",
                "Java Developer",
                new BigDecimal("85000.00")
        );

        when(employeeRepository.existsByEmail(employeeToCreate.getEmail()))
                .thenReturn(false);

        when(employeeRepository.save(employeeToCreate))
                .thenReturn(savedEmployee);

        Employee result =
                employeeService.createEmployee(employeeToCreate);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Deepak", result.getFirstName());
        assertEquals("deepak@example.com", result.getEmail());

        verify(employeeRepository)
                .existsByEmail("deepak@example.com");

        verify(employeeRepository).save(employeeToCreate);
    }
    @Test
    void createEmployee_whenEmailAlreadyExists_shouldThrowException() {
        Employee employee = new Employee(
                null,
                "Deepak",
                "Alikatte",
                "deepak@example.com",
                "Engineering",
                "Java Developer",
                new BigDecimal("85000.00")
        );

        when(employeeRepository.existsByEmail(employee.getEmail()))
                .thenReturn(true);

        DuplicateEmailException exception = assertThrows(
                DuplicateEmailException.class,
                () -> employeeService.createEmployee(employee)
        );

        assertEquals(
                "An employee with this email already exists",
                exception.getMessage()
        );

        verify(employeeRepository)
                .existsByEmail("deepak@example.com");

        verify(employeeRepository, never())
                .save(any(Employee.class));
    }

    @Test
    void getEmployeeById_whenEmployeeExists_shouldReturnEmployee() {
        Employee employee = new Employee(
                1L,
                "Deepak",
                "Alikatte",
                "deepak@example.com",
                "Engineering",
                "Java Developer",
                new BigDecimal("85000.00")
        );

        when(employeeRepository.findById(1L))
                .thenReturn(Optional.of(employee));

        Employee result = employeeService.getEmployeeById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Deepak", result.getFirstName());

        verify(employeeRepository).findById(1L);
    }

    @Test
    void getEmployeeById_whenEmployeeDoesNotExist_shouldThrowException() {
        when(employeeRepository.findById(999L))
                .thenReturn(Optional.empty());

        ResourceNotFoundException exception = assertThrows(
                ResourceNotFoundException.class,
                () -> employeeService.getEmployeeById(999L)
        );

        assertEquals(
                "Employee not found with ID: 999",
                exception.getMessage()
        );

        verify(employeeRepository).findById(999L);
    }

    @Test
    void updateEmployee_whenEmployeeExists_shouldUpdateEmployee() {
        Employee existingEmployee = new Employee(
                1L,
                "Deepak",
                "Alikatte",
                "deepak@example.com",
                "Engineering",
                "Java Developer",
                new BigDecimal("85000.00")
        );

        Employee updatedInformation = new Employee(
                null,
                "Deepak",
                "Alikatte",
                "deepak@example.com",
                "Technology",
                "Senior Java Developer",
                new BigDecimal("95000.00")
        );

        when(employeeRepository.findById(1L))
                .thenReturn(Optional.of(existingEmployee));

        when(employeeRepository.findByEmail(
                updatedInformation.getEmail()
        )).thenReturn(Optional.empty());

        when(employeeRepository.save(existingEmployee))
                .thenReturn(existingEmployee);

        Employee result = employeeService.updateEmployee(
                1L,
                updatedInformation
        );

        assertEquals("Technology", result.getDepartment());
        assertEquals(
                "Senior Java Developer",
                result.getJobTitle()
        );
        assertEquals(
                new BigDecimal("95000.00"),
                result.getSalary()
        );

        verify(employeeRepository).findById(1L);
        verify(employeeRepository)
                .findByEmail("deepak@example.com");
        verify(employeeRepository).save(existingEmployee);
    }

    @Test
    void deleteEmployee_whenEmployeeExists_shouldDeleteEmployee() {
        Employee employee = new Employee(
                1L,
                "Deepak",
                "Alikatte",
                "deepak@example.com",
                "Engineering",
                "Java Developer",
                new BigDecimal("85000.00")
        );

        when(employeeRepository.findById(1L))
                .thenReturn(Optional.of(employee));

        employeeService.deleteEmployee(1L);

        verify(employeeRepository).findById(1L);
        verify(employeeRepository).delete(employee);
    }
}