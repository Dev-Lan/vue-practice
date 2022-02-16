import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { store, key } from './store';

const app = createApp(App).use(store).use(router);

app.use(store, key);

// app.config.globalProperties.$store = store;

app.mount('#app');
