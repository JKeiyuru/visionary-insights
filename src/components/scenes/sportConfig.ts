export type SportSlug =
  | "soccer" | "formula1" | "basketball" | "tennis"
  | "boxing" | "cricket" | "american-football" | "baseball";

export type SceneChapter = {
  title: string;
  body: string;
  metric?: { label: string; value: string };
};

export type SportConfig = {
  slug: SportSlug;
  name: string;
  emoji: string;
  tagline: string;
  /** Hex-ish theme colors used in the 3D scene + overlays */
  primary: string;
  accent: string;
  /** Hero environment description shown above the fold */
  environment: string;
  /** 5 chapters that drive the scroll story */
  chapters: SceneChapter[];
};

export const SPORTS: Record<SportSlug, SportConfig> = {
  soccer: {
    slug: "soccer", name: "Soccer", emoji: "⚽",
    tagline: "Step onto the pitch. Read the match before it happens.",
    primary: "#22c55e", accent: "#eab308",
    environment: "Floodlit stadium · 90 min · xG live",
    chapters: [
      { title: "The ball.", body: "Every pass, every touch — modelled in real-time. Possession is data.", metric: { label: "Events / match", value: "2,300+" } },
      { title: "The stadium.", body: "Pitch geometry, weather, altitude, crowd density — all baked into the forecast.", metric: { label: "Signals tracked", value: "147" } },
      { title: "The forecast.", body: "Expected goals, momentum swings, and a confidence band you can actually trust.", metric: { label: "Median accuracy", value: "71.4%" } },
      { title: "The verdict.", body: "Read the AI reasoning chain. No black boxes — every prediction explains itself.", metric: { label: "Reasoning depth", value: "5 layers" } },
      { title: "Your edge.", body: "Premium forecasts on every major league. Live momentum updates every 30 seconds.", metric: { label: "Leagues covered", value: "40+" } },
    ],
  },
  formula1: {
    slug: "formula1", name: "Formula 1", emoji: "🏎️",
    tagline: "Climb into the cockpit. The dashboard is your prediction engine.",
    primary: "#ef4444", accent: "#f59e0b",
    environment: "Pit lane · 305 km/h · 1,000 sensors",
    chapters: [
      { title: "The car.", body: "Aerodynamic load, tyre temperature, fuel burn — modelled corner by corner.", metric: { label: "Telemetry channels", value: "1,000+" } },
      { title: "The cockpit.", body: "Step inside. The HUD shows live lap delta, sector predictions, undercut windows.", metric: { label: "Update rate", value: "60Hz" } },
      { title: "The grid.", body: "Qualifying gaps, race pace deltas, weather windows — synthesised into pole-to-podium odds.", metric: { label: "Pre-race signals", value: "82" } },
      { title: "The race.", body: "Strategy calls update lap by lap. Pit window? Undercut? Safety car probability?", metric: { label: "Strategy scenarios", value: "1,024" } },
      { title: "Your edge.", body: "Driver-by-driver podium forecasts every Grand Prix weekend.", metric: { label: "Races / season", value: "24" } },
    ],
  },
  basketball: {
    slug: "basketball", name: "Basketball", emoji: "🏀",
    tagline: "Step onto the hardwood. Every possession becomes probability.",
    primary: "#f97316", accent: "#a855f7",
    environment: "NBA-spec arena · 48 minutes · 200 possessions",
    chapters: [
      { title: "The ball.", body: "Shot quality, defensive rotation, pace — modelled possession by possession.", metric: { label: "Possessions / game", value: "200" } },
      { title: "The court.", body: "Heat-map shot zones, defensive matchups, fatigue curves over four quarters.", metric: { label: "Tracked zones", value: "16" } },
      { title: "The forecast.", body: "Live win probability, scoring spread, MVP candidate momentum.", metric: { label: "Live updates", value: "Every 30s" } },
      { title: "The verdict.", body: "AI reasoning highlights pivotal matchups and minutes that decide the game.", metric: { label: "Key matchups", value: "10/game" } },
      { title: "Your edge.", body: "NBA + Euroleague coverage. Playoff series modelled to round 4.", metric: { label: "Leagues", value: "6" } },
    ],
  },
  tennis: {
    slug: "tennis", name: "Tennis", emoji: "🎾",
    tagline: "Walk on court. Read the rally before the serve.",
    primary: "#84cc16", accent: "#06b6d4",
    environment: "Centre court · Best of 5 · Surface aware",
    chapters: [
      { title: "The ball.", body: "Spin, speed, depth — characterised shot by shot from broadcast data.", metric: { label: "Shots / match", value: "1,400+" } },
      { title: "The court.", body: "Surface (grass / clay / hard), altitude, ball type — all reshape the forecast.", metric: { label: "Surface profiles", value: "6" } },
      { title: "The rally.", body: "Live break-point probabilities, set-by-set win odds.", metric: { label: "Live updates", value: "Per game" } },
      { title: "The verdict.", body: "Player form, head-to-head, surface specialism — explained in plain language.", metric: { label: "H2H depth", value: "10 years" } },
      { title: "Your edge.", body: "ATP + WTA + Grand Slams. Every match modelled.", metric: { label: "Tournaments", value: "120+" } },
    ],
  },
  boxing: {
    slug: "boxing", name: "Boxing", emoji: "🥊",
    tagline: "Step into the ring. Read every round before the bell.",
    primary: "#dc2626", accent: "#fbbf24",
    environment: "Championship ring · 12 rounds · Stat-Punch live",
    chapters: [
      { title: "The gloves.", body: "Punch volume, accuracy, power-shot ratios — round by round.", metric: { label: "Punches tracked", value: "900+/fight" } },
      { title: "The ring.", body: "Reach, footwork, stamina curves modelled across the championship distance.", metric: { label: "Bio-metrics", value: "24" } },
      { title: "The bout.", body: "Round-by-round win probability, KO odds, decision split prediction.", metric: { label: "Outcome paths", value: "36" } },
      { title: "The verdict.", body: "Style matchup analysis — pressure vs counterpuncher, switch-hitter, southpaw.", metric: { label: "Style profiles", value: "8" } },
      { title: "Your edge.", body: "Title fights, world rankings, eliminators — all forecast.", metric: { label: "Events / yr", value: "200+" } },
    ],
  },
  cricket: {
    slug: "cricket", name: "Cricket", emoji: "🏏",
    tagline: "Walk to the crease. Every ball becomes prediction.",
    primary: "#16a34a", accent: "#f59e0b",
    environment: "Pitch report · DLS aware · T20 / ODI / Test",
    chapters: [
      { title: "The ball.", body: "Swing, seam, spin — modelled with pitch wear and ball age.", metric: { label: "Deliveries / match", value: "240–540" } },
      { title: "The pitch.", body: "Surface report, weather, dew factor, DLS scenarios.", metric: { label: "Pitch profiles", value: "12" } },
      { title: "The innings.", body: "Live run-rate trajectory, wicket probability, par-score swing.", metric: { label: "Live updates", value: "Per over" } },
      { title: "The verdict.", body: "Powerplay edge, death-overs forecast, chase pressure modelled.", metric: { label: "Phases tracked", value: "5" } },
      { title: "Your edge.", body: "IPL, BBL, internationals — every format covered.", metric: { label: "Formats", value: "3" } },
    ],
  },
  "american-football": {
    slug: "american-football", name: "American Football", emoji: "🏈",
    tagline: "Walk into the huddle. The playbook is data.",
    primary: "#7c3aed", accent: "#22c55e",
    environment: "Stadium · 60 min · Drive-level forecasts",
    chapters: [
      { title: "The ball.", body: "Air yards, pressure rate, yards after catch — modelled play by play.", metric: { label: "Plays / game", value: "160" } },
      { title: "The field.", body: "Field position, weather, turf vs grass — every yard reshapes the forecast.", metric: { label: "Field zones", value: "10" } },
      { title: "The drive.", body: "Live win probability, scoring odds by drive, 4th-down go-for-it edge.", metric: { label: "Live updates", value: "Per play" } },
      { title: "The verdict.", body: "QB matchup, defensive scheme, red-zone efficiency — explained.", metric: { label: "Schemes tracked", value: "12" } },
      { title: "Your edge.", body: "NFL + College football — every Sunday and Saturday modelled.", metric: { label: "Games / week", value: "60+" } },
    ],
  },
  baseball: {
    slug: "baseball", name: "Baseball", emoji: "⚾",
    tagline: "Step up to the plate. Every pitch is probability.",
    primary: "#0ea5e9", accent: "#f43f5e",
    environment: "Diamond · 9 innings · Statcast aware",
    chapters: [
      { title: "The ball.", body: "Spin rate, exit velocity, launch angle — every pitch and every contact.", metric: { label: "Pitches / game", value: "300+" } },
      { title: "The field.", body: "Park factors, wind, temperature — modelled into expected runs.", metric: { label: "Park profiles", value: "30" } },
      { title: "The inning.", body: "Live win probability, scoring odds, bullpen leverage tracking.", metric: { label: "Live updates", value: "Per pitch" } },
      { title: "The verdict.", body: "Starter fatigue, bullpen depth, batter-pitcher matchups — all explained.", metric: { label: "Matchups / game", value: "60" } },
      { title: "Your edge.", body: "MLB + KBO + NPB. Postseason modelled to game 7.", metric: { label: "Leagues", value: "3" } },
    ],
  },
};

export const SPORTS_LIST = Object.values(SPORTS);
