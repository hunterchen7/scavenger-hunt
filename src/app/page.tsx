"use client";

import create from "./axiosInstance";
import { useEffect, useState } from "react";
import Items from "./items";
import Team, { getTeams } from "./team";

const axiosUpdateName = create("update-name-by-pk");

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

  useEffect(() => {
    setTeamName(teams.filter((team) => team.id == teamId).map((team) => team.name)[0] || "");
    setIsUpdatingTeamName(false);

    const intervalId = setInterval(() => {
      getTeams().then((data) => {
        console.log("refetched teams: ", data);
        setTeams(data.teams);
      });
    }, 5000);

    return () => clearInterval(intervalId);
  }, [teams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <main className="flex min-h-screen flex-col items-center px-3 pb-5 gap-3">
      <div className="relative flex place-items-center bg-goose-spin bg-repeat bg-contain z-[-1] min-h-20 text-purple-700 font-black py-10 px-5 text-xl">
        Welcome to the HackWestern 11 Kickoff Scavenger Hunt! 🎉
      </div>
      <ul className="list-disc mx-3">
        Rules:
        <li>Find items on the list, take and upload a picture to get points for it, each item is worth a certain number of points</li>
        <li>Only 1 image can be submitted per item, and once an image is submitted, it cannot be deleted. &#40;but if you must, message me on Slack&#41;</li>
        <li>A street name refers to their lower case individual name, e.g. the name of &#34;Gainsborough Rd&#34; refers to &#34;gainsborough&#34;</li>
        <li>Take a picture of the street sign as proof you found the street </li>
        <li>A helpful tool: <a className="text-blue-500 hover:text-blue-700" href="https://opendsa-server.cs.vt.edu/embed/StringSimple" target="_blank" rel="noreferrer noopener">ASCII sum calculator</a></li>
      </ul>
      <Team />
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
                  !updatingTeamName ? 
                    <div key={team.id} className="text-center space-y-2">
                      <div>Team {team.name} | {team.score} points</div>
                      <div>Members: {team.members.map((member: string) => member).join(", ")}</div>
                      <button
                        className="bg-white text-black rounded px-2.5 hover:bg-gray-200 ease-in-out duration-100 ml-2.5"
                        onClick={() => setUpdatingTeamName(true)}
                      >Edit Team Name</button>
                    </div>
                    : 
                    <div key={team.id} className="text-center">
                      <input className="text-black pl-1" onChange={(e) => setTeamName(e.target.value)} placeholder="new team name" />
                      <button className="bg-white text-black rounded px-2.5 hover:bg-gray-200 ease-in-out duration-100 ml-2.5" onClick={() => {
                        setUpdatingTeamName(false);
                      }}>Cancel</button>
                      <button className="bg-white text-black rounded px-2.5 hover:bg-gray-200 ease-in-out duration-100 ml-2.5" onClick={() => {
                        setIsUpdatingTeamName(true);
                        setUpdatingTeamName(false);
                        axiosUpdateName.post(`/${teamId}`, {object: {
                          name: teamName
                        }}).then(() => {
                          getTeams().then((data) => {
                            console.log("teams after updating name: ", data);
                            setTeams(data.teams);
                          });
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
