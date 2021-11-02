<script>
	export let nu;
  export let clicked;

  function click(){
    // nu+=1;
    clicked=true;
  }
</script>

<td class="card" on:click={click}>
	{nu}
</td>

<style>
	.card{
		border:solid 1px ;
		height:140px;
		width:100px;
	}
</style>