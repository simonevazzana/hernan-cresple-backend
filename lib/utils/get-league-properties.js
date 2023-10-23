const getLeagueProperties = {
  bundesliga: {
    finalSeasonBoard: 1990,
    finalSeason: 1990,
    leagueTier: 1,
    leagueToUrl: 'L1',
    normalized: 'Bundesliga',
    posLimit: 25
  },
  eredivisie: {
    finalSeasonBoard: 1990,
    finalSeason: 1990,
    leagueTier: 2,
    leagueToUrl: 'NL1',
    normalized: 'Eredivisie',
    posLimit: 10
  },
  laliga: {
    finalSeasonBoard: 1990,
    finalSeason: 1990,
    leagueTier: 1,
    leagueToUrl: 'ES1',
    normalized: 'La Liga',
    posLimit: 25
  },
  ligaportugal: {
    finalSeasonBoard: 2000,
    finalSeason: 2000,
    leagueTier: 2,
    leagueToUrl: 'PO1',
    normalized: 'Liga Portugal',
    posLimit: 10
  },
  ligue1: {
    finalSeasonBoard: 1990,
    finalSeason: 1990,
    leagueTier: 1,
    leagueToUrl: 'FR1',
    normalized: 'Ligue 1',
    posLimit: 25
  },
  premierleague: {
    finalSeasonBoard: 1990,
    finalSeason: 1990,
    leagueTier: 1,
    leagueToUrl: 'GB1',
    normalized: 'Premier League',
    posLimit: 25
  },
  seriea: {
    finalSeasonBoard: 1990,
    finalSeason: 1990,
    leagueTier: 1,
    leagueToUrl: 'IT1',
    normalized: 'Serie A',
    posLimit: 25
  }
}

const tierOneLeagues = Object.keys(getLeagueProperties).filter(k => getLeagueProperties[k].leagueTier === 1)
const tierTwoLeagues = Object.keys(getLeagueProperties).filter(k => getLeagueProperties[k].leagueTier === 2)

module.exports = {
  getLeagueProperties,
  tierOneLeagues,
  tierTwoLeagues
}
