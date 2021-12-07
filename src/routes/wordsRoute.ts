import { WordsComplexity } from './../types';
import { Router } from 'express'
import axios from 'axios';

export const wordsRoute = Router()

export const getWords = async (complexity: WordsComplexity, limit = 500) => {
    const { data: { result } } = await axios.get<WordsResponseType>(`https://shlyapa-game.ru/api/v1/words?complexity=${complexity}&language=rus&limit=${limit}&offset=0&rand=true&randomSeed=${Date.now()}&fields=[%22value%22]`)
    return result.data.map(item => item.value)
}

wordsRoute.get('/words', async (req, res) => {
    console.log(req.query)
    const {complexity, limit} = req.query as {complexity: WordsComplexity, limit: string}
    res.status(200).json(await getWords(complexity, Number(limit)))
})

type WordsResponseType = {
    result: {
        total: number
        data: {value: string}[]
    }
}