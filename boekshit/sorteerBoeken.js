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
    let kop = "<table class='boekSelectie'><tr>";
    arr.forEach((item) => {
        kop += "<th>" + item + "</th>";
    });
    kop += "</tr>";
    return kop;
};

const maakTabelRij = (arr, accent) => {
    let rij = "";
    if (accent == true) {
        rij = "<tr class='boekSelectie__rij--accent'>";
    } else {
        rij = "<tr class='boekSelectie__rij'>";
    }
    arr.forEach((item) => {
        rij += "<td class='boekSelectie__data-cel'>" + item + "</td>";
    });
    rij += "</tr>";
    return rij;
};

//Object
//Eigenschappen object: Data
//Method:               Sorteren() en Uitvoeren()
let sorteerBoekObj = {
    data: "",
    kenmerk: "titel",

    sorteren: function() {
        this.data.sort( (a,b) => a[this.kenmerk] > b[this.kenmerk] ? 1 : -1);
        this.uitvoeren(this.data);
    },

    uitvoeren: function (data) {
        let uitvoer = maakTabelKop(["titel", "auteur(s)", "cover", "uitgave", "bladzijden", "taal", "ean"]);

        for(let i=0; i<data.length; i++) {
            let accent = false;
            i%2 == 0 ? accent = true : accent = false;
            let imgElement = "<img src='" + data[i].cover + "' class='boekSelectie__cover' '" + data[i].titel + "'>";
            uitvoer += maakTabelRij([data[i].titel, data[i].auteur[0], imgElement, data[i].uitgave, data[i].paginas, data[i].taal, data[i].ean], accent);
        }

        document.getElementById('uitvoer').innerHTML = uitvoer
    }
}