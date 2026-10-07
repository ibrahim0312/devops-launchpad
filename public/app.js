const byId = (id) => document.getElementById(id);
async function refresh() {
  byId('refresh').disabled = true;
  try {
    const response = await fetch('/api/status', { cache: 'no-store', signal: AbortSignal.timeout(5000) });
    if (!response.ok) throw new Error('Status request failed');
    const data = await response.json();
    byId('health').textContent = data.status;
    byId('uptime').textContent = `${Math.floor(data.uptimeSeconds / 60)}m ${data.uptimeSeconds % 60}s`;
    byId('version').textContent = data.version;
    byId('environment').textContent = `${data.environment} environment`;
    byId('connection').textContent = '● Service reachable';
    byId('checked').textContent = `Last checked ${new Date(data.timestamp).toLocaleTimeString()}`;
  } catch {
    byId('connection').textContent = '● Connection failed';
    byId('health').textContent = 'Unknown';
    byId('uptime').textContent = '—';
    byId('version').textContent = '—';
    byId('environment').textContent = 'Unavailable';
    byId('checked').textContent = 'Unable to reach service. Try refreshing.';
  } finally { byId('refresh').disabled = false; }
}
byId('refresh').addEventListener('click', refresh);
refresh();
setInterval(refresh, 15000);
