require("dotenv").config({ path: ".env.test" });
const mqtt = require("mqtt");
const { Pool } = require("pg");

const BROKER_URL = process.env.MQTT_BROKER_URL || "mqtt://localhost:1883";
const DATABASE_URL =
  process.env.DATABASE_URL ||
  "postgresql://monitoramento:monitoramento@localhost:5432/monitoramento";
const TOTAL_WORKERS = Math.max(1, parseInt(process.env.TOTAL_DISPOSITIVOS || "5", 10));
const REFRESH_DEVICES_MS = parseInt(process.env.REFRESH_DEVICES_MS || "30000", 10);
const EMPRESA = process.env.MQTT_EMPRESA || "IND-001";

const pool = new Pool({ connectionString: DATABASE_URL });

/** @type {{ id: string, name: string }[]} */
let devices = [];

function degradar(valorBase, fatorTempo, amplitude = 1) {
  return valorBase + Math.sin(fatorTempo) * amplitude + (Math.random() - 0.5);
}

function gerarAlertas(sensors) {
  const alertas = [];

  const temp = sensors.find((s) => s.tag === "TEMP_MOTOR_A")?.value;
  if (temp > 95)
    alertas.push({
      cod: "E001",
      description: "Temperatura crítica no motor A",
      severity: "critical",
      resolved: false,
    });
  else if (temp > 85)
    alertas.push({
      cod: "W001",
      description: "Temperatura elevada no motor A",
      severity: "warning",
      resolved: false,
    });

  const pressao = sensors.find((s) => s.tag === "PRESSAO_HIDRAULICA")?.value;
  if (pressao > 16)
    alertas.push({
      cod: "E002",
      description: "Sobrepressão hidráulica",
      severity: "critical",
      resolved: false,
    });
  else if (pressao > 14)
    alertas.push({
      cod: "W002",
      description: "Pressão hidráulica elevada",
      severity: "warning",
      resolved: false,
    });

  const vibracao = sensors.find((s) => s.tag === "VIBRACAO_ROLAMENTO")?.value;
  if (vibracao > 7)
    alertas.push({
      cod: "W003",
      description: "Vibração excessiva no rolamento",
      severity: "warning",
      resolved: false,
    });

  const corrente = sensors.find((s) => s.tag === "CORRENTE_FASE_R")?.value;
  if (corrente > 22)
    alertas.push({
      cod: "E003",
      description: "Sobrecarga elétrica fase R",
      severity: "critical",
      resolved: false,
    });

  return alertas.map((a) => ({ ...a, resolved: Math.random() < 0.05 }));
}

function pickRandomDevice() {
  if (devices.length === 0) return null;
  return devices[Math.floor(Math.random() * devices.length)];
}

async function fetchDevices() {
  const result = await pool.query(
    `SELECT id::text AS id, name
     FROM devices
     ORDER BY created_at DESC`,
  );

  devices = result.rows;
  console.log(`📦 ${devices.length} device(s) carregado(s) do banco`);

  if (devices.length === 0) {
    console.warn(
      "⚠️  Nenhum device encontrado. Cadastre máquinas no frontend antes de simular.",
    );
  } else {
    console.log(
      "   samples:",
      devices
        .slice(0, 5)
        .map((d) => `${d.name} (${d.id.slice(0, 8)}…)`)
        .join(", "),
    );
  }
}

function buildPayload(deviceId) {
  const fatorTempo = Date.now() / 1000;

  const sensors = [
    {
      tag: "TEMP_MOTOR_A",
      value: parseFloat(degradar(80, fatorTempo, 15).toFixed(2)),
      unity: "°C",
    },
    {
      tag: "PRESSAO_HIDRAULICA",
      value: parseFloat(degradar(12, fatorTempo, 3).toFixed(2)),
      unity: "bar",
    },
    {
      tag: "CORRENTE_FASE_R",
      value: parseFloat(degradar(18, fatorTempo, 2).toFixed(2)),
      unity: "A",
    },
    {
      tag: "RPM_EIXO_PRINCIPAL",
      value: parseFloat(degradar(1450, fatorTempo, 50).toFixed(0)),
      unity: "RPM",
    },
    {
      tag: "VIBRACAO_ROLAMENTO",
      value: parseFloat(degradar(2.5, fatorTempo, 5).toFixed(3)),
      unity: "mm/s",
    },
    {
      tag: "UMIDADE_AMBIENTE",
      value: parseFloat((40 + Math.random() * 30).toFixed(1)),
      unity: "%",
    },
  ];

  return {
    deviceId,
    timestamp: new Date().toISOString(),
    sensors,
    alerts: gerarAlertas(sensors),
  };
}

function startWorker(workerIndex) {
  const clientId = `simulator-worker-${workerIndex}-${Math.random().toString(36).slice(2, 8)}`;
  const intervalo = 500 + Math.random() * 1500;
  const client = mqtt.connect(BROKER_URL, { clientId });

  client.on("connect", () => {
    console.log(`✅ worker #${workerIndex} conectado (${clientId})`);

    setInterval(() => {
      const device = pickRandomDevice();
      if (!device) return;

      const payload = buildPayload(device.id);
      const topic = `empresa/${EMPRESA}/${device.id}/telemetria`;
      client.publish(topic, JSON.stringify(payload));

      const temAlerta =
        payload.alerts.length > 0
          ? `⚠️  ${payload.alerts.length} alerta(s)`
          : "✔ sem alertas";
      console.log(
        `📤 ${device.name} [${device.id.slice(0, 8)}…] | ${temAlerta}`,
      );
    }, intervalo);
  });

  client.on("error", (err) => {
    console.error(`❌ worker #${workerIndex}:`, err.message);
  });
}

async function main() {
  console.log("🚀 Device simulator");
  console.log(`   MQTT: ${BROKER_URL}`);
  console.log(`   DB:   ${DATABASE_URL.replace(/:[^:@/]+@/, ":***@")}`);
  console.log(`   Workers: ${TOTAL_WORKERS}`);

  await fetchDevices();
  setInterval(() => {
    fetchDevices().catch((err) =>
      console.error("Erro ao atualizar devices:", err.message),
    );
  }, REFRESH_DEVICES_MS);

  for (let i = 0; i < TOTAL_WORKERS; i++) {
    startWorker(i + 1);
  }
}

main().catch((err) => {
  console.error("Falha ao iniciar simulador:", err);
  process.exit(1);
});
