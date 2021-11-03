import type { Game, Ctx, TurnOrderConfig } from "boardgame.io";
import type { ICard, IG, IPlayer } from "./types/types";
import { DefaultPlayer } from "./types/types";



function initDeck() {
  let deck: ICard[] = [];
  function cucamber(n: number) {
    //https://akiyosblog.com/?p=1264
    if (n == 1) return 0;
    if (n < 6) return 1;
    if (n < 10) return 2;
    if (n < 12) return 3;
    if (n < 15) return 4;
    if (n == 15) return 5;
  }
  for (let i = 1; i < 15 + 1; i += 1) {
    for (let j = 0; j < 4; j += 1) {
      deck.push({
        num: i,
        cucamber: cucamber(i),
        clicked: false
      });
    }
  }
  console.log(deck.length);

  return deck;
}
function initPlayer(numPlayers: number) {
  const players = [];
  for (let i = 0; i < numPlayers; i += 1) {
    players.push({ id: i, hand: [], layout: null, cucamber: 0 });
  }
  return players;
}
function deal(players: IPlayer[], deck: ICard[]) {
  for (let i = 0; i < players.length; i += 1) {
    for (let j = 0; j < 7; j += 1) {
      players[i].hand.push(deck.pop());
    }
  }
}
export const generateCucamber = (numPlayers: number): Game => {
  return {
    setup: (ctx: Ctx, G: IG): IG => {
      G = {
        ...G,
        trickCount: 0,
        prevTrick: { winner: "0", biggest: null },
        trick: { winner: null, biggest: null },
        round: { count: 0, winner: null },
        players: initPlayer(numPlayers),
        deck: initDeck(),
      };
      G.deck = ctx.random.Shuffle(G.deck);
      deal(G.players, G.deck);

      return G;
    },
    turn: {
      minMoves: 1,
      // maxMoves: 1,
    },
    moves: {
      discard,
    },
    // endIf: (G: IG, ctx: Ctx) => {
    //   let nullIndex = G.players.map(p => p.layout).indexOf(null);
    //   if (nullIndex === -1) {
    //     G.trick.count += 1;
    //     G.players = G.players.map((v) => {
    //       v.layout = null;
    //       return v;
    //     });
    //     let firstPlayerIndex = G.players.indexOf(G.trick.winner).toString();
    //     G.trick.biggest = null;
    //     G.trick.winner = null;
    //     return { next: firstPlayerIndex };
    //   }
    // },
    minPlayers: 3,
    maxPlayers: 8
  }
};

function discard(G: IG, ctx: Ctx, index: number) {
  console.log(`${ctx.playOrder} ${ctx.playOrderPos}`);
  //layout and remove 
  let player = G.players[ctx.currentPlayer];
  player.layout = player.hand[index];
  player.hand = player.hand.filter((v, i, a) => i != index);
  //set biggest
  if (G.trick.biggest == null || G.trick.biggest.num < player.layout.num) {
    G.trick.biggest = player.layout;
    G.trick.winner = ctx.currentPlayer;
  }
  //next tric
  let nullIndex = G.players.map(p => p.layout).indexOf(null);
  if (nullIndex === -1) {
    G.trickCount += 1;
    if (G.trickCount == 7) {
      //ラウンド終了処理
      let loserId = G.players.reduce((p, c) => p.layout.num < c.layout.num ? c : p).id;
      G.players[loserId].cucamber += G.players.map(v => v.layout.cucamber).reduce((p, c) => c == 0 ? p * 2 : p + c);
      G.trickCount = 0;
    }
    else {
      G.players = G.players.map((v) => {
        v.layout = null;
        return v;
      });
      G.prevTrick.biggest = G.trick.biggest;
      G.prevTrick.winner = G.trick.winner;
    }

    G.trick.biggest = null;
    G.trick.winner = null;
    console.log(`next trick's first player is ${G.prevTrick.winner}`);
    ctx.events.endTurn({ next: G.prevTrick.winner });
    console.log("not reach here")
  }
  else {
    console.log("default order")
    ctx.events.endTurn();
  }
}

