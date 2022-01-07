<script lang="ts">
  import { MaterialApp, AppBar, Button, Icon, NavigationDrawer, Overlay,Menu, ListItem } from 'svelte-materialify';
  import { mdiMenu, mdiMagnify, mdiDotsVertical  } from '@mdi/js';
  import HowTo from './HowTo.svelte';
  const items = [
    { text: 'Who', href: '/question/1' },
    { text: 'How', href: '/question/2' },
    { text: 'Details', disabled: true },
  ];

  let active = false;
  function toggleNavigation() {
    active = !active;
  }

	export let title;
	export let howTos;

	let startingStepKey = 'q1';
</script>

<MaterialApp>
	<div style="position:relative;height:250px">
		<AppBar dense>
			<div slot="icon">
				<Button fab depressed on:click={toggleNavigation}>
					<Icon path={mdiMenu} />
				</Button>
			</div>
			<span slot="title">{title}: {howTos[0].title}</span>
			<div style="flex-grow:1" />
			<Button>Help</Button>
			<Button fab depressed>
			<Icon path={mdiMagnify} />
			</Button>
			<Menu right>
				<div slot="activator">
				  <Button fab depressed>
					<Icon path={mdiDotsVertical} />
				  </Button>
				</div>
				{#each howTos as howTo,i}
					<ListItem>{howTo.title}</ListItem>
				{/each}
			  </Menu>
			</AppBar>
		<HowTo howToData={howTos[0]} {startingStepKey}></HowTo>
		<NavigationDrawer style="position: relative" {active}>
		</NavigationDrawer>
		<Overlay {active} absolute on:click={toggleNavigation} index={1}/>
	</div>
</MaterialApp>
