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
  process.exit(1); // Detén el servidor si falla la conexión
}

// Registrar CORS
fastify.register(cors, {
  origin: '*', // Permite todos los orígenes para pruebas
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
});

// Ruta básica para verificar el estado del servidor
fastify.get('/', async (request, reply) => {
  reply.send({ message: 'Servidor funcionando correctamente' });
});

// Rutas CRUD (puedes agregar las demás aquí)

// Exportar como módulo para Vercel
module.exports = fastify;
