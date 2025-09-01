// Importamos el paquete mongoose para conectarnos a MongoDB
const mongoose = require('mongoose')

// Creamos una función asíncrona para conectar a la base de datos
const dbConnection = async () => {
    try {
        //Conexion BBDD
        await mongoose.connect(process.env.MONGO_URI)
        console.log('Base de datos conectada con éxito')
    } catch (error) {
        console.error(error)
        throw new Error('Error a la hora de iniciar la base de datos')
    }
}

// Exportamos la función para poder usarla en otros archivos
module.exports = { dbConnection}
