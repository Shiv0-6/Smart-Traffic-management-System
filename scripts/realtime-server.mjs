import { Server } from 'socket.io';

const port = Number(process.env.SOCKET_PORT || process.env.PORT || 3001);
const frontendOrigin = process.env.FRONTEND_ORIGIN || 'http://127.0.0.1:5173';

const io = new Server(port, {
  cors: {
    origin: [frontendOrigin, 'http://localhost:5173'],
    methods: ['GET', 'POST'],
  },
});

const locations = [
  'Main St & 1st Ave',
  'Main St & 2nd Ave',
  'Oak St & 1st Ave',
  'Oak St & 2nd Ave',
  'Pine St & 3rd Ave',
  'Elm St & 4th Ave',
];

const signalStatuses = ['red', 'yellow', 'green'];
const congestionLevels = ['low', 'medium', 'high'];
const violationTypes = ['red_light', 'wrong_way'];

function pick(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function randomPlate() {
  return `DL ${Math.floor(1000 + Math.random() * 9000)}`;
}

function emitTrafficFlow() {
  const vehicleCount = Math.floor(18 + Math.random() * 145);
  const avgSpeed = Math.max(12, Math.round(72 - vehicleCount * 0.32 + Math.random() * 12));
  const congestion =
    vehicleCount > 110 ? 'high' : vehicleCount > 65 ? 'medium' : pick(congestionLevels);

  io.emit('traffic_update', {
    type: 'flow_update',
    timestamp: Date.now(),
    data: {
      id: `flow-live-${Date.now()}`,
      location: pick(locations),
      avg_speed: avgSpeed,
      vehicle_count: vehicleCount,
      congestion_level: congestion,
      timestamp: new Date().toISOString(),
      simulation_data: {
        source: 'local-realtime-server',
      },
    },
  });
}

function emitSignalChange() {
  const signalNumber = Math.floor(Math.random() * locations.length) + 1;

  io.emit('traffic_update', {
    type: 'signal_change',
    timestamp: Date.now(),
    data: {
      id: `signal-${signalNumber}`,
      location: locations[signalNumber - 1],
      status: pick(signalStatuses),
      mode: Math.random() > 0.25 ? 'auto' : 'manual',
      timing_config: {
        red: 30 + Math.floor(Math.random() * 25),
        yellow: 5,
        green: 25 + Math.floor(Math.random() * 30),
      },
      last_updated: new Date().toISOString(),
      updated_by: 'realtime-server',
    },
  });
}

function emitViolationAlert() {
  const id = `vio-live-${Date.now()}`;
  const type = pick(violationTypes);

  io.emit('violation_alert', {
    id,
    type,
    vehicleId: randomPlate(),
    location: pick(locations),
    severity: Math.random() > 0.65 ? 'high' : 'medium',
    timestamp: Date.now(),
  });
}

io.on('connection', (socket) => {
  console.log(`Realtime client connected: ${socket.id}`);

  socket.emit('traffic_update', {
    type: 'flow_update',
    timestamp: Date.now(),
    data: {
      id: `flow-welcome-${Date.now()}`,
      location: locations[0],
      avg_speed: 42,
      vehicle_count: 74,
      congestion_level: 'medium',
      timestamp: new Date().toISOString(),
      simulation_data: {
        source: 'local-realtime-server',
      },
    },
  });

  socket.on('disconnect', () => {
    console.log(`Realtime client disconnected: ${socket.id}`);
  });
});

setInterval(emitTrafficFlow, 4000);
setInterval(emitSignalChange, 7000);
setInterval(() => {
  if (Math.random() > 0.45) {
    emitViolationAlert();
  }
}, 10000);

console.log(`Realtime traffic server running on http://localhost:${port}`);
console.log(`Allowed frontend origin: ${frontendOrigin}`);
