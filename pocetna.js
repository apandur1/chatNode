let form = document.getElementById('formaPocetna');
let input = document.getElementById('inputUsername');

form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (input.value) {
        let ajaxUnosKorisnikaUFile = new XMLHttpRequest()
        ajaxUnosKorisnikaUFile.onreadystatechange = function () {

        }
        ajaxUnosKorisnikaUFile.open("POST", "/korisnik")
        ajaxUnosKorisnikaUFile.setRequestHeader("Content-type", "application/json");
        ajaxUnosKorisnikaUFile.send(JSON.stringify({'korisnik': input.value}))
        input.value = '';
    }
});