<script lang="ts">
  import CucamberClient from "./CucamberClient.svelte";
  import Match from "./Match.svelte";
  import { LobbyClient } from "boardgame.io/client";
  import type { MatchingData } from "./types/lobbyTypes";
  import type { LobbyAPI } from "boardgame.io";
  import { Cucamber } from "./Cucamber";

  let matchingData: MatchingData = {
    joinedMatch: null,
    match: null,
    serverUrl: null,
  };
  let playerName: string = "ななしのひよこ";
  let gameLists: string[];
  let matches: LobbyAPI.Match[];
  let numOfPlayers: number = 3;

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
      numPlayers: clamp(numOfPlayers, Cucamber.minPlayers, Cucamber.maxPlayers),
    });
    console.log(`create new room ${matchID}`);
  }
  async function leaveMatch() {
    const result = await lobbyClient.leaveMatch(
      matchingData.match.gameName,
      matchingData.match.matchID,
      {
        playerID: matchingData.joinedMatch.playerID,
        credentials: matchingData.joinedMatch.playerCredentials,
      }
    );
    console.log(result);
    matchingData.joinedMatch = null;
    matchingData.match = null;
    console.log("leave match");
    await listMatches();
  }
  function clamp(num: number, min: number, max: number) {
    if (min <= num && num <= max) {
      return num;
    } else if (num < min) {
      return min;
    } else {
      return max;
    }
  }

  async function joinMatch(match) {
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
  //-----------------------------------------------------------
</script>

{#if matchingData.match != null}
  <CucamberClient bind:matchingData {serverUrl} onClose={leaveMatch} />
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
        {#if matchingData.match ==null}
        <button on:click={()=>joinMatch(match)}>この部屋に参加する</button>
        {/if}
      {/each}
    {/if}
  </div>
  {#if matches == null}
  <br/>
  {:else if matches.length == 0}
    <div class="new-rooms">
      プレイヤー人数：{numOfPlayers}
      <input
        type="range"
        min={Cucamber.minPlayers}
        max={Cucamber.maxPlayers}
        bind:value={numOfPlayers}
      /><br />
      <button
        on:click={async () => {
          await createMatch();
          await listMatches();
          await joinMatch(matches[0]);
          await listMatches();
        }}>部屋を作成する</button
      ><br />
    </div>
  {/if}
</div>

<style>
  .rooms {
    border: solid 1px;
  }
  .new-rooms {
    border: solid 1px;
  }
</style>
