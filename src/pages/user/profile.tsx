import React from "react";
import { api } from "../../utils/api";
import { ProfilePage } from "../../components/WrappedPages/ProfilePage";
import { Loader2 } from "lucide-react";

export default function ProfilePageContainer() {
  const {
    data: personalDetails,
    isLoading,
    error,
  } = api.user.getUserAddress.useQuery();

  if (error) {
    return <div>Failed to load product {error.message}</div>;
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 color="white" />
      </div>
    );
  }

  return <ProfilePage personalDetails={personalDetails} />;
}
