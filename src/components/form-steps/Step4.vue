<template>
  <ion-grid>
  <div class="form-part">
      <ion-row>
        <h3>1. Gültiges Identitätsdokument</h3>
      </ion-row>
      <ion-row>
        <ion-radio-group v-model="pruefungReq.ausweisDokument">
          <ion-radio class="ion-padding-horizontal" labelPlacement="end" v-for="idItem in idItems" :key="idItem"
            :value="idItem" :checked="idItem === pruefungReq.ausweisDokument"><div class="ion-text-wrap">{{ idItem }}</div></ion-radio>
        </ion-radio-group>
      </ion-row>

  </div>
  <div v-if="!is18" class="form-part">
    <ion-row>
      <h3>2. Zustimmung des gesetzl. Vertreters, wenn unter 18 Jahren alt</h3>
    </ion-row>

    <ion-row>
      <ion-col>
        <ion-checkbox v-model="pruefungReq.zustimmungU18"
          :class="{ 'error-input': pruefungReq.zustimmungU18 === false }">Vorhanden</ion-checkbox>
      </ion-col>
      <ion-col>
        <ion-input label-placement="floating" fill="solid" label="Datum" placeholder="Datum"
          v-model="pruefungReq.zustimmungU18Datum"
          :class="{ 'error-input': isEmpty(pruefungReq.zustimmungU18Datum) }"></ion-input>
      </ion-col>
    </ion-row>

    <ion-row>
      <ion-input label-placement="floating" fill="solid" label="Bemerkung" placeholder="Bemerkung"
        v-model="pruefungReq.zustimmungU18Bemerkung"></ion-input>
    </ion-row>
  </div>

  <div class="form-part">
    <ion-row>
      <ion-col>
        <h3>3. EU-Kompetenznachweis A1/A3 vom:</h3>
      </ion-col>
      
    </ion-row>

    <ion-row>
      <ion-col>
        <ion-input label-placement="floating" fill="solid" label="Datum" placeholder="Ausstellungsdatum A1/A3"
          v-model="pruefungReq.a1a3Datum" :class="{ 'error-input': isEmpty(pruefungReq.a1a3Datum) }"></ion-input>
      </ion-col>
      <ion-col>
        <ion-checkbox v-model="pruefungReq.a1a3Gueltig"
          :class="{ 'error-input': pruefungReq.a1a3Gueltig === false }">gültig?</ion-checkbox>
      </ion-col>
    </ion-row>
    <ion-row>
      <ion-col>
        <ion-input label="Eintrag eID:: Fernpilot" placeholder="-RP-" label-placement="floating" fill="solid" v-model="pruefungReq.a1a3eID"
          :class="{ 'error-input': isEmpty(pruefungReq.a1a3eID) }"></ion-input>
      </ion-col>
    </ion-row>
  </div>

  <div class="form-part">
    <ion-row>
      <ion-col>
        <h3>4. Selbsterklärung / Nachweis praktisches Training UAS.OPEN.040 vom:</h3>
      </ion-col>
    </ion-row>

    <ion-row>
      <ion-col>
        <ion-input label-placement="floating" fill="solid" label="Datum"
          placeholder="Praxistraining Datum" v-model="pruefungReq.praxisTrainingDatum"
          :class="{ 'error-input': isEmpty(pruefungReq.praxisTrainingDatum) }"></ion-input>
      </ion-col>
      <ion-col>
        <ion-radio-group v-model="pruefungReq.praxisTraining">
          <ion-radio class="ion-padding" v-for="trainItem in trainItems" :key="trainItem" :value="trainItem"
            :checked="trainItem === pruefungReq.praxisTraining" label-placement="end" justify="start"
            ><div class="ion-text-wrap">{{ trainItem }}</div></ion-radio>
        </ion-radio-group>
      </ion-col>
    </ion-row>
    <ion-row v-if="pruefungReq.praxisTraining === 'Nachweis'">
      <ion-col>
        <ion-input label="Nachweis" placeholder="Bei wem wurde der Nachweis erbracht?"
        v-model="pruefungReq.praxisTrainingTrainer" :class="{ 'error-input': isEmpty(pruefungReq.praxisTrainingTrainer) }"
        fill="solid" label-placement="floating"></ion-input>
      </ion-col>
    </ion-row>
  </div>

  <div class="form-part">
    <ion-row>
      <ion-col>
        <ion-input label-placement="floating" fill="solid" label="Bemerkung" placeholder="Bemerkung (freiwillige Angabe)"
        v-model="pruefungReq.pruefungVorrausetzungBemerkung"></ion-input>
      </ion-col>
      
    </ion-row>
  </div>
</ion-grid>
<!-- Normale Abfrage zu Form validierung wenn Felder leer wird meldung ausgegeben. In den entsprechenden input fields wird dann die klasse mit v-bind (':class') an die attribute gebunden-->
  <p v-if="isEmpty(pruefungReq.praxisTrainingTrainer && pruefungReq.a1a3eID && pruefungReq.a1a3Datum && pruefungReq.praxisTrainingDatum)"
    class="error-message">Bitte alle Felder ausfüllen!</p>

  <p v-if="!is18 && pruefungReq.zustimmungU18 === false" class="error-message">Minderjährige Prüflinge benötigen die
    Zustimmung eines gesetzlichen Vormunds</p>

  <p v-if="pruefungReq.a1a3Gueltig === false" class="error-message">Achtung! Gültige A1/A3 Lizenz muss vorhanden sein
  </p>
</template>

<script lang="ts" setup>
import {
  IonCheckbox,
  IonGrid,
  IonCol,
  IonInput,
  IonRadio,
  IonRadioGroup,

  IonRow
} from '@ionic/vue';
import { ref, computed, onMounted, watch } from 'vue';
import { usePrueflingStore } from '../../stores/UserDataStore';
import { calculateAge } from '@/services/helpers';
import { isEmpty, checkIfUndefined } from '@/services/helpers';

//Data
const prueflingStore = usePrueflingStore();
const is18 = calculateAge(prueflingStore.personlicheDaten.geburtstag);

const idItems = ['Reisepass', 'Personalausweis'];
const trainItems = ['Selbsterklärung', 'Nachweis'];

const pruefungReq = ref({

  ausweisDokument: prueflingStore.pruefungReq.ausweisDokument,
  zustimmungU18: prueflingStore.pruefungReq.zustimmungU18,
  zustimmungU18Bemerkung: prueflingStore.pruefungReq.zustimmungU18Bemerkung || '',
  zustimmungU18Datum: prueflingStore.pruefungReq.zustimmungU18Datum,
  a1a3Gueltig: prueflingStore.pruefungReq.a1a3Gueltig,
  a1a3Datum: prueflingStore.pruefungReq.a1a3Datum,
  a1a3eID: prueflingStore.pruefungReq.a1a3eID,
  praxisTraining: prueflingStore.pruefungReq.praxisTraining,
  praxisTrainingDatum: prueflingStore.pruefungReq.praxisTrainingDatum,
  pruefungVorrausetzungBemerkung: prueflingStore.pruefungReq.pruefungVorrausetzungBemerkung || '',
  praxisTrainingTrainer: prueflingStore.pruefungReq.praxisTrainingTrainer
});

//wenn prüfling über 18 ist müssen die felder für minderjährige ausgefiltert werden das passiert mit dieser computed property
const pruefungReqFiltered = computed(() => {
  if (is18) {
    const { zustimmungU18, zustimmungU18Datum, zustimmungU18Bemerkung, ...filteredReq } = pruefungReq.value;
    return filteredReq;
  }
 
  return pruefungReq.value;
});

//methods
watch(pruefungReqFiltered, (newValue) => {
  if(newValue.praxisTraining === "Selbsterklärung"){ //wenn das feld 'Nachweis'markiert ist wird ein entsprechendes zusatzfeld gerendert wo eingegeben werden soll bei wem der nachweis erbracht worden ist
      newValue.praxisTrainingTrainer = '-' //Leider ist mir nichts anderes eingefallen, wenn nachweis nicht ausgewählt ist, wird '-' als wert gesetzt da sonst probleme aufgrund der checkIfUndefined methode
    }
  prueflingStore.savePruefungReq(newValue);
  if (checkIfUndefined(newValue)) {
    prueflingStore.formValidate = false;
  } else {
    prueflingStore.formValidate = true;
  }

},
  { deep: true })


//Methods
onMounted(() => {

  if (checkIfUndefined(pruefungReqFiltered.value)) {

    prueflingStore.formValidate = false;
  } else {

    prueflingStore.formValidate = true;
  }
});


</script>

<style scoped>


</style>