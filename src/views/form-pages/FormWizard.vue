<template>
  <ion-page>
    <ion-content>

      <div v-show="!prueflingStore.formCheck && !prueflingStore.submitCheck" class="form-header">
        <div class="progress-bar">
          <!-- der progress bar erhält als styling die größe, welche der prozentanzahl der progresspercentage property entspricht das ganze funktioniert mit der v-bind direktive (shorthand ':') welche
          dem div element ein style attribut mit dem entsprechendem wert für die breite zuweist-->
          <div class="progress" :style="{ width: progressPercentage }"></div>
        </div>
        <p>{{ currentStepIndex + 1 }} / {{ 10 }}</p>
        <h2>{{ stepTitles[currentStepIndex] }}</h2>
        <p v-show="currentStepIndex != 9">(zutreffendes bitte ankreuzen / ausfüllen)</p>
      </div>
      <div class="content-area">
        <select-exam v-show="prueflingStore.formCheck" />
        <component v-if="!prueflingStore.formCheck" :is="currentStep.component"></component>
      </div>

      <div v-show="!prueflingStore.formCheck && !prueflingStore.submitCheck" class="nav-btns">
        <ion-button fill="outline" @click="previousStep">Zurück</ion-button>
        <ion-button v-if="currentStepIndex < 9" @click="nextStep"
          :disabled="currentStepIndex === steps.length || currentStepIndex === 5 && !prueflingStore.angabenKorrekt || !prueflingStore.formValidate">Weiter</ion-button>
        <ion-button @click="submitForm" :disabled="!(prueflingStore.formValidate && prueflingStore.angabenKorrekt)"
          v-else>Anmelden</ion-button>
      </div>
      <ion-alert :is-open="isOpen" header="Achtung!" sub-header="Daten gehen verloren."
        message="Wenn du diese Seite verlässt, gehen deine Daten unwiederuflich verloren."
        :buttons="alertButtons"></ion-alert>

    </ion-content>
  </ion-page>
</template>
    
<script lang="ts" setup>
import { ref, computed, watch, shallowRef } from 'vue';
import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router';
import axios from 'axios';

import Step1 from '../../components/form-steps/Step1.vue';
import Step2 from '../../components/form-steps/Step2.vue';
import Step3 from '../../components/form-steps/Step3.vue';
import Step4 from '../../components/form-steps/Step4.vue';
import Step5 from '../../components/form-steps/Step5.vue';
import Step6 from '../../components/form-steps/Step6.vue';
import Step7 from '../../components/form-steps/Step7.vue';
import Step8 from '../../components/form-steps/Step8.vue';
import Step9 from '../../components/form-steps/Step9.vue';
import Step10 from '../../components/form-steps/Step10.vue';
import SelectExam from './SelectExam.vue';
import {
  IonButton,
  IonPage,
  IonContent,
  IonAlert,
} from '@ionic/vue';
import { usePrueflingStore } from '@/stores/UserDataStore';


//data
const handlerMessage = ref('');
const isOpen = ref(false);
const alertButtons = [
  {
    text: 'Abbrechen',
    role: 'cancel',
    handler: () => {
      handlerMessage.value = 'no';
      isOpen.value = false;
    },
  },
  {
    text: 'Ok',
    role: 'confirm',
    handler: () => {
      handlerMessage.value = 'yes';
    },
  },
];
const setOpen = (state: boolean) => {
  isOpen.value = state;
};

//computed property berechnet formularfortschritt in prozent, dieser dient dann als grundlage für die grafische darstellung des fortschrittbalkens. der prozentwert wird als inline style dem progressbar zugeordnet
const progressPercentage = computed(() => {
  return ((currentStepIndex.value + 1) / steps.value.length) * 100 + '%';
});

// als shallowRef anstatt ref da es sich heir um große daten handelt, ionic fehlermeldung sagte dass das so der beste weg ist
const steps = shallowRef([

  { component: Step1 },
  { component: Step2 },
  { component: Step3 },
  { component: Step4 },
  { component: Step5 },
  { component: Step6 },
  { component: Step7 },
  { component: Step8 },
  { component: Step9 },
  { component: Step10 },

]);

const stepTitles = [
  'Betriebs- & Prüfungsstätte',
  'Bewerber',
  'Die Prüfung soll durchgeführt werden als',
  'Prüfung der Voraussetzungen gemäß DVO(EU) - 2019 / 947',
  'Erklärung über die erfolgreiche Absolvierung des praktischen Selbststudiums zum Erwerb eines Fernpiloten-Zeugnisses für UAS in der Kategorie Offen, Unterkategorie A2',
  'Erklärung über die erfolgreiche Absolvierung des praktischen Selbststudiums zum Erwerb eines Fernpiloten-Zeugnisses für UAS in der Kategorie Offen, Unterkategorie A2',
  'PHB.04.03 Verzichtserklärung des Bewerbers gegenüber der benannten Stelle DE.PStF.010 UAVDACH-Services UG anlässlich seiner Bewerbung zur Ausbildung und Prüfung Fernpilotenzeugnis',
  'PHB.04.04 Einwilligungserklärung des Bewerbers zur Datenverarbeitung durch die benannte Stelle DE.PStF.010 UAVDACH-Services UG anlässlich meiner Bewerbung zur Ausbildung und Prüfung Fernpilotenzeugnis A2',
  'PHB.04.06 Erklärung zum Fragenkatalog-Inhalt .010 anlässlich der Bewerbung zur Prüfung Fernpilotenzeugnis A2 bei der bekannten Stelle DE.PStF.010 UAVDACH-Services UG',
  'Abschluss'
]



const prueflingStore = usePrueflingStore();
const currentStepIndex = ref(0);

const currentStep = computed(() => {
  return steps.value[currentStepIndex.value];
});


//methods

//bevor pfad verlassen wird, wird der navigation guard ausgelöst
onBeforeRouteLeave((to, from, next) => {

  if (from.path === '/form') {
    // hier abfrage anhand der kontrollvariablen, da nach dem absenden des formulars warnung dass die daten verloren gehen unnötig ist, da diese ja bereits an db geschickt wurden.
    // deshalb wird alert nicht mehr angezeigt
    if (prueflingStore.submitCheck === true && prueflingStore.formCheck === false || prueflingStore.selector === '' && prueflingStore.formCheck === true) {
      prueflingStore.submitCheck = false;
      prueflingStore.formCheck = true;
      currentStepIndex.value = 0;
      next();

    } else {
      //wird das formular vor dem absenden der daten verlassen, wird alert mit warnung ausgegeben welcher nach bestätgiung dann alle daten zurücketzt
      setOpen(true);
      if (handlerMessage.value === 'yes') {
        handlerMessage.value = '';
        prueflingStore.submitCheck = false;
        prueflingStore.formCheck = true;
        currentStepIndex.value = 0;
        prueflingStore.clearAllData();
        setOpen(false);
        next();
      } else {
      
        handlerMessage.value = '';
        next(false);
      }
    }
  }
});



const previousStep = () => {
  if (currentStepIndex.value === 0) {
    prueflingStore.formCheck = true;
  }
  else {
    currentStepIndex.value--;
  }
};

const nextStep = () => {
  currentStepIndex.value++;
};


//Funktion zum abschicken des formulars, es wird die funktion zum speichern aufgerufen, die entsprechende kontrollvariablen gsetzt und mit axios der wert dfür die email an die php datei gesendet
const submitForm = async () => {

  try {
    prueflingStore.submitCheck = true;
    prueflingStore.savePrueflingToDatabase();
    const formData = new FormData();
    formData.append('email', prueflingStore.email);

    const response = await axios.post('/bdan-app/mail.php', formData);
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
};


</script>
    
<style scoped>
.form-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;

}


.progress-bar {
  background-color: #f0f0f0;
  height: 10px;
  border-radius: 5px;
  margin: 1.2rem 0 0 1rem;
  min-width: 400px;
}

.progress {
  height: 100%;
  border-radius: 5px;
  background-color: #56b3f9;
}

.nav-btns {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 3rem;
  padding: .9rem;

}

.content-area {
  max-width: 700px;
  margin: auto;
}

p {
  margin: .2rem;
}

h2 {
  margin: .4rem;
}
</style>