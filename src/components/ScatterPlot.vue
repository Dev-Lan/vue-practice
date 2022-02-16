<template>
    <svg :width="width" :height="height">
        <g></g>
        <g></g>
        <g :transform="`translate(${margin}, ${margin})`">
            <circle
                v-for="([x, y], index) in points"
                :key="index"
                :cx="x"
                :cy="y"
                @click="onClick(index)"
                :class="getCssClass(index)"
            />
        </g>
    </svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import * as d3 from 'd3-scale';

export default defineComponent({
    name: 'ScatterPlot',
    props: {
        xAxis: { type: String, required: true },
        yAxis: { type: String, required: true },
        width: { type: Number, default: 300 },
        height: { type: Number, default: 300 },
        margin: { type: Number, default: 40 }
    },
    methods: {
        onClick(index: number) {
            this.$store.dispatch('setSelected', index);
        },
        getCssClass(index: number): string {
            return index === this.$store.state.selectedIndex ? 'selected' : '';
        }
    },
    computed: {
        points(): [number, number][] {
            const scale = d3
                .scaleLinear()
                .domain([0, 5])
                .range([0, this.vizWidth]);

            const xVals = this.$store.state.columns[this.xAxis];
            const yVals = this.$store.state.columns[this.yAxis];

            return xVals.map((_d: number, i: number) => [
                scale(xVals[i]),
                scale(yVals[i])
            ]);
        },
        vizWidth(): number {
            return this.width - 2 * this.margin;
        },
        vizHeight(): number {
            return this.height - 2 * this.margin;
        }
    }
});
</script>

<!-- Add "scoped" attribute tod limit CSS to this component only -->
<style scoped lang="scss">
svg {
    border: solid black 1px;
    background: bisque;
    margin: 40px;
}

circle {
    border: solid black 1px;
    r: 5px;
}

circle.selected {
    fill: tomato;
}
</style>
