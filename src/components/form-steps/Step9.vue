<template>
    <ion-text>
        <p>Entsprechend der Anforderungen des Luftfahrt-Bundesamt an die Prüfstellen für Fernpiloten A2 gemäß §21e (3)
            LuftVO darf der Bewerber zur Prüfung nach UAS.OPE.030 (A2-Prüfung)
            vor Ablegen der Prüfung keine Kenntnis von den zu beantwortenden Prüfungsfragen des Fragenkatalogs der benannten
            Stelle haben, bei der er die Prüfung ablegt.</p>

        <p>Hiermit erkläre ich:</p>
    </ion-text>
    <Step2 />
    <ion-text>
        <p>
            wahrheitsgemäß an Eides statt, dass ich von den Inhalten der Prüfungsfragen des Fragenkatalogs der DE.PStF.010
            UAVDACH-Services UG keine Kenntnis habe.
            Mir ist bewusst, dass mir bei unzutreffender Erklärung das somit unrechtmäßig erworbene Fernpilotenzeugnis
            aberkannt
            werden kann.
        </p>

    </ion-text>
    <signature-validate />
</template>

<script lang="ts" setup>
import {
    IonText,
} from '@ionic/vue';
import Step2 from './Step2.vue';
import SignatureValidate from '@/components/form-components/SignatureValidate.vue';


</script>

<style scoped>

</style>