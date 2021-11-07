<script lang="ts">
  import { Client } from "boardgame.io/client";
  import {Local} from "boardgame.io/multiplayer";
  import { Cucamber } from "./Cucamber";
  import type { ICard, IState, IG } from "./types/types";
  import Rules from "./Rules.svelte";
  import Player from "./Player.svelte";
  let cards: ICard[] = [];
  let currentPlayerId = "";
  let layouts: (ICard | null)[] = [];
  let G: IG = null;
  const client = Client({
    game: Cucamber,
    numPlayers: 3,
    debug: true,
  });
  client.start();
  client.subscribe((state) => update(state));

  function update(state: IState) {
    currentPlayerId = state.ctx.currentPlayer;
    layouts = state.G.players.map((v) => v.layout);
    const playerHand = state.G.players[state.ctx.currentPlayer].hand;
    cards = [];
    for (let i = 0; i < playerHand.length; i += 1) {
      cards.push({
        ...playerHand[i],
      });
    }
    G = state.G;
  }
  function discard(e: Event) {
    let index: number = e.target!.getAttribute("index");
    console.log(index);
    client.moves.discard(index);
  }
  function acceptRountResult(e:Event){
    client.moves.acceptRoundResult();
  }
  function acceptTrickResult(e:Event){
    client.moves.acceptTrickResult();
  }
</script>

<main>
  <h1>Cucamber</h1>
  <!-- <h1>Hello {name}!</h1>
  <p>
    Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn
    how to build Svelte apps.
  </p> -->
  <Rules/>

  <h2>情報</h2>
  <hr />
  <table>
    <tr>
      <td>ラウンド</td>
      <td>トリック</td>
      <td>ファーストプレイヤー</td>
      <td>最大</td>
    </tr>
    <tr>
      <td>{G.round.count}</td>
      <td>{G.trickCount}</td>
      <td>{G.prevTrick.winner}</td>
      <td>{G.trick.biggest != null ? G.trick.biggest.num : ""}</td>
    </tr>
  </table>

  <h2>場札</h2>
  <table>
    <tr>
      <th>プレイヤーID</th>
      {#each layouts as layout, i}
        <td>{i}</td>
      {/each}
    </tr>
    <tr>
      <th>きゅうり</th>
      {#each G.players as player}
        <td>
          <!-- {#each {length:player.cucamber/5} as _,i }
            🥛
          {/each} -->
          <!-- {#each {length:player.cucamber%5} as _,i } -->
          {#each { length: player.cucamber } as _, i}
            🍼
          {/each}
        </td>
      {/each}
    </tr>
    <tr>
      <th>手札枚数</th>
      {#each G.players as player}
        <td>{player.hand.length}</td>
      {/each}
    </tr>
    <tr>
      <th>場札</th>
      {#each layouts as layout}
        <td class="card">{layout != null ? layout.num : ""}</td>
      {/each}
    </tr>
  </table>
  <hr>
  {#each G.players as player}
    {#if player.id.toString() != currentPlayerId}
      <Player {player}/>
    {/if}
  {/each}
 <hr>
  <Player player={G.players[currentPlayerId]}/>
  {#if G.currentPhase == "trickResult"}
  <button on:click={acceptTrickResult}>トリックの結果をみた</button>
  {/if}
  {#if G.currentPhase == "roundResult"}
  <button on:click={acceptRountResult}>ラウンドの結果をみた</button>
  {/if}
  <h2>手札</h2>
  <p>
    {currentPlayerId}
  </p>
  <table>
    <tr>
      <!-- {#each cards as c, i (c)} -->
      {#each cards.sort((a,b)=>a.num<b.num?-1:1) as c, i (c)}
        {#if G.trick.biggest == null || G.trick.biggest.num <= c.num}
          <td
            class="card discardable-bigger"
            on:click={discard}
            index={i}
            number={c.num}
            value={c.num}>{c.num}</td
          >
        {:else if c.num === cards.reduce((p, c) => (p.num > c.num ? c : p)).num}
          <td
            class="card discardable-min"
            on:click={discard}
            index={i}
            number={c.num}
            value={c.num}>{c.num}</td
          >
        {:else}
          <td class="card" index={i} number={c.num} value={c.num}>{c.num}</td>
        {/if}
        <!-- <Card bind:nu={c.num} bind:clicked={c.clicked}/> -->
      {/each}
    </tr>
  </table>
</main>

<style>
  main {
    /* text-align: center; */
    padding: 1em;
    /* max-width: 240px; */
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
  table {
    align-content: center;
  }
  tr{
    height:50px;
    border:solid 1px #ccffff;
  }
  td {
    height: 50px;
    border: solid 1px;
  }
  .card {
    border: solid 1px;
    height: 140px;
    width: 100px;
  }
  .discardable-bigger {
    background-color: #ccffff;
  }
  .discardable-min {
    background-color: #ffccff;
  }
</style>
