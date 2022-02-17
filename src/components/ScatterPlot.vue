<template>
    <svg :width="width" :height="height">
        <g
            ref="yAxisContainer"
            :transform="`translate(${margin}, ${margin})`"
        ></g>
        <g
            ref="xAxisContainer"
            :transform="`translate(${margin}, ${height - margin})`"
        ></g>
        <g
            ref="brushContainer"
            :transform="`translate(${margin}, ${margin})`"
        ></g>
        <g :transform="`translate(${margin}, ${margin})`">
            <transition-group name="dot-slide" tag="g">
                <circle
                    v-for="[x, y, i] in normalPoints"
                    :key="i"
                    :cx="x"
                    :cy="y"
                    :r="dotRadius"
                    @click="onClick(i)"
                />
                <circle
                    v-for="[x, y, i] in brushedPoints"
                    :key="i"
                    :cx="x"
                    :cy="y"
                    :r="dotRadius"
                    @click="onClick(i)"
                    :class="'brushed'"
                />
            </transition-group>
            <circle
                v-if="selectedPoint"
                :cx="selectedPoint[0]"
                :cy="selectedPoint[1]"
                :r="dotRadius * 1.3"
                :class="'selected'"
            />
        </g>
    </svg>
</template>

<script lang="ts">
import { defineComponent, onMounted, computed, ref } from 'vue';
import { scaleLinear } from 'd3-scale';
import { axisLeft, axisBottom } from 'd3-axis';
import { select } from 'd3-selection';
import { brush } from 'd3-brush';
import { min, max } from 'd3-array';
import { useStore } from 'vuex';
import { FilterPayload, State } from '@/store';
import { v4 as uuidv4 } from 'uuid';

export default defineComponent({
    name: 'ScatterPlot',
    props: {
        xKey: { type: String, required: true },
        yKey: { type: String, required: true },
        width: { type: Number, default: 360 },
        height: { type: Number, default: 360 },
        margin: { type: Number, default: 40 },
    },
    setup(props) {
        const store = useStore<State>();
        const dotRadius = ref(5);
        const uniqueId = ref(uuidv4());
        const vizWidth = computed(() => props.width - 2 * props.margin);
        const vizHeight = computed(() => props.height - 2 * props.margin);
        const xScale = computed(() => {
            return scaleLinear().domain([0, 5]).range([0, vizWidth.value]);
        });
        const yScale = computed(() => {
            return scaleLinear().domain([0, 5]).range([vizHeight.value, 0]);
        });

        function getPointList(): [number, number, number][] {
            const xVals = store.state.columns[props.xKey];
            const yVals = store.state.columns[props.yKey];

            const pointList = xVals.map((_d: number, i: number) => [
                xScale.value(xVals[i]),
                yScale.value(yVals[i]),
                i,
            ]) as [number, number, number][];
            return pointList;
        }

        const normalPoints = computed<[number, number, number][]>(() => {
            const points = getPointList();
            const normalPoints: [number, number, number][] = [];
            for (let i of store.state.normalIndices) {
                normalPoints.push(points[i]);
            }
            return normalPoints;
        });

        const brushedPoints = computed<[number, number, number][]>(() => {
            const points = getPointList();
            const brushedPoints: [number, number, number][] = [];
            for (let i of store.state.brushedIndices) {
                brushedPoints.push(points[i]);
            }
            return brushedPoints;
        });

        const selectedPoint = computed(() => {
            const index = store.state.selectedIndex;
            if (index === -1) return;
            const xVals = store.state.columns[props.xKey];
            const yVals = store.state.columns[props.yKey];
            return [xScale.value(xVals[index]), yScale.value(yVals[index])];
        });

        const yAxisContainer = ref<SVGGElement | null>(null);
        const xAxisContainer = ref<SVGGElement | null>(null);
        const brushContainer = ref<SVGGElement | null>(null);
        onMounted(() => {
            const xAxisGen = axisBottom(xScale.value);
            if (xAxisContainer.value) {
                select(xAxisContainer.value).call(xAxisGen);
            }
            const yAxisGen = axisLeft(yScale.value);
            if (yAxisContainer.value) {
                select(yAxisContainer.value).call(yAxisGen);
            }

            if (brushContainer.value) {
                select(brushContainer.value).call(
                    brush()
                        .extent([
                            [0, 0],
                            [vizWidth.value, vizHeight.value],
                        ])
                        .on('brush start end', ({ selection }) => {
                            const bounds = selection as
                                | [[number, number], [number, number]]
                                | null;
                            const payload: FilterPayload = {
                                componentId: uniqueId.value,
                                filterList: [],
                            };
                            if (!bounds) {
                                store.dispatch('addFilter', payload);
                                return;
                            }
                            const xVals = [bounds[0][0], bounds[1][0]];
                            const yVals = [bounds[0][1], bounds[1][1]];
                            payload.filterList.push({
                                low: min(yVals, (d: number) =>
                                    yScale.value.invert(d + dotRadius.value)
                                ) as number,
                                high: max(yVals, (d: number) =>
                                    yScale.value.invert(d - dotRadius.value)
                                ) as number,
                                key: props.yKey,
                            });

                            payload.filterList.push({
                                low: min(xVals, (d: number) =>
                                    xScale.value.invert(d - dotRadius.value)
                                ) as number,
                                high: max(xVals, (d: number) =>
                                    xScale.value.invert(d + dotRadius.value)
                                ) as number,
                                key: props.xKey,
                            });
                            store.dispatch('addFilter', payload);
                        })
                );
            }
        });

        function onClick(index: number) {
            store.dispatch('setSelected', index);
        }

        function getCssClass(index: number): string {
            return index === store.state.selectedIndex ? 'selected' : '';
        }
        return {
            vizWidth,
            vizHeight,
            dotRadius,
            normalPoints,
            brushedPoints,
            selectedPoint,
            yAxisContainer,
            xAxisContainer,
            brushContainer,
            onClick,
            getCssClass,
            getPointList,
        };
    },
});
</script>

<style scoped lang="scss">
svg {
    margin: 10px;
}

circle {
    stroke: black;
}

circle.selected {
    fill: tomato;
}

circle.brushed {
    fill: bisque;
}

.dot-slide-move {
    transition: transform 0.4s ease-out;
}

// .dot-slide-enter {
//     // transform: translateX(10px);
//     // opacity: 0;
// }
// .dot-slide-enter-active,
// .dot-slide-leave-active {
//     transition: all 0.2s ease;
// }
// .dot-slide-leave-to {
//     // transform: translateX(-10px);
//     // opacity: 0;
// }
</style>
