<script lang="ts">
  import type { IPlayer } from "./types/types";

  export let player: IPlayer;
</script>

<div class="player">
  <p>
    PlayerID : {player.id}
  </p>
  <p class="card">
    {player.layout != null ? player.layout.num : "none"}
    {#each { length: player.layout != null ? player.layout.cucamber : 0 } as _, i}
      🦗
    {/each}
  </p>
</div>

<style>
  .player {
    background-color: #b2ffffcc;
    border:1px solid;
    /* height: 200px; */
    width: 150px;
    text-align: center;
    vertical-align: middle;
    display: inline-block;
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
