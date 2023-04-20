import { initDB } from './db/index'
import { FastifyRequestBody, FastifyRequestBodyWithParams, FastifyRequestParams } from "./db/typesForRequest";
import fastify, { FastifyError, FastifyReply } from 'fastify'
//import { Server, IncomingMessage, ServerResponse } from 'http'
import ToDo from './db/models/ToDo.model'

const server = fastify({ logger: true })

initDB()

server.get('/ping', async (req, reply: FastifyReply) => {
  return { pong: 'it worked!' }
})

server.get('/', async function (req, reply: FastifyReply) { //GET - read 
  try {
    const toDoList = await ToDo.findAll(); //SELECT * FROM "ToDos"
    reply.send(toDoList);
  } catch (error) {
    reply.code(500).send({message: "This is error!"});
  };
})

server.post('/todos', async function (req: FastifyRequestBody, reply: FastifyReply) { //POST - create
  try {
    const crToDo = await ToDo.create({
      title: req.body.title,
      description: req.body.description,
      isCompleted: req.body.isCompleted
    });
    reply.code(200).send(crToDo);
    console.log(req.body.description)
  } catch (error) {
    console.log("This is error!", error)
    reply.code(500).send({message: "This is error!"});
  };
})

server.get('/todos/:id', async function (req: FastifyRequestParams, reply: FastifyReply) { //GET + :id - read by id
  try {
    const oneToDo = await ToDo.findByPk(req.params.id);
    if (!oneToDo) {
      reply.code(404).send({
        message: "ToDo not found with ID!",
      });
    }
    reply.code(200).send(oneToDo);
  } catch (error) {
    reply.code(500).send({message: "This is error!"});
  };
})


server.patch('/todos/:id', async function (req: FastifyRequestBodyWithParams, reply: FastifyReply) { //PATCH + :id - update by id
  try {
    const findToDo = await ToDo.findByPk(req.params.id);
    if (!findToDo) {
      reply.code(404).send({message: "ToDo not found with ID!"});
    } else {await findToDo.update(req.body)
      console.log(req.body.title)
    }
    const updToDo = await ToDo.findByPk(req.params.id);
    reply.code(200).send(updToDo);
  } catch (error) {
    console.log("This is error!", error)
    reply.code(500).send({message: "This is error!"});
  };
})


server.delete('/todos', async function (req, reply: FastifyReply) { //DELETE - delete 
  try {
    const allDelToDo = await (ToDo.destroy({
      where: {},
    }));
    reply.send(allDelToDo);
  } catch (error) {
    reply.code(500).send({message: "This is error!"});
  };
})

server.delete('/todos/:id', async function (req: FastifyRequestParams, reply: FastifyReply) { //DELETE + :id - delete by id
  try {
    const delToDo = await (ToDo.destroy({
      where: {
        id: req.params.id,
      }
    }))
    reply.send(ToDo);
    return {
      delToDo
    };
  } catch (error) {
    reply.code(500).send({message: "This is error!"});
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
