<script lang="ts">
  import Card from "./Card.svelte";
  import {Cucamber} from "./Cucamber";
  export let name: string;
  let deck = [];
  let pile = [];
  for (let i = 0; i < 5; i += 1)
    deck.push({ nu: i, nu2: 5 - i, clicked: false });
  $: deck = (() => {
    deck
      .filter((v) => v.clicked === true)
      .forEach((v) => {
        pile.push(v);
      });
    return deck.filter((v) => v.clicked === false);
  })();
</script>

<main>
  <h1>Hello {name}!</h1>
  <p>
    Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn
    how to build Svelte apps.
  </p>
  <table>
    <tr>
      {#each pile as c}
        <Card bind:nu={c.nu} />
      {/each}
    </tr>
    <tr>
      {#each deck as c}
        <Card bind:nu={c.nu} bind:clicked={c.clicked} />
      {/each}
    </tr>
  </table>
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
  tr{
    height:140px;
  }
</style>
