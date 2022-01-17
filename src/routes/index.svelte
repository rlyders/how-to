<script lang="ts">
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
  
    let startingStepKey = 'who';
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
			<span slot="title" >{title}: {howTos[0].title}</span>
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
				{#each howTos as howTo,i}
					<ListItem>{howTo.title}</ListItem>
				{/each}
			  </Menu>
			</div>
		</AppBar>
		<HowTo howToData={howTos[0]} {startingStepKey}></HowTo>
		<Overlay {active} absolute on:click="{toggleNavigation}" index={1}>
		</Overlay>
    </div>
</MaterialApp>