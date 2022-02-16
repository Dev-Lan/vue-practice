<template>
    <div class="dashboard">
        <button @click="generateData">Generate New Data</button>

        <div>
            <ScatterPlot :xAxis="'A'" :yAxis="'B'" />
            <ScatterPlot :xAxis="'A'" :yAxis="'C'" />
            <ScatterPlot :xAxis="'B'" :yAxis="'C'" />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
// import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src
import ScatterPlot from '@/components/ScatterPlot.vue';
import { Columns } from '@/store';

export default defineComponent({
    name: 'Dashboard',
    components: {
        ScatterPlot
    },
    methods: {
        generateData(): void {
            const newColumns: Columns = {};
            for (let key of ['A', 'B', 'C']) {
                const colVals: number[] = [];
                for (let i = 0; i < 50; i++) {
                    const val = Math.random() * 5;
                    colVals.push(val);
                }
                newColumns[key] = colVals;
            }
            this.$store.dispatch('setColumn', newColumns);
        }
    }
});
</script>
