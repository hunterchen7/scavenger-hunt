import React, { useEffect, useState } from "react";
import create from "./axiosInstance";

const axiosTeams = create("teams");

export const getTeams = async () => {
    try {
        const response = await axiosTeams.get("/");
        return response.data;
    } catch (error) {
        console.error(error);
    }
};

export const getTeam = async (teamId: string) => {
    try {
        const response = await axiosTeams.get(`/${teamId}`);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

const Team = () => {
    const [teams, setTeams] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const getAndUpdateTeams = () => {
        getTeams().then((data) => {
            // console.log("teams before sorting: ", data);

            // Sort the teams by points in descending order
            const sortedTeams = data.teams.sort((a: any, b: any) => b.score - a.score);
            
            // console.log("teams after sorting: ", sortedTeams);
            setTeams(sortedTeams);
            setLoading(false);
        });
    }

    useEffect(() => {
        getAndUpdateTeams();

        const intervalId = setInterval(() => {
            getAndUpdateTeams();
        }, 5000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="text-center bg-purple-600 px-6 py-1.5 rounded">
            <h3 className="text-xl font-bold">Leaderboard</h3>
            {loading ? <div>Loading...</div> : (
            <ul className="list-decimal text-left">
                <li>🥇 {teams[0].score} points | Team <b>{teams[0].name}</b></li>
                <li>🥈 {teams[1].score} points | Team <b>{teams[1].name}</b></li>
                <li>🥉 {teams[2].score} points | Team <b>{teams[2].name}</b></li>
                <li>🤡 {teams[3].score} points | Team <b>{teams[3].name}</b></li>
            </ul>)}
        </div>
    );
};

export default Team;