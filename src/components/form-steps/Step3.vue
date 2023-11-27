<template>
  <ion-grid>
    <div class="form-part">
      <ion-row v-for="examItem in examItems">
        <ion-col>
          <ion-radio-group v-model="pruefungData.anzahlPruefung">
            <ion-radio class="ion-padding-horizontal" label-placement="end"  :key="examItem"
              :value="examItem" :checked="examItem === pruefungData.anzahlPruefung">
              <div class="ion-text-wrap">{{ examItem }}</div>
            </ion-radio>
          </ion-radio-group>
        </ion-col>
      </ion-row>
    </div>

    <div class="form-part">
      <ion-row v-for="examKindItem in examKindItems">
        <ion-col>
          <ion-radio-group v-model="pruefungData.artPruefung">
            <ion-radio class="ion-padding-horizontal" label-placement="end"
              :key="examKindItem" :value="examKindItem" :checked="examKindItem === pruefungData.artPruefung">
                <div class="ion-text-wrap">{{ examKindItem }}</div></ion-radio>
          </ion-radio-group>
        </ion-col>
      </ion-row>
    </div>

  </ion-grid>

</template>

<script lang="ts" setup>
import {
  IonGrid,
  IonCol,
  IonRadio,
  IonRadioGroup,
  IonRow,
} from '@ionic/vue';
import { ref, onMounted, watch } from 'vue';
import { usePrueflingStore } from '../../stores/UserDataStore'
import { checkIfUndefined } from '@/services/helpers';

//Data
const examItems = ['Erstprüfung', 'Wiederholungsprüfung', 'Kopie Prüfungsprotokoll liegt vor'];
const examKindItems = ['Präsenzprüfung', 'Online Prüfung', '(Erfüllung techn. Anforderungen PHB Kap.10.9 liegt vor)']
const prueflingStore = usePrueflingStore();

const pruefungData = ref({

  anzahlPruefung: prueflingStore.pruefungData.anzahlPruefung,
  artPruefung: prueflingStore.pruefungData.artPruefung,
});



//methods
watch(pruefungData, (newValue, oldValue) => {
  prueflingStore.savePruefungDaten(newValue);
  if (checkIfUndefined(pruefungData.value)) {
    prueflingStore.formValidate = false;
  } else {
    prueflingStore.formValidate = true;
  }

},
  { deep: true })


onMounted(() => {

  if (checkIfUndefined(pruefungData.value)) {
    prueflingStore.formValidate = false;
  } else {
    prueflingStore.formValidate = true;
  }
});



</script>

<style lang="scss" scoped>


</style>