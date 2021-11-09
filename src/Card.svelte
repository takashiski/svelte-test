<script lang="ts">
	import type { ICard } from "./types/types";
	export let card: ICard;
	export let index:number;
	export let clicked: boolean;

	function click() {
		// nu+=1;
		clicked = !clicked;
	}
</script>

	{#if card != null}
<p class="card">
		{card.num}<br />
		{#each { length: card.cucamber } as _, i}
			🦗
		{/each}
</p>
	{/if}

<style>
	p.card {
		border: solid 1px;
		height: 140px;
		width: 100px;
	}
</style>
