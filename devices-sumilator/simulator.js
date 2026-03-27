require("dotenv").config();

const mqtt = require("mqtt");

const BROKER_URL = process.env.MQTT_BROKER_URL;
const TOTAL_DISPOSITIVOS = parseInt(process.env.TOTAL_DISPOSITIVOS);
// const INTERVALO_MS = parseInt(process.env.INTERVALO_MS);
const intervalo = 500 + Math.random() * 1500;

// cria vários dispositivos simulados
for (let i = 0; i < TOTAL_DISPOSITIVOS; i++) {
  const deviceId = `device-${i}`;

  const client = mqtt.connect(BROKER_URL, {
    clientId: deviceId,
  });

  client.on("connect", () => {
    console.log(`✅ ${deviceId} conectado`);

    setInterval(() => {
      const payload = {
        deviceId,
        temperatura:  20 + Math.random() * 10,
        pressao: 90 + Math.random() * 20,
        timestamp: Date.now(),
      };

      const topic = `empresa/teste/${deviceId}/telemetria`;

      client.publish(topic, JSON.stringify(payload));

      console.log(`📤 ${deviceId} enviou`);
    }, intervalo);
  });

  client.on("error", (err) => {
    console.error(`❌ Erro no ${deviceId}:`, err.message);
  });
}