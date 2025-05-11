const asyncHandler = require('../middleware/asyncHandler')
const db = require('../config/db')

exports.addTournament = asyncHandler( async (req, res) => {
    const {name, start_date, end_date, num_teams} = req.body

    if (!name || !start_date || !end_date || !num_teams) {
        return res.status(400).json({error: 'Tournament info missing'})
    }

    const query = `
    INSERT INTO tournaments (name, start_date, end_date, num_teams)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
    `
    try {
        const result = await db.query(query, [ name, start_date, end_date, num_teams])
        return res.status(200).json({
            data: result.rows[0],
            message: 'Successfully added tournament'
        })
    }
    
    catch (err) {
        return res.status(500).json({error: 'Error adding tournament:'+ err})
    }

})

exports.deleteTournament = asyncHandler(async(req, res) => {
    const id = req.params.id
    if (!id) {
        return res.status(400).json({error: 'Missing id'})
    }

    try {
        const result = await db.query(`
        DELETE FROM tournaments WHERE tournament_id = $1 RETURNING *
        `, [id])
        
        return res.status(200).json({
            message: 'Tournament successfully deleted',
            data: result.rows
        })
    }

    catch (err) {
        return res.status(400).json({error: 'Error deleting tournament: '+err})
    }
    
})


exports.addTeam = asyncHandler(async(req, res) => {
    const {team_name, coach_name, manager_name} = req.body

    if (!team_name || !coach_name || !manager_name) {
        return res.status(400).json({error: 'Missing inputs'})
    }

    try {
        const result = await db.query(`
            INSERT INTO teams (team_name, manager_name, coach_name) VALUES ($1, $2, $3) RETURNING *
            `, [team_name, manager_name, coach_name])


        res.status(200).json({
            data: result.rows[0]
        })
    }
    catch (err) {
        return res.status(400).json({error: 'Error inserting into team database' + err})
    }

})


exports.addTeamToTournament = asyncHandler( async (req, res) => {
    const team_id = req.params.team_id
    const tournament_id = req.params.tournament_id


    if (!team_id || !tournament_id) {
        return res.status(400).json({error: 'Team info missing'})
    }

    query = `
    INSERT INTO tournament_teams (team_id, tournament_id)
    VALUES ($1, $2) RETURNING *;
    `

    try {
        const result = await db.query(query, [team_id, tournament_id])
        return res.status(200).json({
            message: 'Successfully added team to tournament',
            data: result.rows[0]})
    }

    catch (err) {
        return res.status(500).json({error: "Error adding team to tournament:", err})
    }
})



exports.deleteTeam = asyncHandler(async(req, res) => {
    const id = req.params.id
    if (!id) {
        return res.status(400).json({error: 'Missing id'})
    }

    try {
        const result = await db.query(`
        DELETE FROM teams WHERE team_id = $1 RETURNING *
        `, [id])
        
        return res.status(200).json({
            message: 'Team successfully deleted',
            data: result.rows
        })
    }

    catch (err) {
        return res.status(400).json({error: 'Error deleting team: '+err})
    }
    
})

exports.removeTeamFromTournament = asyncHandler(async (req, res) => {
    const { tournament_id, team_id } = req.params;

    if (!tournament_id || !team_id) {
        return res.status(400).json({
            success: false,
            error: "Tournament ID and Team ID are required"
        });
    }

    try {
        const result = await db.query(
            `DELETE FROM tournament_teams 
             WHERE tournament_id = $1 AND team_id = $2
             RETURNING *`,
            [tournament_id, team_id]
        );

        res.status(200).json({
            success: true,
            message: "Team successfully removed from tournament",
            data: {
                tournament_id,
                team_id,
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: "Failed to remove team from tournament",
            details: error.message
        });
    }
});


exports.addMatchesToTournament = asyncHandler(async(req, res) => {
    const {matches} = req.body
    const {tournament_id} = req.params

    if (!matches) {
        return res.status(400).json({error: 'Matches objects needed'})
    }

    const insertedMatches = []

    try {
        for (const match of matches) {
        if (!tournament_id ||!match.match_id || !match.teama_id || !match.teamb_id || !match.match_date) {
            throw new Error(`Missing required fields in match: ${JSON.stringify(match)}`);
        }

        const result = await db.query(
            `INSERT INTO matches (
                match_id,
                tournament_id,
                teama_id,
                teamb_id,
                match_date,
                start_time,
                end_time,
                venue_id,
                match_completed
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *`,
            [
                match.match_id,
                tournament_id,
                match.teama_id,
                match.teamb_id,
                match.match_date,
                match.start_time || null,
                match.end_time || null,
                match.venue_id || null,
                match.match_completed || false
            ]
        );

        insertedMatches.push(result.rows[0]);
    }

    await db.query('COMMIT')

    return res.status(200).json({
        success: true,
        message: 'successfully made matches for tournament',
        data: insertedMatches
    })
}

    catch (err) {
        return res.status(500).json({
            error: 'error making matches'+ err,
            generated: matches
        })
    }



})


exports.updateMatch = asyncHandler(async (req, res) => {
    const match_id = req.params.match_id;
    const {teama_id, teamb_id , match_date, start_time, end_time, captaina_id, captainb_id, venue_id, tournament_id} = req.body;

    // Validate required fields
    if (!teama_id|| !teamb_id || !match_date|| !start_time || !end_time || !captaina_id || !captainb_id || !venue_id) {
        return res.status(400).json({
            success: false,
            message: 'Please provide all required fields'
        });
    }

    try {
        const result = await db.query(
            `UPDATE matches 
             SET teama_id = $1, teamb_id = $2, match_date = $3, start_time = $4, end_time = $5, captaina_id = $6, captainb_id = $7, venue_id = $8
             WHERE match_id = $9
             RETURNING *`,
            [teama_id, teamb_id , match_date, start_time, end_time, captaina_id, captainb_id, venue_id, match_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: `Match with ID ${match_id} not found`
            });
        }

        res.status(200).json({
            success: true,
            message: 'Match updated successfully',
            data: result.rows
        });

    } catch (error) {
        console.error('Error updating match:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating match',
            error: error.message
        });
    }
});

exports.addGoalEvent = asyncHandler(async (req, res) => {
    const { match_id, player_id, goal_time } = req.body;
    
    // Validate input
    if (!match_id || !player_id || goal_time == null) {
      return res.status(400).json({ 
        success: false, 
        error: "match_id, player_id, and goal_time are required" 
      });
    }
  
    if (isNaN(goal_time) || goal_time < 0) {
      return res.status(400).json({
        success: false,
        error: "goal_time must be a positive number"
      });
    }
  
    const client = await db.connect();
  
    try {
      await client.query('BEGIN');
  
      // 1. First verify the player belongs to one of the match teams
      const teamCheck = await client.query(
        `SELECT m.teama_id, m.teamb_id, p.team_id 
         FROM matches m
         JOIN players p ON p.player_id = $1
         WHERE m.match_id = $2`,
        [player_id, match_id]
      );
  
      if (teamCheck.rows.length === 0) {
        throw new Error('Player or match not found');
      }
  
      const { teama_id, teamb_id, team_id } = teamCheck.rows[0];
      const isTeamA = team_id === teama_id;
  
      // 2. Insert into goal_events
      const goalEvent = await client.query(
        `INSERT INTO goal_events (match_id, player_id, event_time)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [match_id, player_id, goal_time]
      );
  
      // 3. Update match_goals (aggregated count)
      await client.query(
        `INSERT INTO match_goals (match_id, player_id, goal_count)
         VALUES ($1, $2, 1)
         ON CONFLICT (match_id, player_id)
         DO UPDATE SET goal_count = match_goals.goal_count + 1`,
        [match_id, player_id]
      );
  
      // 4. Update the match score (increment correct team's score)
      const updatedMatch = await client.query(
        `UPDATE matches
         SET ${isTeamA ? 'scorea = COALESCE(scorea, 0) + 1' : 'scoreb = COALESCE(scoreb, 0) + 1'}
         WHERE match_id = $1
         RETURNING *`,
        [match_id]
      );
  
      await client.query('COMMIT');
  
      res.status(201).json({
        success: true,
        data: {
          goal_event: goalEvent.rows[0],
          match: updatedMatch.rows[0]
        }
      });
  
    } catch (err) {
      await client.query('ROLLBACK');
      
      if (err.code === '23505') { // Unique violation (duplicate goal)
        return res.status(409).json({
          success: false,
          error: "This goal event already exists"
        });
      }
      
      res.status(500).json({ 
        success: false, 
        error: err.message,
        details: err.detail // PostgreSQL specific error details
      });
    } finally {
      client.release();
    }
  });

exports.addMatchGoals = asyncHandler(async (req, res) => {
    const { match_id, player_id, goal_count } = req.body;
    if (!match_id || !player_id || goal_count == null) {
        return res.status(400).json({ success: false, error: "match_id, player_id, and goal_count are required" });
    }
    try {
        const result = await db.query(
        `INSERT INTO match_goals (match_id, player_id, goal_count)
        VALUES ($1, $2, $3)
        ON CONFLICT (match_id, player_id) DO UPDATE
         SET goal_count = EXCLUDED.goal_count
        RETURNING *`,
        [match_id, player_id, goal_count]
        );
        res.status(200).json({ success: true, data: result.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

exports.getGoalEvents = asyncHandler(async (req, res) => {
  try {
    const result = await db.query(`SELECT * FROM goal_events`);
    res.status(200).json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

exports.getMatchGoals = asyncHandler(async (req, res) => {
  try {
    const result = await db.query(`SELECT * FROM match_goals`);
    res.status(200).json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

exports.updateMatchGoals = asyncHandler(async (req, res) => {
    const { match_id, player_id, goal_count } = req.body;
    if (!match_id || !player_id || goal_count == null) {
      return res.status(400).json({
        success: false,
        error: "match_id, player_id, and goal_count are required"
      });
    }
    try {
      const result = await db.query(
        `UPDATE match_goals
         SET goal_count = $3
         WHERE match_id = $1 AND player_id = $2
         RETURNING *`,
        [match_id, player_id, goal_count]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: "No match_goals entry found for given match_id and player_id"
        });
      }
      res.status(200).json({ success: true, data: result.rows[0] });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  exports.deleteGoalEvent = asyncHandler(async (req, res) => {
    const { match_id, player_id, goal_time } = req.body;
    
    // Validate input
    if (!match_id || !player_id || goal_time == null) {
      return res.status(400).json({ 
        success: false, 
        error: "match_id, player_id, and goal_time are required" 
      });
    }
  
    if (isNaN(goal_time) || goal_time < 0) {
      return res.status(400).json({
        success: false,
        error: "goal_time must be a positive number"
      });
    }
  
    const client = await db.connect();
  
    try {
      await client.query('BEGIN');
  
      // 1. First verify the player belongs to one of the match teams
      const teamCheck = await client.query(
        `SELECT m.teama_id, m.teamb_id, p.team_id, m.scorea, m.scoreb
         FROM matches m
         JOIN players p ON p.player_id = $1
         WHERE m.match_id = $2`,
        [player_id, match_id]
      );
  
      if (teamCheck.rows.length === 0) {
        throw new Error('Player or match not found');
      }
  
      const { teama_id, teamb_id, team_id, scorea, scoreb } = teamCheck.rows[0];
      const isTeamA = team_id === teama_id;
  
      // 2. Delete from goal_events
      const deletedGoal = await client.query(
        `DELETE FROM goal_events
         WHERE match_id = $1 AND player_id = $2 AND event_time = $3
         RETURNING *`,
        [match_id, player_id, goal_time]
      );
  
      if (deletedGoal.rows.length === 0) {
        throw new Error('No goal event found with these parameters');
      }
  
      // 3. Update match_goals (decrement aggregated count)
      await client.query(
        `UPDATE match_goals
         SET goal_count = goal_count - 1
         WHERE match_id = $1 AND player_id = $2
         RETURNING *`,
        [match_id, player_id]
      );
  
      // 4. Update the match score (decrement correct team's score)
      const updatedMatch = await client.query(
        `UPDATE matches
         SET ${isTeamA ? 'scorea = GREATEST(COALESCE(scorea, 0) - 1, 0)' : 'scoreb = GREATEST(COALESCE(scoreb, 0) - 1, 0)'}
         WHERE match_id = $1
         RETURNING *`,
        [match_id]
      );
  
      // 5. Clean up any zero-count records
      await client.query(
        `DELETE FROM match_goals
         WHERE match_id = $1 AND player_id = $2 AND goal_count <= 0`,
        [match_id, player_id]
      );
  
      await client.query('COMMIT');
  
      res.status(200).json({
        success: true,
        data: {
          deleted_goal: deletedGoal.rows[0],
          match: updatedMatch.rows[0]
        }
      });
  
    } catch (err) {
      await client.query('ROLLBACK');
      
      if (err.message === 'No goal event found with these parameters') {
        return res.status(404).json({
          success: false,
          error: err.message
        });
      }
      
      res.status(500).json({ 
        success: false, 
        error: err.message,
        details: err.detail
      });
    } finally {
      client.release();
    }
  });

exports.deletePlayerMatchGoals = asyncHandler(async (req, res) => {
  const { player_id } = req.params;
  if (!player_id) {
    return res.status(400).json({ success: false, error: "player_id is required" });
  }
  try {
    const result = await db.query(
      `DELETE FROM match_goals
       WHERE player_id = $1
       RETURNING *`,
      [player_id]
    );
    res.status(200).json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});


exports.updateTournament = asyncHandler(async(req, res) => {
    const tournament_id = req.params.tournament_id
    const {start_date, end_date, name} = req.body

    const result = await db.query(`
        UPDATE tournaments 
        SET name = $1, start_date = $2, end_date = $3 
        WHERE tournament_id = $4       
     `, [name, start_date, end_date, tournament_id])

    return res.status(200).json({
        success: true,
        data: result.rows
    })
})