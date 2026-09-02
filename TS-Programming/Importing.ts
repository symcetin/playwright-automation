import {Employee} from "./ClassAndObjects";

let employee1 = new Employee("Mary", 35, 100_000);

console.log(employee1);

employee1.work();

console.log(Employee.isEmployed);

Employee.payTax();
