<script lang="ts">
  import CucamberClient from "./CucamberClient.svelte";
  import { LobbyClient } from "boardgame.io/client";
  import Player from "./Player.svelte";
  import type { LobbyAPI } from "boardgame.io";
import { identity, text } from "svelte/internal";
  let playerId: string = "";
  let playerName: string = "";
  let matchId: string = "";
  let credentials: string = "";
  let tempMatchId: String = "default";
  let inputNumber: number;
  let gameLists: string[];
  let matches: LobbyAPI.Match[];
  let numOfPlayers: number = 2;

  const { protocol, hostname, port } = window.location;
  const serverUrl = `${protocol}//${hostname}:${port}`;
  // const serverUrl = "https://vast-reaches-25264.herokuapp.com";
  // const serverUrl = "http://localhost:8000";
  const lobbyClient = new LobbyClient({ server: serverUrl });
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
  async function setPlayerId() {
    playerId = inputNumber.toString();
    console.log(playerId);
  }
  async function createMatch() {
    const { matchID } = await lobbyClient.createMatch("Cucamber", {
      numPlayers: 2,
    });
    matchId = matchID;
  }
  async function setMatchId() {
    matchId = tempMatchId.toString();
  }
  async function join() {
    playerId="0";
    const { playerCredentials } = await lobbyClient.joinMatch(
      "Cucamber",
      matchId,
      {
        playerID: playerId,
        playerName: playerName,
      }
    );
    console.log(playerCredentials);
    credentials = playerCredentials;
  }
  async function seated(match:LobbyAPI.Match, playerId:string){
    console.log(match);
    console.log(playerId);
    const {playerCredentials} = await lobbyClient.joinMatch(match.gameName,
    match.matchID,
    {
      playerID:playerId,
      playerName: playerName
    });
    console.log(playerCredentials);
    credentials = playerCredentials;
  }
</script>

<!-- <button on:click={listGames}>ゲーム一覧</button> -->
<div>

    プレイヤー名：<input type="text" bind:value={playerName} />
  <button on:click={listMatches}>部屋一覧</button><br />
  {#if matches != null}
    {#each matches as match}
      {match.gameName}<br />
      部屋ID：<input type="text" value={match.matchID}/><br />
      参加者一覧
      {#each match.players as player}
        {#if player.isConnected == true}
          - {player.id} : {player.name}<br />
        {:else}
          {player.id} : <button on:click={()=>{seated(match,player.id.toString())}}>ここに座る</button> <br />
        {/if}
      {/each}
    {/each}
  {/if}
</div>
{#if matchId == ""}
  プレイヤー人数：
  <input type="number" bind:value={numOfPlayers} /><br />
  <button on:click={createMatch}>部屋を作成する</button><br />
  or <br />
  <input type="text" bind:value={tempMatchId} />
  <button on:click={setMatchId}>このIDの部屋に参加する</button><br />
{:else}
  {#if credentials == ""}
    <p>部屋ID : {matchId}</p>
    <!-- {#each { length: numOfPlayers } as _, i}
      <label>
        <input
          type="radio"
          bind:group={playerId}
          name="pid"
          value={i.toString()}
        />
        {i}
      </label><br />
    {/each} -->
    <!-- <input type="number" bind:value={inputNumber}/> -->
    <!-- <button on:click={setPlayerId}>id決定</button><br> -->
    <button on:click={join}>ゲームに入る</button>
  {/if}
  {#if credentials != ""}
    <CucamberClient
      {playerId}
      {matchId}
      {credentials}
      {numOfPlayers}
      {serverUrl}
    />
  {/if}
{/if}
<!-- <CucamberClient playerId="0"/> -->
<!-- <CucamberClient playerId="1"/> -->
<!-- <CucamberClient playerId="2"/> -->
