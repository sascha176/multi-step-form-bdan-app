<template>
  <div v-show="!prueflingStore.submitCheck">
    <ion-text>
      <p>
        Bitte trage deine E-Mail Adresse in das nachfolgende
        Textfeld ein.</p>

        <p>Nach Abschluss der Anmeldung erhälst du
          deine Anmeldebestätigung per E-Mail.</p>
    </ion-text>
    <div class="form-part">
      <ion-input v-model="email" type="email" label="E-Mail Adresse" label-placement="floating" fill="solid"
      placeholder="E-Mail Adresse"></ion-input>
    <ion-checkbox v-model="prueflingStore.angabenKorrekt" label-placement="end" justify="start"><div class="ion-text-wrap">Ich versichere, dass alle Angaben korrekt und wahrheitsgemäß
      angegeben wurden.</div></ion-checkbox>
    </div>
    
  </div>

  

  <div class="submit" v-show=" prueflingStore.submitCheck && !prueflingStore.formCheck">
    <p>Deine Anmeldung war erfolgreich und deine Daten wurden übermittelt</p>
    <p>Deine Anmeldebestätigung erhältst du nocheinmal zusätzlich per E-Mail</p>
  </div>

  <div class="submit" v-show="prueflingStore.errorMsg">
    <p>Entschuldigung, aber etwas ist schiefgelaufen.</p>
    <p>Sollte der Fehler erneut auftreten, wende dich bitte an einen Mitarbeiter der Drohnenakademie!</p>
  </div>
</template>

<script lang="ts" setup>
import { usePrueflingStore } from '@/stores/UserDataStore'; import {
  IonCheckbox,
  IonInput,
  IonText,
} from '@ionic/vue';
import { ref, onMounted, watch } from 'vue';
import { checkIfUndefined } from '@/services/helpers';

const prueflingStore = usePrueflingStore();

const email = ref('');


watch(email, (newValue) => {
 
  prueflingStore.saveEmail(newValue);
  prueflingStore.formValidate = !!newValue;
  
 
});

const isChecked = ref();
let previousIsChecked = isChecked.value;

watch(isChecked, (currentValue) => {

  if (currentValue !== previousIsChecked) { // Überprüfung auf Änderung
    prueflingStore.setIsChecked(currentValue); // Wert nur speichern, wenn er sich geändert hat
    previousIsChecked = currentValue; // Vorherigen Wert aktualisieren
  }
});

onMounted(() => {
  prueflingStore.angabenKorrekt = false;
  prueflingStore.formValidate = true;
  if (checkIfUndefined(email)) {
    prueflingStore.formValidate = false;
  } else {

    prueflingStore.formValidate = !!email;
  }
});


</script>

<style scoped>
p {
  text-align: center;
  font-size: 1.5rem;
  font-weight: bold;
}



.submit {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

}

.form-part {
  padding: .9rem;
}

ion-input {
  margin-bottom: 1.2rem;
}


</style>