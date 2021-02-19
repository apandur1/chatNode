let form = document.getElementById('formaPocetna');
let input = document.getElementById('inputUsername');

form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (input.value) {
        let ajaxUnosKorisnikaUFile = new XMLHttpRequest()
        ajaxUnosKorisnikaUFile.onreadystatechange = function () {
            if(ajaxUnosKorisnikaUFile.readyState === 4 && ajaxUnosKorisnikaUFile.status === 200) {
                window.location.href = "../Static/glavna.html"
            }
            else if(ajaxUnosKorisnikaUFile.readyState === 4 && ajaxUnosKorisnikaUFile.status === 200)
                console.log("Burke, nešto ne valja, popravljaj to")
        }
        ajaxUnosKorisnikaUFile.open("POST", "/korisnik")
        ajaxUnosKorisnikaUFile.setRequestHeader("Content-type", "application/json");
        ajaxUnosKorisnikaUFile.send(JSON.stringify({'korisnik': input.value}))
        input.value = '';
    }
});