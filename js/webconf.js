
const url_base = "https://fcawebbook.herokuapp.com"

window.onload = function() {
    const btnRegister = document.getElementById("btnRegister");
    btnRegister.addEventListener("click", function(){
        //Abertura da janela modal
        swal ({
            title: "Inscrição na WebConference",
            html:
                '<input id="txtName" class="swal2-input" placeholder ="Nome (primeiro e último)">' +
                '<input id="txtEmail" class="swal2-input" placeholder ="E-mail: alguem@exemplo.com">',
            showCancelButton: true,
            confirmButtonText: "Inscrever",
            cancelButtonText: "Cancelar",
            showLoaderOnConfirm: true,
            preConfirm: () => {
                const name = document.getElementById("txtName").value
                const email = document.getElementById("txtEmail").value

                return
                    fetch (`${url_base}/conferences/1/participants/${email}`,{
                        headers: { "content-Type": "application/x-www-form-urlencoded" },
                        method: "POST",
                        body: `nomeparticipant=${name}`
                    })
                    .then(response => {
                        if(!response.ok){
                            throw new Error(response.statusText)
                        }
                        return response.json()
                    })
                    .catch(error => {
                        swal.showValidationError(`Pedido falhou: ${error}`)
                    });
            },
            allowOutsideClick: () => !swal.isLoading()

        }).then(result => {
            if(result.value){
                if(!result.value.err_code) {
                    swal({title: "Inscrição feita com sucesso!"})
                }else{
                    swal({title: `${result.valeu.err_message}`})
                }
            }
        })
    })
}

(async () => {
    const renderSpeakers = document.getElementById("renderSpeakers")
    let txtSpeaker = ""
    
    const response = await fetch(`${url_base}/conferences/1/speakers`)
    const speakers = await response.json()

    for(let speaker of speakers){
        txtSpeaker += `
            <div class="col-sm-4">
                <div class="team-member">
                    <img id="${speaker.idSpeaker}" class="mx-auto rounded-circle viewSpeaker" src="${speaker.foto}" alt="">
                    <h4>${speaker.name}</h4>
                    <p class="text-muted">${speaker.jobRole}</p>
                    <ul class="list-inline social-buttons">`

        if(speaker.twitter !== null){
            txtSpeaker += `
            <li class="list-inline-item">
                <a href="${speaker.twitter}" target="_blank">
                    <i class="fab fa-twitter"></i>
                </a>
            </li>`
        }
        if(speaker.facebook !== null){
            txtSpeaker += `
            <li class="list-inline-item">
                <a href="${speaker.facebook}" target="_blank">
                    <i class="fab fa-facebook-f"></i>
                </a>
            </li>`
        }
        if(speaker.linkedin !== null){
            txtSpeaker += `<li class="list-inline-item">
            <a href="${speaker.linkedin}" target="_blank">
                <i class="fab fa-linkedin-in"></i>
            </a>
        </li>`
        }
        txtSpeaker += `
                    </ul>
                </div>
            </div>`
    }

    const btnView = document.getElementsByClassName("viewSpeaker")
    for(let i = 0; i < btnView.length; i++){
        btnView[i].addEventListener("click", () => {
            for(const speaker of speakers){
                if(speaker.idSpeaker == btnView[i].getAttribute("id")){
                    swal({
                        title: speaker.name,
                        text: speaker.bio,
                        imageUrl: speaker.foto,
                        imageWidth: 400,
                        imageHeight: 400,
                        imageAlt: "Foto do orador",
                        animation: false
                    })
                }
            }
        })
    }

    renderSpeakers.innerHTML = txtSpeaker
}) ()


(async () => {
    const renderSponsors = document.getElementById("renderSponsors")
    let txtSponsor = ""

    const response = await fetch(`${url_base}/conferences/1/sponsors`)
    const sponsors = await response.json()

    for(let sponsor of sponsors){
        txtSponsor += `
            <div class="col-md-3 col-sm-6">
                <a href="${sponsor.link}" target="_blank">
                    <img class="img-fluid d-block mx-auto"
                        src="${sponsor.logo}"
                        alt="${sponsor.name}">
                </a>
            </div>`
    }
    renderSponsors.innerHTML = txtSponsor
}) ()


const contactForm = document.getElementById("contactForm")
contactForm.addEventListener("submit", async () => {
    const name = document.getElementById("name").value
    const email = document.getElementById("email").valeu
    const message = document.getElementById("message").value

    const response = await fetch(`${url_base}/contacts/emails`, {
        headers: {"Content-Type": "application/x-www-form-urlencoded"},
        method: "POST",
        body: `email=${email}&name=${name}&subject=${message}`
    })

    const result = await response.json()
    if(result.valeu.success) {
        swal('Envio de mensagem', result.value.message.pt, 'success')
    }else{
        swal('Envio de mensagem', result.value.message.pt, 'error')
    }
})