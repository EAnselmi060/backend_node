const fastify = require('fastify')({ logger: true });
const cors = require('@fastify/cors');
const mongoPlugin = require('@fastify/mongodb');

// Conectar con MongoDB
try {
  await fastify.register(mongoPlugin, {
    url: 'mongodb+srv://EAnselmi060:Lxe9jupr62BnJCIq@proydw.vs6az.mongodb.net/todo-list?retryWrites=true&w=majority&appName=ProyDW',
  });
  fastify.log.info('Conexión a MongoDB exitosa');
} catch (err) {
  fastify.log.error('Error al conectar con MongoDB:', err);
  process.exit(1);
}

// Registrar el plugin de CORS
fastify.register(cors, {
  origin: ['https://eanselmi060.github.io'], // Dominios permitidos
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
});

// Rutas CRUD
fastify.get('/profesores', async (request, reply) => {
  const collection = fastify.mongo.db.collection('profesores');
  const items = await collection.find({}).toArray();
  reply.send(items);
});

fastify.post('/profesores', async (request, reply) => {
  const { nombres, apellidos, telefono, direccion, departamento, estatus, titulacion, especialidad } = request.body;

  if (!nombres || !apellidos || !telefono || !direccion || !departamento || !estatus || !titulacion || !especialidad) {
    return reply.status(400).send({ error: 'Todos los campos son requeridos' });
  }

  try {
    const collection = fastify.mongo.db.collection('profesores');
    const lastProfessor = await collection.find({}).sort({ cod_profesor: -1 }).limit(1).toArray();
    const cod_profesor = (lastProfessor[0]?.cod_profesor || 0) + 1;

    const result = await collection.insertOne({
      cod_profesor,
      nombres,
      apellidos,
      telefono,
      direccion,
      departamento,
      estatus,
      titulacion,
      especialidad,
      createdAt: new Date(),
    });

    reply.send({ id: result.insertedId, cod_profesor });
  } catch (error) {
    fastify.log.error(error);
    reply.status(500).send({ error: 'Error al registrar el profesor' });
  }
});

fastify.get('/profesores/:id', async (request, reply) => {
  const { id } = request.params;
  try {
    const collection = fastify.mongo.db.collection('profesores');
    const item = await collection.findOne({ _id: new fastify.mongo.ObjectId(id) });

    if (!item) {
      return reply.status(404).send({ error: 'Profesor no encontrado' });
    }

    reply.send(item);
  } catch (err) {
    reply.status(400).send({ error: 'ID no válido' });
  }
});

// Iniciar servidor
fastify.listen({ port: 3000, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`Servidor escuchando en ${address}`);
});
