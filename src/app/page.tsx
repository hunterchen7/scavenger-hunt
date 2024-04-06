import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="relative flex place-items-center bg-goose-spin bg-repeat bg-contain z-[-1] h-20 text-black">
        Welcome to the HackWestern 11 Kickoff Scavenger Hunt! 🎉
      </div>
      <div>
        Leaderboard
        <ul>
          <li>1. 🥇</li>
          <li>2. 🥈</li>
          <li>3. 🥉</li>
          <li>4. 🏅</li> 
        </ul>     
       </div>
      <div>
        Scavenger Hunt
      </div>
    </main>
  );
}
