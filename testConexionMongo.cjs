const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://jatnielcarr10:kQc263HsvbLhYnNc@cluster0.fu2p8ok.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Crear un cliente de MongoDB con opciones de API estable
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Conectar el cliente al servidor
    await client.connect();
    // Enviar un ping para confirmar la conexión
    await client.db("admin").command({ ping: 1 });
    console.log("¡Conexión exitosa a MongoDB!");
  } finally {
    // Cerrar el cliente al finalizar
    await client.close();
  }
}
run().catch(console.dir); 