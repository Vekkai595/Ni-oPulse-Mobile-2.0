export const ensoFallback = {
  ok: false,
  stale: true,
  generatedAt: null,
  refreshIntervalMs: 300000,
  warning: "Os dados oficiais da NOAA ainda não estão disponíveis nesta sessão. Nenhum valor antigo é apresentado como atual.",
  current: {
    phase: "Dados indisponíveis",
    alertStatus: null,
    alertStatusPt: "Dados indisponíveis",
    synopsis: null,
    issuedAt: null,
    issuedLabel: null,
    nextUpdate: null,
    nextUpdateLabel: null,
    weeklySst: {
      date: null,
      dateLabel: null,
      regions: {
        nino12: { sst: null, anomaly: null },
        nino3: { sst: null, anomaly: null },
        nino34: { sst: null, anomaly: null },
        nino4: { sst: null, anomaly: null },
      },
    },
  },
  forecast: {
    issuedAt: null,
    issuedLabel: null,
    selectedSeason: null,
    seasons: [],
  },
  sources: [
    { name: "NOAA/CPC — ENSO Diagnostic Discussion", url: "https://www.cpc.ncep.noaa.gov/products/analysis_monitoring/enso_advisory/ensodisc.shtml", cadence: "monthly", available: false },
    { name: "NOAA/CPC — Official ENSO Strength Probabilities", url: "https://www.cpc.ncep.noaa.gov/products/analysis_monitoring/enso/roni/strengths/", cadence: "monthly", available: false },
    { name: "NOAA/CPC — Weekly Niño SST Indices", url: "https://www.cpc.ncep.noaa.gov/data/indices/wksst9120.for", cadence: "weekly", available: false },
  ],
};
