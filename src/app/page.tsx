"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Items from "./items";
import Team, { getTeams } from "./team";

export default function Home() {
  const validTeamIds = [857, 103, 716, 687];
  const [teamId, setTeamId] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [teams, setTeams] = useState<any[]>([]);

  // check local storage for team id
  useEffect(() => {
    const storedTeamId = localStorage.getItem("teamId");
    if (storedTeamId) {
      setTeamId(storedTeamId);
    }
    getTeams().then((data) => {
      console.log("teams: ", data);
      setTeams(data.teams);
    });
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-5 gap-3">
      <div className="relative flex place-items-center bg-goose-spin bg-repeat bg-contain z-[-1] h-20 text-black py-10 px-5">
        Welcome to the HackWestern 11 Kickoff Scavenger Hunt! 🎉
      </div>
      <div>
        Leaderboard
        <Team />
       </div>
      <div>
        {teamId ? 
          <div>
            Team ID: {teamId}
            <button className="bg-white text-black rounded px-2.5 hover:bg-gray-200 ease-in-out duration-100 ml-2.5" onClick={() => {
              setTeamId("");
              localStorage.removeItem("teamId");
            }}>Change Team</button>
          </div> 
          :
          <div>Enter your team ID: 
            <input onChange={handleInputChange} className="text-black ml-2 max-w-[25%]">
            </input>
            <button className="bg-white text-black rounded px-2.5 hover:bg-gray-200 ease-in-out duration-100 ml-2.5" onClick={() => 
                {
                  setTeamId(inputValue);
                  localStorage.setItem("teamId", inputValue);
                }
              }>Submit</button>
          </div>
        }
      </div>
      {
        validTeamIds.includes(parseInt(teamId)) ?
        <div>
          <div>
            {teams.length > 0 ?
                teams.filter((team) => team.id == teamId).map((team) => (
                  <div key={team.id}>
                    Team {team.name} | {team.members.map((member: any) => member).join(", ")} | {team.score} points
                  </div>
                )) : <div>Loading...</div>
            }
          </div>
          <br/>
          Items:
          <Items teamId={teamId} />
        </div> : <div>Invalid Team ID</div>
      }
    </main>
  );
}
