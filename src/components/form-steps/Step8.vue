<template>
    <ion-text>
        <p>
            Beruf
            Die benannte Stelle DE.PStF.010 UAVDACH-Services UG und ihre angeschlossenen Betriebs- & Prüfungsstäten erheben
            zur Erfüllung ihrer in der
            Benennung definierten Aufgaben und zur Wahrnehmung ihrer öffentlichen Aufgaben aus der Benennung durch das
            Luftfahrt-Bundesamt (LBA)
            personenbezogene Daten und Daten über persönliche und sachbezogene Verhältnisse seiner Bewerber und Kunden.
            Diese Daten werden darüber
            hinaus gespeichert, in Einzelfällen an die Zentrale der DE.PStF.010 und das LBA übermittelt und verarbeitet.
            Einzelheiten dazu sind in
            der Datenschutzrichtlinie DE.PStF.010 ausgeführt.</p>

        <p>Eine anderweitige Datenverwendung z.B. Datenverkauf oder Weitergabe an unberechtigte Dritte findet nicht statt.
        </p>

        <p>Jeder Bewerber hat das Recht auf Auskunft über seine gespeicherten Daten, Berichtigung seiner gespeicherten Daten
            im Falle der Unrichtigkeit und auf Sperrung
            bzw. Löschung seiner Daten nach Beendigung der Geschäftsbeziehung.Durch diese Erklärung stimmt der Bewerber der
            oben genannten Datenerfassung, -
            Verarbeitung und –Speicherung ausdrücklich zu.</p>

        <p>Bei Minderjährigen Unterschrift der gesetzlich Vertretungsberechtigten</p>
        <p>Ich bin mit der Ausbildung / Prüfung und der vorstehenden Erklärung einverstanden. Ich wurde über den bestehenden
            Versicherungsschutz aufgeklärt.</p>

    </ion-text>
    <Step2 />
    <signature-validate />
</template>

<script lang="ts" setup>
import {
    IonText,
    IonButton,
} from '@ionic/vue';
import Step2 from './Step2.vue';
import SignatureValidate from '@/components/form-components/SignatureValidate.vue';


</script>

<style scoped>


</style>