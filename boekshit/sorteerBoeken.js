//keuze sorteer
document.getElementById('kenmerk').addEventListener('change', (e) => {
    sorteerBoekObj.kenmerk = e.target.value;
    sorteerBoekObj.voegJSdatumIn();
    sorteerBoekObj.sorteren();
});

document.getElementsByName('oplopend').forEach((item) => {
    item.addEventListener('click', (e) => {
        sorteerBoekObj.oplopend = parseInt(e.target.value);
        sorteerBoekObj.sorteren();
    })
})

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

const geefMaandNummer= (maand) => {
    let number;
    switch (maand) {
        case "januari":     number = 0; break;
        case "februari":    number = 1; break;
        case "maard":       number = 2; break;
        case "april":       number = 3; break;
        case "mei":         number = 4; break;
        case "juni":        number = 5; break;
        case "juli":        number = 6; break;
        case "augustus":    number = 7; break;
        case "september":   number = 8; break;
        case "oktober":     number = 9; break;
        case "november":    number = 10; break;
        case "december":    number = 11; break;


        default:            number = 0
    }
    return number;
}

const maakJSdatum = (maandJaar) => {
    let mjArray = maandJaar.split(" ");
    let datum = new Date(mjArray[1], geefMaandNummer(mjArray[0]));
    return datum;
}

// Functie maakt van een Array een opsomming
const maakOpsomming = (array) => {
    let string = "";
    for (let i=0; i<array.length; i++){
        switch (i) {
            case array.length-1 : string += array[i]; break;
            case array.length-2 : string += array[i] + " en "; break
            default: string += array[i] + ", ";
        }
    }
    return string;
}

//Object
//Eigenschappen object: Data
//Method:               Sorteren() en Uitvoeren()
let sorteerBoekObj = {
    data: "",

    kenmerk: "titel",

    oplopend: 1,

    // een datumObject
    voegJSdatumIn: function () {
        this.data.forEach((item) => {
            item.jsDatum = maakJSdatum(item.uitgave);

        })
    },

    sorteren: function() {
        this.data.sort( (a,b) => a[this.kenmerk] > b[this.kenmerk] ? 1*this.oplopend : -1*this.oplopend);
        this.uitvoeren(this.data);
    },

    uitvoeren: function (data) {
        let uitvoer = maakTabelKop(["titel", "auteur(s)", "cover", "uitgave", "bladzijden", "taal", "ean"]);

        for(let i=0; i<data.length; i++) {
            let accent = false;
            i%2 == 0 ? accent = true : accent = false;
            let imgElement = "<img src='" + data[i].cover + "' class='boekSelectie__cover' '" + data[i].titel + "'>";
            // Maak opsomming van de auteurs
            let auteurs = maakOpsomming(data[i].auteur);
            uitvoer += maakTabelRij([data[i].titel, auteurs, imgElement, data[i].uitgave, data[i].paginas, data[i].taal, data[i].ean], accent);
        }

        document.getElementById('uitvoer').innerHTML = uitvoer;
    }
}

//keuze
