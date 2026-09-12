function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function phaseFromSignal(anomaly, probabilities) {
  if (anomaly >= 0.5) return "elNino";
  if (anomaly <= -0.5) return "laNina";

  const entries = [
    ["elNino", Number(probabilities.elNino)],
    ["neutral", Number(probabilities.neutral)],
    ["laNina", Number(probabilities.laNina)],
  ].filter(([, value]) => Number.isFinite(value));

  if (!entries.length) return "neutral";
  return entries.sort((a, b) => b[1] - a[1])[0][0];
}

export function calculateExperimentalOutlook(data) {
  const rawAnomaly = Number(data.current?.weeklySst?.regions?.nino34?.anomaly);
  const anomalyAvailable = Number.isFinite(rawAnomaly);
  const anomaly = anomalyAvailable ? rawAnomaly : 0;
  const seasons = data.forecast?.seasons || [];
  const firstRaw = Number(seasons[0]?.probability?.elNino);
  const lastRaw = Number(seasons.at(-1)?.probability?.elNino);
  const firstAvailable = Number.isFinite(firstRaw);
  const lastAvailable = Number.isFinite(lastRaw);
  const first = firstAvailable ? firstRaw : 0;
  const last = lastAvailable ? lastRaw : first;
  const direction = last - first;
  const selected = data.forecast?.selectedSeason || seasons[0];
  const probabilities = selected?.probability || {};
  const elNino = Number(probabilities.elNino);
  const neutral = Number(probabilities.neutral);
  const laNina = Number(probabilities.laNina);
  const probabilityAvailable = [elNino, neutral, laNina].some(Number.isFinite);
  const dominantProbability = probabilityAvailable
    ? Math.max(
        Number.isFinite(elNino) ? elNino : 0,
        Number.isFinite(neutral) ? neutral : 0,
        Number.isFinite(laNina) ? laNina : 0,
      )
    : null;
  const availableSources = (data.sources || []).filter((source) => source.available).length;
  const totalSources = Math.max((data.sources || []).length, 1);
  const phase = phaseFromSignal(anomaly, probabilities);
  const hasSignalData = anomalyAvailable || probabilityAvailable;

  // Experimental score: strength/coherence of the available ENSO signal, NOT confidence.
  // Weights sum to 100 and deliberately exclude data quality from the score itself.
  const components = {
    observedIntensity: Math.round(clamp(Math.abs(anomaly) / 2.0, 0, 1) * 35),
    forecastConsensus: probabilityAvailable ? Math.round(clamp(dominantProbability / 100, 0, 1) * 25) : 0,
    phaseConsistency: probabilityAvailable
      ? Math.round((
          (phase === "elNino" && elNino >= 50)
          || (phase === "laNina" && laNina >= 50)
          || (phase === "neutral" && neutral >= 50)
            ? 1 : 0
        ) * 20)
      : 0,
    trendClarity: firstAvailable || lastAvailable ? Math.round(clamp(Math.abs(direction) / 40, 0, 1) * 20) : 0,
  };
  const signalScore = hasSignalData
    ? Object.values(components).reduce((sum, value) => sum + value, 0)
    : null;
  const dataCoverage = Math.round((availableSources / totalSources) * 100);
  const trend = firstAvailable || lastAvailable
    ? direction >= 10 ? "strengthening" : direction <= -10 ? "weakening" : "stable"
    : "unavailable";

  return {
    anomaly,
    first,
    last,
    direction,
    signalScore,
    components,
    dominantProbability,
    dataCoverage,
    trend,
    hasSignalData,
  };
}
