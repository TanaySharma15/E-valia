import JobForm from "./JobForm";

export default function JobDescription() {
  return (
    <div className="flex w-[100vw] justify-center items-center flex-col gap-6 p-24">
      <h1 className="font-bold  text-4xl">Job </h1>
      <div className="w-[50%]">
        {" "}
        <JobForm />
      </div>
    </div>
  );
}
