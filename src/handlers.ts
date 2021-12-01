import { ActionType, ScenarioHandler } from './types';
import * as dictionary from './system.i18n'
require('dotenv').config()


export const runAppHandler: ScenarioHandler = ({ req, res }) => {
    const keyset = req.i18n(dictionary)
    const responseText = keyset('Привет')
    res.appendBubble(responseText)
    res.setPronounceText(responseText)
}

export const noMatchHandler: ScenarioHandler = async ({ req, res }) => {
    const keyset = req.i18n(dictionary)
    const responseText = keyset('404')
    res.appendBubble(responseText)
    res.setPronounceText(responseText)
}

export const setTimerHandler: ScenarioHandler = ({ req, res }) => {
    const { seconds } = req.variables

    if (Number(seconds)) {
        res.appendCommand<ActionType>({
            type: 'SET_TIMER_LIMIT',
            limit: Number(seconds)
        })
    }
}

export const setWordsLimitHandler: ScenarioHandler = ({req, res}) => {
    const { wordsToWin } = req.variables

    if (Number(wordsToWin)) {
        res.appendCommand<ActionType>({
            type: 'SET_WORDS_COUNT_TO_WIN',
            count: Number(wordsToWin)
        })
    }
}

export const setDecreasingPointsHandler: ScenarioHandler = ({req, res}) => {
    const { isDecreasing } = req.variables

    if (isDecreasing) {
        res.appendCommand<ActionType>({
            type: 'SET_DECREASING_POINTS',
            isDecreasing: isDecreasing === 'true' ? true : false
        })
    }
}