import { InjectionKey } from 'vue';
import { createStore, Store } from 'vuex';

interface Columns {
    [index: string]: number[];
}

interface State {
    columns: Columns;
    selectedIndex: number;
}

// define injection key
export const key: InjectionKey<Store<State>> = Symbol();

export const store = createStore({
    state: {
        columns: {
            A: [0, 1, 2, 3, 4, 5],
            B: [5, 4, 3, 2, 1, 0],
            C: [4, 2, 4, 2, 4, 2]
        },
        selectedIndex: -1
    },
    mutations: {
        SET_SELECTED(state, index: number) {
            state.selectedIndex = index;
        }
    },
    actions: {
        setSelected({ commit }, index: number) {
            commit('SET_SELECTED', index);
        }
    },
    modules: {}
});
