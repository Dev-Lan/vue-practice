<template>
    <div>
        <button @click="generateData">Generate New Data</button>

        <div class="splom">
            <div v-for="(key1, i) in $store.state.columnHeaders" :key="i">
                <ScatterPlot
                    v-for="(key2, i) in $store.state.columnHeaders"
                    :key="i"
                    :yKey="key1"
                    :xKey="key2"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ScatterPlot from '@/components/ScatterPlot.vue';
import { Columns } from '@/store';
// import { useStore } from 'vuex';

export default defineComponent({
    name: 'Splom',
    components: {
        ScatterPlot,
    },
    methods: {
        generateData(): void {
            const newColumns: Columns = {};
            for (let key of ['A', 'B', 'C']) {
                const colVals: number[] = [];
                for (let i = 0; i < 100; i++) {
                    const val = Math.random() * 5;
                    colVals.push(val);
                }
                newColumns[key] = colVals;
            }
            this.$store.dispatch('setColumn', newColumns);
            this.$store.dispatch('setSelected', -1);
        },
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
        },
    },
});
</script>

<style scoped lang="scss">
.splom {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    flex-direction: column;
}
</style>
