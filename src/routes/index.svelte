<script lang="ts">
    import TopAppBar, { Row, Section, Title } from '@smui/top-app-bar';
    import IconButton from '@smui/icon-button';
    import Banner, { Label } from '@smui/banner';

    import Menu, { MenuComponentDev } from '@smui/menu';
    import List, { Item, Text } from '@smui/list';
  
    import customerFeedbackHowToData from '$lib/data/how-tos/customer-feedback.yaml';
    import turnOnLightsHowToData from '$lib/data/how-tos/turn-on-lights.yaml';
    import HowTo from './HowTo.svelte';
    import { fade, fly } from 'svelte/transition';
    import { version } from '$lib/version';

    let howTos = [customerFeedbackHowToData, turnOnLightsHowToData];
    let title = "How-To";

    let menu: MenuComponentDev;

    let prominent = false;
    let dense = false;
    let secondaryColor = false;

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
		} // FIXME a delay >=500ms is required here otherwise the How-To guide never actually changes
    ,500);
	}

	init(howTos[currentHowToIdx].title);

</script> 
 
  <div class="flexy">
    <div class="top-app-bar-container flexor">
      <TopAppBar
        variant="static"
        {prominent}
        {dense}
        color={secondaryColor ? 'secondary' : 'primary'}
      >
        <Row>
          <Section>
            <IconButton class="material-icons" on:click={() => menu.setOpen(true)}>menu</IconButton>
              <Menu bind:this={menu}>
                <List>
                    {#each howTos as howToInList,i}
                        <Item on:SMUI:action={() => useHowTo(howToInList.title)}>
                            <Text>{howToInList.title}</Text>
                        </Item>    
    				{/each}
                </List>
              </Menu>
          
            <Title>{title} <span style="font-size:80%">v{version}</span>: {howTos[currentHowToIdx].title}</Title>
          </Section>
          <Section align="end" toolbar>
            <IconButton class="material-icons" aria-label="Download"
              >file_download</IconButton
            >
            <IconButton class="material-icons" aria-label="Print this page"
              >print</IconButton
            >
            <IconButton class="material-icons" aria-label="Bookmark this page"
              >bookmark</IconButton
            >
          </Section>
        </Row>
      </TopAppBar>
      <div class="flexor-content">
        <!-- This `{#if !howToVisible}` for the <Banner> must be before *and in a separate if/then*
          from the `{#if howToVisible}` for the <HowTo> so that the Banner doesn't move around when
          the <HowTo> fades away -->
        {#if !howToVisible}
          <Banner open fixed mobileStacked content$style="max-width: max-content;">
            <Label slot="label">
              Loading...
            </Label>
          </Banner>		
        {/if}
        {#if howToVisible}
          <div in:fly="{{ y: 200, duration: 750 }}" out:fade >
            <HowTo howToData={howTos[currentHowToIdx]} {startingStepKey}></HowTo>
          </div>
        {/if}
      </div>
    </div>
  </div>
  
  <style>
    .top-app-bar-container {
      width: 100%;
      height: 600px;
      border: 1px solid
        var(--mdc-theme-text-hint-on-background, rgba(0, 0, 0, 0.1));
      margin: 0 18px 18px 0;
      background-color: var(--mdc-theme-background, #fff);
  
      overflow: auto;
      display: inline-block;
    }
  
    @media (max-width: 480px) {
      .top-app-bar-container {
        margin-right: 0;
      }
    }
  
    .flexy {
      display: flex;
      flex-wrap: wrap;
    }
  
    .flexor {
      display: inline-flex;
      flex-direction: column;
    }
  
    .flexor-content {
      flex-basis: 0;
      height: 0;
      flex-grow: 1;
      overflow: auto;
    }
  </style>
  