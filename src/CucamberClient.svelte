<script lang="ts">
  import { Client } from "boardgame.io/client";
  import { Local } from "boardgame.io/multiplayer";
  import { SocketIO } from "boardgame.io/multiplayer";
  import { Cucamber } from "./Cucamber";
  import type { ICard, IState, IG } from "./types/types";
  import Rules from "./Rules.svelte";
  import Player from "./Player.svelte";
  import Modal, { getModal } from "./Modal.svelte";
  import Card from "./Card.svelte";

  export let playerId: string = "";
  export let matchId: string = "default";
  export let credentials: string = "";
  let cards: ICard[] = [];
  let selectedCard: ICard;
  let selectedIndex: number;
  let currentPlayerId = "";
  let layouts: (ICard | null)[] = [];
  let G: IG = null;

  console.log(playerId);
  console.log(matchId);
  console.log(credentials);

  const client = Client({
    game: Cucamber,
    multiplayer: SocketIO({ server: "localhost:8000" }),
    numPlayers: 2,
    matchID: matchId,
    playerID: playerId,
    credentials: credentials,
    debug: true,
  });
  client.start();
  client.subscribe((state) => update(state));
  // client.sendChatMessage("test");

  function update(state: IState) {
    // console.log(state);
    if (state == null) {
      console.error("receive null state");
      return;
    }
    currentPlayerId = state.ctx.currentPlayer;
    layouts = state.G.players.map((v) => v.layout);
    const playerHand = state.G.players[playerId].hand;
    // const playerHand = state.G.players[state.ctx.currentPlayer].hand;
    cards = [];
    for (let i = 0; i < playerHand.length; i += 1) {
      cards.push({
        ...playerHand[i],
      });
    }
    G = state.G;
  }
  function selectCard(e: Event) {
    let index: number = e.target!.getAttribute("index");
    selectedCard = cards[index];
    selectedIndex = index;
    console.log(selectedCard);
    console.log(selectedIndex);
    getModal("verify-modal").open();
  }
  function discard() {
    console.log(client.playerID);
    client.moves.discard(selectedIndex);
  }
  // function discard(e: Event) {
  //   let index: number = e.target!.getAttribute("index");
  //   console.log(index);
  //   console.log(client);
  //   client.moves.discard(index);
  // }
  function acceptRountResult(e: Event) {
    client.moves.acceptRoundResult();
  }
  function acceptTrickResult(e: Event) {
    client.moves.acceptTrickResult();
  }
  $: myTurn = playerId == currentPlayerId;
</script>

<main>
  <!-- {#if G!=null} -->
  <!-- <h1>Cucamber</h1> -->
  <!-- <h1>Hello {name}!</h1>
  <p>
    Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn
    how to build Svelte apps.
  </p> -->
  <!-- <Rules/> -->

  <!-- <h2>情報</h2> -->
  <!-- <hr /> -->
  <h2>Player {playerId}</h2>
  {#if playerId == currentPlayerId}
    あなたの番です。
  {/if}
  {#if G != null}
    <table>
      <tr>
        <td>ラウンド</td>
        <td>トリック</td>
      </tr>
      <tr>
        <td>{G.round.count}</td>
        <td>{G.trickCount}</td>
      </tr>
    </table>
  {/if}

  {#if G != null}
    <hr />
    {#each G.players as player}
      <!-- {#if player.id.toString() != currentPlayerId} -->
      <Player {player} {currentPlayerId} />
      <!-- {/if} -->
    {/each}
    <!-- <hr>
  <Player player={G.players[currentPlayerId]}/> -->
    {#if G.currentPhase == "trickResult"}
      <button on:click={acceptTrickResult}>トリックの結果をみた</button>
    {/if}
    {#if G.currentPhase == "roundResult"}
      <button on:click={acceptRountResult}>ラウンドの結果をみた</button>
    {/if}
    <h2>手札</h2>
    <!-- <p>
    {currentPlayerId}
  </p> -->
    <table>
      <tr>
        {#each cards as c, i (c)}
          <!-- {#each cards.sort((a, b) => (a.num < b.num ? -1 : 1)) as c, i (c)} -->
          {#if myTurn && (G.trick.biggest == null || G.trick.biggest.num <= c.num)}
            <td
              class="card discardable-bigger"
              on:click={selectCard}
              index={i}
              number={c.num}
              value={c.num}>{c.num}</td
            >
          {:else if myTurn && c.num === cards.reduce( (p, c) => (p.num > c.num ? c : p) ).num}
            <td
              class="card discardable-min"
              on:click={selectCard}
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
  {/if}
</main>

<Modal id="verify-modal">
  Player {playerId}<br />
  このカードを出しますか？
  <Card bind:card={selectedCard} />
  <button
    on:click={() => {
      getModal("verify-modal").close();
      selectedCard = null;
    }}>いいえ</button
  >
  <button
    on:click={() => {
      discard();
      getModal("verify-modal").close();
    }}>はい</button
  >
</Modal>

<style>
  main {
    /* text-align: center; */
    padding: 1em;
    /* max-width: 240px; */
    margin: 5px auto;
    border: 1px solid;
    width: 600px;
    display: inline-block;
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
  tr {
    height: 50px;
    border: solid 1px #ccffff;
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
  .card:active {
    background-color: #ccffff;
    border: solid 3px #000000;
  }
  .discardable-bigger {
    background-color: #ccffff;
  }
  .discardable-min {
    background-color: #ffccff;
  }
</style>
