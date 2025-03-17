export function getTimeDifference(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "proprio adesso";
    if (diffMins < 60) return diffMins === 1 ? "1 minuto fa" : `${diffMins} minuti fa`;
    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs < 24) return diffHrs === 1 ? "1 ora fa" : `${diffHrs} ore fa`;
    const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));
    if (diffDays < 30) return diffDays === 1 ? "1 giorno fa" : `${diffDays} giorni fa`;
    const diffMonths = Math.floor(diffDays / 30);
    return diffMonths === 1 ? "1 mese fa" : `${diffMonths} mesi fa`;
  }