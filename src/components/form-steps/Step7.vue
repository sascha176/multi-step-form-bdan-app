<template>
    <ion-text>
        <p>Ich verzichte hiermit gegenüber der benannten Stelle DE.PStF.010, UAVDACHServices UG, deren an dem Verfahren zur
            Erlangung der Bescheinigung meines
            Fernpilotenzeugnisses nach DVO(EU)-2019/947 beteiligten Betriebs- & Prüfungsstätten sowie deren
            Mitarbeiter(inne)n / Erfüllungsgehilfen auf sämtliche
            vertragliche wie gesetzliche Ansprüche zum Ersatz jeglichen Schadens, welchen ich im Rahmen der Tätigkeiten zur
            Erlangung der vorbezeichneten Bescheinigung
            in der Ausbildung und Prüfung im Flugbetrieb und/oder Bodenbetrieb erleide Ausdrücklich von diesem Verzicht
            ausgenommen sind Ansprüche auf Schadensersatz
            infolge grober Fahrlässigkeit und Vorsatz, sowie fahrlässig oder vorsätzlich verursachte Schäden aus der
            Verletzung des Lebens, des Körpers oder der Gesundheit.</p>

        <p>Ich kenne den Umfang der abgeschlossenen Versicherungen. Ich weiß, dass ich mich auf eigene Kosten zusätzlich
            versichern kann, soweit eine Versicherung nicht oder
            nicht in dem Umfang und in der Höhe besteht, die ich für ausreichend halte.</p>

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