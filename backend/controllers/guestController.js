const asyncHandler = require('../middleware/asyncHandler')
const db = require('../config/db')

// @desc    Get all teams for guests
// @route   GET /api/guest/teams
// @access  Public
exports.getTeams = asyncHandler(async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM teams');
    res.status(200).json({
      success: true,
      data: result.rows
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// @desc    Get all tournaments for guests
// @route   GET /api/guest/tournaments
// @access  Public
exports.getTournaments = asyncHandler(async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM tournaments');
    res.status(200).json({
      success: true,
      data: result.rows
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// @desc    Get all players for guests
// @route   GET /api/guest/players
// @access  Public
exports.getPlayers = asyncHandler(async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM players');
    res.status(200).json({
      success: true,
      data: result.rows
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// @desc    Get all yellow card events for guests
// @route   GET /api/guest/cards/yellow
// @access  Public
exports.getYellowCards = asyncHandler(async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM yellow_card_events');
    res.status(200).json({
      success: true,
      data: result.rows
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// @desc    Get all red card events for guests
// @route   GET /api/guest/cards/red
// @access  Public
exports.getRedCards = asyncHandler(async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM red_card_events');
    res.status(200).json({
      success: true,
      data: result.rows
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});


// @desc    Get all match results for guests
// @route   GET /api/guest/matches
// @access  Public
exports.getMatches = asyncHandler(async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        m.match_id,
        m.tournament_id,
        m.teama_id,
        t1.team_name AS teamA_name,
        m.teamb_id,
        t2.team_name AS teamB_name,
        m.match_date,
        m.start_time,
        m.end_time,
        m.scorea,
        m.scoreb,
        m.winner_team_id,
        m.match_completed
      FROM matches m
      LEFT JOIN teams t1 ON m.teama_id = t1.team_id
      LEFT JOIN teams t2 ON m.teamb_id = t2.team_id
    `);
    res.status(200).json({
      success: true,
      data: result.rows
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// @desc    Get all venues for guests
// @route   GET /api/guest/venues
// @access  Public
exports.getVenues = asyncHandler(async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM venues');
    res.status(200).json({
      success: true,
      data: result.rows
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// @desc    Get all individual goal events for guests
// @route   GET /api/guest/goal-events
// @access  Public
exports.getGoalEvents = asyncHandler(async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM goal_events');
    res.status(200).json({
      success: true,
      data: result.rows
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// @desc    Get aggregated match goals for guests
// @route   GET /api/guest/match-goals
// @access  Public
exports.getMatchGoals = asyncHandler(async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM match_goals');
    res.status(200).json({
      success: true,
      data: result.rows
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});


// @desc    Get all tournament–team associations for guests
// @route   GET /api/guest/tournament-teams
// @access  Public
exports.getTournamentTeams = asyncHandler(async (req, res) => {
  try {
    const result = await db.query(`
      SELECT
        tt.tournament_id,
        tr.name AS tournament_name,
        tt.team_id,
        t.team_name
      FROM tournament_teams tt
      JOIN tournaments tr ON tt.tournament_id = tr.tournament_id
      JOIN teams t ON tt.team_id = t.team_id
    `);
    res.status(200).json({
      success: true,
      data: result.rows
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
}
);