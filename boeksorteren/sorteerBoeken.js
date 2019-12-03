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
        //De data moet ook een eigenschap hebben waarbij de titels in kapitalen staan
        sorteerBoekObj.data.forEach( boek => {
            boek.titelUpper = boek.titel.toUpperCase();
            // Ook de Naam van de auteur
            boek.sortAuteur = boek.auteur[0];
        })
        sorteerBoekObj.sorteren();
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

const keerTekstOm = (string) => {
    if(string.indexOf(',') != -1) {
        let array = string.split(',');
        string = array[1] + ' ' + array[0];
    }

    return string;
}

//Object
//Eigenschappen object: Data
//Method:               Sorteren() en Uitvoeren()
let sorteerBoekObj = {
    data: "",

    kenmerk: "titelUpper",

    oplopend: 1,

    // een datumObject
    voegJSdatumIn: function () {
        this.data.forEach((item) => {
            item.jsDatum = maakJSdatum(item.uitgave);

        })
    },
    // Data sorteren
    sorteren: function() {
        this.data.sort( (a,b) => a[this.kenmerk] > b[this.kenmerk] ? 1*this.oplopend : -1*this.oplopend);
        this.uitvoeren(this.data);
    },
    // Data in een tabel uitvoeren
    uitvoeren: function (data) {
        document.getElementById('uitvoer').innerHTML = "";
        data.forEach(boek => {
            // document.getElementById('uitvoer').innerHTML = "";
            let sectie = document.createElement('section');
            sectie.className = 'boekSelectie';

            // Main Ele met alle info
            let main = document.createElement('main');
            main.className = 'boekSelectie__main';

            // Cover maken (Afbeelding)
            let afbeelding = document.createElement('img');
            afbeelding.className = 'boekSelectie__cover';
            afbeelding.setAttribute('src', boek.cover);
            afbeelding.setAttribute('alt', keerTekstOm(boek.titel));

            // Titel maken
            let titel = document.createElement('h3');
            titel.className = 'boek__titel';
            titel.textContent = keerTekstOm(boek.titel);

            // Auteurs
            let auteurs = document.createElement('p');
            auteurs.className = 'boekSelectie__auteurs';
            // De voor en achternaam van de eerste auteur
            boek.auteur[0] = keerTekstOm(boek.auteur[0]);
            // Auteurs staan in een array: deze omzetten naar nederlandse string
            auteurs.textContent = maakOpsomming(boek.auteur);

            // Overige info
            let overig = document.createElement('p');
            overig.className = 'boekSelectie__overig';
            overig.textContent = boek.uitgave+' | aantal pagina\'s '+boek.paginas+' | '+boek.taal+' | ean: '+boek.ean;

            // Prijs maken
            let prijs = document.createElement('div');
            prijs.className = 'boekSelectie__prijs';
            // https://www.freeformatter.com/netherlands-standards-code-snippets.html
            prijs.textContent = boek.prijs.toLocaleString('nl-NL', {currency: 'EUR', style: 'currency'});

            // De elementen toevoegen
            sectie.appendChild(afbeelding);
            main.appendChild(titel);
            main.appendChild(auteurs);
            main.appendChild(overig);
            sectie.appendChild(main);
            sectie.appendChild(prijs);
            document.getElementById('uitvoer').appendChild(sectie);
        })
    }
}

//keuze
