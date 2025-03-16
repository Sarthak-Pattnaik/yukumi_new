import { deleteCookie } from "cookies-next"; 
import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

const LogoutButton = () => {
    const auth = getAuth();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await signOut(auth); // Firebase sign-out
            deleteCookie("firebase-auth-token"); // Remove auth cookie

            console.log("User logged out, cookie removed!");

            router.push("/dashboard"); // Redirect to dashboard
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    return (
        <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded">
            Logout
        </button>
    );
};

export default LogoutButton;
