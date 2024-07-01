var url = "http://127.0.0.1:8000/api/getData";

var change = 0;

caricaDati();

function caricaDati(){
    fetch(url)
        .then(function(response) {
            if (!response.ok) {
                throw new Error('errore durante il recupero dei dati: ' + response.status);
            }
            return response.json();
        })
        .then(function(data) {
            createTable(data);
        })
        .catch(function(error) {
            console.error(error);
        });
    
    setTimeout(caricaDati, 20000);
}

// Funzione per creare la tabella
function createTable(data) {



    //non visualizza l'animazione di caricamento
    var loader = document.querySelector(".loader-container");
     loader.style.display = "none";

     if (change==0){

    var table = "<table class='tabella'>";
    table += "<th>classe</th><th>aula</th><th>temperatura</th><th>umidità</th><th>ultimo aggiornamento</th></tr>";

    function classeDeterminata() {
        for (var i = 0; i < data.length; i++) {
            table += "<tr>";
            table += "<td>" + data[i].classe + "</td>";
            table += "<td>" + data[i].aula + "</td>";
            table += "<td style='" + impostaColoreBgT(data[i].temperatura) + "'>" + data[i].temperatura + "</td>";
            table += "<td style='" + impostaColoreBgU(data[i].umidità) + "'>" + data[i].umidità + "</td>";
            const dataU = new Date(data[i].ultima_lettura);
            table += "<td style='width: 8rem;'>" + dataU.toLocaleString() + "</td>";
            table += "</tr>";
        } }

    classeDeterminata();

    table += "</table>";
    var element = document.querySelector(".table-container");
     element.innerHTML = table;

}}

// Posiziona il loader al centro della finestra del browser
window.addEventListener('load', function() {
    var loaderContainer = document.getElementById('loaderContainer');
    loaderContainer.style.top = (window.innerHeight / 2 - loaderContainer.offsetHeight / 2) + 'px';
  });

  function impostaColoreBgT (temp) {
  const rosso= '#e90047';
  const arancione= '#ff9100';
  const verde= '#04ca4685';

  if (temp >= -10 && temp < 16) {
    return 'background-color: ' + rosso + "; color: yellow; font-weight: bold;";
} else if (temp >= 16 && temp < 19) {
    return 'background-color: ' + arancione;
} else if (temp >= 19 && temp <= 25) {
    return 'background-color: ' + verde;
} else if (temp > 25) {
    return 'background-color: ' + rosso + "; color: yellow; font-weight: bold;";
}
}

function impostaColoreBgU (umid) {
    const rosso= '#e90047';
    const arancione= '#ff9100';
    const verde= '#04ca4685';

    if (umid >= 0 && umid < 35) {
      return 'background-color: ' + rosso + "; color: yellow; font-weight: bold;";
  } else if (umid >= 35 && umid < 40) {
      return 'background-color: ' + arancione;
  } else if (umid >= 40 && umid <= 60) {
      return 'background-color: ' + verde;
    } else if (umid > 60 && umid <= 70) {
        return 'background-color: ' + arancione;  
  } else if (umid > 70) {
      return 'background-color: ' + rosso + "; color: yellow; font-weight: bold;";
  }
  }

  function visualizza_dati_classe(data) {

    change = 1;

    let tabella = document.querySelector(".table-container");
    tabella.style.display = "none";

    let button = document.getElementById("x");
    button.style.display = "flex";

    let table = "<table><tr><th>classe</th><th>aula</th><th>temperatura</th><th>umidità</th><th>ultimo aggiornamento</th></tr>";

    for (var i = 0; i < data.length; i++) {
        table += "<tr>";
        table += "<td>" + data[i].classe + "</td>";
        table += "<td>" + data[i].aula + "</td>";
        table += "<td style='" + impostaColoreBgT(data[i].temperatura) + "'>" + data[i].temperatura + "</td>";
        table += "<td style='" + impostaColoreBgU(data[i].umidità) + "'>" + data[i].umidità + "</td>";
        const dataU = new Date(data[i].ultima_lettura);
        table += "<td style='width: 8rem;'>" + dataU.toLocaleString() + "</td>";
        table += "</tr>";
    }

    table += "</table>";
    tabella.innerHTML = table;
    tabella.style.display = "block";
}

  function show_tabella() {
    change = 0;
    var loader = document.querySelector(".loader-container");
     loader.style.display = "flex";

    caricaDati();
    let classeInserita = document.getElementById("classe");
    classeInserita.value = "";
  }