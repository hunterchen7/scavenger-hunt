import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-full sm:before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full sm:after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]">
        Welcome to the HackWestern 11 Kickoff Scavenger Hunt! 🎉
        <Image
          className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
          src="/tenor.gif"
          alt="goose"
          width={180}
          height={37}
          priority
        />
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
