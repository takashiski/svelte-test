<script>
  import { slide } from "svelte/transition";
  let isOpen = false;
  const toggle = () => (isOpen = !isOpen);
</script>

<button on:click={toggle} aria-expanded={isOpen}>ルールを開く/閉じる</button>
{#if isOpen}
  <div transition:slide={{ duration: 1000 }}>
    <h2>ルール</h2>
      <ul>
        <li>全員に7枚ずつカードが配られます。</li>
        <li>適当な方法で最初のプレイヤーを決めます。</li>
      <li>最初のプレイヤーを「ファーストプレイヤー」と呼びます。</li>
      <li>カードは数字の1から15までが各4枚の合計60枚を使います。</li>
      </ul>
    <ol>
      <li>1人1回につき1枚ずつカードをだします</li>
      <ul>
        <li>このとき、出せるカードはそれまでの人が場に出したカードと同じ数字か、それより大きい数字のカードです。</li>
        <li>もしもっていないか、より大きなカードを出したくない場合は「手札の中で一番小さな数字のカード」でもよいです。</li>
      </ul>
      <li>全員が1枚ずつ出すまでを「トリック」と呼びます。</li>
      <ul>
        <li>トリックが終わったら、トリックの勝者を決めます。</li>
        <li>一番大きな数字のカードを最後に出した人がトリックの勝者です。</li>
        <li>トリックの勝者は次のトリックのファーストプレイヤーになります。</li>
        <li>終わったトリックで出したカードはもう使わないので、全て捨てます。 </li>
      </ul>
      <li>トリックを7回繰り返すと手札がなくなりますので、7回目のトリックは特別なトリックです。</li>
      <ul>
        <li>第7トリックでは、今までの勝者が敗者になります。</li>
        <li>一番大きな数字のカードを最後に出したプレイヤーが敗者です。</li>
        <li>敗者は場に出ている全てのカードに基づいて 🦗 を獲得します。</li>
        <li>第七トリックまでが一つの流れです。この流れを「ラウンド」と呼びます。</li>
      </ul>
      <li>ラウンドを繰り返します。</li>
      <ul>
        <li>🦗の数が一番少なかったプレイヤーが勝者です。</li>
      </ul>
    </ol>
  </div>
{/if}

<style>
  button {
    border: none;
    background: none;
    display: block;
    color: inherit;
    font-size:large ;
    cursor: pointer;
    margin: 0;
    padding-bottom: 0.5em;
    padding-top: 0.5em;
  }
</style>
