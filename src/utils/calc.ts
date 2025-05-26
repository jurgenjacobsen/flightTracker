export const calc = {
    formatCoord(lat: number, lon: number, only?:'LAT'|'LON') {
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
    const lonDegStr = lonDeg.toString().padStart(3, '0');
    const lonMinStr = lonMin.toString().padStart(2, '0');

    const latStr = `${latDir}${latDegStr}${latMinStr}`;
    const lonStr = `${lonDir}${lonDegStr}${lonMinStr}`;

    if(only) {
      if(only === 'LAT') {
        return latStr;
      } else if(only === 'LON') {
        return lonStr;
      }
    } else {
      return `${latStr}${lonStr}`;
    }
  },
  formatTimeFromISO(isoString: string) {
    const date = new Date(isoString);
    const hh = String(date.getUTCHours()).padStart(2, '0');
    const mm = String(date.getUTCMinutes()).padStart(2, '0');
    const ss = String(date.getUTCSeconds()).padStart(2, '0');
    return `${hh}:${mm}:${ss}`;
  },
  speedMsToKt(s: number) {
    // Convert speed from m/s to knots (1 m/s = 1.94384 knots)
    return (s * 1.94384);
  },
  calculateTrack(lat1: number, lon1: number, lat2: number, lon2: number) {
    const toRad = (deg: number) => deg * Math.PI / 180;
    const toDeg = (rad: number) => rad * 180 / Math.PI;

    const φ1 = toRad(lat1);
    const φ2 = toRad(lat2);
    const Δλ = toRad(lon2 - lon1);

    const y = Math.sin(Δλ) * Math.cos(φ2);
    const x = Math.cos(φ1) * Math.sin(φ2) -
              Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
    const θ = Math.atan2(y, x);

    const bearing = (toDeg(θ) + 360) % 360;

    return Math.round(bearing); // 0 to 359, always max 3 digits
  }
}