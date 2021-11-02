// import {INVALID_MOVE} from "boardgame.io/dist/cjs/core.js";
import {INVALID_MOVE} from "boardgame.io/core";

export const TicTacToe = {
  setup: () => ({ cells: Array(9).fill(null) }),

  turn:{
    minMoves:1,
    maxMoves:1
  },
  moves: {
    clickCell: (G, ctx, id) => {
      if(G.cells[id]!==null){
        return INVALID_MOVE;
      }
      G.cells[id] = ctx.currentPlayer==1?"×":"〇";
    },
  },
  endIf: (G,ctx)=>{
    if(IsVictory(G.cells)){
      return {winner:ctx.currentPlayer};
    }
    if(IsDraw(G.cells)){
      return {draw:true};
    }
  },
  ai:{
    enumerate: (G,ctx)=>{
      let moves=[];
      for(let i=0;i<9;i+=1){
        if(G.cells[i]===null){
          moves.push({move:"clickCell",args:[i]});
        }
      }
      return moves;
    }
  }
};

function IsVictory(cells){
  const positions = [
    [0,1,2],[3,4,5],[6,7,8],[0,3,6],
    [1,4,7],[2,5,8],[0,4,8],[2,4,6]
  ];
  const isRowComplete = row =>{
    const symbols = row.map(i=>cells[i]);
    return symbols.every(i=>i!==null&&i===symbols[0]);
  };
  return positions.map(isRowComplete).some(i=>i===true);
}

function IsDraw(cells){
  return cells.filter(c=>c===null).length===0;
}