const url_base = "https://fcawebbook.herokuapp.com"

window.onload = function () {
    const frmSponsors = document.getElementById("frmSponsors")
    frmSponsors.addEventListener("submit", async(event) => {
        const txtName = document.getElementById("txtName").value
        const txtLogo = document.getElementById("txtLogo").value
        const txtLink = document.getElementById("txtLink").value

        if(isNew) {
            const response = await fetch(`${url_base}/sponsors`, {
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                method: 'POST',
                body: 
                `nome=${txtName}&logo=${txtLogo}&link=${txtLink}`
            })
            const newSponsorId = response.headers.get("Location")
            const newUrl = `${url_base}/conferences/1/sponsors/${newSponsorId}`

            const response2 = await fetch(newUrl, {
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                method: 'POST',
            })

            const isNewSponsor = response2.json()
            if(isNewSponsor.value.success){
                swal("Registo de sponsor", isNewSponsor.value.massage.pt, 'success')
            }else{
                swal("Registo de sponsor", isNewSponsor.value.massage.pt, 'error')
            }
        }else{
            const txtSponsorId = document.getElementById("txtSponsorId").value
            const response = await fetch(`${url_base}/sponsors/${txtSponsorId}`, {
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                method: 'PUT',
                body: 
                `nome=${txtName}&logo=${txtLogo}&link=${txtLink}`
            })
            const newSponsor = await response.json()
            if(newSponsor.value.success){
                swal("Atualização de sponsor", newSponsor.value.massage.pt, 'success')
            }else{
                swal("Atualização de sponsor", newSponsor.value.massage.pt, 'error')
            }
        }
    })

// #############################################################################################################################

    const renderSponsors = async () => {
        const tblSponsors = document.getElementById("tblSponsors")
        let strHtml = `
        <thead>
            <tr><th class='w-62 text-center bg-warning' colspan='4'>
                Lista de Sponsors</th>
            </tr>
            <tr class='bg-info'>
                <th class='w-2'>#</th>
                <th class='w-50'>Nome</th>
                <th class='w-10'>Ações</th>
            </tr>
        </thead><tbody>`

        const response = await fetch(`${url_base}/conferences/1/sponsors`)
        const sponsors = await response.json()

        let i = 1
        for(const sponsor of sponsors){
            strHtml += `
                <tr>
                    <td>${i}</td>
                    <td>${sponsor.nome}</td>
                    <td>
                        <i id='${sponsor.idSponsor}' class="fas fa-edit edit"></i>
                        <i id='${sponsor.idSponsor}' class="fas fa-trash-al remove"></i>
                    </td>
                </tr>`
            i++
        }
        strHtml += "</tbody>"

        tblSponsors.innerHTML = strHtml


        const btnEdit = document.getElementsByClassName("edit")
        for(let i = 0; i < btnEdit.length; i++){
            btnEdit[i].addEventListener("click", () => {
                isNew = false
                for(const sponsor of sponsors){
                    if(sponsor.idsponsor == btnEdit[i].getAttribute("id")){
                        document.getElementById("txtSponsorId").value = sponsor.idSponsor
                        document.getElementById("txtName").value = sponsor.nome
                        document.getElementById("txtLogo").value = sponsor.logo
                        document.getElementById("txtLink").value = sponsor.link
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
                const sponsorId = btnDelete[i].getAttribute("id")
                try {
                    const response = await fetch(`${url_base}/conferences/1/sponsors/${sponsorId}`, {
                        method: "DELETE"
                    })
                    const isRemoved = await response.json()
                    swal('Remoção de Inscrição', isRemoved.message.pt, (isRemoved.success) ? 'success' : 'error')
                    renderSponsors()
                }catch (err) {
                    swal({type: 'error', title: 'Remoção de Inscrição', text: err})
                }
            }
        })
    })
}