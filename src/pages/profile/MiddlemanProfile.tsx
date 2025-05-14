import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { getDocument } from "@/lib/firestore";
import { auth } from "@/lib/firebase";
import { reauthenticateWithCredential, EmailAuthProvider, updatePassword } from "firebase/auth";

const MiddlemanProfile = () => {
  const avatarRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState({ name: "", email: "", expertise: "", phone: "" });
  const [loading, setLoading] = useState(true);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changing, setChanging] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const data = await getDocument<any>("users", user.uid);
        setProfile({
          name: data?.username || "",
          email: user.email || "",
          expertise: data?.expertise || "",
          phone: data?.phone || ""
        });
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      alert("Please fill in all password fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match.");
      return;
    }
    setChanging(true);
    try {
      const credential = EmailAuthProvider.credential(user.email, oldPassword);
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, newPassword);
      alert("Password updated successfully.");
      setOldPassword(""); setNewPassword(""); setConfirmPassword("");
    } catch (err: any) {
      alert(err.message || "Failed to update password.");
    }
    setChanging(false);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-blue-600 hover:underline"
      >
        &larr; Back
      </button>
      <h1 className="text-2xl font-bold mb-6">Middleman Profile</h1>
      <form className="space-y-6 max-w-lg mx-auto bg-white p-8 rounded shadow" onSubmit={handlePasswordChange}>
        <div className="flex flex-col items-center mb-6">
          <img
            src="https://ui-avatars.com/api/?name=Middleman&background=0D8ABC&color=fff"
            alt="Avatar"
            className="w-24 h-24 rounded-full mb-2 object-cover"
            onClick={() => avatarRef.current && avatarRef.current.click()}
            style={{ cursor: 'pointer' }}
          />
          <input
            type="file"
            accept="image/*"
            ref={avatarRef}
            className="hidden"
          />
          <span className="text-sm text-gray-500">Click avatar to change</span>
        </div>
        <div>
          <label className="block mb-2 font-semibold">Name</label>
          <input className="w-full border rounded p-2" type="text" value={profile.name} readOnly />
        </div>
        <div>
          <label className="block mb-2 font-semibold">Email</label>
          <input className="w-full border rounded p-2" type="email" value={profile.email} readOnly />
        </div>
        <div>
          <label className="block mb-2 font-semibold">Expertise</label>
          <input className="w-full border rounded p-2" type="text" value={profile.expertise} readOnly />
        </div>
        <div>
          <label className="block mb-2 font-semibold">Phone</label>
          <input className="w-full border rounded p-2" type="text" value={profile.phone} readOnly />
        </div>
        <hr className="my-6" />
        <div>
          <label className="block mb-2 font-semibold">Change Password</label>
          <div className="flex items-center gap-2 mb-2">
            <input className="w-full border rounded p-2" type="password" placeholder="Old password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} required />
            <button type="button" className="text-blue-600 hover:underline whitespace-nowrap" onClick={() => alert('A code has been sent to your email.')}>Forgot password?</button>
          </div>
          <input className="w-full border rounded p-2 mb-2" type="password" placeholder="New password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
          <input className="w-full border rounded p-2" type="password" placeholder="Confirm new password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={changing}>{changing ? "Updating..." : "Update Password"}</button>
      </form>
    </div>
  );
};

export default MiddlemanProfile; 