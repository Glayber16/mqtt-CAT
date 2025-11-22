import { connect } from "mqtt";

const client = connect("mqtt://localhost:1883"); //Conecta com o broker que é o mosquitto

const sensorId = "sensor1";
const topic = `sensores/temperatura/${sensorId}`;

client.on("connect", () => {
    console.log("[Sensor] Conectado ao broker"); //Mensagem pra demonstrar que a conexão deu certo

    setInterval(() => {
        const temp = (Math.random() * 100 + 150).toFixed(2); //Gera uma temperatura aleatória 
        client.publish(topic, temp);// o Cat vai escutar esse topico que é  sensores/temperatura/sensor1
        console.log(`[Sensor] Enviado: ${temp}`);
    }, 10000); // 10 segundos para testar
});
