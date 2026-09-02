export class Employee{

    public employeeName !: string; // typescript has very strict property initialization check
    public employeeAge !: number;
    public employeeSalary !: number;

    constructor(name: string, age: number, salary: number){
        this.employeeName = name;
        this.employeeAge = age;
        this.employeeSalary = salary;
    }

    public static isEmployed : boolean;

    static{
        Employee.isEmployed = true;
    }

    public work() : void{
        console.log(`${this.employeeName} is working.`);
    }

    public static payTax(): void{
        console.log("Paying taxes.");
    }

}

export function greeting(): void{
    console.log("Hello, TypeScript!");
}