class Person{
    constructor(name, birthDate){
        this.name = name;
        this.birthDate = birthDate;
    }
    static compareBirthDate (personA, personB){
        return personA.birthDate - personB.birthDate;
    }
}

let firstPerson = new Person("John", new Date(2003, 4, 13));
let secondPerson = new Person("Kelly", new Date(2003, 4, 13));

if(Person.compareBirthDate(firstPerson, secondPerson) < 0){
    console.log(`${firstPerson.name} is the oldest.`);
} else if(Person.compareBirthDate(firstPerson, secondPerson) == 0){
    console.log("Both have the same age.");
} else{
    console.log(`${secondPerson.name} is the oldest.`);
}


let personArray = [
    new Person("Paul", new Date()),
    new Person("Berry", new Date()),
    new Person("Benjamin", new Date()),
    new Person("Teresa", new Date())
]

// personArray.sort(Person.compareBirthDate);

// for(let i = 0; i < personArray.length; i++){
//     console.log(personArray[i].name);
// }

console.log(personArray[3].birthDate);

let date = new Date();
console.log(Date.toString());