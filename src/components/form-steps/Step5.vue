<template>
    <ion-grid>
        <div class="form-part">
            <ion-row>
                <ion-col>
                    <h3>Ich habe das praktische Selbsttraining mit folgendem unbemannten Luftfahrtsystem (UAS)
                        durchgeführt:</h3>
                </ion-col>
            </ion-row>
            <ion-row>
                <ion-col>
                    <ion-input v-model="erklaerungSelbststudium.hersteller" label="Hersteller" label-placement="floating"
                        fill="solid" placeholder="Hersteller"
                        :class="{ 'error-input': isEmpty(erklaerungSelbststudium.hersteller) }"></ion-input>
                </ion-col>
            </ion-row>
            <ion-row>
                <ion-col>
                    <ion-input v-model="erklaerungSelbststudium.modellbezeichnung" label="Modellbezeichnung"
                        label-placement="floating" fill="solid" placeholder="Modellbezeichnung"
                        :class="{ 'error-input': isEmpty(erklaerungSelbststudium.modellbezeichnung) }"></ion-input>
                </ion-col>
            </ion-row>
        </div>

        <div class="form-part">
            <ion-row>
                <ion-col>
                    <h3>Das unbemannte Luftfahrzeug (UA) ist ein:</h3>
                </ion-col>
            </ion-row>
            <ion-row>
                <ion-col>
                    <ion-radio-group v-model="erklaerungSelbststudium.uaTyp">
                        <ion-radio class="ion-padding-horizontal" label-placement="end" v-for="uaItem in uaItems"
                            :key="uaItem" :value="uaItem" :checked="uaItem === erklaerungSelbststudium.uaTyp"><div class="ion-text-wrap">{{ uaItem
                            }}</div></ion-radio>
                    </ion-radio-group>
                </ion-col>
            </ion-row>
        </div>
        <div class="form-part">
            <ion-row>
                <ion-col>
                    <h3>Höchstzulässige Startmasse in kg (> 500g /&lt 4kg):</h3>
                </ion-col>
            </ion-row>
            <ion-row>
                <ion-col>
                    <ion-input  v-model="erklaerungSelbststudium.startmasse" type="number" label="Startmasse" placeholder="Startmasse in KG" label-placement="floating"
                        fill="solid" :class="{ 'error-input': isEmpty(erklaerungSelbststudium.startmasse) }"></ion-input>
                </ion-col>
            </ion-row>
        </div>

        <div class="form-part">
            <ion-row>
                <ion-col>
                    <h3>Steuerungs-Modi:</h3>
                </ion-col>
            </ion-row>

            <ion-row v-for="steuerModItem in steuerModItems">
                <ion-col>
                    <ion-radio-group v-model="erklaerungSelbststudium.steuerungsModi">
                        <ion-radio class="ion-padding-horizontal" label-placement="end" :key="steuerModItem" :value="steuerModItem"
                            :checked="steuerModItem === erklaerungSelbststudium.steuerungsModi"><div class="ion-text-wrap">{{
                                steuerModItem }}</div></ion-radio>
                    </ion-radio-group>
                </ion-col>
            </ion-row>
        </div>

        <div class="form-part">
            <ion-row>
                <ion-col>
                    <h3>Kennzeichnung des UAS:</h3>
                </ion-col>
            </ion-row>
            <ion-row>
                <ion-col>
                    <ion-checkbox label-placement="end" v-model="erklaerungSelbststudium.kennzeichnungUAS" :class="{ 'error-input': erklaerungSelbststudium.kennzeichnungUAS === false }"><div class="ion-text-wrap">Klasse C2 (ab 1.1.2023
                        erforderlich!)</div></ion-checkbox>
                </ion-col>
            </ion-row>
        </div>
    </ion-grid>
    <p v-if="isEmpty(erklaerungSelbststudium.hersteller && erklaerungSelbststudium.modellbezeichnung && erklaerungSelbststudium.startmasse)"
        class="error-message">Bitte alle Felder ausfüllen!</p>
    <p v-if=" erklaerungSelbststudium.kennzeichnungUAS === false && erklaerungSelbststudium != undefined" class="error-message">Hinweis: Für Klasse C2 erforderlich!</p>

</template>

<script lang="ts" setup>
import {
    IonCheckbox,
    IonGrid,
    IonRow,
    IonCol,
    IonInput,
    IonRadio,
    IonRadioGroup,

} from '@ionic/vue';
import { ref, computed, onMounted, watch } from 'vue';
import { usePrueflingStore } from '../../stores/UserDataStore';
import { isEmpty, checkIfUndefined } from '@/services/helpers';


//data
const uaItems = ['Starrflügler', 'Drehflügler', 'Sonstiges'];
const steuerModItems = ['Manuell', 'Automatisiert', 'Sonstiges'];
const prueflingStore = usePrueflingStore();

const erklaerungSelbststudium = ref({

    hersteller: prueflingStore.erklärungSelbststudium.hersteller,
    modellbezeichnung: prueflingStore.erklärungSelbststudium.modellbezeichnung,
    uaTyp: prueflingStore.erklärungSelbststudium.uaTyp,
    startmasse: prueflingStore.erklärungSelbststudium.startmasse,
    steuerungsModi: prueflingStore.erklärungSelbststudium.steuerungsModi,
    kennzeichnungUAS: prueflingStore.erklärungSelbststudium.kennzeichnungUAS,
});


//methods
watch(erklaerungSelbststudium, (newValue, oldValue) => {
    prueflingStore.saveSelbststudium(newValue);
    if (checkIfUndefined(erklaerungSelbststudium.value)) {
        prueflingStore.formValidate = false;
    } else {
        prueflingStore.formValidate = true;
    }
},
    { deep: true })

onMounted(() => {

    if (checkIfUndefined(erklaerungSelbststudium.value)) {
        prueflingStore.formValidate = false;
    } else {
        prueflingStore.formValidate = true;
    }
});
</script>