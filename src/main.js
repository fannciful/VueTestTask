import { createApp } from 'vue';
import App from './App.vue';

import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura'; // тема Aura
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css'; // primeflex для утиліт

// PrimeVue компоненти
import Button from 'primevue/button';
import FileUpload from 'primevue/fileupload';
import Checkbox from 'primevue/checkbox';
import Card from 'primevue/card';
import ScrollPanel from 'primevue/scrollpanel';
import Divider from 'primevue/divider';
import Panel from 'primevue/panel';
import Tag from 'primevue/tag';
import Tabs from 'primevue/tabs';
import Tab from 'primevue/tab';

const app = createApp(App);

app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
});

app.component('Button', Button);
app.component('FileUpload', FileUpload);
app.component('Checkbox', Checkbox);
app.component('Card', Card);
app.component('ScrollPanel', ScrollPanel);
app.component('Divider', Divider);
app.component('Panel', Panel);
app.component('Tag', Tag);
app.component('Tabs', Tabs);
app.component('Tab', Tab);

app.mount('#app');
