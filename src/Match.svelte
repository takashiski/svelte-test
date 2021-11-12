<script lang="ts">
import type { LobbyAPI } from "boardgame.io";
import type { LobbyClient } from "boardgame.io/dist/types/packages/client";
import type { MatchingData } from "./types/lobbyTypes";


  export let lobbyClient:LobbyClient;
  export let matchingData:MatchingData;
  export let match:LobbyAPI.Match;
  export let playerName:string;

  async function seated(id: string) {
    matchingData.joinedMatch = await lobbyClient.joinMatch(
      match.gameName,
      match.matchID,
      {
        // playerID: id,
        playerName: playerName,
      }
    );
    matchingData.match = match;
  }
</script>

<div class="match">

ゲームの種類：{match.gameName}<br/>
部屋ID:<input type="text" value={match.matchID}/> <br/>
参加者一覧<br/>
<ul>

{#each match.players as player}
<li>

{#if player.isConnected}
{player.id} : {player.name}
{:else}
{player.id} : <button on:click={()=>{seated(player.id.toString())}}>ここに座る</button>
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