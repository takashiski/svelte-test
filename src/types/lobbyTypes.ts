import type { LobbyAPI } from "boardgame.io";

export interface MatchingData{
  joinedMatch:LobbyAPI.JoinedMatch;
  match:LobbyAPI.Match;
  serverUrl:string
}