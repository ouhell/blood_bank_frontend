import { Input } from "@/components/ui/input";

const AddAccount = () => {
  return (
    <div className="page flex h-full justify-center items-start pt-8">
      <div className="p-8 rounded-sm border w-[40rem]">
        <div className="flex justify-between p-2 gap-8">
          <Input placeholder="email" />
          <Input placeholder="full name" />
        </div>
        <div className="flex justify-between p-2 gap-8">
          <Input placeholder="password" type="password" />
          <Input placeholder="phoneNumber" />
        </div>
        <div className="flex justify-between p-2 gap-8">
          <Input placeholder="hospitalId" type="number" />
          {/* <Input placeholder="" /> */}
        </div>
      </div>
    </div>
  );
};

export default AddAccount;
