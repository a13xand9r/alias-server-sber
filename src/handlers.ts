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
            payload: {
                limit: Number(seconds)
            }
        })
    }
}

export const setWordsLimitHandler: ScenarioHandler = ({req, res}) => {
    const { wordsToWin } = req.variables

    if (Number(wordsToWin)) {
        res.appendCommand<ActionType>({
            type: 'SET_WORDS_COUNT_TO_WIN',
            payload: {
                count: Number(wordsToWin)
            }
        })
    }
}

export const setDecreasingPointsHandler: ScenarioHandler = ({req, res}) => {
    const { isDecreasing } = req.variables

    if (isDecreasing) {
        res.appendCommand<ActionType>({
            type: 'SET_DECREASING_POINTS',
            payload: {
                isDecreasing: isDecreasing === 'true' ? true : false
            }
        })
    }
}

export const currentScoreHandler: ScenarioHandler = ({req, res}) => {
    res.setPronounceText(`Текущий счёт: ${req.state?.teams?.map(team => `${team.name}, ${team.score}.`)} Для победы нужно набрать ${req.state?.wordsCountToWin} очков`)
}

export const helloMessageHandler: ScenarioHandler = ({ req, res }) => {
    const { isFirstLaunchOnDevice } = req.serverAction?.payload as { isFirstLaunchOnDevice: boolean }

    const keyset = req.i18n(dictionary)
    if (isFirstLaunchOnDevice === true || isFirstLaunchOnDevice === undefined){
        res.setPronounceText(keyset('Первый привет'))
    } else {
        res.setPronounceText(keyset('Не первый привет'))
    }
}