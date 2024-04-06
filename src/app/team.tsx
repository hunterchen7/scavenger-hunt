import axios from "axios";
import React, { useEffect, useState } from "react";

const axiosTeams = axios.create({
    baseURL: "https://hw11-scavenger-hunt.hasura.app/api/rest/teams",
    headers: {
        "content-type": "application/json",
        "x-hasura-admin-secret": process.env.NEXT_PUBLIC_HASURA_ADMIN_SECRET
    }
});

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

    useEffect(() => {
        getTeams().then((data) => {
            console.log("teams before sorting: ", data);
  
            // Sort the teams by points in descending order
            const sortedTeams = data.teams.sort((a: any, b: any) => b.score - a.score);
            
            console.log("teams after sorting: ", sortedTeams);
            setTeams(sortedTeams);
            setLoading(false);
        });
    }, []);

    return (
        <div>
            {loading ? <div>Loading...</div> : (
            <ul>
                <li>1. 🥇 Team {teams[0].name} | {teams[0].score} points</li>
                <li>2. 🥈 Team {teams[1].name} | {teams[1].score} points</li>
                <li>3. 🥉 Team {teams[2].name} | {teams[2].score} points</li>
                <li>4. 🎖️ Team {teams[3].name} | {teams[3].score} points</li>
            </ul>)}
        </div>
    );
};

export default Team;