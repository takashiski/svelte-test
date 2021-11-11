<script lang="ts">
  import type { LobbyAPI } from "boardgame.io";
  import type { IPlayer } from "./types/types";

  export let match: LobbyAPI.Match;
  export let player: IPlayer;
  export let currentPlayerId: string;
</script>

<div
  class="player {player.id.toString() == currentPlayerId
    ? 'current-player'
    : ''}"
>
  <p>
    {player.id}
    {match.players[player.id].name}
  </p>
  <p>
    🦗 : {player.cucamber}
  </p>
  <p class="card bold">
    <!-- <p class="card {player.id.toString() == currentPlayerId?"bold":""}"> -->
    {player.layout != null ? player.layout.num : "none"}<br />
    {#each { length: player.layout != null ? player.layout.cucamber : 0 } as _, i}
      🦗
    {/each}
  </p>
</div>

<style>
  .player {
    /* background-color: #a9ffffcc; */
    /* border:1px solid; */
    /* height: 200px; */
    width: 150px;
    text-align: center;
    vertical-align: middle;
    display: inline-block;
  }
  .current-player {
    background-color: #a9ffffcc;
  }
  .bold {
    border: 1px solid;
  }
  p.card {
    margin-left: auto;
    margin-right: auto;
    /* align-content: center; */
    height: 140px;
    width: 100px;
    border: solid 1px;
  }
</style>
