const coroutine = require('bluebird').coroutine;
const { requestUrl } = require('../utils');

const DEFAULT_FUTURE_MATCHES_TAKE = 5;
const DEFAULT_CURRENT_MATCHES_TAKE = 5;
const ONE_DAT_IN_MILL_SECONDS = 86400000;

const getFutureMatchesLink = (take) => {
  if (!take) {
    take = DEFAULT_FUTURE_MATCHES_TAKE;
  }
  return `https://abiosgaming.com/ajax/calendar-matches?games%5B%5D=&games%5B%5D=1&take=${take}&upcoming=true`;
};

const getCurrentMatchesLink = (take) => {
  if (!take) {
    take = DEFAULT_CURRENT_MATCHES_TAKE;
  }
  return `https://abiosgaming.com/ajax/calendar-matches?games%5B%5D=&games%5B%5D=1&take=${take}&past=true`;
};

const tournamentsInfoMap = new Map();

const getTournamentInfo = (tournamentId) => {
  return `https://abiosgaming.com/ajax/tournament/${tournamentId}`;
};

const tournamentOnGoing = `https://abiosgaming.com/ajax/tournaments?ongoing=true&skip=0&take=30&games%5B%5D=&games%5B%5D=1&from=${Date.now()}&query=`;
const tournamentUpComing = `https://abiosgaming.com/ajax/tournaments?upcoming=true&skip=0&take=30&games%5B%5D=1&from=${Date.now()}&query=`;
const tournamentPast = `https://abiosgaming.com/ajax/tournaments?past=true&skip=0&take=30&games%5B%5D=1&from=${Date.now()}&query=`;

const ONGOING = 'ongoing';
const UPCOMING = 'upcoming';
const PAST = 'past';

let prevFutureMatchesResult = null;
let prevFutureTime = null;
let prevCurrentMatchesResult = null;
let prevCurrentTime = null;

module.exports.getTournamentById = coroutine(function* (req, res) {
  let tournament = null;
  switch (req.params.id) {
    case UPCOMING:
      tournament = tournamentUpComing;
      break;
    case PAST:
      tournament = tournamentPast;
      break;
    default:
      tournament = tournamentOnGoing;
  }

  let abioApiRes = yield requestUrl(tournament);
  try {
    abioApiRes = JSON.parse(abioApiRes);
  } catch (e) {
    return res.send({error: 'No information about tournaments'});
  }
  if (!abioApiRes) {
    return res.send({error: 'No information about tournaments'});
  }

  res.send({list: abioApiRes.list});
});

module.exports.getTournamentInfo = coroutine(function* (req, res) {
  if (!req.params.id) {
    return res.send({error: 'Need tournament ID'});
  }
  const cachedTournamentInfo = tournamentsInfoMap.get(req.params.id);
  if (cachedTournamentInfo) {
    // TODO: try/catch
    return res.send(JSON.parse(cachedTournamentInfo));
  }

  const abioApiRes = yield requestUrl(getTournamentInfo(req.params.id));
  tournamentsInfoMap.set(req.params.id, abioApiRes);
  // TODO: try/catch
  res.send(JSON.parse(abioApiRes));
});

module.exports.getFutureMatches = coroutine(function* (req, res) {
  if (prevFutureMatchesResult && ((prevFutureTime + ONE_DAT_IN_MILL_SECONDS) - Date.now()) > 0) {
    return res.send(prevFutureMatchesResult);
  }

  let { take } = req.body;
  const abioApiRes = yield requestUrl(getFutureMatchesLink(take));
  prevFutureMatchesResult = abioApiRes;
  prevFutureTime = Date.now();
  res.send(abioApiRes);
});

module.exports.getCurrentMatches = coroutine(function* (req, res) {
  if (prevCurrentMatchesResult && ((prevCurrentTime + ONE_DAT_IN_MILL_SECONDS) - Date.now()) > 0) {
    return res.send(prevCurrentMatchesResult);
  }

  let { take } = req.body;
  const abioApiRes = yield requestUrl(getCurrentMatchesLink(take));
  prevCurrentMatchesResult = abioApiRes;
  prevCurrentTime = Date.now();
  res.send(abioApiRes)
});
