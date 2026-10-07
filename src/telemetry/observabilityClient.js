/**
 * Sovereign Fleet Observability & Dead Man's Switch Client (ESM SSoT).
 * Provides:
 * 1. Inverted Heartbeat (Push Monitor) to Uptime Kuma with dynamic ping latency.
 * 2. Semantic IPC File Touch (/tmp/heartbeat.<service>.alive) for Docker/systemd healthchecks.
 * 3. Structured JSON Telemetry & Log Ingestion to OpenObserve.
 */

import fs from 'node:fs';
import path from 'node:path';
import { performance } from 'node:perf_hooks';

export class ObservabilityClient {
  constructor({
    pushUrl = null,
    ipcPath = '/tmp/heartbeat.alive',
    pushIntervalSeconds = 30,
    statusProvider = null,
    openobserveEnabled = false,
    openobserveEndpoint = null,
    openobserveAuthToken = null,
    openobserveStream = 'fleet_logs',
    timeoutMs = 5000,
  } = {}) {
    this.pushUrl = pushUrl ? pushUrl.trim() : null;
    this.ipcPath = ipcPath ? ipcPath.trim() : '/tmp/heartbeat.alive';
    this.pushIntervalSeconds = pushIntervalSeconds;
    this.statusProvider = typeof statusProvider === 'function' ? statusProvider : null;
    this.openobserveEnabled = Boolean(openobserveEnabled);
    this.openobserveEndpoint = openobserveEndpoint ? openobserveEndpoint.replace(/\/+$/, '') : null;
    this.openobserveAuthToken = openobserveAuthToken ? openobserveAuthToken.trim() : null;
    this.openobserveStream = openobserveStream ? openobserveStream.trim() : 'fleet_logs';
    this.timeoutMs = timeoutMs;

    this._timer = null;
    this._lastPushTs = 0;
    this._lastLatencyMs = 5;
  }

  static fromEnv(serviceName, statusProvider = null) {
    return new ObservabilityClient({
      pushUrl: process.env.UPTIME_KUMA_PUSH_URL || null,
      ipcPath: process.env.SEMANTIC_IPC_HEARTBEAT_PATH || `/tmp/heartbeat.${serviceName}.alive`,
      pushIntervalSeconds: parseFloat(process.env.HEARTBEAT_INTERVAL_SECONDS || '30'),
      statusProvider,
      openobserveEnabled: process.env.OPENOBSERVE_ENABLED === 'true' || Boolean(process.env.OPENOBSERVE_ENDPOINT),
      openobserveEndpoint: process.env.OPENOBSERVE_ENDPOINT || null,
      openobserveAuthToken: process.env.OPENOBSERVE_AUTH_TOKEN || null,
      openobserveStream: process.env.OPENOBSERVE_STREAM || `${serviceName}_logs`,
    });
  }

  start() {
    if (this._timer) return;
    this.emitHeartbeat({ force: true }).catch(() => {});
    this._timer = setInterval(() => {
      this.emitHeartbeat({ force: true }).catch(() => {});
    }, this.pushIntervalSeconds * 1000);
    if (this._timer && typeof this._timer.unref === 'function') {
      this._timer.unref();
    }
  }

  stop() {
    if (this._timer) {
      clearInterval(this._timer);
      this._timer = null;
    }
  }

  touchIpcHeartbeat() {
    try {
      const now = (Date.now() / 1000).toFixed(4);
      const dir = path.dirname(this.ipcPath);
      if (dir && !fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(this.ipcPath, `${now}\n`, 'utf8');
      return true;
    } catch {
      return false;
    }
  }

  async emitHeartbeat({ force = false, msg = null, pingMs = null } = {}) {
    this.touchIpcHeartbeat();

    if (!this.pushUrl) {
      return false;
    }

    const now = Date.now() / 1000;
    if (!force && (now - this._lastPushTs) < this.pushIntervalSeconds) {
      return true;
    }

    let effectiveMsg = msg;
    if (!effectiveMsg) {
      if (this.statusProvider) {
        try {
          effectiveMsg = String(this.statusProvider());
        } catch {
          effectiveMsg = 'OK';
        }
      } else {
        effectiveMsg = 'OK';
      }
    }

    const effectivePing = Math.max(1, Math.round(pingMs !== null && pingMs !== undefined ? pingMs : this._lastLatencyMs));
    const baseUrl = this.pushUrl.split('?')[0];
    const url = `${baseUrl}?status=up&msg=${encodeURIComponent(effectiveMsg)}&ping=${effectivePing}`;

    const t0 = performance.now();
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(this.timeoutMs) });
      const elapsed = Math.round(performance.now() - t0);
      if (res.ok) {
        this._lastLatencyMs = Math.max(1, elapsed);
        this._lastPushTs = now;
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  async emitTelemetryMetric(payload) {
    if (!this.openobserveEnabled || !this.openobserveEndpoint || !this.openobserveAuthToken) {
      return false;
    }
    const url = `${this.openobserveEndpoint}/api/default/${this.openobserveStream}/_json`;
    const data = Array.isArray(payload) ? payload : [payload];
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${this.openobserveAuthToken}`,
        },
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(this.timeoutMs),
      });
      return res.ok;
    } catch {
      return false;
    }
  }
}
