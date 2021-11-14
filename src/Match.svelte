<script lang="ts">
import type { LobbyAPI } from "boardgame.io";
import type { LobbyClient } from "boardgame.io/dist/types/packages/client";
import { ActivePlayers } from "boardgame.io/dist/types/packages/core";
import Player from "./Player.svelte";
import type { MatchingData } from "./types/lobbyTypes";


  export let lobbyClient:LobbyClient;
  export let matchingData:MatchingData;
  export let match:LobbyAPI.Match;
  export let playerName:string;

</script>

<div class="match">

ゲームの種類：{match.gameName}<br/>
部屋ID:<input type="text" value={match.matchID}/>{match.players.filter((p)=>p.name).length}/{match.players.length}<br/>
参加者一覧<br/>
<ul>

{#each match.players as player}
<li>
{#if player.name}
{player.id} : {player.name} {player.isConnected}
{:else}
{player.id}
{/if}
</li>
{/each}
</ul>
</div>

<style>
  .match{
    border:1px solid;
  }
</style>