//Json Importeren
let xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
    if(this.readyState == 4 && this.status == 200) {
        sorteerBoekObj.data = JSON.parse(this.responseText);
        sorteerBoekObj.sorteren();
    } else {

    }
}
xmlhttp.open('GET', "boeken.json", true);
xmlhttp.send();

//Tabel
const maakTabelKop = (arr) => {
    let kop = "<table><tr>";
    arr.forEach((item) => {
        kop += "<th>" + item + "</th>"
    });
    kop += "<tr>";
    return kop;
};

const maakTabelRij = (arr) => {
    let rij = "<tr>";
    arr.forEach((item) => {
        rij += "<td>" + item + "</td>"
    });
    rij += "<tr>";
    return rij;
};

//Object
let sorteerBoekObj = {
    data: "",

    sorteren: function() {
        this.data.sort( (a,b) => a.titel > b.titel ? 1 : -1)
        this.uitvoeren(this.data);
    },

    uitvoeren: function (data) {
        let uitvoer = maakTabelKop(["titel", "auteur(s)", "cover", "uitgave", "bladzijde", "taal", "ean"]);
        for(let i=0; i<data.length; i++) {
            let imgElement = "<img src='" + data[i].cover + "' width=100>'" + data[i].titel;
            uitvoer += maakTabelRij([data[i].titel, data[i].titel, imgElement, data[i].uitgave, data[i].bladzijde, data[i].taal, data[i].ean]);
        }

        document.getElementById('uitvoer').innerHTML = uitvoer
    }
}