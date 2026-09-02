class Item {
    private itemName !: string;
    private itemPrice !: number;

    // Constructor
    constructor(name: string, price: number) {
        this.setItemName(name);
        this.setItemPrice(price);
    }

    // Getter for itemName
    public getItemName(): string {
        return this.itemName;
    }

    // Setter for itemName
    public setItemName(name: string): void {
        this.itemName = name;
    }

    // Getter for itemPrice
    public getItemPrice(): number {
        return this.itemPrice;
    }

    // Setter for itemPrice
    public setItemPrice(price: number): void {
        if(price <=0){
            throw new Error("Item price must be greater than zero.");
        }
        this.itemPrice = price;
    }
}

let item1 = new Item("Pen", 2);

console.log(item1);

// console.log(item1.itemName);
// console.log(item1.itemPrice);
console.log(item1.getItemName());
console.log(item1.getItemPrice());

console.log("----------------------------------------------");

interface Volume{
    volume(): number;
}

abstract class Shape{
    public abstract area(): number;

    protected abstract perimeter(): number;
}

class Rectangle extends Shape{
    
    public width !: number;
    public length !: number;

    constructor(width: number, length: number){
        super();
        this.width = width;
        this.length = length;
    }

    public area(): number {
        return this.width * this.length;
    }
    public perimeter(): number {
        return 2 * (this.width + this.length);
    }
}

class Square extends Shape{

    public side !: number;

    constructor(side: number){
        super();
        this.side = side;
    }
    public area(): number {
        return this.side * this.side;
    }
    public perimeter(): number {
        return 4 * this.side;
    }

}

class Circle extends Shape{
    public radius !: number;

    constructor(radius: number){
        super();
        this.radius = radius;
    }
    public area(): number {
        return Math.PI * this.radius * this.radius;
    }
    public perimeter(): number {
        return 2 * Math.PI * this.radius;
    }
}

class Cube extends Shape implements Volume{
    public side !: number;

    constructor(side: number){
        super();
        this.side = side;
    }
    public area(): number {
        return 6 * this.side * this.side;
    }
    public perimeter(): number {
        return 12 * this.side;
    }
    public volume(): number {
        return this.side * this.side * this.side;
    }
}

class Cylinder extends Shape implements Volume{
    public radius !: number;
    public height !: number;

    constructor(radius: number, height: number){
        super();
        this.radius = radius;
        this.height = height;
    }
    public area(): number {
        return 2 * Math.PI * this.radius * (this.radius + this.height);
    }
    public perimeter(): number {
        return 2 * Math.PI * this.radius * this.height;
    }
    public volume(): number {
        return Math.PI * this.radius * this.radius * this.height;
    }
}


let rectangle = new Rectangle(5, 10);
let square = new Square(4);
let circle = new Circle(3);
let cube = new Cube(5);
let cylinder = new Cylinder(3, 5);

console.log(rectangle);
console.log(square);
console.log(circle);
console.log(cube);
console.log(cylinder);

console.log("------------------------------------------------");

let shape: Shape;

shape = new Rectangle(10, 20);
console.log(shape);


shape = new Square(15);
console.log(shape);


shape = new Circle(5);
console.log(shape);


shape = new Cube(10);
console.log(shape);


shape = new Cylinder(5, 10);
console.log(shape);

console.log("-------------------");

let shapes: Shape[] = [
    new Circle(5),
    new Square(5),
    new Cube(5),
    new Cylinder(5, 6),
    new Rectangle(5, 6)
];

console.log(shapes);



/*
Volume:
    volume();
Shape:
    area();
    perimeter();

Rectangle:
       width
       length

Square:
    side

Circle:
    radius

Cube:
    side

Cylinder:
    radius
    height
*/
