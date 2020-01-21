// Functie die van een maand-string een nummer maakt
// Waarbij januari 0 geeft
// En december 11

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
        bestelling.forEach(item => {
            this.items.push(item);
        })
        return bestelling;
    },

    uitvoeren: function () {
        document.getElementById('uitvoer').innerHTML = "";
        this.items.forEach(boek => {
            // document.getElementById('uitvoer').innerHTML = "";
            let sectie = document.createElement('section');
            sectie.className = 'besteldBoek';

            // Cover maken (Afbeelding)
            let afbeelding = document.createElement('img');
            afbeelding.className = 'besteldBoek__cover';
            afbeelding.setAttribute('src', boek.cover);
            afbeelding.setAttribute('alt', keerTekstOm(boek.titel));

            // Titel maken
            let titel = document.createElement('h3');
            titel.className = 'besteldBoek__titel';
            titel.textContent = keerTekstOm(boek.titel);

            // Prijs maken
            let prijs = document.createElement('div');
            prijs.className = 'besteldBoek__prijs';
            // https://www.freeformatter.com/netherlands-standards-code-snippets.html
            prijs.textContent = boek.prijs.toLocaleString('nl-NL', {currency: 'EUR', style: 'currency'});

            // verwijder knop
            let verwijder = document.createElement('div');
            verwijder.className = 'besteldBoek__verwijder';
            verwijder.

            // De elementen toevoegen
            sectie.appendChild(afbeelding);
            sectie.appendChild(titel);
            sectie.appendChild(prijs);
            sectie.appendChild(verwijder);
            document.getElementById('uitvoer').appendChild(sectie);
        });
    }
}

winkelwagen.haalItemsOp();
winkelwagen.uitvoeren();