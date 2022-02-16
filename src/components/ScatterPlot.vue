<template>
    <svg :width="width" :height="height">
        <g :transform="`translate(${margin}, ${margin})`" ref="yAxis"></g>
        <g
            :transform="`translate(${margin}, ${height - margin})`"
            ref="xAxis"
        ></g>
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
import { defineComponent, onMounted, computed, ref } from 'vue';
import { scaleLinear } from 'd3-scale';
import { axisLeft, axisBottom } from 'd3-axis';
import { select } from 'd3-selection';
import { useStore } from 'vuex';
import { State } from '@/store';

export default defineComponent({
    name: 'ScatterPlot',
    props: {
        xKey: { type: String, required: true },
        yKey: { type: String, required: true },
        width: { type: Number, default: 360 },
        height: { type: Number, default: 360 },
        margin: { type: Number, default: 40 }
    },
    setup(props) {
        const store = useStore<State>();
        const vizWidth = computed(() => props.width - 2 * props.margin);
        const vizHeight = computed(() => props.height - 2 * props.margin);
        const xScale = computed(() => {
            return scaleLinear().domain([0, 5]).range([0, vizWidth.value]);
        });
        const yScale = computed(() => {
            return scaleLinear().domain([0, 5]).range([vizHeight.value, 0]);
        });

        const points = computed(() => {
            const xVals = store.state.columns[props.xKey];
            const yVals = store.state.columns[props.yKey];

            return xVals.map((_d: number, i: number) => [
                xScale.value(xVals[i]),
                yScale.value(yVals[i])
            ]);
        });

        const yAxis = ref<SVGGElement | null>(null);
        const xAxis = ref<SVGGElement | null>(null);
        onMounted(() => {
            const xAxisGen = axisBottom(xScale.value);
            if (xAxis.value) {
                select(xAxis.value).call(xAxisGen);
            }
            const yAxisGen = axisLeft(yScale.value);
            if (yAxis.value) {
                select(yAxis.value).call(yAxisGen);
            }
        });
        return { vizWidth, vizHeight, points, yAxis, xAxis };
    },
    methods: {
        onClick(index: number) {
            this.$store.dispatch('setSelected', index);
        },
        getCssClass(index: number): string {
            return index === this.$store.state.selectedIndex ? 'selected' : '';
        }
    }
});
</script>

<!-- Add "scoped" attribute tod limit CSS to this component only -->
<style scoped lang="scss">
svg {
    // border: solid black 1px;
    // background: bisque;
    margin: 10px;
}

circle {
    border: solid black 1px;
    r: 5px;
}

circle.selected {
    fill: tomato;
}
</style>
