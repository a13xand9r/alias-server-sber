import { ActionType, ScenarioHandler } from './types';
import * as dictionary from './system.i18n'
import { addSSML } from './utils/utils';
import assert from 'assert';
require('dotenv').config()


export const runAppHandler: ScenarioHandler = ({ req, res }) => {
    // const keyset = req.i18n(dictionary)
    // const responseText = keyset('Привет')
    // res.appendBubble(responseText)
    // res.setPronounceText(responseText)
}

export const noMatchHandler: ScenarioHandler = async ({ req, res }) => {
    const keyset = req.i18n(dictionary)
    const responseText = keyset('404')
    res.appendBubble(responseText)
    res.setPronounceText(responseText)
}

export const helpHandler: ScenarioHandler = ({ req, res }) => {
    const keyset = req.i18n(dictionary)
    const device = req.request.payload.device?.surface
    console.log(device)
    if (device && device === 'SBERBOX'){
        res.setPronounceText(addSSML(keyset('sberboxRules')), {ssml: true})
    } else {
        res.setPronounceText(addSSML(keyset('mobileRules')), {ssml: true})
    }
}

export const setTimerHandler: ScenarioHandler = ({ req, res }) => {
    const { seconds } = req.variables

    console.log(req.variables)

    if (Number(seconds)) {
        res.appendCommand<ActionType>({
            type: 'SET_TIMER_LIMIT',
            payload: {
                limit: Number(seconds)
            }
        })
        res.setPronounceText('Готово')
    } else res.setPronounceText('Готово')
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
        res.setPronounceText('Готово')
    } else res.setPronounceText('Что-то не выходит')
}

export const setDecreasingPointsHandler: ScenarioHandler = ({req, res}) => {
    const { value } = req.variables

    assert(typeof value === 'string')

    const { isDecreasing } = JSON.parse(value)

    console.log(isDecreasing)

    if (isDecreasing !== undefined) {
        res.appendCommand<ActionType>({
            type: 'SET_DECREASING_POINTS',
            payload: {
                isDecreasing: isDecreasing === 'true' ? true : false
            }
        })
        res.setPronounceText('Готово')
    } else res.setPronounceText('Что-то не выходит')
}
export const setComplexityPointsHandler: ScenarioHandler = ({req, res}) => {
    const { value } = req.variables
    console.log(req.variables)
    console.log('value', value)

    assert(typeof value === 'string')

    const { complexity } = JSON.parse(value)

    // console.log(req.variables)
    console.log(complexity)

    if (complexity) {
        res.appendCommand<ActionType>({
            type: 'SET_WORDS_COMPLEXITY',
            payload: {
                complexity
            }
        })
        res.setPronounceText('Готово')
    } else res.setPronounceText('Что-то не выходит')
}

export const currentScoreHandler: ScenarioHandler = ({req, res}) => {
    res.setPronounceText(`Текущий счёт: ${req.state?.teams?.map(team => `${team.name}, ${team.score}.`)} Для победы нужно набрать ${req.state?.wordsCountToWin} очков`)
}

export const helloMessageHandler: ScenarioHandler = ({ req, res }) => {
    const { isFirstLaunchOnDevice } = req.serverAction?.payload as { isFirstLaunchOnDevice: boolean }

    const keyset = req.i18n(dictionary)
    if (isFirstLaunchOnDevice === true || isFirstLaunchOnDevice === undefined){
        res.setPronounceText(keyset('Первый привет'), {ssml: true})
    } else {
        res.setPronounceText(keyset('Не первый привет'), {ssml: true})
    }
}