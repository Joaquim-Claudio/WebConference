const url_base = "https://fcawebbook.herokuapp.com"

window.onload = function (){

    const frmSpeaker = document.getElementById("frmSpeaker")
    frmSpeaker.addEventListener("submit", async(event) =>{
        event.preventDefault()
        // Pedido HTTP para inserção dos dados do orador
        const txtName = document.getElementById("txtName").value
        const txtJob = document.getElementById("txtJob").value
        const txtPhoto = document.getElementById("txtPhoto").value
        const txtFacebook = document.getElementById("txtFacebook").value
        const txtTwitter = document.getElementById("txtTwitter").value
        const txtLinkedin = document.getElementById("txtLinkedin").value
        const txtBio = document.getElementById("txtBio").value

        if(isNew) {
            // Adiciona orador
            const response = await fetch(`${url_base}/speakers`, {
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                method: 'POST',
                body: 
                `nome=${txtName}&cargo=${txtJob}&foto=${txtPhoto}&
                facebook=${txtFacebook}&twitter=${txtTwitter}&
                linkedin=${txtLinkedin}&bio=${txtBio}`
            })
            const isNewSpeaker = await response.json()
            const newSpeakerId = response.headers.get("Location")
            const newUrl = `${url_base}/conferences/1/speakers/${newSpeakerId}`
    
            const response2 = await fetch(newUrl, {
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                method: 'POST'
            })
    
            const isNewSpeaker2 = await response2.json()
            if(isNewSpeaker2.value.success){
                swal("Registo de orador", isNewSpeaker2.value.massage.pt, 'success')
            }else{
                swal("Registo de orador", isNewSpeaker2.value.massage.pt, 'error')
            }
        }else{
            // Atualiza orador
            const txtSpeakerId = document.getElementById("txtSpeakerId").value
            const response = await fetch(`${url_base}/speakers/${txtSpeakerId}`, {
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                method: 'PUT',
                body: 
                `nome=${txtName}&cargo=${txtJob}&foto=${txtPhoto}&
                facebook=${txtFacebook}&twitter=${txtTwitter}&
                linkedin=${txtLinkedin}&bio=${txtBio}`
            })
            const newSpeaker = await response.json()
            if(newSpeaker.value.success){
                swal("Atualização de orador", newSpeaker.value.massage.pt, 'success')
            }else{
                swal("Atualização de orador", newSpeaker.value.massage.pt, 'error')
            }
        }

    })

// #############################################################################################################################
    const renderSpeakers = async () => {
        const tblSpeakers = document.getElementById("tblSpeakers")

        let strHtml = `
            <thead>
                <tr><th class='w-100 text-center bg-warning' colspan='4'>
                    Lista de Oradores</th>
                </tr>
                <tr class='bg-info'>
                    <th class='w-2'>#</th>
                    <th class='w-50'>Nome</th>
                    <th class='w-38'>Cargo</th>
                    <th class='w-10'>Ações</th>
                </tr>
            </thead><tbody>`

        const response = await fetch(`${url_base}/conferences/1/speakers`)
        const speakers = await response.json()

        let i = 1
        for (const speaker of speakers){
            strHtml += `
                <tr>
                    <td>${i}</td>
                    <td>${speaker.nome}</td>
                    <td>${speaker.cargo}</td>
                    <td>
                        <i id='${speaker.idSpeaker}' class="fas fa-edit edit"></i>
                        <i id='${speaker.idSpeaker}' class="fas fa-trash-alt remove"></i>
                    </td>
                </tr>`
            i++
        }
        strHtml += '</tbody>'

        tblSpeakers.innerHTML = strHtml



        const btnEdit = document.getElementsByClassName("edit")
        for(let i = 0; i < btnEdit.length; i++){
            btnEdit[i].addEventListener("click", () => {
                isNew = false
                for(const speaker of speakers){
                    if(speaker.idSpeaker == btnEdit[i].getAttribute("id")){
                        document.getElementById("txtSpeakerId").value = speaker.idSpeaker
                        document.getElementById("txtName").value = speaker.nome
                        document.getElementById("txtJob").value = speaker.cargo
                        document.getElementById("txtPhoto").value = speaker.foto
                        document.getElementById("txtFacebook").value = speaker.facebook
                        document.getElementById("txtTwitter").value = speaker.twitter
                        document.getElementById("txtLinkedin").value = speaker.linkedin
                        document.getElementById("txtBio").value = speaker.bio
                    }
                }
            })
        }

    }
}

const btnDelete = document.getElementsByClassName("remove")
for(let i = 0; i < btnDelete.length; i++){
    btnDelete[i].addEventListener("click", () => {
        // Invocação da janela modal para confirmar remoção
        swal({
            title: "Tem a certeza?",
            text: "Não será possível reverter a remoção!",
            type: "Warning",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Remover',
        }).then(async (result) => {
            if(result.value) {
                // Pedido HTTP para remoção de inscrição
                const speakerId = btnDelete[i].getAttribute("id")
                try {
                    const response = await fetch(`${url_base}/conferences/1/speakers/${speakerId}`, {
                        method: "DELETE"
                    })
                    const isRemoved = await response.json()
                    swal('Remoção de Inscrição', isRemoved.message.pt, (isRemoved.success) ? 'success' : 'error')
                    renderSpeakers()
                }catch (err) {
                    swal({type: 'error', title: 'Remoção de Inscrição', text: err})
                }
            }
        })
    })
}