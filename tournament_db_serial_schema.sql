--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: goal_details; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.goal_details (
    goal_id integer NOT NULL,
    match_no integer NOT NULL,
    player_id integer NOT NULL,
    team_id integer NOT NULL,
    goal_time integer NOT NULL,
    goal_type character(1) NOT NULL,
    play_stage character(1) NOT NULL,
    goal_schedule character(2) NOT NULL,
    goal_half integer
);


ALTER TABLE public.goal_details OWNER TO postgres;

--
-- Name: match_captain; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.match_captain (
    match_no integer NOT NULL,
    team_id integer NOT NULL,
    player_captain integer NOT NULL
);


ALTER TABLE public.match_captain OWNER TO postgres;

--
-- Name: match_details; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.match_details (
    match_no integer NOT NULL,
    team_id integer NOT NULL,
    win_lose character(1) NOT NULL,
    decided_by character(1) NOT NULL,
    goal_score integer NOT NULL,
    penalty_score integer,
    player_gk integer NOT NULL,
    start_time character varying(40),
    end_time character varying(40),
    completed boolean DEFAULT false
);


ALTER TABLE public.match_details OWNER TO postgres;

--
-- Name: match_played; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.match_played (
    match_no integer NOT NULL,
    play_stage character(1) NOT NULL,
    play_date date NOT NULL,
    team_id1 integer NOT NULL,
    team_id2 integer NOT NULL,
    results character(5) NOT NULL,
    decided_by character(1) NOT NULL,
    goal_score character(5) NOT NULL,
    venue_id integer NOT NULL,
    audience integer NOT NULL,
    player_of_match integer NOT NULL,
    stop1_sec integer NOT NULL,
    stop2_sec integer NOT NULL,
    start_time character varying(40),
    end_time character varying(40),
    completed boolean DEFAULT false
);


ALTER TABLE public.match_played OWNER TO postgres;

--
-- Name: match_support; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.match_support (
    match_no integer NOT NULL,
    support_id integer NOT NULL,
    support_type character(2) NOT NULL
);


ALTER TABLE public.match_support OWNER TO postgres;

--
-- Name: penalty_gk; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.penalty_gk (
    match_no integer NOT NULL,
    team_id integer NOT NULL,
    player_gk integer NOT NULL
);


ALTER TABLE public.penalty_gk OWNER TO postgres;

--
-- Name: penalty_shootout; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.penalty_shootout (
    kick_id integer NOT NULL,
    match_no integer NOT NULL,
    team_id integer NOT NULL,
    player_id integer NOT NULL,
    score_goal character(1) NOT NULL,
    kick_no integer NOT NULL
);


ALTER TABLE public.penalty_shootout OWNER TO postgres;

--
-- Name: person; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.person (
    kfupm_id integer NOT NULL,
    name character varying(40) NOT NULL,
    date_of_birth date
);


ALTER TABLE public.person OWNER TO postgres;

--
-- Name: player; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.player (
    player_id integer NOT NULL,
    jersey_no integer NOT NULL,
    position_to_play character(2) NOT NULL
);


ALTER TABLE public.player OWNER TO postgres;

--
-- Name: player_booked; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.player_booked (
    match_no integer NOT NULL,
    team_id integer NOT NULL,
    player_id integer NOT NULL,
    booking_time integer NOT NULL,
    sent_off character(1),
    play_schedule character(2) NOT NULL,
    play_half integer NOT NULL
);


ALTER TABLE public.player_booked OWNER TO postgres;

--
-- Name: player_in_out; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.player_in_out (
    match_no integer NOT NULL,
    team_id integer NOT NULL,
    player_id integer NOT NULL,
    in_out character(1) NOT NULL,
    time_in_out integer NOT NULL,
    play_schedule character(2) NOT NULL,
    play_half integer NOT NULL
);


ALTER TABLE public.player_in_out OWNER TO postgres;

--
-- Name: playing_position; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.playing_position (
    position_id character(2) NOT NULL,
    position_desc character varying(15) NOT NULL
);


ALTER TABLE public.playing_position OWNER TO postgres;

--
-- Name: support; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.support (
    support_type character(2) NOT NULL,
    support_desc character varying(15) NOT NULL
);


ALTER TABLE public.support OWNER TO postgres;

--
-- Name: team; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.team (
    team_id integer NOT NULL,
    team_name character varying(30) NOT NULL,
    coach_name character varying(50),
    manager_name character varying(50)
);


ALTER TABLE public.team OWNER TO postgres;

--
-- Name: team_player; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.team_player (
    player_id integer NOT NULL,
    team_id integer NOT NULL,
    tr_id integer NOT NULL
);


ALTER TABLE public.team_player OWNER TO postgres;

--
-- Name: team_support; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.team_support (
    support_id integer NOT NULL,
    team_id integer NOT NULL,
    tr_id integer NOT NULL,
    support_type character(2) NOT NULL
);


ALTER TABLE public.team_support OWNER TO postgres;

--
-- Name: team_team_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.team_team_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.team_team_id_seq OWNER TO postgres;

--
-- Name: team_team_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.team_team_id_seq OWNED BY public.team.team_id;


--
-- Name: tournament; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tournament (
    tr_id integer NOT NULL,
    tr_name character varying(40) NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    num_teams integer DEFAULT 4
);


ALTER TABLE public.tournament OWNER TO postgres;

--
-- Name: tournament_team; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tournament_team (
    team_id integer NOT NULL,
    tr_id integer NOT NULL,
    team_group character(1) NOT NULL,
    match_played integer NOT NULL,
    won integer NOT NULL,
    draw integer NOT NULL,
    lost integer NOT NULL,
    goal_for integer NOT NULL,
    goal_against integer NOT NULL,
    goal_diff integer NOT NULL,
    points integer NOT NULL,
    group_position integer NOT NULL
);


ALTER TABLE public.tournament_team OWNER TO postgres;

--
-- Name: tournament_tr_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tournament_tr_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tournament_tr_id_seq OWNER TO postgres;

--
-- Name: tournament_tr_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tournament_tr_id_seq OWNED BY public.tournament.tr_id;


--
-- Name: venue; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.venue (
    venue_id integer NOT NULL,
    venue_name character varying(30) NOT NULL,
    venue_status character(1) NOT NULL,
    venue_capacity integer NOT NULL
);


ALTER TABLE public.venue OWNER TO postgres;

--
-- Name: venue_venue_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.venue_venue_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.venue_venue_id_seq OWNER TO postgres;

--
-- Name: venue_venue_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.venue_venue_id_seq OWNED BY public.venue.venue_id;


--
-- Name: team team_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.team ALTER COLUMN team_id SET DEFAULT nextval('public.team_team_id_seq'::regclass);


--
-- Name: tournament tr_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tournament ALTER COLUMN tr_id SET DEFAULT nextval('public.tournament_tr_id_seq'::regclass);


--
-- Name: venue venue_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.venue ALTER COLUMN venue_id SET DEFAULT nextval('public.venue_venue_id_seq'::regclass);


--
-- Name: goal_details goal_details_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.goal_details
    ADD CONSTRAINT goal_details_pkey PRIMARY KEY (goal_id);


--
-- Name: match_captain match_captain_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.match_captain
    ADD CONSTRAINT match_captain_pkey PRIMARY KEY (match_no, team_id);


--
-- Name: match_details match_details_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.match_details
    ADD CONSTRAINT match_details_pkey PRIMARY KEY (match_no, team_id);


--
-- Name: match_played match_played_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.match_played
    ADD CONSTRAINT match_played_pkey PRIMARY KEY (match_no);


--
-- Name: match_support match_support_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.match_support
    ADD CONSTRAINT match_support_pkey PRIMARY KEY (match_no, support_id);


--
-- Name: penalty_gk penalty_gk_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.penalty_gk
    ADD CONSTRAINT penalty_gk_pkey PRIMARY KEY (match_no, team_id);


--
-- Name: penalty_shootout penalty_shootout_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.penalty_shootout
    ADD CONSTRAINT penalty_shootout_pkey PRIMARY KEY (kick_id);


--
-- Name: person person_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.person
    ADD CONSTRAINT person_pkey PRIMARY KEY (kfupm_id);


--
-- Name: player_booked player_booked_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.player_booked
    ADD CONSTRAINT player_booked_pkey PRIMARY KEY (match_no, team_id, player_id);


--
-- Name: player_in_out player_in_out_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.player_in_out
    ADD CONSTRAINT player_in_out_pkey PRIMARY KEY (match_no, team_id);


--
-- Name: player player_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_pkey PRIMARY KEY (player_id);


--
-- Name: playing_position playing_position_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.playing_position
    ADD CONSTRAINT playing_position_pkey PRIMARY KEY (position_id);


--
-- Name: support support_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.support
    ADD CONSTRAINT support_pkey PRIMARY KEY (support_type);


--
-- Name: team team_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.team
    ADD CONSTRAINT team_pkey PRIMARY KEY (team_id);


--
-- Name: team_player team_player_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.team_player
    ADD CONSTRAINT team_player_pkey PRIMARY KEY (player_id, team_id, tr_id);


--
-- Name: team_support team_support_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.team_support
    ADD CONSTRAINT team_support_pkey PRIMARY KEY (support_id, team_id, tr_id);


--
-- Name: tournament tournament_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tournament
    ADD CONSTRAINT tournament_pkey PRIMARY KEY (tr_id);


--
-- Name: tournament_team tournament_team_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tournament_team
    ADD CONSTRAINT tournament_team_pkey PRIMARY KEY (team_id, tr_id);


--
-- Name: venue venue_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.venue
    ADD CONSTRAINT venue_pkey PRIMARY KEY (venue_id);


--
-- Name: goal_details goal_details_match_no_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.goal_details
    ADD CONSTRAINT goal_details_match_no_fkey FOREIGN KEY (match_no) REFERENCES public.match_played(match_no);


--
-- Name: goal_details goal_details_player_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.goal_details
    ADD CONSTRAINT goal_details_player_id_fkey FOREIGN KEY (player_id) REFERENCES public.player(player_id);


--
-- Name: goal_details goal_details_team_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.goal_details
    ADD CONSTRAINT goal_details_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.team(team_id);


--
-- Name: match_captain match_captain_match_no_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.match_captain
    ADD CONSTRAINT match_captain_match_no_fkey FOREIGN KEY (match_no) REFERENCES public.match_played(match_no);


--
-- Name: match_captain match_captain_player_captain_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.match_captain
    ADD CONSTRAINT match_captain_player_captain_fkey FOREIGN KEY (player_captain) REFERENCES public.player(player_id);


--
-- Name: match_captain match_captain_team_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.match_captain
    ADD CONSTRAINT match_captain_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.team(team_id);


--
-- Name: match_details match_details_match_no_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.match_details
    ADD CONSTRAINT match_details_match_no_fkey FOREIGN KEY (match_no) REFERENCES public.match_played(match_no);


--
-- Name: match_details match_details_player_gk_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.match_details
    ADD CONSTRAINT match_details_player_gk_fkey FOREIGN KEY (player_gk) REFERENCES public.player(player_id);


--
-- Name: match_details match_details_team_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.match_details
    ADD CONSTRAINT match_details_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.team(team_id);


--
-- Name: match_played match_played_player_of_match_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.match_played
    ADD CONSTRAINT match_played_player_of_match_fkey FOREIGN KEY (player_of_match) REFERENCES public.player(player_id);


--
-- Name: match_played match_played_team_id1_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.match_played
    ADD CONSTRAINT match_played_team_id1_fkey FOREIGN KEY (team_id1) REFERENCES public.team(team_id);


--
-- Name: match_played match_played_team_id2_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.match_played
    ADD CONSTRAINT match_played_team_id2_fkey FOREIGN KEY (team_id2) REFERENCES public.team(team_id);


--
-- Name: match_played match_played_venue_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.match_played
    ADD CONSTRAINT match_played_venue_id_fkey FOREIGN KEY (venue_id) REFERENCES public.venue(venue_id);


--
-- Name: match_support match_support_match_no_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.match_support
    ADD CONSTRAINT match_support_match_no_fkey FOREIGN KEY (match_no) REFERENCES public.match_played(match_no);


--
-- Name: match_support match_support_support_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.match_support
    ADD CONSTRAINT match_support_support_id_fkey FOREIGN KEY (support_id) REFERENCES public.person(kfupm_id);


--
-- Name: penalty_gk penalty_gk_match_no_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.penalty_gk
    ADD CONSTRAINT penalty_gk_match_no_fkey FOREIGN KEY (match_no) REFERENCES public.match_played(match_no);


--
-- Name: penalty_gk penalty_gk_player_gk_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.penalty_gk
    ADD CONSTRAINT penalty_gk_player_gk_fkey FOREIGN KEY (player_gk) REFERENCES public.player(player_id);


--
-- Name: penalty_gk penalty_gk_team_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.penalty_gk
    ADD CONSTRAINT penalty_gk_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.team(team_id);


--
-- Name: penalty_shootout penalty_shootout_match_no_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.penalty_shootout
    ADD CONSTRAINT penalty_shootout_match_no_fkey FOREIGN KEY (match_no) REFERENCES public.match_played(match_no);


--
-- Name: penalty_shootout penalty_shootout_player_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.penalty_shootout
    ADD CONSTRAINT penalty_shootout_player_id_fkey FOREIGN KEY (player_id) REFERENCES public.player(player_id);


--
-- Name: penalty_shootout penalty_shootout_team_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.penalty_shootout
    ADD CONSTRAINT penalty_shootout_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.team(team_id);


--
-- Name: player_booked player_booked_match_no_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.player_booked
    ADD CONSTRAINT player_booked_match_no_fkey FOREIGN KEY (match_no) REFERENCES public.match_played(match_no);


--
-- Name: player_booked player_booked_player_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.player_booked
    ADD CONSTRAINT player_booked_player_id_fkey FOREIGN KEY (player_id) REFERENCES public.player(player_id);


--
-- Name: player_booked player_booked_team_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.player_booked
    ADD CONSTRAINT player_booked_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.team(team_id);


--
-- Name: player_in_out player_in_out_match_no_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.player_in_out
    ADD CONSTRAINT player_in_out_match_no_fkey FOREIGN KEY (match_no) REFERENCES public.match_played(match_no);


--
-- Name: player_in_out player_in_out_player_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.player_in_out
    ADD CONSTRAINT player_in_out_player_id_fkey FOREIGN KEY (player_id) REFERENCES public.player(player_id);


--
-- Name: player_in_out player_in_out_team_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.player_in_out
    ADD CONSTRAINT player_in_out_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.team(team_id);


--
-- Name: player player_player_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_player_id_fkey FOREIGN KEY (player_id) REFERENCES public.person(kfupm_id);


--
-- Name: player player_position_to_play_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_position_to_play_fkey FOREIGN KEY (position_to_play) REFERENCES public.playing_position(position_id);


--
-- Name: team_player team_player_player_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.team_player
    ADD CONSTRAINT team_player_player_id_fkey FOREIGN KEY (player_id) REFERENCES public.player(player_id);


--
-- Name: team_player team_player_team_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.team_player
    ADD CONSTRAINT team_player_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.team(team_id);


--
-- Name: team_player team_player_tr_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.team_player
    ADD CONSTRAINT team_player_tr_id_fkey FOREIGN KEY (tr_id) REFERENCES public.tournament(tr_id) ON DELETE CASCADE;


--
-- Name: team_support team_support_support_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.team_support
    ADD CONSTRAINT team_support_support_id_fkey FOREIGN KEY (support_id) REFERENCES public.person(kfupm_id);


--
-- Name: team_support team_support_support_type_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.team_support
    ADD CONSTRAINT team_support_support_type_fkey FOREIGN KEY (support_type) REFERENCES public.support(support_type);


--
-- Name: team_support team_support_team_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.team_support
    ADD CONSTRAINT team_support_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.team(team_id);


--
-- Name: team_support team_support_tr_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.team_support
    ADD CONSTRAINT team_support_tr_id_fkey FOREIGN KEY (tr_id) REFERENCES public.tournament(tr_id) ON DELETE CASCADE;


--
-- Name: tournament_team tournament_team_team_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tournament_team
    ADD CONSTRAINT tournament_team_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.team(team_id);


--
-- Name: tournament_team tournament_team_tr_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tournament_team
    ADD CONSTRAINT tournament_team_tr_id_fkey FOREIGN KEY (tr_id) REFERENCES public.tournament(tr_id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

