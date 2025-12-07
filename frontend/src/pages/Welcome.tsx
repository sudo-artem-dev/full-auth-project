import { useAuth } from "../context/AuthContext";

export default function Welcome() {
  const { user } = useAuth();

//   console.log("USER =", user);

  return (
    <div>
      <h1 className="text-black">Bienvenue {user?.firstName}</h1>
    </div>
  );
}
