<script lang="ts">
    import { fade, fly } from 'svelte/transition';
    import { ButtonGroup, ButtonGroupItem, Card, CardText, CardActions, Button, Breadcrumbs, Icon} from 'svelte-materialify';
    import { UserChoice } from '$lib/UserChoice';

    export let howToData;
    export let startingStepKey;

    let startingUserChoice = new UserChoice({path: `/${startingStepKey}`, stepKey: startingStepKey});
    let currentUserChoiceIdx = 0;
    let userChoices: UserChoice[] = [startingUserChoice];
    let currentUserChoice: UserChoice;
    let currentHowToStep;

    $: currentUserChoice = userChoices[currentUserChoiceIdx];
    $: currentHowToStep = currentUserChoice && currentUserChoice.stepKey ? howToData[currentUserChoice.stepKey] : undefined;
    
    let htmlContent = '';
    let visibleCard = true;
    let transitionMultiplier = 1;

    const handleClickChoice = (userChoice, choiceKey) => {
        if (choiceKey !== userChoice.selectedChoiceKey) {
            userChoices.length = currentUserChoiceIdx+1;
            userChoice.selectedChoiceKey=choiceKey;
            userChoice.selectedChoiceValue=howToData[userChoice.stepKey].choices[choiceKey];
            if (currentUserChoiceIdx+1 >= userChoices.length) {
                let newUserChoice;
                if (howToData.hasOwnProperty(userChoice.selectedChoiceValue)) {
                    newUserChoice = new UserChoice({
                        path: `${currentUserChoice.path}/${userChoice.selectedChoiceValue}`, 
                        stepKey: userChoice.selectedChoiceValue
                    });
                } else {
                    newUserChoice = new UserChoice({
                        url: userChoice.selectedChoiceValue
                    });
                }
                userChoices = [...userChoices, newUserChoice];
            } else {
                userChoices = userChoices;
            }
        }
        transitionCard(false, () => {
            currentUserChoiceIdx++;
        });
    }

    function transitionCard(toRight: boolean, callback: Function) {
        transitionMultiplier = toRight ? -1 : 1;
        visibleCard=false;
        setTimeout( () => {
            callback();
            visibleCard=true;
        }, 500);
    }

    const handleClickBreadcrumb = (userChoiceIdx) => {
        transitionCard(true, () => {
            currentUserChoiceIdx = userChoiceIdx;
        });
    }

    function getHtml(url) {
        if (url) {
            fetch(url).then(response => {
                return response.text();
            }).then(html => {
                htmlContent = html
            });
        }
    }

    function getStepUrl(stepData) {
        if (isValidHttpUrl(stepData)) {
            return stepData;
        }
        if (stepData.selectedChoiceKey) {
            let selectedChoiceValue = Object.values(stepData.selectedChoiceKey)[0];
            if (isValidHttpUrl(selectedChoiceValue))
            return selectedChoiceValue;
        }
        return undefined;
    }

    function isValidHttpUrl(possibleUrlStr: string) {
        let url;
        try {
            url = new URL(possibleUrlStr);
        } catch (_) {
            return false;  
        }

        return url.protocol === "http:" || url.protocol === "https:";
    }
    // breadcrumb label:(nextStepKey.length <= 20) ? nextStepKey : nextStepKey.substr(0, 9) + "..." + nextStepKey.substr(nextStepKey.length-10);
</script>

{#if currentHowToStep }

    <ul class="breadcrumb">
        {#each userChoices as userChoice,userChoiceIdx}
            {#if userChoiceIdx <= currentUserChoiceIdx}
                <li in:fly="{{ y: 200, duration: 750 }}" out:fade>
                    {#if userChoiceIdx < currentUserChoiceIdx}
                        <a href={userChoice.path} on:click|preventDefault={() => handleClickBreadcrumb(userChoiceIdx)}>{userChoice.selectedChoiceKey}</a>
                    {:else if userChoiceIdx == currentUserChoiceIdx}
                        <span>{userChoice.selectedChoiceKey ? userChoice.selectedChoiceKey : userChoice.stepKey}</span>
                    {/if}
                </li>
            {/if}
        {/each}    
    </ul> 

    {#if visibleCard }
        <div in:fly="{{ x: 200*transitionMultiplier, duration: 750 }}" out:fade class="card-container">
            <Card padded>
                <CardText>
                    <div class="container" style="display: flex;">
                        <div style="margin: 0px; padding: 10px 0px; color: #888; width: 50px">
                            Guide:
                        </div>
                        <div style="flex-grow: 1; font-size: 24px; background-color: #F3F5F6; margin: 10px; padding: 25px 20px;">
                            {#if (typeof currentHowToStep == 'string' || currentHowToStep instanceof String) && isValidHttpUrl(currentHowToStep)}
                                <a href={currentHowToStep} target="_tab">{currentHowToStep}</a>
                            {:else}
                                {currentHowToStep.question ? currentHowToStep.question : currentHowToStep}
                            {/if}
                        </div>
                    </div>
                </CardText>
                <CardActions>
                    <div style="flex: 1;">
                        {#if currentHowToStep.learnMore}                      
                            <Button text class="primary-text" on:click={() => {window.open(currentHowToStep.learnMore, "_tab")}}>Learn More</Button>
                        {/if}
                    </div>
                    {#if currentHowToStep.choices}
                        <div class="text-center" style="flex: 20;">
                            <ButtonGroup mandatory activeClass="selected-choice white-text" 
                                bind:value={currentHowToStep.selectedChoiceKey}>
                                {#each Object.keys(currentHowToStep.choices) as choiceKey,choiceIdx}
                                    <ButtonGroupItem 
                                        on:click={handleClickChoice(currentUserChoice, choiceKey)} value={choiceKey}>
                                        {choiceKey}
                                    </ButtonGroupItem>
                                {/each}
                            </ButtonGroup>
                        </div>
                    {/if}
                </CardActions>    
            </Card>
        </div>
    {/if}
{/if}

<!-- <code>
    <div>currentUserChoiceIdx={currentUserChoiceIdx}</div>
    <div>userChoices[currentUserChoiceIdx]={JSON.stringify(userChoices[currentUserChoiceIdx], null, 2)}</div>
    <div>userChoices[currentUserChoiceIdx].stepKey={JSON.stringify(userChoices[currentUserChoiceIdx].stepKey, null, 2)}</div>
    <div>howToData[userChoices[currentUserChoiceIdx].stepKey]={JSON.stringify(howToData[userChoices[currentUserChoiceIdx].stepKey], null, 2)}</div>
    <div>startingUserChoice={JSON.stringify(startingUserChoice, null, 2)}</div>
    <div>userChoices={JSON.stringify(userChoices, null, 2)}</div>
    <div>currentUserChoice={JSON.stringify(currentUserChoice, null, 2)}</div>
    <div>currentHowToStep={JSON.stringify(currentHowToStep, null, 2)}</div>
    <div>currentUserChoice.stepKey={JSON.stringify(currentUserChoice ? currentUserChoice.stepKey : undefined, null, 2)}</div>
    <div>howToData[currentUserChoice.stepKey]={JSON.stringify(currentUserChoice && currentUserChoice.stepKey ? howToData[currentUserChoice.stepKey] : undefined, null, 2)}</div>
</code> -->

<style>
ul.breadcrumb {
  padding: 10px 16px;
  list-style: none;
  background-color: #eee;
}

/* Display list items side by side */
ul.breadcrumb li {
  display: inline;
  font-size: 18px;
}

/* Add a slash symbol (/) before/behind each list item */
ul.breadcrumb li+li:before {
  padding: 8px;
  color: black;
  content: "/\00a0";
}

/* Add a color to all links inside the list */
ul.breadcrumb li a {
  color: #0275d8;
  text-decoration: none;
}

/* Add a color on mouse-over */
ul.breadcrumb li a:hover {
  color: #01447e;
  text-decoration: underline;
}    
</style>