<script lang="ts">
    import { fade, fly } from 'svelte/transition';
    import { MaterialApp, AppBar, Button, Icon, Overlay,Menu, ListItem } from 'svelte-materialify';
    import { mdiMenu, mdiMagnify, mdiDotsVertical  } from '@mdi/js';
  
    import customerFeedbackHowToData from '$lib/data/how-tos/customer-feedback.yaml';
    import turnOnLightsHowToData from '$lib/data/how-tos/turn-on-lights.yaml';
    let howTos = [customerFeedbackHowToData, turnOnLightsHowToData];
    let title = "How-To";
  
    import HowTo from './HowTo.svelte';
  
    let active = false;
    function toggleNavigation() {
      active = !active;
    }
  
	let currentHowToIdx = 0;
    let startingStepKey = 'which';
	let howToVisible = true;

	function init(howToTitle) {
		currentHowToIdx = howTos.findIndex( h => h.title === howToTitle);
		startingStepKey = Object.keys(howTos[currentHowToIdx]).find( k => k !== 'title');
	}

	const useHowTo = (howToTitle) => {
		howToVisible = false;
		setTimeout( () => { 
			init(howToTitle);
			howToVisible = true; 
		},1000);
	}

	init(howTos[currentHowToIdx].title);
  </script>
  
<MaterialApp>
	<div style="position:relative;height:250px">
		<AppBar position="static">
			<div slot="icon">
				<Button fab depressed on:click="{toggleNavigation}">
					<Icon path="{mdiMenu}">
					</Icon>
				</Button>
			</div>
			<span slot="title" >{title}: {howTos[currentHowToIdx].title}</span>
            <div style="flex-grow:1"></div>
			<div>
			<Button>Help</Button>
			<Button fab depressed>
				<Icon path="{mdiMagnify}">
				</Icon>
			</Button>
			<Menu right>
				<div slot="activator">
				  <Button fab depressed>
					<Icon path="{mdiDotsVertical}">
				  	</Icon>
				</Button>
				</div>
				{#each howTos as howToInList,i}
					<ListItem on:click={e=>{useHowTo(howToInList.title)}} >{howToInList.title}</ListItem>
				{/each}
			  </Menu>
			</div>
		</AppBar>
		{#if howToVisible}
			<div in:fly="{{ y: 200, duration: 750 }}" out:fade >
				<HowTo howToData={howTos[currentHowToIdx]} {startingStepKey}></HowTo>
			</div>
		{:else}
			<div>Loading...</div>
		{/if}
		<Overlay {active} absolute on:click="{toggleNavigation}" index={1}>
		</Overlay>
    </div>
</MaterialApp>