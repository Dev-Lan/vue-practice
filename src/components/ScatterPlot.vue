<template>
    <div class="wrapper">
        <svg :width="width" :height="height">
            <g></g>
            <g></g>
            <g>
                <circle
                    v-for="(point, index) in points"
                    :key="index"
                    :cx="point[0]"
                    :cy="point[1]"
                    @click="onClick(index)"
                    :class="getCssClass(index)"
                />
            </g>
        </svg>
    </div>
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
        height: { type: Number, default: 300 }
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
                .range([0, this.width]);

            const xVals = this.$store.state.columns[this.xAxis];
            const yVals = this.$store.state.columns[this.yAxis];

            return xVals.map((_d: number, i: number) => [
                scale(xVals[i]),
                scale(yVals[i])
            ]);
        }
    }
});
</script>

<!-- Add "scoped" attribute tod limit CSS to this component only -->
<style scoped lang="scss">
.wrapper {
    background: bisque;
}

svg {
    border: solid black 1px;
}

circle {
    border: solid black 1px;
    r: 10px;
}

circle.selected {
    fill: tomato;
}
</style>
