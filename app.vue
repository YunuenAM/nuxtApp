<template>
	<div
		id="app"
		class="app-container"
	>
		<NavbarComponent />
		<TablaComponent />
	</div>
</template>

<script setup>
import NavbarComponent from '@/components/app/NavbarComponent.vue';
import TablaComponent from '@/components/app/TablaComponent.vue';
</script>

<style scoped>
.app-container {
	display: flex;
	flex-direction: row;
	min-height: 100vh;
	gap: 2rem;
	background-color: #112;
	color: white;

}
</style>