<script lang="ts">
  import { Client, LobbyClient } from "boardgame.io/client";
  import type { LobbyAPI } from "boardgame.io";
  import { SocketIO } from "boardgame.io/multiplayer";
  import { Cucamber } from "./Cucamber";
  import type { ICard, IState, IG } from "./types/types";
  import Rules from "./Rules.svelte";
  import Player from "./Player.svelte";
  import Modal, { getModal } from "./Modal.svelte";
  import Card from "./Card.svelte";
  import type { MatchingData } from "./types/lobbyTypes";
  import Match from "./Match.svelte";

  export let matchingData: MatchingData;
  export let serverUrl: string;
  export let onClose = async () => {};
  const matchId: string = matchingData.match.matchID;
  const playerId: string = matchingData.joinedMatch.playerID;
  let cards: ICard[] = [];
  let selectedCard: ICard;
  let selectedIndex: number;
  let currentPlayerId = "";
  let layouts: (ICard | null)[] = [];
  let G: IG = null;
  let TIMEOUT = 15;
  let playerName = "";

  const client = Client({
    game: Cucamber,
    multiplayer: SocketIO({ server: serverUrl }),
    numPlayers: matchingData.match.players.length,
    matchID: matchId,
    playerID: matchingData.joinedMatch.playerID,
    credentials: matchingData.joinedMatch.playerCredentials,
    debug: true,
  });
  client.start();
  client.subscribe((state) => update(state));

  function update(state: IState) {
    if (state == null) {
      console.error("receive null state");
      return;
    }
    currentPlayerId =
      state.G.currentStage == "main" ? state.ctx.currentPlayer : "-1";
    layouts = state.G.players.map((v) => v.layout);
    const player = state.G.players[playerId];
    console.log(player);
    const playerHand = player.hand;
    cards = [];
    for (let i = 0; i < playerHand.length; i += 1) {
      cards.push({
        ...playerHand[i],
      });
    }
    G = state.G;
    if ((playerName = "")) playerName = client.matchData[playerId].name;
    console.log(client.matchData);
  }
  function selectCard(e: Event) {
    let index: number = e.target!.getAttribute("index");
    if (selectedCard == cards[index]) {
      discard();
    } else {
      selectedCard = cards[index];
      selectedIndex = index;
      console.log(selectedCard);
      console.log(selectedIndex);
    }
  }
  function discard() {
    console.log(client.playerID);
    client.moves.discard(selectedIndex);
  }
  function acceptRountResult(e: Event) {
    client.moves.acceptRoundResult();
  }
  function acceptTrickResult(e: Event) {
    client.moves.acceptTrickResult();
  }
  $: myTurn = playerId == currentPlayerId;
</script>

<main>
  <Rules />
  {#if client.matchData==null}
  null
  <br/>
  {:else if client.matchData.filter((v) => v.name == null || v.name == undefined).length > 0}
    参加者を待っています
    <ul>
      {#each client.matchData as p}
      <li>{p.id}:{p.name} {p.isConnected}</li>
      {/each}
    </ul>
  {:else}
    {#if matchingData.match}
      <h2>
        {matchingData.match.gameName} : {matchingData.match.matchID}
        <button on:click={onClose}>退席する</button>
      </h2>
    {/if}

    <h2>
      Player {playerId} : {playerName}
    </h2>
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
        <Player
          {player}
          {currentPlayerId}
          playerName={client.matchData[player.id].name}
        />
        <!-- {/if} -->
      {/each}
      <hr />
      {#if G.currentStage == "main"}
        {#if G.trickCount < 6}
        <ul>
          <li>他の人のカードの数字と同じ数字か、大きい数字のカードを出そう。</li>
          <li>だせないか出したくないときは、手札の中で一番小さい数字でもよいぞ。</li>
          <li>最後の1枚が他の人のカードの数字より小さくなるようにしよう</li>
        </ul>
        {/if}
      {/if}
      {#if G.currentStage == "trickResult"}
        <h3>
          第 {G.trickCount} トリック勝者：{G.trick.winner}:{client.matchData[
            G.trick.winner
          ].name}
        </h3>
        <br />
        <button on:click={acceptTrickResult}>次のトリックへ進む</button><br />
      {/if}
      {#if G.currentStage == "roundResult"}
        <h3>第 {G.round.count} ラウンド</h3>
        <br />
        敗者 {G.trick.winner}:{client.matchData[G.trick.winner].name}<br />
        <button on:click={acceptRountResult}>次のラウンドへ進む</button>
      {/if}
      <hr />
      <h2>手札</h2>
      <!-- <p>
    {currentPlayerId}
  </p> -->
      <table>
        <tr>
          {#each cards as c, i (c)}
            <!-- {#each cards.sort((a, b) => (a.num < b.num ? -1 : 1)) as c, i (c)} -->
            {#if myTurn && c == selectedCard}
              <td
                class="card selected-card"
                on:click={selectCard}
                index={i}
                number={c.num}
                value={c.num}>{c.num}</td
              >
            {:else if myTurn && (G.trick.biggest == null || G.trick.biggest.num <= c.num)}
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
              <td class="card" index={i} number={c.num} value={c.num}
                >{c.num}</td
              >
            {/if}
            <!-- <Card bind:nu={c.num} bind:clicked={c.clicked}/> -->
          {/each}
        </tr>
      </table>
    {/if}
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
  .card:hover {
    /* background-color: #ccffff; */
    border: solid 3px #000000;
  }
  .selected-card {
    background-color: #99ffff;
  }
  /* .card:checked{
    background-color: #ffccff;
    border:solid 3px #000000;
  } */
  .discardable-bigger {
    background-color: #ccffff;
  }
  .discardable-min {
    background-color: #ffccff;
  }
</style>
