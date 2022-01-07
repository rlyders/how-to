import App from './App.svelte';
import customerFeedbackHowToData from '../public/how-tos/customer-feedback.yaml';
import turnOnLightsHowToData from '../public/how-tos/turn-on-lights.yaml';
let howTos = [customerFeedbackHowToData, turnOnLightsHowToData];

const app = new App({
	target: document.body,
	props: {
		title: 'How-To',
		howTos: howTos
	}
});

export default app;