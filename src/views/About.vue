<template>
    <div class="about">
        <h1>This is an about page</h1>
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

export default defineComponent({
    name: 'About',
    components: {
        ScatterPlot
    }
});
</script>
