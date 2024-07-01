// Funzione per acquisire i dati da caricare nel database 
async function carica_dati() {
  const url = "https://script.google.com/macros/s/AKfycbyAFsFhqHPBHL_WIVYmtm4Qtq1Vy0arB13IXLA30NkCL25fefOz0Px-SGBvhEjPtlvS/exec?getAula=0";

  try {
    // Effettua una richiesta GET all'URL 
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`errore nella richiesta GET: ${response.status}`);
    }

    // Ottieni i dati dalla risposta GET
    const responseData = await response.json();
    
    // 'dati' è definito ed è un array
    const dati = responseData.dati;
    if (!dati || !Array.isArray(dati)) {
      throw new Error("i dati ricevuti non sono validi o non sono un array");
    }

    // struttura dati per la richiesta POST
    const postData = {
      result: "ok",
      dati: dati.map(item => ({
        aula: item.aula,
        classe: item.classe,
        temp: item.temp,
        umid: item.umid,
        devid: item.devid,
        ultimoAgg: new Date(item.ultimoAgg)
      }))
    };

    // richiesta POST con i dati 
    const apiEndpoint = "http://127.0.0.1:8000/api/device/uploadData";
    const postResponse = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(postData)
    });

    if (!postResponse.ok) {
      throw new Error(`Errore nella richiesta POST: ${postResponse.status}`);
    }

    console.log('dati inviati con successo');
  } catch (error) {
    console.error('si è verificato un errore:', error);
  }
}

setInterval(carica_dati, 15000);




function cerca_classe() {
const classeInserita = document.getElementById("classe").value;
fetch(`http://127.0.0.1:8000/api/data/class/${classeInserita}`)
  .then(response => {
    if (!response.ok) {
      throw new Error('Errore nella richiesta API');
    }
    return response.json();
  })
  .then(data => {
    // Controlla se i dati sono stati trovati 
    if (data.msg) {
      console.log(data.msg);  // errore
    } else {
      visualizza_dati_classe(data);
    }
  })
  .catch(error => {
    console.error('Si è verificato un errore durante la richiesta:', error);
  });
}