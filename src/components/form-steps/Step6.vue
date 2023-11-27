<template>
  <ion-list>
    <p class="check-steps" :class="{ 'error-message': !trainStepsSolved }">
      Haken Sie durchgeführte Trainingsschritte bitte ab!
    </p>
    <div id="page1" v-show="currentPage === 1">
      <ion-text>
        <h2>1. Das von mir durchgeführte Selbsttraining beinhaltete folgende Trainingsinhalte</h2>
      </ion-text>
      <ion-text>
        <h3>1.1 Flugvorbereitung</h3>
        <p>Sicherstellung, dass</p>
      </ion-text>
      <ion-item v-for="(step1Item, index) in step1Items" :key="step1Item">
        <div :class="{ 'indented-content': index < 3 }">
          <ion-checkbox @ionChange="checkboxHandler(step1Item, 0)" label-placement="end"
            :checked="isCheckedTrue(step1Item)" :value="step1Item">
            <div class="ion-text-wrap">{{ step1Item }}</div>
          </ion-checkbox>
        </div>
      </ion-item>
    </div>
    <div id="page2" v-show="currentPage === 2">
      <ion-text>
        <h3>1.2 Vorflugkontrolle</h3>
      </ion-text>
      <ion-item v-for="step2Item in step2Items" :key="step2Item">
        <ion-checkbox label-placement="end" justify="start" @ionChange="checkboxHandler(step2Item, 1)" :value="step2Item"
          :checked="isCheckedTrue(step2Item)">
          <div class="ion-text-wrap">{{
            step2Item }}</div>
        </ion-checkbox>
      </ion-item>
    </div>

    <div id="page3" v-show="currentPage === 3">
      <ion-text>
        <h3>1.3 Flug unter normalen Bedingungen</h3>
        <p>Vertraut machen mit folgenden Prozeduren, welche im Betriebshandbuch vom Hersteller vorgegeben sind</p>
      </ion-text>
      <div v-for="(step3Item, index) in step3Items" :key="step3Item">
        <ion-item >
          <div :class="{ 'indented-content': index > 0 }">
            <ion-checkbox label-placement="end" justify="start" @ionChange="checkboxHandler(step3Item, 2)"
              :value="step3Item" :checked="isCheckedTrue(step3Item)">
              <div class="ion-text-wrap">{{
                step3Item }}</div>
            </ion-checkbox>
        
          </div>
        </ion-item>
        <ion-item v-if="index < 1">
          <p>
            Erreichen eines stabilen Flugzustands
          </p>
        </ion-item>
      </div>
    </div>


    <div id="page4" v-show="currentPage === 4">
      <ion-text>
        <h3>1.4 Flug unter abnormalen Bedingungen</h3>
      </ion-text>
      <ion-item v-for="step4Item in step4Items" :key="step4Item">
        <ion-checkbox label-placement="end" justify="start" @ionChange="checkboxHandler(step4Item, 3)" :value="step4Item"
          :checked="isCheckedTrue(step4Item)">
          <div class="ion-text-wrap">{{
            step4Item }}</div>
        </ion-checkbox>
      </ion-item>
    </div>

    <div id="page5" v-show="currentPage === 5">
      <ion-text>
        <h3>1.5 Einsatzvorbesprechung, Einsatznachbesprechung, Rückmeldung</h3>
      </ion-text>
      <ion-item v-for="step5Item in step5Items" :key="step5Item">
        <ion-checkbox label-placement="end" justify="start" @ionChange="checkboxHandler(step5Item, 4)" :value="step5Item"
          :checked="isCheckedTrue(step5Item)">
          <div class="ion-text-wrap">{{
            step5Item }}</div>
        </ion-checkbox>
      </ion-item>

      <ion-text>
        <h3>2. Erklärung</h3>
        <p class="ion-text-wrap">
          Hiermit bestätige ich, dass ich sämtliche oben aufgelisteten Übungen mit dem oben spezifizierten UAS erfolgreich
          absolviert habe. Dadurch habe ich aus meiner Sicht einen angemessenen theoretischen
          Wissensstand und angemessene praktische Fähigkeiten im Umgang mit dem UAS erworben, um ein UAS mit denselben
          Flugcharakteristiken, demselben Steuerungsmodus und ähnlichem Gewicht
          (Höchstzulässige Startmasse &lt 4kg) auch in Zukunft stets sicher entsprechend der eingeübten Prozeduren
          und Manöver kontrollieren zu können. Ich werde ein ausreichendes theoretisches und praktisches Training
          unter den Betriebsbedingungen der Unterkategorie A3 durchführen, bevor ich ein UAS mit wesentlich
          anderen Eigenschaften unter den Betriebsbedingungen der Unterkategorie A2 steuere.
        </p>
      </ion-text>

      <signature-validate />
      <ion-checkbox class="ion-padding" label-placement="end" v-model="isChecked">
        <div class="ion-text-wrap">Ich versichere, dass die vorstehenden Angabenvollständig und korrekt
          sind</div>
      </ion-checkbox>
    </div>
    <p class="error-message" v-if="!trainStepsSolved">Du solltest alle Trainingsschritte durchgeführt haben!</p>


    <div class="navigation-buttons">
      <ion-button @click="previousPage" :disabled="currentPage === 1">
        <ion-icon slot="icon-only" :icon="chevronBackOutline"></ion-icon>
      </ion-button>
      <p>{{ currentPage }} / {{ totalPageCount }}</p>
      <ion-button @click="nextPage" :disabled="currentPage === totalPageCount">
        <ion-icon slot="icon-only" :icon="chevronForwardOutline"></ion-icon>
      </ion-button>
    </div>
  </ion-list>
</template>

<script lang="ts" setup>
import {
  IonCheckbox,
  IonItem,
  IonButton,
  IonText,
  IonList,
  IonIcon,
} from '@ionic/vue';
import { ref, onMounted, watch, computed } from 'vue';
import { useExamStore } from '../../stores/ExamStore';
import { chevronBackOutline, chevronForwardOutline } from 'ionicons/icons'; // Icons für Navigationspfeile
import { usePrueflingStore } from '../../stores/UserDataStore';
import SignatureValidate from '../form-components/SignatureValidate.vue'
import { storeToRefs } from 'pinia';

//data
const prueflingStore = usePrueflingStore();
const currentPage = ref(1);
const totalPageCount = 5;
// Wert für Checkbox ob Angaben korrekt sind
const isChecked = ref();
let previousIsChecked = isChecked.value; // Vorheriger Wert von isChecked

// Leere Datensätze in welche die Werte aus der db eingelesen werden
const step1Items = ref<string[]>([]);
const step2Items = ref<string[]>([]);
const step3Items = ref<string[]>([]);
const step4Items = ref<string[]>([]);
const step5Items = ref<string[]>([]);


const stepChecked = ref<Array<string[]>>([
  prueflingStore.trainingsschritte.flugvorbereitung || [],
  prueflingStore.trainingsschritte.vorflugkontrolle || [],
  prueflingStore.trainingsschritte.flugNormaleBedingungen || [],
  prueflingStore.trainingsschritte.flugAbnormaleBedingungen || [],
  prueflingStore.trainingsschritte.einsatzbesprechung || [],
]);

//Computed Property welche berechnet ob alle Schritte markiert wurden, wenn nicht wird Meldung ausgegeben, formular kann aber trotzdem fortgesetzt werden werden.
const trainStepsSolved = computed(() => {
  return (
    stepChecked.value[0].length === step1Items.value.length &&
    stepChecked.value[1].length === step2Items.value.length &&
    stepChecked.value[2].length === step3Items.value.length &&
    stepChecked.value[3].length === step4Items.value.length &&
    stepChecked.value[4].length === step5Items.value.length
  );

});

const trainStepStore = useExamStore();

const {
  flugvorbereitung,
  vorflugkontrolle,
  flugNormaleBedingungen,
  flugAbnormaleBedingungen,
  einsatzbesprechung,
} = storeToRefs(trainStepStore);



//methods
// Methode zum überprüfen ob Checkbox markiert ist oder nicht ( bisschen umständlich aber ich habs nicht anders hinbekommen)
function isCheckedTrue(item: string) {
  for (let i = 0; i < 5; i++) {
    if (stepChecked.value[i] && stepChecked.value[i].includes(item)) {
      return true;
    }
  }
  return false;
}


// Bei Änderung von isChecked wird der Wert im Store abgelegt für zentralen Zugriff. Emit ist overkill (denke ich?)
watch(isChecked, (currentValue) => {
  if (currentValue !== previousIsChecked) { // Überprüfung auf Änderung
    prueflingStore.setIsChecked(currentValue); // Wert nur speichern, wenn er sich geändert hat
    previousIsChecked = currentValue; // Vorherigen Wert aktualisieren
  }
});


onMounted(() => {

  trainStepStore.loadExams;
  step1Items.value = flugvorbereitung.value;
  step2Items.value = vorflugkontrolle.value;
  step3Items.value = flugNormaleBedingungen.value;
  step4Items.value = flugAbnormaleBedingungen.value;
  step5Items.value = einsatzbesprechung.value;

  // Die  Werte werden direkt mit den Werten im Store synchronisiert
  const storedNewTrainstepsArray = [
    prueflingStore.trainingsschritte.flugvorbereitung,
    prueflingStore.trainingsschritte.vorflugkontrolle,
    prueflingStore.trainingsschritte.flugNormaleBedingungen,
    prueflingStore.trainingsschritte.flugAbnormaleBedingungen,
    prueflingStore.trainingsschritte.einsatzbesprechung
  ];

  for (let i = 0; i < storedNewTrainstepsArray.length; i++) {
    const storedNewTrainsteps = storedNewTrainstepsArray[i];
    // Überprüfung ob Werte vorhanden sind da sonst undefined und checkboxHandler nicht funktioniert
    if (storedNewTrainsteps) {
      stepChecked.value[i] = storedNewTrainsteps;
    }
  }

  // Wenn Wert vorhanden dann aus der Datenbank nehmen, ansonsten ist default wert (false) gesetzt
  const storedValue = prueflingStore.angabenKorrekt;
  if (storedValue) {
    isChecked.value = storedValue;
  }

});

function nextPage() {
  if (currentPage.value < totalPageCount) {
    currentPage.value++;
  }
}

function previousPage() {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
}

// ion-checkbox funktioniert nicht mit v-model daher eigene Methode, welche mit emit die Werte an Elternkomponente übergibt
function checkboxHandler(value: string, stepIndex: number) {
  const stepCheckedArray = stepChecked.value[stepIndex];
  const index = stepCheckedArray.indexOf(value);
  if (index > -1) {
    stepCheckedArray.splice(index, 1);
  } else {
    stepCheckedArray.push(value);
  }

}

watch(stepChecked, (newValues) => {

  // Aktualisierte Werte in den Store speichern
  prueflingStore.saveTrainSteps({
    flugvorbereitung: newValues[0],
    vorflugkontrolle: newValues[1],
    flugNormaleBedingungen: newValues[2],
    flugAbnormaleBedingungen: newValues[3],
    einsatzbesprechung: newValues[4],
  });
}, { deep: true });


</script>

<style scoped>


.navigation-buttons {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: .2rem;
}

.check-steps {
  text-decoration: underline;
  text-align: center;
}

.indented-content {
  margin-left: 3rem;
}

ion-item {
  padding-top: 1.5rem;
}

h2, h3 {
  margin: .9rem;
}
</style>