//Importar dependencias
import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";
//Cargar configuración (API KEY)
//Config nos permite cargar las variables de entorno
dotenv.config();

//Cargar express
const app = express();
const PORT = process.env.PORT || 3000;
//Servir página estática (FrontEnd)
app.use("/", express.static("public"))
//Middleware para procesar json (Lo que enviamos en json lo convertimos a un objeto de JS)
    //Esto se ejecuta siempre antes de llegar a las rutas
    app.use(express.json());
    //Convertirmos los datos a un objeto JS
    app.use(express.urlencoded({extended: true}));
//Instancia de openai y pasar el API KEY
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});
//Ruta / EndPoint / URL
//Toda ruta de Node.JS va a recibir una request (req) que es el objeto que contiene toda la información de la petición que hace el cliente
//Y una response (res) que es el objeto que nos permite enviar la respuesta al cliente
app.post('/api/traducir', async(req, res) =>{
    //FUNCIONALIDAD DE TRADUCIR CON IA

    //Recibimos los datos del cliente y los guardamos en las variables text y targetLang
    const {text, targetLang} = req.body;
    //Crear el Prompt y las indicaciones del sistema
        //Contexto
        const promptSystem1 = "Eres un traductor profesional.";
        const promptSystem2 = "Solo puedes responder con una traducción directa del texto que el usuario  te envie."
                               + "Cualquier otra respuesta o conversación está prohibida.";
        //Prompt de usuario
        const promptUser = `Traduce el siguiente texto al idioma ${targetLang}: ${text}`;
    //Llamar al LLM o modelo de openai
    try{
        //Completion = Petición con autocompletado de IA
        //Esperamos el resultado de la petición a openai (await) y lo pasamos a la variable completion
        const completion = await openai.chat.completions.create({
            //Modelo
            model: "gpt-3.5-turbo",
            //Mensaje
            messages: [
                //Cargamos los roles del sistema
                {role: "system", content:promptSystem1},
                {role: "system", content:promptSystem2},
                //Cargamos el mensaje del usuario
                {role: "user", content: promptUser}
            ],
            //Máximo de tokens (palabras) que puede tener la respuesta
            max_tokens: 500,
            //Podemos recibir la respuesta en un formato u otro
            response_format: {type: "text"}
        });
        
    }catch(error){

    }
})
//Servir el Backend
app.listen(PORT, ()=>{
    console.log("Servidor corriendo correctamente en http://localhost:"+PORT);
});