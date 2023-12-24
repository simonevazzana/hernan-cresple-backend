const normalizeLeagueString = (str) => str.toLowerCase().replace(/[^\p{Ll}\d]/gu, '')

module.exports = {
  normalizeLeagueString
}
