<template>
  <ion-grid >
    <div class="form-part">
      <ion-row class="ion-padding">
        <ion-col>
          <ion-input  v-model="examData.name" fill="solid" label-placement="floating" label="Name der Prüfungsstätte:" placeholder="Name"
          :class="{ 'error-input': isEmpty(examData.name) }"></ion-input>
        </ion-col>
  
      </ion-row>

      <ion-row class="ion-padding">
        <ion-col>
          <h3>(Geplanter) Prüfungsort Präsenzprüfung</h3>
        </ion-col>
        
      </ion-row>
      <ion-row  class="ion-padding">
        <ion-col>
          <ion-input v-model="examData.strasse" label-placement="floating" fill="solid" label="Straße:"
          placeholder="Straße" :class="{ 'error-input': isEmpty(examData.strasse) }"></ion-input>
        </ion-col>
      </ion-row>

      <ion-row  class="ion-padding">
        <ion-col size="12" size-sm="4">
          <ion-input v-model="examData.hausnr" label-placement="floating" fill="solid" label="Hausnr.::"
            placeholder="Hausnr." :class="{ 'error-input': isEmpty(examData.hausnr) }"></ion-input>
        </ion-col>
        <ion-col size="12" size-sm="4" >
          <ion-input v-model="examData.plz" label-placement="floating" fill="solid" label="Postleitzahl:"
            placeholder="PLZ" :class="{ 'error-input': isEmpty(examData.plz) }"></ion-input>
        </ion-col>

        <ion-col size="12" size-sm="4">
          <ion-input v-model="examData.ort" label-placement="floating" fill="solid" label="Ort:" placeholder="Ort"
            :class="{ 'error-input': isEmpty(examData.ort) }"></ion-input>
        </ion-col>
      </ion-row>
    </div>

    <div class="form-part">
      <ion-row class="ion-padding">
        <ion-col>
          <h3>geplanter Prüfungstermin</h3>
        </ion-col>
      </ion-row>
  
      <ion-row class="ion-padding">
        <ion-col>
          <ion-input v-model="examData.datum" label-placement="floating" fill="solid" label="Prüfungstermin:"
          placeholder="Datum" :class="{ 'error-input': isEmpty(examData.datum) }"></ion-input>
        </ion-col>
      </ion-row>
    </div>
   
  </ion-grid>

  <p v-if="isEmpty(examData.name && examData.strasse && examData.datum && examData.hausnr && examData.ort && examData.plz)"
    class="error-message">Bitte alle Felder ausfüllen!</p>


</template>
  
<script lang="ts" setup>
import { ref,  onMounted, watch } from 'vue';
import { usePrueflingStore } from '../../stores/UserDataStore';
import { isEmpty, checkIfUndefined } from '../../services/helpers';
import {
  IonInput,
  IonGrid,
  IonCol,
  IonRow
} from '@ionic/vue';


//Data

const prueflingStore = usePrueflingStore();

const examData = ref({
  name: prueflingStore.pruefungsstaetteData.name,
  strasse: prueflingStore.pruefungsstaetteData.strasse,
  hausnr: prueflingStore.pruefungsstaetteData.hausnr,
  plz: prueflingStore.pruefungsstaetteData.plz,
  ort: prueflingStore.pruefungsstaetteData.ort,
  datum: prueflingStore.pruefungsstaetteData.datum,

});



//methods

watch(examData, (newValue) => {
  prueflingStore.savePruefungsstaetteData(newValue);
  if (checkIfUndefined(newValue)) {
    prueflingStore.formValidate = false;
  } else {

    prueflingStore.formValidate = true;
  }
},
  { deep: true })

onMounted(() => {
  
  examData.value.name = prueflingStore.pruefungsstaetteData.name;
  examData.value.strasse = prueflingStore.pruefungsstaetteData.strasse,
  examData.value.hausnr = prueflingStore.pruefungsstaetteData.hausnr,
  examData.value.plz = prueflingStore.pruefungsstaetteData.plz,
  examData.value.ort = prueflingStore.pruefungsstaetteData.ort,
  examData.value.datum = prueflingStore.pruefungsstaetteData.datum,

  prueflingStore.formValidate = true;
  if (checkIfUndefined(examData.value)) {
    prueflingStore.formValidate = false;
  } else {
    prueflingStore.formValidate = true;
  }

});

</script>

<style lang="scss" scoped>

</style>