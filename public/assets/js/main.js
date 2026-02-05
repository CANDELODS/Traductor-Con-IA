let translateButton = document.querySelector(".chat__button");

//La función que se ejecutará al hacer click en el botón de traducir debe ser asincrona, ya que hará una petición al backend y esperará la respuesta
translateButton.addEventListener("click", async() => {
    let inputText = document.querySelector("#inputText");
    //Obtener el valor a traducir
    const text = inputText.value.trim();
    //Obtener el lenguaje de destino
    const targetLang = document.querySelector("#targetLang").value;

    if(!text) return false; //Si no hay texto, no hacer nada

    //Meter el mensaje del usuario a la caja de mensajes
    const userMessage = document.createElement("DIV");
    userMessage.className = "chat__message chat__message--user";
    userMessage.textContent = text;
    //Mostrar texto en el contenedor
    const messagesContainer = document.querySelector(".chat__messages")
    messagesContainer.appendChild(userMessage);
    messagesContainer.scrollTop = messagesContainer.scrollHeight; //Hacer scroll hacia abajo
    //Petición ajax al backend
    try {
        const response = await fetch("/api/traducir", {
            method: "POST",
            headers: {"Content-Type" : "application/json"},
            //Con JSON.stringify convertimos el objeto JS a formato JSON
                body: JSON.stringify({
                    //Colocando el nombre de las variables se crea la clave-valor automáticamente
                    text,
                    targetLang
                })
        });
    
    //Obtener la respuesta en formato JSON
    const data = await response.json();
    //Agregar el mensaje de la IA al chat
    const botMessage = document.createElement("DIV");
    botMessage.className = "chat__message chat__message--bot";
    botMessage.textContent = data.translatedText
    messagesContainer.appendChild(botMessage);
    messagesContainer.scrollTop = messagesContainer.scrollHeight; //Hacer scroll hacia abajo    

    } catch (error) {
        console.log("Erro:", error);    
    }

    //Vaciar el input de tipo texto
    inputText.value = "";
});