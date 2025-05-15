import { createRouter, createWebHistory } from 'vue-router';
import TablaComponent from '~/components/app/TablaComponent.vue';
import NavbarComponent from '~/components/app/NavbarComponent.vue';

const routes = [
	
	{
		path: '/tabla',
		name: 'Tabla',
		component: TablaComponent,
	},
	{
		path: '/navbar',
		name: 'NavbarComponent',
		component: NavbarComponent,
	},
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});
export default router;