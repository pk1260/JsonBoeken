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

// Functie die een string van maand jaar omzet in een date-object
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

//Maakt een functie die de tekst achter de komma vooraan plaatst
const keerTekstOm = (string) => {
    if(string.indexOf(',') != -1) {
        let array = string.split(',');
        string = array[1] + ' ' + array[0];
    }

    return string;
}

// Een winkelwagenobject deze
// 1. Toegevoegde items bevat
// 2. Method om data om te halen uit localStorage
// 3. Method om toe te voegen
// 4. Method om items te verwijderen
// 5. Method om items te uit te voeren

let winkelwagen = {
    items: [],
    haalItemsOp: function() {
        let bestelling;
        if (localStorage.getItem('besteldeBoeken') == null ) {
            bestelling = [];
        } else {
            bestelling = JSON.parse(localStorage.getItem('besteldeBoeken'));
            document.querySelector('.winkelwagen__aantal').innerHTML = bestelling.length;
        }
        return bestelling;
    },

    toevoegen: function(el){
        this.items = this.haalItemsOp()
        this.items.push(el);
        localStorage.setItem('besteldeBoeken', JSON.stringify(this.items));
        document.querySelector('.winkelwagen__aantal').innerHTML = this.items.length;
    },

    uitvoeren: function () {

    }

}

winkelwagen.haalItemsOp();

//Object dat de boeken uitvoert en sorteert
//Eigenschappen object: Data (sorteer)kenmerk
//Method: Sorteren() en Uitvoeren()
let sorteerBoekObj = {
    data: "", // Komt van xmlhttp.onreadystatechange

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

            // Knop toevoegen bij de prijs
            let knop = document.createElement('button');
            knop.className = 'boekSelectie__knop';
            knop.innerHTML = 'voeg toe aan<br>winkelwagen';
            knop.addEventListener('click', () => {
                winkelwagen.toevoegen(boek);
            })

            // De elementen toevoegen
            sectie.appendChild(afbeelding);
            main.appendChild(titel);
            main.appendChild(auteurs);
            main.appendChild(overig);
            sectie.appendChild(main);
            prijs.appendChild(knop);
            sectie.appendChild(prijs);
            document.getElementById('uitvoer').appendChild(sectie);
        })
    }
}


winkelwagen.haalItemsOp();
winkelwagen.uitvoeren();
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
