import type { Game, Ctx, TurnOrderConfig } from "boardgame.io";
import type { ICard, IG, IPlayer } from "./types/types";
import { DefaultPlayer } from "./types/types";


function LOG(any){
  console.log(`[LOG] ${any}`);
}



export const Cucamber:Game = {
  name:"Cucamber",
    setup: (ctx: Ctx, setupData:any): IG => {
      const G = {
        currentPhase:"main",
        trickCount: 0,
        prevTrick: { winner: "0", biggest: null },
        trick: { winner: null, biggest: null },
        round: { count: 0, winner: null },
        players: initPlayer(ctx.numPlayers),
        deck: initDeck(),
      };
      G.deck = ctx.random.Shuffle(G.deck);
      deal(G, 7);
      LOG("setup, init G");

      return G;
    },
    turn: {
      minMoves:1
    },
    phases: {
      main: {
        moves: { discard },
        start: true
      },
      trickResult:{
        moves:{acceptTrickResult}
      },
      roundResult: {
        moves: { acceptRoundResult },
      },
    },
    minPlayers: 3,
    maxPlayers: 8
  
};




function initDeck() {
  let deck: ICard[] = [];
  const numberRange = { min: 1, max: 15 };
  const numberOfSameCard = 4;
  function convertNumToCucamber(n: number) {
    //https://akiyosblog.com/?p=1264
    if (n == 1) return 0;
    if (n < 6) return 1;
    if (n < 10) return 2;
    if (n < 12) return 3;
    if (n < 15) return 4;
    if (n == 15) return 5;
  }
  for (let i = numberRange.min; i < numberRange.max + 1; i += 1) {
    for (let j = 0; j < numberOfSameCard; j += 1) {
      deck.push({
        num: i,
        cucamber: convertNumToCucamber(i),
        clicked: false
      });
    }
  }
  LOG("init deck, deck length is below");
  LOG(deck.length);

  return deck;
}
function initPlayer(numPlayers: number):IPlayer[] {
  const players = [];
  for (let i = 0; i < numPlayers; i += 1) {
    players.push({ id: i, hand: [], layout: null, cucamber: 0 });
  }
  LOG("init players")
  return players;
}
function deal(G: IG, num: number) {
  for (let i = 0; i < G.players.length; i += 1) {
    for (let j = 0; j < 7; j += 1) {
      G.players[i].hand.push(G.deck.pop());
    }
  G.players[i].hand = G.players[i].hand.sort((a,b)=>a.num<b.num?-1:1);
  }
  LOG("deal cards")
}


function calculateRoundResult(G: IG, ctx: Ctx) {
  LOG("calculate round result");
  let loserId = G.players.reduce((p, c) => p.layout.num < c.layout.num ? c : p).id;
  console.log(`loser is ${loserId}`);

  let cucamber = G.players.map(v => v.layout.cucamber).reduce((p, c) => c == 0 ? p * 2 : p + c);
  G.players[loserId].cucamber += cucamber;
  console.log(`loser get ${cucamber} cucambers`);
}

function finishRound(G: IG, ctx: Ctx) {
  LOG("close round")
  console.log(`init trick state`);
  G.trickCount = 0;
  G.round.count += 1;
  G.prevTrick.biggest = null;
  G.prevTrick.winner = null;
  G.trick.biggest = null;
  G.trick.winner = null;
  G.players.map((player) => {
    player.layout = null;
    player.hand = [];
  });
  G.deck = ctx.random.Shuffle(initDeck());
  deal(G, 7);
  console.log(`redeal`);
}

function setTrickWinner(G: IG, ctx: Ctx) {
  const player = G.players[ctx.currentPlayer];
  if (G.trick.biggest == null || G.trick.biggest.num < player.layout.num) {
    G.trick.biggest = player.layout;
    G.trick.winner = ctx.currentPlayer;
  }
}
/**
 * @description discard and layout, then calculate biggest player
 * @param G 
 * @param ctx 
 * @param index 
 * @returns 
 */
function discard(G: IG, ctx: Ctx, index: number) {
  LOG("discard");
  console.log(`${ctx.playOrder} ${ctx.playOrderPos}`);
  //layout and remove 
  let player = G.players[ctx.currentPlayer];
  player.layout = player.hand[index];
  player.hand = player.hand.filter((v, i, a) => i != index);
  //set biggest
  setTrickWinner(G, ctx);
  //check if all player dicard or not
  let nullIndex = G.players.map(p => p.layout).indexOf(null);
  if (nullIndex === -1) {
    G.trickCount += 1;
    //check round finish
    if (G.trickCount == 7) {
      calculateRoundResult(G, ctx);
      //ラウンド終了処理
      // finishRound(G, ctx);
      console.log(`next player is default`);
      G.currentPhase = "roundResult";
      ctx.events.setPhase("roundResult");
      return;
    }
    else {
      //go next trick
      setTrickWinner(G,ctx);
      G.currentPhase = "trickResult";
      ctx.events.setPhase("trickResult");
      return;
    }
  }
  else {
    console.log("default order")
    ctx.events.endTurn();
    return;
  }
}


function acceptTrickResult(G: IG, ctx: Ctx) {
  LOG("init trick")
  //トリック初期化
  G.players = G.players.map((v) => {
    v.layout = null;
    return v;
  });
  G.prevTrick.biggest = G.trick.biggest;
  G.prevTrick.winner = G.trick.winner;
  G.trick.biggest = null;
  G.trick.winner = null;
  console.log(`next trick's first player is ${G.prevTrick.winner}`);
  ctx.events.endTurn({ next: G.prevTrick.winner });
  G.currentPhase = "main";
  ctx.events.setPhase("main");
}
function acceptRoundResult(G: IG, ctx: Ctx) {
  LOG("init round")
  //ラウンド初期化
  finishRound(G,ctx);
  G.currentPhase="main";
  ctx.events.setPhase("main");
}
