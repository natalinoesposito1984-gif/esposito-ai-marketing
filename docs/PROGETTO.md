# Esposito AI Marketing — specifica iniziale

## Obiettivo
Applicazione web privata, interamente in italiano, modulare e ampliabile per gestire il marketing dell'agenzia assicurativa.

## Prima versione
- Dashboard con calendario editoriale mensile.
- Aree: previdenza, protezione del reddito, protezione familiare, protezione aziendale, risparmio e investimenti, RC Auto.
- Bozze testuali differenziate per canale; libreria media e caroselli.
- Workflow: bozza → revisione → approvazione → programmazione → pubblicazione → esito.
- Link di atterraggio specifico per singolo contenuto.
- Archivio dei contenuti e registro degli errori.
- Autenticazione e accesso riservato.

## Canali previsti
Facebook, Instagram, LinkedIn, YouTube, Google Business Profile e WordPress. Ogni integrazione va implementata e verificata con API ufficiali, autorizzazioni, permessi e limiti specifici; non presumere che tutte le tipologie di post siano pubblicabili automaticamente.

## Integrazioni future
Canva, Claude, CapCut (da verificare disponibilità di API), campagne Meta/Google Ads, risposte e contatti automatici con consenso. Koala escluso dalla prima fase.

## Architettura
Separare frontend, backend/API, database, connettori dei canali, scheduler/worker e generazione AI. Conservare token e segreti solo lato server, mai nel repository. Preparare test, backup, gestione errori, permessi, log e controllo costi. Distribuzione cloud su Render, regione europea ove disponibile.

## Vincoli
- Non pubblicare senza approvazione esplicita.
- Revisione umana delle informazioni previdenziali, dei numeri e dei contenuti assicurativi prima della pubblicazione.
- Rispetto GDPR, informative e consensi per comunicazioni commerciali.
- Non modificare il sito WordPress esistente senza autorizzazione.
- Evitare abbonamenti e servizi a pagamento senza approvazione.


## Modulo AI multi-fornitore — progettazione approvata
- Provider intercambiabili: OpenAI (testi e strategia), Anthropic Claude (analisi e revisione), Canva (progetti grafici tramite integrazioni ufficiali disponibili).
- CapCut: integrazione da valutare; non promettere API o esportazione automatica senza verifica.
- Pipeline per contenuto: brief → generazione → revisione → grafica → approvazione umana → programmazione.
- Interfaccia unica in italiano; selezione del provider per attività, con fallback configurabile.
- Ogni provider usa credenziali proprie archiviate esclusivamente sul server; mai nel browser o su GitHub.
- Attivare chiamate esterne solo dopo configurazione esplicita e valutazione dei costi API.
- Prevedere quote, limiti di spesa, gestione errori e registro delle generazioni.
- Gli abbonamenti consumer a ChatGPT/Claude/Canva non equivalgono necessariamente all'accesso API.
- I contenuti previdenziali devono essere verificati prima della pubblicazione; non inventare statistiche o rendimenti.
