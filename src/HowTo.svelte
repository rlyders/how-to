<script lang="ts">
  import { ButtonGroup, ButtonGroupItem, Card, CardText, CardActions, Button} from 'svelte-materialify';
  export let howToData;
  export let startingStepKey;
    const values = [];
    let choiceElements = [{}, {}];
    let displayedSteps = [];

    const handleClickChoice = (stepData, choiceIdx) => {
        stepData.selectedChoice=stepData.choices[choiceIdx];
        buildDisplayedQuestionList();
    }
    const buildDisplayedQuestionList = () => {
        let nextStepKey = startingStepKey;
        displayedSteps = [];
        do {
            let nextStepData;
            if (howToData.hasOwnProperty(nextStepKey)) {
                nextStepData = howToData[nextStepKey];
            } else {
                nextStepData = nextStepKey;
            }
            displayedSteps.push(nextStepData);
            nextStepKey = nextStepData.selectedChoice ? Object.values(nextStepData.selectedChoice)[0] : undefined;
        } while (nextStepKey);
    }
    buildDisplayedQuestionList();
</script>

{#each displayedSteps as stepData,stepIdx}
    <div class="card-container">
        <Card padded>
            <CardText>
                <div class="container" style="display: flex;">
                    <div style="margin: 0px; padding: 10px 0px; color: #888; width: 50px">
                        Guide:
                    </div>
                    <div xmlns="http://www.w3.org/1999/xhtml" style="flex-grow: 1; font-size: 24px; background-color: #F3F5F6; margin: 10px; padding: 25px 20px;">
                        {stepData.question ? stepData.question : stepData}
                    </div>
                </div>
            </CardText>
            {#if stepData.learnMore}
                <CardActions>
                    <Button text class="primary-text" href={stepData.learnMore} target="_blank">Learn More</Button>
                </CardActions>      
            {/if}
            {#if stepData.choices}
                <div class="text-center">
                    <ButtonGroup mandatory activeClass="selected-choice white-text" bind:value={stepData.selectedChoice}>
                        {#each stepData.choices as choice,choiceIdx}
                            <ButtonGroupItem style="font-size: 24px; background-color: #F3F5F6; margin: 100px; padding: 25px 50px; height: 50px;" bind:this={choiceElements[choiceIdx]} on:click={handleClickChoice(stepData, choiceIdx)} value={choice}>
                                {Object.keys(choice)[0]}
                            </ButtonGroupItem>
                        {/each}
                    </ButtonGroup>
                </div>
            {/if}
        </Card>
    </div>
{/each}
