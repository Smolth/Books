import { initDB } from './db/index'
import { FastifyRequestBody, FastifyRequestBodyWithParams, FastifyRequestParams } from "./db/typesForRequest";
import fastify, { FastifyError, FastifyReply } from 'fastify'
//import { Server, IncomingMessage, ServerResponse } from 'http'
import ToDo from './db/models/ToDo.model'

const server = fastify({ logger: true })

initDB()

server.get('/ping', async (req, reply) => {
  return { pong: 'it worked!' }
})

server.get('/', async function (req, reply) { //GET - read 
  try {
    const toDoList = await ToDo.findAll(); //SELECT * FROM "ToDos"
    reply.type('application/json');
    return {
      toDoList
    }
  } catch (error) {
    reply.type('application/json').code(500);
    return {
      error: fastify.errorCodes.FST_ERR_BAD_STATUS_CODE,
    }
  };
})

server.post('/todos', async function (req: FastifyRequestBody, reply: FastifyReply) { //POST - create
  try {
    const crToDo = await ToDo.create({
      title: req.body.title,
      description: req.body.description,
      isCompleted: req.body.isCompleted
    });
    reply.type('application/json').code(200);
    return {
      crToDo,
    }
  } catch (error) {
    console.log("This is error!", error)
    reply.type('application/json').code(500);
    return {
      error: fastify.errorCodes.FST_ERR_BAD_STATUS_CODE,
    }
  };
})

server.get('/todos/:id', async function (req: FastifyRequestParams, reply: FastifyReply) { //GET + :id - read by id
  try {
    const oneToDo = await ToDo.findByPk(req.params.id);
    if (!oneToDo) {
      reply.type('application/json').code(404);
      return {
        message: "ToDo not found with ID!",
      }
    }
    reply.type('application/json').code(200);
    return {
      oneToDo
    }
  } catch (error) {
    reply.type('application/json').code(500);
    return {
      error: fastify.errorCodes.FST_ERR_BAD_STATUS_CODE,
    }
  };
})


server.patch('/todos/:id', async function (req: FastifyRequestBodyWithParams, reply: FastifyReply) { //PATCH + :id - update by id
  try {
    const findToDo = await ToDo.findByPk(req.params.id);
    if (!findToDo) {
      reply.type('application/json').code(404);
      return {
        message: "ToDo not found with ID!",
      }
    }
    await findToDo.update({ ...req.body })
    const updToDo = await ToDo.findByPk(req.params.id);
    reply.type('application/json').code(200);
    return {
      updToDo
    }
  } catch (error) {
    console.log("This is error!", error)
    reply.type('application/json').code(500);
    return {
      error: fastify.errorCodes.FST_ERR_BAD_STATUS_CODE,
    }
  };
})


server.delete('/todos', async function (req, reply: FastifyReply) { //DELETE - delete 
  try {
    const allDelToDo = await (ToDo.destroy({
      where: {},
    }));
    reply.type('application/json');
    return {
      allDelToDo
    };
  } catch (error) {
    reply.type('application/json').code(500);
    return {
      error: fastify.errorCodes.FST_ERR_BAD_STATUS_CODE,
    }
  };
})

server.delete('/todos/:id', async function (req: FastifyRequestParams, reply: FastifyReply) { //DELETE + :id - delete by id
  try {
    const delToDo = await (ToDo.destroy({
      where: {
        id: req.params.id,
      }
    }))
    reply.type('application/json');
    return {
      delToDo
    };
  } catch (error) {
    reply.type('application/json').code(500);
    return {
      error: fastify.errorCodes.FST_ERR_BAD_STATUS_CODE,
    }
  };
})

const start = async () => {
  try {
    await server.listen({ port: 4444 })

    const address = server.server.address()
    const port = typeof address === 'string' ? address : address?.port

  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}
start()
