
export function addition(a: number, b:number, c: number = 0): number{
    return a + b + c;
}

// addition();
// addition("100", "200");

let result1 = addition(10, 20);

console.log(result1);

let result2 = addition(10, 20, 30);

console.log(result2);