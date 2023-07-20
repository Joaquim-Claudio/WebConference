let form = document.getElementById("form");

form.addEventListener("submit", function(event){
    let pass1 = document.getElementById("pass1");
    let pass2 = document.getElementById("pass2");
    if(pass1.value != pass2.value){
        alert("As duas passwords devem ser iguais!!!");
        event.preventDefault();
    }else{
        alert("Submetido com sucesso!");
    }
})

async function fetchByBreed(breed){
    try{
        let response = await fetch(`https://dog.ceo/api/breed/${breed}/images/random`);
        let jsonData = await response.json();
        document.getElementById("myImg").src = jsonData.message;
    } catch(error){
        alert(error);
    }
}

fetchByBreed("husky");