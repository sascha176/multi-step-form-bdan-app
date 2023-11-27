<template>
  <ion-grid class="form-part">
    <ion-row class="ion-padding">
      <ion-col>
        <ion-input v-model="persData.name" label-placement="floating" fill="solid" label="Name:" placeholder="Name"
        :class="{ 'error-input': isEmpty(persData.name) }"></ion-input>
      </ion-col>
    </ion-row>
    <ion-row class="ion-padding">
      <ion-col>
        <ion-input v-model="persData.vorname" label-placement="floating" fill="solid" label="Vorname:" placeholder="Vorname"
        :class="{ 'error-input': isEmpty(persData.vorname) }"></ion-input>
      </ion-col>
    </ion-row>

    <ion-row class="ion-padding">
      <ion-col>
        <ion-input v-model="persData.strasse" label-placement="floating" fill="solid" label="Strasse:" placeholder="Strasse"
        :class="{ 'error-input': isEmpty(persData.strasse) }"></ion-input>
      </ion-col>
    </ion-row>

    <ion-row class="ion-padding">
      <ion-col size="12" size-sm="4">
        <ion-input v-model="persData.hausnr" type="number" label-placement="floating" fill="solid" label="Hausnr.:" placeholder="Hausnr."
          :class="{ 'error-input': isEmpty(persData.hausnr) }"></ion-input>
      </ion-col>
      <ion-col size="12" size-sm="4">
        <ion-input v-model="persData.plz" type="number" label-placement="floating" fill="solid" label="Postleitzahl:" placeholder="PLZ"
          :class="{ 'error-input': isEmpty(persData.plz) }"></ion-input>
      </ion-col >
      <ion-col size="12" size-sm="4">
        <ion-input v-model="persData.ort" label-placement="floating" fill="solid" label="Wohnort:" placeholder="Wohnort"
          :class="{ 'error-input': isEmpty(persData.ort) }"></ion-input>
      </ion-col>
    </ion-row>
    <ion-row class="ion-padding">
      <ion-col><ion-input v-model="persData.geburtstag"  label-placement="floating" fill="solid" label="Geburtstag:" placeholder="Geburtstag (TT.MM.JJJJ)"
          :class="{ 'error-input': isEmpty(persData.geburtstag) || !isValidGeburtstagFormat && persData.geburtstag != undefined }"></ion-input></ion-col>
      <ion-col>
        <ion-input v-model="persData.geburtsort" label-placement="floating" fill="solid" label="Geburtsort:" placeholder="Geburtsort"
          :class="{ 'error-input': isEmpty(persData.geburtsort) }"></ion-input>
      </ion-col>
    </ion-row>

    <ion-row class="ion-padding">
      <ion-col>
        <ion-input v-model="persData.beruf" label-placement="floating" fill="solid" label="Beruf:" placeholder="Beruf (freiwillige Angabe)"></ion-input>
      </ion-col>
    </ion-row>
  </ion-grid>

  <p v-if="isEmpty(persData.name && persData.strasse && persData.geburtstag && persData.geburtsort && persData.hausnr && persData.ort && persData.plz)"
        class="error-message">Bitte alle Felder ausfüllen!</p>
  <p v-if="!isValidGeburtstagFormat && persData.geburtstag != undefined" class="error-message">Bitte das Geburtsdatum im Format TT.MM.JJJJ eingeben!"</p>

</template>
  
<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue';
import {
  IonInput,
  IonGrid,
  IonRow,
  IonCol

} from '@ionic/vue';
import { usePrueflingStore } from '../../stores/UserDataStore';
import { isEmpty, checkIfUndefined } from '@/services/helpers';


//data
const prueflingStore = usePrueflingStore();

const persData = ref({
  name: prueflingStore.personlicheDaten.name,
  vorname: prueflingStore.personlicheDaten.vorname,
  strasse: prueflingStore.personlicheDaten.strasse,
  hausnr: prueflingStore.personlicheDaten.hausnr,
  plz: prueflingStore.personlicheDaten.plz,
  ort: prueflingStore.personlicheDaten.ort,
  geburtstag: prueflingStore.personlicheDaten.geburtstag,
  geburtsort: prueflingStore.personlicheDaten.geburtsort,
  beruf: prueflingStore.personlicheDaten.beruf || '',
});


//methods
watch(persData, (newValue) => {
  prueflingStore.savePersonlicheDaten(newValue);
  if (checkIfUndefined(newValue)) {
    prueflingStore.formValidate = false;
  }
  else if (!isValidGeburtstagFormat.value) {
    prueflingStore.formValidate = false;
  }
  else {
    prueflingStore.formValidate = true;
  }

},
  { deep: true })


onMounted(() => {

  prueflingStore.formValidate = true;
  if (checkIfUndefined(persData.value)) {
    prueflingStore.formValidate = false;
  } else {
    prueflingStore.formValidate = true;
  }
});

//Funktion zur Validierung ob das Geburtsdatum in einem korrekten Format vorliegt, sonst funktioniert is18() nicht korrekt beispielsweise wenn sich der nutzer vertippt
// Als computed, da wert immer wieder neu ebrechnet werden muss.
const isValidGeburtstagFormat = computed(() => {
  const datePattern = /^\d{2}\.\d{2}\.\d{4}$/; //grundlegendes pattern, welches vorhanden sein muss zwei zeichen. zwei zeichen. vier zeichen ende.
  return datePattern.test(persData.value.geburtstag); //test() methode überprüft ob pattern stimmt oder nicht und gibt entsprechend true oder false zurück
  //man könnte jetzt natürlich noch nach legitimen daten abfragen sprich nur zahlen von 1 bis 12 oder 1 bis 31 usw. aber das passt schon so
});

</script>

<style lang="scss" scoped>
ion-list {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  flex-wrap: wrap;
  border: 2px solid red;

}

ion-item {

  border: 2px solid white;
}
</style>
  