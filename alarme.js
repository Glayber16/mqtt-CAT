import { connect } from "mqtt";

const client = connect("mqtt://localhost:1883"); //Conecta ao broker mosquitto

client.on("connect", () => {
    console.log("[Alarms] Conectado"); //Mensagem pra mostrar que a conexão deu certo
    client.subscribe("cat/alerta/#"); //Se inscreve nos topicos de alerta do CAT, sendo o # Aumento ou Temperatura alta
});

client.on("message", (topic, payload) => {
    console.log(`[ALARM] ${topic} → ${payload.toString()}`); //Exibe o topico e a mensagem recebida
});
