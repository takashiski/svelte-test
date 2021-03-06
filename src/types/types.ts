import type {Ctx, State} from "boardgame.io";

export interface IState extends State{
  G:IG;
  ctx:Ctx;
}
export interface ICard {
  num: number;
  cucamber: number;
  clicked: boolean;
}

export interface IPlayer {
  id:number;
  name:string;
  hand: ICard[];
  layout: ICard;
  cucamber: number;
}
export const DefaultPlayer: IPlayer = {
  id:null,
  name:null,
  hand: [],
  layout: null,
  cucamber: 0,
};

export interface IG {
  currentStage:string;
  trickCount:number;
  prevTrick:{
    biggest:ICard;
    winner:string;
  };
  trick: {
    biggest:ICard;
    winner: string;
  };
  round: {
    count: number;
    winner: string;
  };
  players: IPlayer[];
  deck: ICard[];
}