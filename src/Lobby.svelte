<script lang="ts">
  import CucamberClient from "./CucamberClient.svelte";
  import Match from "./Match.svelte";
  import { LobbyClient } from "boardgame.io/client";
  import type { MatchingData } from "./types/lobbyTypes";
  import Player from "./Player.svelte";
  import type { LobbyAPI } from "boardgame.io";
  import { identity, text } from "svelte/internal";

  let matchingData: MatchingData = {
    joinedMatch: null,
    match: null,
    serverUrl: null,
  };
  let playerName: string = "ななしのひよこ";
  let gameLists: string[];
  let matches: LobbyAPI.Match[];
  let numOfPlayers: number = 2;

  const { protocol, hostname, port } = window.location;
  const serverUrl =
    process.env.NODE_ENV == "production"
      ? `${protocol}//${hostname}:${port}`
      : "http://localhost:8000";
  matchingData.serverUrl = serverUrl;
  // const serverUrl = "https://vast-reaches-25264.herokuapp.com";
  const lobbyClient = new LobbyClient({ server: serverUrl });

  //-------------------------------------------------
  async function listGames() {
    gameLists = await lobbyClient.listGames();
    console.log(gameLists);
  }
  async function listMatches() {
    matches = (await lobbyClient.listMatches("Cucamber")).matches.map(
      (match) => match
    );
    matches = matches.map((match) => {
      console.log(match);
      return match;
    });
  }
  async function createMatch() {
    const { matchID } = await lobbyClient.createMatch("Cucamber", {
      numPlayers: numOfPlayers,
    });
    console.log(`create new room ${matchID}`);
  }
  //-----------------------------------------------------------
</script>

{#if matchingData.joinedMatch != null}
  <CucamberClient {matchingData} {serverUrl} />
{/if}
<div>
  プレイヤー名：<input type="text" bind:value={playerName} /><br />
  <hr />
  <button on:click={listMatches}>部屋一覧を取得する</button><br />
  <div class="rooms">
    {#if matches == null}
      部屋一覧取得を押してください。
    {:else if matches.length == 0}
      今立っている部屋はないです。
    {:else}
      {#each matches as match}
        <Match bind:matchingData {match} {playerName} {lobbyClient} />
      {/each}
    {/if}
  </div>
  <div class="new-rooms">
    プレイヤー人数：
    <input type="number" bind:value={numOfPlayers} /><br />
    <button
      on:click={async () => {
        await createMatch();
        await listMatches();
      }}>部屋を作成する</button
    ><br />
  </div>
</div>

<style>
  .rooms {
    border: solid 1px;
  }
  .new-rooms {
    border: solid 1px;
  }
</style>
