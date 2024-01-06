import React, { useEffect } from "react";

import { useSearchParams } from "react-router-dom";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { parse as parseStringToObject } from "qs";
import { DataTable } from "@/components/DataTable";
import { columns, setDonorDonationsActions } from "./DonorDonationsColumns";

import NumberedPagination from "@/components/NumberedPagination";
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
  ValidateAppointmentRequest,
  fetchDoctorPagedAppointments,
  putValidateAppointment,
} from "@/api/apiCalls/doctor";
import {
  fetchDonorCoursingAppointment,
  fetchDonorCoursingDonation,
  fetchDonorPagedDonations,
  postDonation,
  putDonorRejectDonation,
} from "@/api/apiCalls/donor";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { parseStatus } from "@/utils/typeConverting";

function AppointmentsList() {
  const [quantity, setQuantity] = React.useState(1);
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const serializedSearchParams = React.useMemo<string>(() => {
    return searchParams.toString();
  }, [searchParams]);
  const searchParamsRecord = React.useMemo(() => {
    return parseStringToObject(serializedSearchParams);
  }, [serializedSearchParams]);

  const queryClient = useQueryClient();
  const { data: coursingDonation } = useQuery({
    queryKey: ["donor", "donations", "coursing"],
    queryFn: () => {
      return fetchDonorCoursingDonation();
    },
    select: (res) => {
      //   console.log("response", res);
      return res.data;
    },
  });

  const { data: coursingAppointment } = useQuery({
    queryKey: ["donor", "donations", "appointment"],
    queryFn: () => {
      return fetchDonorCoursingAppointment();
    },
    select: (res) => {
      //   console.log("response", res);
      return res.data;
    },
  });
  const { data: donationPage, isFetching: isDonationsFetching } = useQuery({
    queryKey: ["donor", "donations", "params:" + serializedSearchParams],

    queryFn: async () => {
      return fetchDonorPagedDonations({
        params: searchParamsRecord,
      });
    },
    select: (res) => res.data,
    // placeholderData: (data) => data,
  });

  const { mutateAsync: rejectDonation } = useMutation({
    mutationFn: (donationId: number | string) => {
      return putDonorRejectDonation(donationId);
    },
  });

  const { mutateAsync: addDonation } = useMutation({
    mutationFn: (quantity: number) => {
      return postDonation(quantity);
    },
  });

  const currentPage = searchParams.get("page")
    ? Number.parseInt(searchParams.get("page") as string)
    : 1;

  const addSearchParamValues = (set: Record<string, string>) => {
    const newUrlSearchParams = new URLSearchParams();
    searchParams.forEach((key, val) => {
      newUrlSearchParams.set(val, key);
    });
    for (const key in set) {
      newUrlSearchParams.delete(key);
      if (set[key]?.trim()) newUrlSearchParams.set(key, set[key]);
    }

    setSearchParams(newUrlSearchParams);
  };

  const setPageSearchParam = (page: number) => {
    addSearchParamValues({
      page: page + "",
    });
  };

  setDonorDonationsActions({
    onReject: async (data) => {
      const result = await rejectDonation(data.id).catch((e: AxiosError) => e);
      if (result instanceof AxiosError) {
        console.log("donor reject error :", result);
        toast.error("Failed To Reject Donation");
      } else {
        toast.success("Successfully  Rejected Donation");
        queryClient.invalidateQueries({
          queryKey: ["donor", "donations"],
        });
      }
    },
  });

  useEffect(() => {
    console.log("coursingDonation:", coursingDonation);
  }, [coursingDonation]);

  const thereIsCoursingDonation = coursingDonation !== "";
  const thereIsCoursingAppointment = coursingAppointment !== "";

  return (
    <div className="page">
      {coursingAppointment && (
        <div className="p-4 bg-yellow-200 mb-2 flex justify-between items-center rounded-sm">
          <div>
            there is a {parseStatus(coursingAppointment.reason)} appointment at{" "}
            {coursingAppointment.date} in{" "}
            <span className="capitalize">
              {coursingAppointment.doctorData?.hospital?.name} -{" "}
              {coursingAppointment.doctorData?.hospital?.district.name}
            </span>
          </div>
          {coursingAppointment.doctorData?.hospital?.mapHash && (
            <div>
              <a
                href={coursingAppointment.doctorData?.hospital?.mapHash}
                target="_blank"
              >
                <Button>Go to</Button>
              </a>
            </div>
          )}
        </div>
      )}
      <div className="flex justify-between items-centerd">
        <h3 className="text-2xl">Donations </h3>
        <div className="flex gap-4">
          <Dialog
            open={isOpen}
            onOpenChange={(open) => {
              setIsOpen(open);
            }}
          >
            <DialogTrigger asChild disabled={thereIsCoursingDonation}>
              <Button
                variant={"outline"}
                size={"icon"}
                disabled={thereIsCoursingDonation}
                onClick={() => setIsOpen(true)}
              >
                <Plus size={20} />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add Donation</DialogTitle>
                <DialogDescription>
                  please assign the amount of blood you wish to donate
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="flex gap-8 items-center">
                  <Input
                    id="name"
                    placeholder="quantity"
                    className=""
                    type="number"
                    value={quantity}
                    onChange={(e) => {
                      const numeric = Number.parseInt(e.target.value) || 1;
                      setQuantity(Math.max(1, Math.min(8, numeric)));
                    }}
                  />
                  <div className="col-span-3 whitespace-nowrap">
                    {quantity * 0.25} Litre
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  onClick={async () => {
                    const result = await addDonation(quantity).catch(
                      (e: AxiosError) => e
                    );
                    if (result instanceof AxiosError) {
                      console.log("add donation error : ", result);
                      toast.error("Failed To Add Donation");
                    } else {
                      toast.success("Successfully Added Donation");
                      queryClient.invalidateQueries({
                        queryKey: ["donor", "donations"],
                      });
                      setIsOpen(false);
                    }
                  }}
                >
                  Save changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="divider w-full h-[0.1rem] bg-muted mb-4 mt-2 font-semibold"></div>
      <div className="flex justify-between mb-4">
        <Select
          value={(searchParamsRecord.status as string) ?? ""}
          onValueChange={(value) => {
            addSearchParamValues({ status: value });
          }}
        >
          <SelectTrigger className="w-[15rem]">
            <SelectValue placeholder="Select a Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value=" ">Any</SelectItem>
              <SelectItem value="AWAITING_CONSULTATION">
                Awaiting Consultation
              </SelectItem>
              <SelectItem value="AWAITING_EXTRACTION">
                Awaiting Extraction
              </SelectItem>
              <SelectItem value="PENDING_CONSULTATION">
                Pending Consultation
              </SelectItem>
              <SelectItem value="PENDING_EXTRACTION">
                Pending Extraction
              </SelectItem>
              <SelectItem value="ACCEPTED">Accepted</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <DataTable
        data={donationPage?.content || []}
        columns={columns}
        isFetching={isDonationsFetching}
      />
      <div className="py-4">
        <NumberedPagination
          currentPageNumber={currentPage}
          totalPages={donationPage?.totalPages ?? 1}
          onClickPage={setPageSearchParam}
          onClickLastPage={() => {
            setPageSearchParam(donationPage ? donationPage.totalElements : 1);
          }}
          onClickFirstPage={() => {
            setPageSearchParam(1);
          }}
          onClickNext={setPageSearchParam}
          onClickPrevious={setPageSearchParam}
        />
      </div>
    </div>
  );
}

export default AppointmentsList;
