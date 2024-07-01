from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import mysql.connector
from mysql.connector import errorcode
from datetime import datetime
from typing import List
from loguru import logger
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Configura CORS per consentire tutte le origini
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

# configurazione per connessione al database
config = {
    "host": "127.0.0.1",
    "port": "3306",
    "user": "root",
    "database": "dati_solace"
}

class Dati(BaseModel):
    aula: str
    classe: str
    temp: str
    umid: str
    devid: str
    ultimoAgg: datetime

class DatiIngresso(BaseModel):
    result: str
    dati: List[Dati]

# rotta per inserire dati nel db
@app.post("/api/device/uploadData")
def carica_dati(dati_in: DatiIngresso):
    
    conn = mysql.connector.connect(**config)
    cursor = conn.cursor()

    try:
        for dato in dati_in.dati:
            # Inserire aula se non è presente
            cursor.execute("INSERT IGNORE INTO aule (aula) VALUES (%s)", (dato.aula,))
            conn.commit()
            logger.info(f"Inserita aula: {dato.aula}")

            # Inserire classe se non è presente
            cursor.execute("INSERT IGNORE INTO classi (classe) VALUES (%s)", (dato.classe,))
            conn.commit()
            logger.info(f"Inserita classe: {dato.classe}")

            # Inserire dispositivo se non è presente
            cursor.execute("INSERT IGNORE INTO dispositivi (numero_seriale) VALUES (%s)", (dato.devid,))
            conn.commit()
            logger.info(f"Inserito dispositivo: {dato.devid}")

            # Carica letture
            cursor.execute("INSERT INTO letture (numero_seriale, aula, classe, temperatura, umidità, ultima_lettura) VALUES (%s, %s, %s, %s, %s, %s)",
                           (dato.devid, dato.aula, dato.classe, dato.temp, dato.umid, dato.ultimoAgg))
            conn.commit()
            logger.info(f"Inserita lettura: {dato.devid}, {dato.aula}, {dato.classe}, {dato.temp}, {dato.umid}, {dato.ultimoAgg}")

        return {"msg": "dati caricati correttamente"}
    except Exception as e:
        logger.error(f"errore durante il caricamento dei dati: {e}")
        return HTTPException(status_code=500, detail="errore durante il caricamento dei dati")

    finally:
        conn.close()


# rotta per stampare i dati di una singola classe
@app.get("/api/data/class/{classe_inserita}")
def stampa_dati_classe(classe_inserita: str):
        
    conn = mysql.connector.connect(**config)
    cursor = conn.cursor(dictionary=True)

    # conta i dispositivi inseriti nel db
    cursor.execute("SELECT COUNT(DISTINCT id_dispositivo) AS num_dispositivi FROM dispositivi")
    count = cursor.fetchone()

    if count:
        numero_dispositivi = count['num_dispositivi']
    else:
            numero_dispositivi = 0

    # seleziona l'ultima lettura di ciascun dispositivo 
    cursor.execute("SELECT * FROM (SELECT * FROM letture ORDER BY id_lettura DESC LIMIT %s) AS ultime_letture WHERE classe = %s ", (int(numero_dispositivi), classe_inserita)) 
    dati_classe = cursor.fetchall()
    conn.close()
    
    if dati_classe : 
     return dati_classe
    else : 
     return "Classe non trovata"


class Letture(BaseModel):
    id_lettura: int
    numero_seriale: str
    aula: str
    classe: str
    temperatura: float
    umidità: float
    ultima_lettura: datetime

# rotta per stampare i dati dell'ultima lettura di ciascun dispositivo
@app.get("/api/getData")
def get_dati_aule():
    try:
        conn = mysql.connector.connect(**config)
        cursor = conn.cursor(dictionary=True)

        # conta i dispositivi inseriti nel db
        cursor.execute("SELECT COUNT(DISTINCT id_dispositivo) AS num_dispositivi FROM dispositivi")
        count = cursor.fetchone()
        numero_dispositivi = count['num_dispositivi'] if count else 0

        # seleziona l'ultima lettura di ciascun dispositivo
        cursor.execute("""
            SELECT id_lettura, numero_seriale, aula, classe, temperatura, umidità, ultima_lettura
            FROM letture
            ORDER BY id_lettura DESC
            LIMIT %s
        """, (numero_dispositivi,))
        
        dati = cursor.fetchall()
        conn.close()

        
        letture_list = []
        for record in dati:
            letture = Letture(
                id_lettura=record['id_lettura'],
                numero_seriale=record['numero_seriale'],
                aula=record['aula'],
                classe=record['classe'],
                temperatura=record['temperatura'],
                umidità=record['umidità'],
                ultima_lettura=record['ultima_lettura']
            )
            letture_list.append(letture)

        return letture_list
    
    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=str(err))