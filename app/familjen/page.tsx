import MemberCard from "../components/MemberCard";

export const dynamic = "force-dynamic";

export default function FamiljenPage() {
  return (
    <div className="p-6 space-y-6 min-h-screen">
      <header>
        <h1 className="text-3xl font-bold text-white tracking-tight">
          👨‍👩‍👧‍👦{" "}
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Familjen
          </span>
        </h1>
        <p className="text-slate-400 mt-1">
          Familjemedlemmar och deras ansvarsområden.
        </p>
      </header>

      <MemberCard />
    </div>
  );
}
