import { Monitro } from 'monitro'

const API_KEY = '53c129f8-222f-4773-8c19-de91636c019d'

export const montiro = new Monitro('portfolio', API_KEY, {
  hookExceptions: true,
})
