  import type { Game, Ctx } from "boardgame.io";

  interface ICard {
    num: number;
    cucamber: number;
  }

  interface IPlayer {
    hand: ICard[];
    layout: ICard[];
    cucamber: number;
  }
  const DefaultPlayer: IPlayer = {
    hand: [],
    layout: [],
    cucamber: 0,
  };

  interface IG {
    deck: ICard[];
    players: IPlayer[];
    trick: {
      count: number;
      winner: number;
    };
    round: {
      count: number;
      winner: number;
    };
  }

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
    for (let i = 1; i < 14 + 1; i += 1) {
      for (let j = 0; j < 4; j += 1) {
        deck.push({
          num: i,
          cucamber: cucamber(i),
        });
      }
    }

    return deck;
  }
  function initPlayer(numPlayers: number) {
    return new Array(numPlayers).fill(DefaultPlayer);
  }
  function deal(players: IPlayer[], deck: ICard[]) {
    players.map((v, i, a) => {
      for (let i = 0; i < 7; i += 1) {
        v.hand.push(deck.pop());
      }
    });
  }
  export const Cucamber: Game = {
    setup: (ctx: Ctx, G: IG): IG => {
      G = {
        ...G,
        deck: initDeck(),
        players: initPlayer(ctx.numPlayers),
        trick: { count: 0, winner: null },
        round: { count: 0, winner: null },
      };
      ctx.random.Shuffle(G.deck);
      deal(G.players, G.deck);

      return G;
    },
    phases: {
      rounds: {
        moves: {
          discard,
        },
      },
    },
  };

  function discard(G: IG, ctx: Ctx, index: number) {
    let player = G.players[ctx.currentPlayer];
    player.layout.push(player.hand[index]);
    player.hand = player.hand.filter((v, i, a) => i !== index);
  }
