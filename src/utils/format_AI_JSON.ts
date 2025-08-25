export const formatAIJSON = (response: string) => {
  return response.replace("```json", "").replace("```", "");
};

export const displayJSON = (response: string) => {
  const res = JSON.parse(response);
  const jobSummary = res.jobSummary ?? "";
  const responsibilities = res.Responsibilities
    ? res.Responsibilities.join(", ")
    : "";

  const requirements = res.Requirements ? res.Requirements.join(", ") : "";

  const benefits = res.Benefits ? res.Benefits.join(", ") : "";
  const KeySkills = res.keySkills ? res.keySkills.join(", ") : "";
  return { jobSummary, responsibilities, requirements, benefits, KeySkills };
};
