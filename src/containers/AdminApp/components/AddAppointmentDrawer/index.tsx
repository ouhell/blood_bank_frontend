import * as React from "react";
import { Minus, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { AssignAppointmentRequest } from "@/types/databaseModel";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchAllProvinces } from "@/api/apiCalls/user";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { parse } from "qs";
import {
  getAppointmentSuggestion,
  getPagedAccounts,
  postAppointment,
} from "@/api/apiCalls/admin";
import { toast } from "sonner";
import { AxiosError } from "axios";

export type DrawerInitials = AssignAppointmentRequest & { province?: number };

type Props = {
  children?: React.ReactNode;
  open?: boolean;
  initials?: DrawerInitials;
  title?: string;
};

function AddAppointmentDrawer({ children, open, initials, title }: Props) {
  const [province, setProvince] = React.useState(initials?.province);

  const [request, setRequest] = React.useState<AssignAppointmentRequest>(
    initials ?? {}
  );

  React.useEffect(() => {
    setRequest(initials ?? request);
    setProvince(initials?.province ?? province);
  }, [initials]);

  const { data: provinces } = useQuery({
    queryKey: ["provinces"],
    queryFn: () => {
      return fetchAllProvinces();
    },
    select: (data) => data.data.sort((a, b) => a.number - b.number),
    placeholderData: (data) => data,
  });
  const queryClient = useQueryClient();
  const { data: suggestion, refetch: fetchSuggestion } = useQuery({
    queryKey: [
      "admin",
      "appointment-suggestion",
      initials?.demandId ?? initials?.donationId ?? "none",
    ],
    queryFn: () => {
      return getAppointmentSuggestion({
        type: request.demandId
          ? "DEMAND"
          : request.donationId
          ? "DONATION"
          : "NONE",
        id: request.demandId ?? request.donationId,
      });
    },
    retry: false,
    select: (res) => res.data,

    // placeholderData: (data) => data,
    enabled: false,
  });

  const { mutateAsync: arrangeAssignment } = useMutation({
    mutationFn: (request: AssignAppointmentRequest) => {
      return postAppointment(request).then((res) => res.data);
    },
  });

  const searchParams = React.useMemo(() => {
    const params = new URLSearchParams();
    if (province) {
      params.append("province", province + "");
    }
    params.append("role", "DOCTOR");
    params.append("size", "100");
    return params;
  }, [province]);

  const parsedSearchParams = React.useMemo(() => {
    return parse(searchParams.toString());
  }, [searchParams]);
  const { data: doctors } = useQuery({
    queryKey: ["admin", "accounts", searchParams.toString()],
    queryFn: () =>
      getPagedAccounts({
        params: parsedSearchParams,
      }),
    select: (data) => data.data,
    placeholderData: (data) => data,
  });

  const { date, time } = React.useMemo(() => {
    const currentDate = request.date ? new Date(request.date) : undefined;

    const newDate = currentDate
      ? `${(currentDate.getFullYear() + "").padStart(4, "0")}-${(
          currentDate.getMonth() +
          1 +
          ""
        ).padStart(2, "0")}-${(currentDate.getDate() + "").padStart(2, "0")}`
      : "";

    const newTime = currentDate
      ? `${(currentDate.getHours() + "").padStart(2, "0")}:${(
          currentDate.getMinutes() + ""
        ).padStart(2, "0")}`
      : "";
    return {
      date: newDate,
      time: newTime,
    };
  }, [request.date]);

  return (
    <Drawer open={open}>
      {/* <DrawerTrigger asChild>
        <Button variant="outline">Open Drawer</Button>
      </DrawerTrigger> */}
      {children}
      <DrawerContent>
        <div className="w-full p-8">
          <DrawerHeader>
            <DrawerTitle className="text-2xl text-center ">
              {title ?? "Assign Appointment"}
            </DrawerTitle>
            {/* <DrawerDescription>Set your daily activity goal.</DrawerDescription> */}
          </DrawerHeader>

          <div className=" flex flex-col gap-4 md:px-20 ">
            <div className=" flex flex-col md:flex-row items-center justify-center gap-4 relative">
              <Button
                variant="secondary"
                className=""
                onClick={async () => {
                  const res = await fetchSuggestion();
                  if (res.isError) {
                    console.log("suggestioon error", res.error);
                    toast.error("Failed to load Suggestion");
                  } else {
                    const suggestion = res.data;
                    toast.success("Suggestion Loaded");
                    if (suggestion) {
                      const suggestedDate = new Date(suggestion.date);
                      setProvince(suggestion.doctor.district?.provinceId);

                      const newDate = `${(
                        suggestedDate.getFullYear() + ""
                      ).padStart(4, "0")}-${(
                        suggestedDate.getMonth() +
                        1 +
                        ""
                      ).padStart(2, "0")}-${(
                        suggestedDate.getDate() + ""
                      ).padStart(2, "0")}`;

                      const newTime = `${(
                        suggestedDate.getHours() + ""
                      ).padStart(2, "0")}:${(
                        suggestedDate.getMinutes() + ""
                      ).padStart(2, "0")}`;

                      setRequest((old) => {
                        return {
                          ...old,
                          date: suggestedDate.getTime(),
                          doctorId: suggestion.doctor.id,
                        };
                      });
                    }
                  }
                }}
              >
                get Suggestion
              </Button>
              <Input
                placeholder="doctor id"
                value={request.doctorId}
                onChange={(e) => {
                  setRequest((old) => {
                    return {
                      ...old,
                      doctorId: Number.parseInt(e.target.value) ?? undefined,
                    };
                  });
                }}
                type="number"
                className="max-w-[15rem]"
              />
            </div>
            <div className="flex flex-col md:flex-row items-center gap-4  md:justify-between md:gap-8 w-full">
              <Select
                onValueChange={(value) => {
                  setProvince(Number.parseInt(value) ?? undefined);
                }}
                value={province ? province + "" : ""}
              >
                <SelectTrigger className="w-[15rem]">
                  <SelectValue placeholder="Select a Province" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {provinces?.map((province) => (
                      <SelectItem
                        className="capitalize"
                        value={province.id + ""}
                        key={province.id}
                      >
                        {province.number}. {province.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Select
                onValueChange={(value) => {
                  setRequest((old) => {
                    return {
                      ...old,
                      doctorId: Number.parseInt(value) ?? undefined,
                    };
                  });
                }}
                value={request.doctorId ? request.doctorId + "" : ""}
                disabled={!provinces}
              >
                <SelectTrigger className="w-[15rem]">
                  <SelectValue placeholder="Select a Doctor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {doctors?.content.map((doc) => {
                      return (
                        <SelectItem key={doc.id} value={doc.id + ""}>
                          {doc.fullName}
                        </SelectItem>
                      );
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-between gap-4">
              <Input
                type="time"
                className="max-w-[15rem]"
                value={time}
                onChange={(e) => {
                  const [hours, minutes] = e.target.value.split(":");

                  setRequest((old) => {
                    const oldDate = old.date ? new Date(old.date) : new Date();

                    oldDate.setHours(Number.parseInt(hours));
                    oldDate.setMinutes(Number.parseInt(minutes));
                    oldDate.setSeconds(0);
                    oldDate.setMilliseconds(0);
                    return { ...old, date: oldDate.getTime() };
                  });
                }}
              />
              <Input
                type="date"
                className="max-w-[15rem]"
                value={date}
                onChange={(e) => {
                  const newDate = new Date(e.target.value);

                  setRequest((old) => {
                    const oldDate = old.date ? new Date(old.date) : new Date();

                    oldDate.setFullYear(
                      newDate.getFullYear(),
                      newDate.getMonth(),
                      newDate.getDate()
                    );
                    oldDate.setHours(0);
                    oldDate.setMinutes(0);
                    oldDate.setSeconds(0);
                    oldDate.setMilliseconds(0);

                    return { ...old, date: oldDate.getTime() };
                  });
                }}
              />
            </div>
          </div>
          <DrawerFooter className="px-32 ">
            <div className="flex justify-center gap-4 md:flex-col md:px-40">
              <Button
                disabled={
                  !request.date ||
                  !request.doctorId ||
                  (!request.demandId && !request.donationId)
                }
                onClick={async () => {
                  console.log("request :", request);
                  const result = await arrangeAssignment(request).catch(
                    (e: AxiosError) => e
                  );
                  if (result instanceof AxiosError) {
                    toast.error("Failed to arrange appointment");
                    console.log("appointment error :", result);
                  } else {
                    toast.success("Appointment Successfully Arranged");
                    queryClient.invalidateQueries({
                      queryKey: ["admin", "appointments"],
                    });
                    queryClient.invalidateQueries({
                      queryKey: ["admin", "donations"],
                    });
                    queryClient.invalidateQueries({
                      queryKey: ["admin", "demands"],
                    });
                    setRequest({});
                  }
                }}
              >
                Submit
              </Button>
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </div>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default AddAppointmentDrawer;
