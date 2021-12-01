import { ScenarioRequest, ActionType } from './types';
import { SmartAppBrainRecognizer } from '@salutejs/recognizer-smartapp-brain'
import {
    createIntents,
    createMatchers,
    createSaluteRequest,
    createSaluteResponse,
    createScenarioWalker,
    createSystemScenario,
    createUserScenario,
    NLPRequest,
    NLPResponse,
    SaluteRequest
} from '@salutejs/scenario'
import { SaluteMemoryStorage } from '@salutejs/storage-adapter-memory'
import { noMatchHandler, runAppHandler, setDecreasingPointsHandler, setTimerHandler, setWordsLimitHandler } from './handlers'
import model from './intents.json'
require('dotenv').config()

const storage = new SaluteMemoryStorage()
const intents = createIntents(model.intents)
const { intent, match } = createMatchers<ScenarioRequest, typeof intents>()

const userScenario = createUserScenario<ScenarioRequest>({
    AddTeam: {
        match: req => {
            console.log(req.inference?.variants)
            return intent('/Добавить команду', {confidence: 0.4})(req)
        },
        handle: ({req, res}) => {
            res.appendCommand<ActionType>({
                type: 'ADD_TEAM'
            })
        }
    },
    SetTimer: {
        match: intent('/Таймер', {confidence: 0.4}),
        handle: setTimerHandler
    },
    SetWordsLimit: {
        match: intent('/Количество слов', {confidence: 0.4}),
        handle: setWordsLimitHandler
    },
    SetDecreasing: {
        match: intent('/Штраф за пропуск', {confidence: 0.4}),
        handle: setDecreasingPointsHandler
    },
    NavigationPlay: {
        match: intent('/Игра', {confidence: 0.4}),
        handle: ({res}) => {
            res.appendCommand<ActionType>({
                type: 'NAVIGATION_PLAY'
            })
        }
    },
    NavigationNext: {
        match: intent('/Дальше', {confidence: 0.4}),
        handle: ({res}) => {
            res.appendCommand<ActionType>({
                type: 'NAVIGATION_NEXT'
            })
        }
    },
    NavigationSettings: {
        match: intent('/Дальше', {confidence: 0.4}),
        handle: ({res}) => {
            res.appendCommand<ActionType>({
                type: 'NAVIGATION_SETTINGS'
            })
        }
    },
    NavigationPlay: {
        match: intent('/Дальше', {confidence: 0.4}),
        handle: ({res}) => {
            res.appendCommand<ActionType>({
                type: 'NAVIGATION_SETTINGS'
            })
        }
    },
    NavigationBack: {
        match: req => intent('/Понятно', {confidence: 0.4})(req) || intent('/Назад', {confidence: 0.4})(req),
        handle: ({res}) => {
            res.appendCommand<ActionType>({
                type: 'NAVIGATION_BACK'
            })
        }
    },
    NavigationRules: {
        match: intent('/Правила', {confidence: 0.4}),
        handle: ({res}) => {
            res.appendCommand<ActionType>({
                type: 'NAVIGATION_RULES'
            })
        }
    },
})

const systemScenario = createSystemScenario({
    RUN_APP: runAppHandler,
    NO_MATCH: noMatchHandler
})

const scenarioWalker = createScenarioWalker({
    recognizer: new SmartAppBrainRecognizer(process.env.SMARTAPP_BRAIN_TOKEN),
    intents,
    systemScenario,
    userScenario
})

export const handleNlpRequest = async (request: NLPRequest): Promise<NLPResponse> => {
    const req = createSaluteRequest(request)
    const res = createSaluteResponse(request)

    const sessionId = request.uuid.sub
    const session = await storage.resolve(sessionId)

    await scenarioWalker({ req, res, session })

    await storage.save({ id: sessionId, session })

    return res.message
}