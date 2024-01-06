import { fetchAccountProfile } from "@/api/apiCalls/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useParams } from "react-router-dom";

const Profile = () => {
  const { userId } = useParams();
  const [formData, setFormData] = React.useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    districtId: "",
  });
  const { data: profile } = useQuery({
    queryKey: ["profile", "userId"],
    queryFn: () => {
      return fetchAccountProfile(userId ?? "");
    },
    select: (res) => res.data,
  });

  return (
    <div className="page">
      <form className="border p-8 w-[50rem] flex flex-col gap-8">
        <div className="flex justify-between gap-8">
          <Input placeholder="name" />
          <Input placeholder="email" />
        </div>
        <div className="flex justify-between gap-8">
          <Input />
          <Input />
        </div>
        <div>
          <Button>Modify Account</Button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
