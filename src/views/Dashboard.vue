<template>
    <div>
        <button @click="generateData">Generate New Data</button>

        <div class="dashboard">
            <ScatterPlot
                v-for="([key1, key2], index) in keyPairs"
                :key="index"
                :yKey="key1"
                :xKey="key2"
            />
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
    },
    computed: {
        keyPairs(): [string, string][] {
            const keyPairs: [string, string][] = [];
            for (let key1 in this.$store.state.columns) {
                for (let key2 in this.$store.state.columns) {
                    keyPairs.push([key1, key2]);
                }
            }
            return keyPairs;
        }
    }
});
</script>

<style scoped lang="scss">
.dashboard {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
}
</style>
