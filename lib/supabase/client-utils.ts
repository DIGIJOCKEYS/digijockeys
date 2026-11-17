export function extractServiceName(services: unknown): string {
  if (!services) return 'Layanan DigiJockeys';
  if (typeof services === 'string') return services;
  if (Array.isArray(services)) return services[0]?.name || 'Layanan DigiJockeys';
  if (typeof services === 'object' && 'name' in services) {
    return (services as { name?: string }).name || 'Layanan DigiJockeys';
  }
  return 'Layanan DigiJockeys';
}

