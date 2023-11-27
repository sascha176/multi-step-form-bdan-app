import { defineStore } from 'pinia';
import FirebaseService from '../services/FirebaseService';

//interfaces
export interface PruefungsstaetteData {
  name: string;
  strasse: string;
  hausnr: string;
  plz: string;
  ort: string;
  datum: string;
}


interface PersonlicheDaten {
  name: string;
  vorname: string;
  strasse: string;
  hausnr: string;
  plz: string;
  ort: string;
  geburtstag: string;
  geburtsort: string;
  beruf?: string;
}

interface PruefungData {
  anzahlPruefung: string;
  artPruefung: string;
}

interface PruefungReq {
  ausweisDokument: string;
  zustimmungU18?: boolean;
  zustimmungU18Bemerkung?: string;
  zustimmungU18Datum?: string;
  a1a3Gueltig: boolean;
  a1a3Datum: string;
  a1a3eID: string;
  praxisTraining: string;
  praxisTrainingDatum: string;
  pruefungVorrausetzungBemerkung?: string;
  praxisTrainingTrainer?: string;

}

interface ErklaerungSelbststudium {
  hersteller: string;
  modellbezeichnung: string;
  uaTyp: string;
  startmasse: string;
  steuerungsModi: string;
  kennzeichnungUAS: boolean;
}

interface TrainingsSchritte {
  flugvorbereitung: string[];
  vorflugkontrolle: string[];
  flugNormaleBedingungen: string[];
  flugAbnormaleBedingungen: string[];
  einsatzbesprechung: string[];
}

interface SignatureData {
  unterschrift: string;
  ort: string;
  datum: string;

}


export interface PrueflingData {
  pruefungsstaetteData: PruefungsstaetteData;
  personlicheDaten: PersonlicheDaten;
  pruefungData: PruefungData;
  pruefungReq: PruefungReq;
  erklärungSelbststudium: ErklaerungSelbststudium;
  trainingsschritte: TrainingsSchritte;
  angabenKorrekt: boolean;
}


export const usePrueflingStore = defineStore({
  id: 'pruefling',
  state: () => ({
    pruefungsstaetteData: {} as PruefungsstaetteData,
    personlicheDaten: {} as PersonlicheDaten,
    pruefungData: {} as PruefungData,
    pruefungReq: {} as PruefungReq,
    erklärungSelbststudium: {} as ErklaerungSelbststudium,
    trainingsschritte: {} as TrainingsSchritte,
    email: '',
    signatureData: {} as SignatureData,
    currentStep: {} as string,
    //variablen zur validierungshilfe
    angabenKorrekt: false,
    formValidate: false,
    //kontrollvariablen um das rendering einzelner ui elemente zu steuern
    submitCheck: false, 
    formCheck: true, 
    selector: '',
    errorMsg: false,



  }),

  actions: {
    //funktion  um alle daten in der dtaenbank zu speichern
    async savePrueflingToDatabase() {
      try {

        const firebaseService = new FirebaseService();
        const prueflingData = {
          pruefungsstaetteData: this.pruefungsstaetteData,
          personlicheDaten: this.personlicheDaten,
          pruefungData: this.pruefungData,
          pruefungReq: this.pruefungReq,
          erklärungSelbststudium: this.erklärungSelbststudium,
          trainingsschritte: this.trainingsschritte,
          angabenKorrekt: this.angabenKorrekt,
          email: this.email,

        };
        this.clearAllData();
        
        await firebaseService.savePruefling(prueflingData);
        console.log('speichern erfolgreich')
      } catch (error) {
        this.errorMsg = true;
        console.error('Fehler beim Laden der Prüfungstermine:', error);
        throw error;
      }
    },

    clearAllData() {
      this.pruefungsstaetteData = {} as PruefungsstaetteData;
      this.personlicheDaten = {} as PersonlicheDaten;
      this.pruefungData = {} as PruefungData;
      this.pruefungReq = {} as PruefungReq;
      this.erklärungSelbststudium = {} as ErklaerungSelbststudium;
      this.trainingsschritte = {} as TrainingsSchritte;
      this.signatureData = {} as SignatureData;
      this.angabenKorrekt = false;
      this.formValidate = false;
      this.errorMsg = false;
      this.selector = '';

    },

    //Funktionen zum speichern der daten im store
    setIsChecked(data: boolean) {
      this.angabenKorrekt = data;
    },


    saveEmail(data: string) {
      this.email = data;
    },
    savePrueflingValidate(data: SignatureData) {
      this.signatureData = data;
    },

    savePruefungsstaetteData(data: PruefungsstaetteData) {
      this.pruefungsstaetteData = data;
    },

    savePersonlicheDaten(data: PersonlicheDaten) {
      this.personlicheDaten = data;
    },

    savePruefungDaten(data: PruefungData) {
      this.pruefungData = data;
    },

    savePruefungReq(data: PruefungReq) {
      this.pruefungReq = data;
    },

    saveSelbststudium(data: ErklaerungSelbststudium) {
      this.erklärungSelbststudium = data;
    },

    saveTrainSteps(data: TrainingsSchritte) {
      this.trainingsschritte = data;
    }
  },
});