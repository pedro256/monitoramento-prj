require("dotenv").config();
const mqtt = require("mqtt");

const BROKER_URL = process.env.MQTT_BROKER_URL;
const TOTAL_DISPOSITIVOS = parseInt(process.env.TOTAL_DISPOSITIVOS);

function degradar(valorBase, fatorTempo, amplitude = 1) {
  return valorBase + Math.sin(fatorTempo) * amplitude + (Math.random() - 0.5);
}

function gerarAlertas(sensors) {
  const alertas = [];

  const temp = sensors.find((s) => s.tag === "TEMP_MOTOR_A")?.value;
  if (temp > 95)
    alertas.push({ cod: "E001", description: "Temperatura crítica no motor A",   severity: "CRITICAL", resolved: false });
  else if (temp > 85)
    alertas.push({ cod: "W001", description: "Temperatura elevada no motor A",   severity: "WARNING",  resolved: false });

  const pressao = sensors.find((s) => s.tag === "PRESSAO_HIDRAULICA")?.value;
  if (pressao > 16)
    alertas.push({ cod: "E002", description: "Sobrepressão hidráulica",          severity: "CRITICAL", resolved: false });
  else if (pressao > 14)
    alertas.push({ cod: "W002", description: "Pressão hidráulica elevada",       severity: "WARNING",  resolved: false });

  const vibracao = sensors.find((s) => s.tag === "VIBRACAO_ROLAMENTO")?.value;
  if (vibracao > 7)
    alertas.push({ cod: "W003", description: "Vibração excessiva no rolamento",  severity: "WARNING",  resolved: false });

  const corrente = sensors.find((s) => s.tag === "CORRENTE_FASE_R")?.value;
  if (corrente > 22)
    alertas.push({ cod: "E003", description: "Sobrecarga elétrica fase R",       severity: "CRITICAL", resolved: false });

  // marca alerta como resolvido se o valor voltou ao normal
  return alertas.map((a) => ({ ...a, resolved: Math.random() < 0.05 }));
}

for (let i = 0; i < TOTAL_DISPOSITIVOS; i++) {
  const deviceId = '8e867d6f-49a7-4a69-8142-ba1eafe066c4';
  const intervalo = 500 + Math.random() * 15000;

  const estado = {
    fatorTempo: 0,
  };

  const client = mqtt.connect(BROKER_URL, { clientId: deviceId });

  client.on("connect", () => {
    console.log(`✅ ${deviceId} conectado`);

    setInterval(() => {
      estado.fatorTempo += 0.1;

      const sensors = [
        { tag: "TEMP_MOTOR_A",        value: parseFloat(degradar(80,   estado.fatorTempo, 15).toFixed(2)), unity: "°C"   },
        { tag: "PRESSAO_HIDRAULICA",  value: parseFloat(degradar(12,   estado.fatorTempo,  3).toFixed(2)), unity: "bar"  },
        { tag: "CORRENTE_FASE_R",     value: parseFloat(degradar(18,   estado.fatorTempo,  2).toFixed(2)), unity: "A"    },
        { tag: "RPM_EIXO_PRINCIPAL",  value: parseFloat(degradar(1450, estado.fatorTempo, 50).toFixed(0)), unity: "RPM"  },
        { tag: "VIBRACAO_ROLAMENTO",  value: parseFloat(degradar(2.5,  estado.fatorTempo,  5).toFixed(3)), unity: "mm/s" },
        { tag: "UMIDADE_AMBIENTE",    value: parseFloat((40 + Math.random() * 30).toFixed(1)),             unity: "%"    },
      ];

      /** @type {DevicesPayload} */
      const payload = {
        deviceId,
        timestamp: new Date().toISOString(),
        sensors,
        alerts: gerarAlertas(sensors),
      };

      const topic = `empresa/IND-001/${deviceId}/telemetria`;
      client.publish(topic, JSON.stringify(payload));

      const temAlerta = payload.alerts.length > 0 ? `⚠️  ${payload.alerts.length} alerta(s)` : "✔ sem alertas";
      console.log(`📤 ${deviceId} | ${temAlerta}`);
    }, intervalo);
  });

  client.on("error", (err) => {
    console.error(`❌ Erro no ${deviceId}:`, err.message);
  });
}