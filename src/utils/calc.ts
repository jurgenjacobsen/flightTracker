export const calc = {
    formatLatLong(lat: number, lon: number) {
    // Latitude
    const latDir = lat >= 0 ? 'N' : 'S';
    const latAbs = Math.abs(lat);
    const latDeg = Math.floor(latAbs);
    const latMin = Math.floor((latAbs - latDeg) * 60);

    // Longitude
    const lonDir = lon >= 0 ? 'E' : 'W';
    const lonAbs = Math.abs(lon);
    const lonDeg = Math.floor(lonAbs);
    const lonMin = Math.floor((lonAbs - lonDeg) * 60);

    // Pad degrees and minutes with zeros (2 digits for degrees, 2 for minutes)
    const latDegStr = latDeg.toString().padStart(2, '0');
    const latMinStr = latMin.toString().padStart(2, '0');
    const lonDegStr = lonDeg.toString().padStart(3, '0'); // longitude degrees can be 3 digits
    const lonMinStr = lonMin.toString().padStart(2, '0');

    return `${latDir}${latDegStr}${latMinStr}${lonDir}${lonDegStr}${lonMinStr}`;
  },
  formatTimeFromISO(isoString: string) {
    const date = new Date(isoString);
    const hh = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    const ss = String(date.getSeconds()).padStart(2, '0');
    return `${hh}:${mm}:${ss}`;
  },
  speedMsToKt(s: number) {
    // Convert speed from m/s to knots (1 m/s = 1.94384 knots)
    return (s * 1.94384);
  }
}