import { defineStore } from 'pinia';
import FirebaseService from '../services/FirebaseService';


//interfaces
interface Exam {
  id: number;
  datum: string;
  ort: string;
}

interface ExamExtern {
  id: number;
  datum: string;
  typ: string;
  ort: string;
}

interface ExamsAdresses {
  id: number;
  plz: string;
  strasse: string;
  hausnr: string;
  name: string;
}



export const useExamStore = defineStore({
  id: 'exam',
  state: () => ({
    grundkosten: '',
    verwaltungskosten: '',
    kostenExtern: '',
    exams: [] as Exam[],
    examsExtern: [] as ExamExtern[],
    examsAddresses: [] as ExamsAdresses[],
    flugvorbereitung: [] as string[],
    vorflugkontrolle: [] as string[],
    flugNormaleBedingungen: [] as string[],
    flugAbnormaleBedingungen: [] as string[],
    einsatzbesprechung: [] as string[],
    examsLoaded: false
  }),

  actions: {

    loadExams() {
      try {
        const firebaseService = new FirebaseService();
        firebaseService.loadExamsDatabase()
          .then((examsData) => {

            this.grundkosten = examsData.grundkosten;
            this.kostenExtern = examsData.kostenExtern;
            this.verwaltungskosten = examsData.verwaltungskosten;
            this.exams = examsData.pruefungsTermine;
            this.examsExtern = examsData.externePruefungsTermine;
            this.examsAddresses = examsData.pruefungsAdressen;
            this.flugvorbereitung = examsData.trainingsschritte.flugvorbereitung;
            this.vorflugkontrolle = examsData.trainingsschritte.vorflugkontrolle;
            this.flugNormaleBedingungen = examsData.trainingsschritte.flugNormaleBedingungen;
            this.flugAbnormaleBedingungen = examsData.trainingsschritte.flugAbnormaleBedingungen;
            this.einsatzbesprechung = examsData.trainingsschritte.einsatzbesprechung;

            // Benachrichtige die Komponente über das geladene examsData
            this.examsLoaded = true;
          })

      } catch (error) {
        console.error('Fehler beim Laden der Prüfungstermine:', error);
        throw error;
      }
    },

    //Jenachdem welcher Prüfungsstandort ausgewählt wird, wird die entsprechende Adresse herausgesucht und eingesetzt
    getAddressByOrt(ort: string) {
      return this.examsAddresses.find((address: any) => address.name.includes(ort)) || null;
    },

    // Die prüfungstermie werden nach Datum sortiert
    sortByDate<T extends Exam | ExamExtern>(examList: T[]): T[] {
      return examList.slice().sort((a, b) => {
        const [dayA, monthA, yearA] = a.datum.split('.');
        const [dayB, monthB, yearB] = b.datum.split('.');
        const dateA = new Date(`${yearA}-${monthA}-${dayA}`);
        const dateB = new Date(`${yearB}-${monthB}-${dayB}`);
        return dateA.getTime() - dateB.getTime();
      });
    },
  },
});

