import { connect } from "mqtt";

const client = connect("mqtt://localhost:1883");//Conecta ao broker mosquitto

let temperatura = []; //Array para armazenar as temperaturas 
let ultimaMedia = null; //Armazena a ultima media calculada

function calcularMedia() { //Calcula a media das temperaturas que estao no array a cada 10 segundos
    if (temperatura.length === 0) return 0;
    const soma = temperatura.reduce((acc, e) => acc + e.temp, 0);
    return soma / temperatura.length;
}

client.on("connect", () => {
    console.log("[CAT] Conectado");
    client.subscribe("sensores/temperatura/#"); //Se inscreve no topico de temperatura dos sensores, onde o # pode ser qualquer sensor
});

client.on("message", (topic, payload) => {
    const temp = parseFloat(payload.toString()); //Converte o payload pra string e depois para
    const agora = Date.now();

    temperatura.push({ timestamp: agora, temp });

    // mantém somente os últimos 120s 
    temperatura = temperatura.filter(item => agora - item.timestamp <= 120000); 

    const media = calcularMedia();
    console.log(`[CAT] média: ${media.toFixed(2)}`); //Exibe a media das temperaturas

    if (ultimaMedia !== null && Math.abs(media - ultimaMedia) >= 5) { //Se a diferença for maior ou igual 5 graus, envia um alerta de aumento_repentino
        client.publish("cat/alerta/aumento_repentino", media.toFixed(2));
        console.log("[CAT] ALERTA: aumento repentino");
    }

    if (media > 200) { //Se a media for maior que 200, envia um aletar de temperatura alta
        client.publish("cat/alerta/temperatura_alta", media.toFixed(2));
        console.log("[CAT] ALERTA: temperatura alta");
    }

    ultimaMedia = media; //Atualiza a media
});
