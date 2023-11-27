<template>
    <ion-page>
        <ion-content>
            
            <div v-show="prueflingStore.selector === ''" id="select">
                <h1>PHB 04.01 Bewerbungsbogen - für Fernpilotenzeugnis-Prüfung nach UAS.OPEN.030 (2) DVO(E)-2019/947</h1>

                <p>
                    Prüfungstermine werden zwischen Intern & Extern unterschieden. Folgen Sie dem für Sie relevanten Button,
                    wählen Sie ihr gewünschtes Datum / ihren gewünschten Prüfungsort und folgen Sie den nächsten zehn
                    Schritte,
                    um sich für die Fernpilotenzeugnis-Prüfung anzumelden.
                </p>

                <p class="error-message">
                    Bitte beachten Sie, dass sie die Anmeldung nicht unterbrechen können, deshalb planen Sie genug Zeit ein,
                    um
                    den gesamten Prozess zu durchlaufen.
                </p>
                <div id="selectBtn-container">
                    <ion-button class="ion-text-wrap selectBtn" @click="selectIntOrExt('intern')">
                        <div class=“selectBtn-content”>
                            <ion-icon :src="internIcon" style="width: 75px; height: 50px;"></ion-icon>
                            <p>Intern</p>
                            <p class="subtext">(Studenten, Mitarbeiter)</p>
                        </div>
                    </ion-button>

                    <ion-button class="ion-text-wrap selectBtn" @click="selectIntOrExt('extern')">
                        <div class=“selectBtn-content”>
                            <ion-icon :src="externIcon" style="width: 75px; height: 50px;"></ion-icon>
                            <p>Extern</p>
                            <p class="subtext">(Bauwesen, BOS, Landwirtschaft, etc)</p>
                        </div>
                    </ion-button>
                </div>

            </div>
            <div v-show="prueflingStore.selector" id="examDates">
                <h1>Kosten & Termine zur Prüfung</h1>
                <h2>Kosten:</h2>
                <ion-list v-if="examsLoaded">
                    <ion-item>
                        <ion-text class="ion-text-wrap" v-show="prueflingStore.selector === 'intern'">{{ grundkosten
                        }}</ion-text>
                        <ion-label v-show="prueflingStore.selector === 'extern'">{{ kostenExtern }}</ion-label>
                    </ion-item>
                    <ion-item>
                        <ion-text class="ion-text-wrap"> {{ verwaltungskosten }}</ion-text>
                    </ion-item>
                </ion-list>

                <h2>Termine</h2>
                <p>Alle Termine zu unserem Prüfungsangebot können Sie folgender Tabelle entnehmen:</p>

                <ion-grid v-if="examsLoaded && prueflingStore.selector === 'intern'">
                    <ion-row class="row" v-for="exam in sortedExams" :key="exam.id">
                        <ion-col>
                            {{ exam.datum }}
                        </ion-col>
                        <ion-col>
                            {{ exam.ort }}
                        </ion-col>
                        <ion-col>
                            <ion-button @click="saveInputs(exam.datum, exam.ort)">Anmelden</ion-button>
                        </ion-col>
                    </ion-row>
                </ion-grid>

                <ion-grid v-if="examsLoaded && prueflingStore.selector === 'extern'">
                    <ion-row class="row" v-for="exam in sortedExamsExtern" :key="exam.id">
                        <ion-col>
                            {{ exam.datum }}
                        </ion-col>
                        <ion-col>
                            {{ exam.typ }}
                        </ion-col>
                        <ion-col>
                            <ion-button v-if="exam.typ === 'Prüfung'"
                                @click="saveInputs(exam.datum, exam.ort)">Anmelden</ion-button>
                        </ion-col>
                    </ion-row>
                </ion-grid>
                <ion-button v-show="prueflingStore.selector != ''" @click="selectIntOrExt('')">Zurück zur Auswahl</ion-button>
            </div>
            
         
            
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import {
    IonList,
    IonItem,
    IonLabel,
    IonTitle,
    IonGrid,
    IonCol,
    IonRow,
    IonButton,
    IonIcon,
    IonPage,
    IonContent,
    IonText,
} from '@ionic/vue';
import { ref, computed, onMounted, onBeforeMount, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useExamStore } from '../../stores/ExamStore';
import { usePrueflingStore } from '../../stores/UserDataStore';
import { storeToRefs } from 'pinia';
import internIcon from '../../assets/img/u88.svg'
import externIcon from '../../assets/img/u93.svg'
const examStore = useExamStore();

//data

let selector = ref('');
const selectIntOrExt = (type: string) => {
    prueflingStore.selector = type;
    if (type === 'intern') {
        return true;
    }

    else {
        return false;
    }

};

const prueflingStore = usePrueflingStore();

const {
    grundkosten,
    verwaltungskosten,
    kostenExtern,
    exams,
    examsExtern,
    examsLoaded,
} = storeToRefs(examStore);

const {
    loadExams,
    sortByDate,
    getAddressByOrt
} = examStore;

const sortedExams = computed(() => sortByDate(exams.value));
const sortedExamsExtern = computed(() => sortByDate(examsExtern.value));


const examOrt = ref('');
const examTermin = ref('');
const examName = ref('');
const examStrasse = ref('');
const examHausnr = ref('');
const examPlz = ref('');


//methods
onMounted(() => {
    try {
        loadExams();
    } catch (error) {
        console.error('Fehler beim Laden der Prüfungstermine:', error);
    }
});


function saveInputs(datum: string, ort: string) {
    examOrt.value = ort;
    examTermin.value = datum;
    const examAddresses = computed(() => getAddressByOrt(examOrt.value));

    if (examAddresses.value) {
        examName.value = examAddresses.value.name;
        examStrasse.value = examAddresses.value.strasse;
        examHausnr.value = examAddresses.value.hausnr;
        examPlz.value = examAddresses.value.plz;

        prueflingStore.pruefungsstaetteData.name = examAddresses.value.name;
        prueflingStore.pruefungsstaetteData.ort = ort;
        prueflingStore.pruefungsstaetteData.datum = datum;
        prueflingStore.pruefungsstaetteData.strasse = examAddresses.value.strasse;
        prueflingStore.pruefungsstaetteData.hausnr = examAddresses.value.hausnr.toString();
        prueflingStore.pruefungsstaetteData.plz = examAddresses.value.plz.toString();
    }


    prueflingStore.formCheck = false;
}

</script>

<style scoped>


#selectBtn-container {
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin-top: 4rem;
    flex-wrap: wrap;
}



.selectBtn {
    height: 15rem;
    margin: .6rem;
    width: 30rem;
    flex: 1 0 0;
    --border-radius: 15px
}

h1 {
    text-align: center;

}

h2 {
    text-align: center;
}

p {
    margin: .8rem;
    text-align: center;
}

.row:nth-child(even) {
    background-color: #6fccf7;
}

#examDates, #select {
    max-width: 700px;
    margin: auto;
}

#back {
  
}
</style>
