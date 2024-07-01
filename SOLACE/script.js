getDatiAule();

// Funzione per ottenere i dati dalle API
function getDatiAule() {
  let urlG = "http://127.0.0.1:8000/api/getData";
    fetch(urlG)
        .then(response => {
            if (response.ok) {
                return response.json(); // Parse la risposta JSON
            }
            throw new Error('Errore nella richiesta API');
        })
        .then(data => {
            visualizzaDati(data); // Chiamata alla funzione per visualizzare i dati
        })
        .catch(error => {
            console.error('Errore durante la fetch:', error);
        });

        setTimeout(getDatiAule,20000);
}
    
function visualizzaDati(data){
         // Processa i dati ricevuti
       if (data && data.length > 0) {
           let moduli = document.getElementsByClassName("moduloAula");

           for (const m of moduli) {
               let nAula = m.getAttribute("data-aula").toString();
               let datiAula = data.find(d => d.aula === nAula);

               if (datiAula) {
                   const dataU = new Date(datiAula["ultima_lettura"]);

                   m.children[0].innerHTML = "AULA " + datiAula["aula"];
                   m.children[0].style.marginTop = "-2.5px";
                   m.children[1].style.backgroundColor = "lightyellow";
                   m.children[1].setAttribute("title", datiAula["numero_seriale"]);
                   m.children[1].innerHTML = "Temperatura: " + datiAula["temperatura"] + "°C <br>" +
                       "Umidità: " + datiAula["umidità"] + "% <br>" +
                       "Classe: " + datiAula["classe"] + "<p style='font-size: small; margin-top: -2px'>" +
                       "Ultimo aggiornamento: <br>" + dataU.toLocaleString() + "</p>";

                   var classe = datiAula["classe"];
                   var temperatura = parseInt(datiAula["temperatura"]);
                   var aula = datiAula["aula"];
                   var devid = datiAula["numero_seriale"];

            var urlP = apriFoglioDev(devid); 

            let pallino = document.getElementById("myButton"+aula);
            pallino.setAttribute("onClick", "urlPallino(this)");
            pallino.setAttribute("data-urlP",urlP);

          //imposta padding pallino
          var button = document.getElementById("myButton"+aula);
          button.style.padding = "12px 27px";

          //non visualizza classe sul pallino         
            var button = document.getElementById("myButton"+aula);
            button.value = "";

          //non visualizza retta del pallino         
          var retta = document.getElementById("r"+aula);
          retta.style.display = "none";

          //non visualizza moduloAula del pallino
          var moduloAula = document.getElementById("mA"+aula);
          moduloAula.style.display = "none";

          //imposta dimensioni ecc moduloAula
          var moduloAula = document.getElementById("mA"+aula);
          moduloAula.style.width = "175px";
          moduloAula.style.borderRadius = "5px";
          moduloAula.style.border = "1px solid darkgray";
          moduloAula.style.padding = "10px";
          moduloAula.style.backgroundColor = "#00b03b";
          moduloAula.style.textAlign = "center";

          //colore di base
          var button = document.getElementById("myButton"+aula);
         button.style.backgroundColor = "#a2a2a2";
         button.style.borderColor = "rgb(204, 204, 204)";


        //imposta colore del pulsante & co
        const rosso= '#e90047';
        const rossoC= '#f7adba';

        const arancione= '#ff9100';
        const arancioneC= '#ffc87f';

        const verde= '#00b03b';
        const verdeC= '#99ffbb';

         if (temperatura >= -10 && temperatura < 16 ) {
         
         var button = document.getElementById("myButton"+aula);
         button.style.backgroundColor = rosso;
         button.style.borderColor = rossoC;
        
         var retta = document.getElementById("r"+aula);
         retta.style.color = rosso;
        
         var moduloAula = document.getElementById("mA"+aula);
         moduloAula.style.backgroundColor = rosso;

         } else if ( temperatura >= 16 && temperatura < 19 ) {
        
        var button = document.getElementById("myButton"+aula);
         button.style.backgroundColor = arancione;
         button.style.borderColor = arancioneC;
        
         var retta = document.getElementById("r"+aula);
         retta.style.color = arancione;
        
         var moduloAula = document.getElementById("mA"+aula);
         moduloAula.style.backgroundColor = arancione;

         } else if ( temperatura >= 19 && temperatura <= 25 ) {

        var button = document.getElementById("myButton"+aula);
         button.style.backgroundColor = verde;
         button.style.borderColor = verdeC;
        
         var retta = document.getElementById("r"+aula);
         retta.style.color = verde;
        
         var moduloAula = document.getElementById("mA"+aula);
         moduloAula.style.backgroundColor = verde;

         } else if ( temperatura > 25) {
         
        var button = document.getElementById("myButton"+aula);
        button.style.backgroundColor = rosso;
        button.style.borderColor = rossoC;
       
        var retta = document.getElementById("r"+aula);
        retta.style.color = rosso;
       
        var moduloAula = document.getElementById("mA"+aula);
        moduloAula.style.backgroundColor = rosso;
         }

       
        //visualizza div pallino
        var opacity = document.querySelector(".divButton");
        opacity.style.display = "flex";

         if (classe!="--") {
        //visualizza classe sul pallino 
        var button = document.getElementById("myButton"+aula);
        button.value = classe;

        //imposta padding pallino
        var button = document.getElementById("myButton"+aula);
        button.style.padding = "15px 16px";

        // //visualizza retta del pallino         
         var retta = document.getElementById("r"+aula);
         retta.style.display = "block";

        } else {

          //visualizza retta del pallino         
        var retta = document.getElementById("r"+aula);
        retta.style.display = "block";

        //visualizza moduloAula del pallino
        var moduloAula = document.getElementById("mA"+aula);
        moduloAula.style.display = "none";
              
      }

      }else {
          // m.style.backgroundColor="lightred";
          // m.innerHTML = "aula non trovata";

          }
      }
    }
        //non visualizza caricamento
        var loader = document.querySelector(".loader-container");
        loader.style.display = "none";
    }

  function apriFoglioDev(devid) {
    var urlMap = {
      "WD1-083A8DF5B2E7": "373402555",
      "WD1-D8BFC00E1F62": "1593497783",
      "WD1-08F9E05D653E": "1187588892",
      "WD1-C8C9A31AEDE3": "403008464",
      "WD1-08F9E05D4A87": "1955611649",
      "WD1-08F9E05D4A80": "578462426",
      "WD1-08F9E05D5ECD": "172201768"
  };

   var urlA = "https://docs.google.com/spreadsheets/d/1G6jgh2ofgdTZPQHB2CXA-Kk9EfNbBX0JYtQurP5vM4E/edit#gid=" + urlMap[devid];  
   if (urlA) {
    return urlA;
   } else {
    var urlB= "https://docs.google.com/spreadsheets/d/1G6jgh2ofgdTZPQHB2CXA-Kk9EfNbBX0JYtQurP5vM4E/edit#gid=0";
   return urlB;
  }
  }



 function showModuloAula(aula) {
  var moduloAula = document.getElementById("mA"+aula); 
  moduloAula.style.display = "block"
  moduloAula.style.opacity = 1
  
  var retta = document.getElementById("r"+aula);
  retta.style.opacity = 1;
  }

function hideModuloAula(aula) {
    var moduloAula = document.getElementById("mA"+aula); 
    moduloAula.style.display = "none"
    moduloAula.style.opacity = 0;

    var retta = document.getElementById("r"+aula);
  retta.style.opacity = 0;
}

function urlPallino(tag) {
  window.open(tag.getAttribute("data-urlP"), '_blank');
  }