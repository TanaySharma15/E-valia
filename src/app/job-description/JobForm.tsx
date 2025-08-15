"use client";
import Dropdown from "@/components/Dropdown";
import TextBox from "@/components/TextBox";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

function JobForm() {
  const [jobTitle, setJobTitle] = useState("");
  const [JobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const handleSubmit = async () => {
    try {
      setLoading(true);
      const supabase = await createClient();
      const { data: authData } = await supabase.auth.getUser();
      const userId = authData.user?.id;
      if (!userId) {
        toast("Login required");
        router.push("/login");
      }
      const { error } = await supabase
        .from("job")
        .insert([
          { user_id: userId, title: jobTitle, description: JobDescription },
        ]);
      if (error) {
        toast("Error!");
        console.log(error);
      }
      toast("Job description added");
      router.push("/interview");
    } catch (error) {
      console.log(error);
      toast("Error occured");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex flex-col justify-center w-full gap-4">
      <h1 className="font-semibold text-center text-2xl">
        Select your desired Job Role
      </h1>
      <div className="w-full flex items-center justify-between gap-4  ">
        <Dropdown jobTitle={jobTitle} setJobTitle={setJobTitle} />
        <TextBox
          jobTitle={jobTitle}
          setJobDescription={setJobDescription}
          JobDescription={JobDescription}
        />
      </div>
      <button
        onClick={handleSubmit}
        className={`border-2 mt-16 px-4 py-2 ${
          loading ? "bg-slate-400" : "bg-blue-200"
        } rounded-2xl hover:bg-blue-300 cursor-pointer`}
      >
        {loading ? "Loading..." : "Continue to interview"}
      </button>
    </div>
  );
}

export default JobForm;
