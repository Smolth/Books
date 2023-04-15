import { FastifyRequest } from "fastify/types/request";


interface BodyType {
  title: string,
  description: string,
  isCompleted: boolean,
}

interface ParamsType {
  id: string,
}


export type FastifyRequestBody = FastifyRequest<{
  Body: BodyType
}>

export type FastifyRequestParams = FastifyRequest<{
  Params: ParamsType
}>

export type FastifyRequestBodyWithParams = FastifyRequest<{
  Body: BodyType,
  Params: ParamsType
}>
