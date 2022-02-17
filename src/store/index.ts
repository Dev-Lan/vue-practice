import { createStore } from 'vuex';

export interface Columns {
    [index: string]: number[];
}

export interface FilterPayload {
    componentId: string;
    filterList: Filter[];
}
export interface Filter {
    low: number;
    high: number;
    key: string;
}
export interface Filters {
    [index: string]: Filter[];
}
export interface State {
    columns: Columns;
    columnHeaders: string[];
    normalIndices: number[];
    brushedIndices: number[];
    selectedIndex: number;
    filters: Filters;
}

function getFlatFilters(state: State): Filter[] {
    let flatFilters: Filter[] = [];
    for (const key in state.filters) {
        flatFilters = flatFilters.concat(state.filters[key]);
    }
    return flatFilters;
}

function getIndices(state: State): {
    normalIndices: number[];
    brushedIndices: number[];
} {
    const normalIndices: number[] = [];
    const brushedIndices: number[] = [];
    const firstHeader = state.columnHeaders[0];
    const flatFilters = getFlatFilters(state);
    for (let i = 0; i < state.columns[firstHeader].length; i++) {
        if (i === state.selectedIndex) continue;
        if (flatFilters.length === 0) {
            normalIndices.push(i);
            continue;
        }
        let brushed = true;
        for (const { low, high, key } of flatFilters) {
            const val = state.columns[key][i];
            if (val < low || high < val) {
                normalIndices.push(i);
                brushed = false;
                break;
            }
        }
        if (brushed) {
            brushedIndices.push(i);
        }
    }
    return { normalIndices, brushedIndices };
}

function updateIndices(state: State): void {
    const { normalIndices, brushedIndices } = getIndices(state);
    state.normalIndices = normalIndices;
    state.brushedIndices = brushedIndices;
    return;
}

export const store = createStore<State>({
    state: {
        columns: {
            A: [0, 1, 2, 3, 4, 5],
            B: [5, 4, 3, 2, 1, 0],
            C: [0, 1.1, 2.5, 3.1, 3, 2.5],
        },
        columnHeaders: ['A', 'B', 'C'],
        normalIndices: [0, 1, 2, 3, 4],
        brushedIndices: [],
        selectedIndex: -1,
        filters: {},
    },
    mutations: {
        SET_SELECTED(state, index: number) {
            state.selectedIndex = index;
            updateIndices(state);
        },
        SET_COLUMNS(state, columns: Columns) {
            state.columns = columns;
            updateIndices(state);
        },
        ADD_FILTER(state, { componentId, filterList }: FilterPayload) {
            state.filters[componentId] = filterList;
            updateIndices(state);
        },
    },
    actions: {
        setSelected({ commit }, index: number) {
            commit('SET_SELECTED', index);
        },
        setColumn({ commit }, columns: Columns) {
            commit('SET_COLUMNS', columns);
        },
        addFilter({ commit }, filterPayload: FilterPayload) {
            commit('ADD_FILTER', filterPayload);
        },
    },
    getters: {},
    modules: {},
});
