import {
    AppState,
    SaluteHandler,
    SaluteRequest,
    SaluteRequestVariable
} from '@salutejs/scenario'


export interface ScenarioAppState extends AppState {

}

export interface ScenarioIntentsVariables extends SaluteRequestVariable {
    isDecreasing?: string;
    seconds?: string;
    wordsToWin?: string;
}

export interface ScenarioSession extends Record<string, unknown>{

}

export type ScenarioRequest = SaluteRequest<ScenarioIntentsVariables, ScenarioAppState>
export type ScenarioHandler = SaluteHandler<ScenarioRequest, ScenarioSession>

export type ActionType =
    {
        type: 'ADD_TEAM'
    } |
    {
        type: 'DELETE_PLAYING_TEAM'
        id: string
    } |
    {
        type: 'SET_TIMER_LIMIT'
        limit: number
    } |
    {
        type: 'SET_WORDS_COUNT_TO_WIN'
        count: number
    } |
    {
        type: 'SET_DECREASING_POINTS'
        isDecreasing: boolean
    } |
    {
        type: 'NAVIGATION_NEXT'
    } |
    {
        type: 'NAVIGATION_SETTINGS'
    } |
    {
        type: 'NAVIGATION_RULES'
    } |
    {
        type: 'NAVIGATION_PLAY'
    } |
    {
        type: 'NAVIGATION_BACK'
    }