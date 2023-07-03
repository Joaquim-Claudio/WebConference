let names = ["John", "Charlie" ,"Chloe", "Ruby", "Charlie"];
let newArray = [...names, "Joaquim", "Pedro"];

for(let element of newArray){
    console.log(element);
}

console.log(newArray.indexOf("Charlie", 0));
console.log(newArray.lastIndexOf("Charlie", 3));
console.log(newArray.includes("Jone"));
