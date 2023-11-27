<template>

    <ion-accordion-group :class="{ 'error-input': isEmpty(prueflingValidate.ort && prueflingValidate.datum && prueflingValidate.unterschrift) }"  expand="inset">
        <ion-accordion value="first" :disabled="!is18">
          <ion-item slot="header" color="rose">
            <ion-label>Volljähriger Bewerber</ion-label>
          </ion-item>
          <div class="ion-padding" slot="content">
            <ion-input :class="{ 'error-input': isEmpty(prueflingValidate.ort) }"  v-model="prueflingValidate.ort" label="Ort" placeholder="Ort" ></ion-input>
            <ion-input :class="{ 'error-input': isEmpty(prueflingValidate.datum) }"  v-model="prueflingValidate.datum"  label="Datum" placeholder="Datum" ></ion-input>
            <ion-input :class="{ 'error-input': isEmpty(prueflingValidate.unterschrift) }" v-model="prueflingValidate.unterschrift" label="Unterschrift" placeholder="Unterschrift (vollständiger Vor- und Nachname)" ></ion-input>
          </div>
        </ion-accordion>
        <ion-accordion  value="second" :disabled="is18">
          <ion-item slot="header" color="rose">
            <ion-label>Minderjähriger Bewerber</ion-label>
          </ion-item>
          <div class="ion-padding" slot="content">
            <ion-input :class="{ 'error-input': isEmpty(prueflingValidate.ort) }" v-model="prueflingValidate.ort"  label="Ort" placeholder="Ort"></ion-input>
            <ion-input :class="{ 'error-input': isEmpty(prueflingValidate.datum) }" v-model="prueflingValidate.datum"  label="Datum" placeholder="Datum"></ion-input>
            <ion-input :class="{ 'error-input': isEmpty(prueflingValidate.unterschrift) }" v-model="prueflingValidate.unterschrift"  label="Unterschrift" placeholder="Unterschrift (vollständiger Vor- und Nachname)"></ion-input>
          </div>
        </ion-accordion>
      </ion-accordion-group>
      <p v-if="isEmpty(prueflingValidate.ort && prueflingValidate.datum && prueflingValidate.unterschrift)"
      class="error-message">Bitte alle Felder ausfüllen!</p>
      

</template>

<script lang="ts" setup>
import {
        IonAccordion,
        IonCheckbox,
        IonItem,
        IonInput,
        IonLabel,
        IonText,
        IonAccordionGroup
    } from '@ionic/vue';
import { usePrueflingStore } from '@/stores/UserDataStore';
import { calculateAge } from '@/services/helpers';
import { watch, ref, onMounted } from 'vue';
import { checkIfUndefined, isEmpty } from '@/services/helpers';

//data
const prueflingStore = usePrueflingStore();
const is18 = ref(calculateAge(prueflingStore.personlicheDaten.geburtstag));

const prueflingValidate = ref({
  unterschrift: prueflingStore.signatureData.unterschrift,
  ort: prueflingStore.signatureData.ort,
  datum: prueflingStore.signatureData.datum,
  
    
})



//methods
watch(() => prueflingStore.personlicheDaten.geburtstag, (newValue) => {
  is18.value = calculateAge(newValue);
});

watch(prueflingValidate, (newValue) => {
  prueflingStore.savePrueflingValidate(newValue);
  if(checkIfUndefined(prueflingValidate.value)) {
      prueflingStore.formValidate = false;
    }
    else {
      prueflingStore.formValidate = true;
    }
  

},
  { deep: true })

  onMounted(() => {

    if(checkIfUndefined(prueflingValidate.value)) {
      prueflingStore.formValidate = false;
    }
    else {
      prueflingStore.formValidate = true;
    }
  

});


</script>