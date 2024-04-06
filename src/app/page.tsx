"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import Items from "./items";
import Team, { getTeams } from "./team";

const axiosUpdateName = axios.create({
  baseURL: "https://hw11-scavenger-hunt.hasura.app/api/rest/update-name-by-pk",
  headers: {
    "content-type": "application/json",
    "x-hasura-admin-secret": process.env.NEXT_PUBLIC_HASURA_ADMIN_SECRET,
  },
});

export default function Home() {
  const validTeamIds = [857, 103, 716, 687];
  const [teamId, setTeamId] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [teams, setTeams] = useState<any[]>([]);
  const [updatingTeamName, setUpdatingTeamName] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [isUpdatingTeamName, setIsUpdatingTeamName] = useState(false);

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
                  !updatingTeamName ? <div key={team.id}>
                    Team {team.name} | {team.members.map((member: any) => member).join(", ")} | {team.score} points
                    <button className="bg-white text-black rounded px-2.5 hover:bg-gray-200 ease-in-out duration-100 ml-2.5" onClick={() => setUpdatingTeamName(true)}>Edit Team Name</button>
                    </div>
                    : 
                    <div>
                      <input className="text-black" onChange={(e) => setTeamName(e.target.value)} />
                      <button className="bg-white text-black rounded px-2.5 hover:bg-gray-200 ease-in-out duration-100 ml-2.5" onClick={() => {
                        setUpdatingTeamName(false);
                      }}>Cancel</button>
                      <button className="bg-white text-black rounded px-2.5 hover:bg-gray-200 ease-in-out duration-100 ml-2.5" onClick={() => {
                        setIsUpdatingTeamName(true);
                        axiosUpdateName.post(`/${teamId}`, {object: {
                          name: teamName
                        }}).then(() => {
                          setUpdatingTeamName(false);
                          window.location.reload();
                        });
                      }}>Save</button>
                    </div>
    
                )) : <div>Loading...</div>
            }
          </div>
          <br/>
          Items:
          <Items teamId={teamId} />
        </div> : <div>Invalid Team ID</div>
      }
      {isUpdatingTeamName && 
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 text-white text-2xl backdrop-blur-md">
              Updating... Please wait...
          </div>
      }
    </main>
  );
}
