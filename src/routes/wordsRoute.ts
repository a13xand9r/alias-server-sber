import { general } from './../words/general';
import { Router } from 'express'

export const wordsRoute = Router()

wordsRoute.get('/words', (req, res) => {
    res.status(200).json(general)
})