import {
  LoginData,
  LoginResp,
  fetchAllProvinces,
  postLogin,
  postSignUp,
} from "@/api/apiCalls/user";
import { useApiCenter } from "@/api/apiCenter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Account,
  AccountProfile,
  BloodGroup,
  Province,
  UserRole,
} from "@/types/databaseModel";
import { bloodGroupParseMap } from "@/utils/typeConverting";

import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();

  const [apiCenter, setApiCenter] = useApiCenter();

  const [email, setEmail] = React.useState("");

  const [password, setPassword] = React.useState("");

  const { mutateAsync: login } = useMutation<LoginResp, AxiosError, LoginData>({
    mutationFn: (data) => postLogin(data).then((res) => res.data),
  });

  const isFormValid = !!password && !!email;

  return (
    <div className="page ">
      <div className="p-12 flex justify-center items-center ">
        <form
          className="border p-8 w-[20rem] flex flex-col gap-8 mt-12 max-w-full rounded-md"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <div className="flex justify-center">
            <h3 className="text-3xl font-bold">Login</h3>
          </div>
          <div className="flex justify-between gap-4">
            <Input
              placeholder="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="flex justify-between gap-4">
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex justify-center">
            <Button
              disabled={!isFormValid}
              onClick={async () => {
                const result = await login({
                  username: email,
                  password: password,
                }).catch((e: AxiosError) => e);
                if (result instanceof AxiosError) {
                  toast.error("Login Failed");
                  console.log("login error : ", result);
                } else {
                  setApiCenter(() => {
                    return result;
                  });
                  navigate("/");
                }
              }}
            >
              SignUp
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
