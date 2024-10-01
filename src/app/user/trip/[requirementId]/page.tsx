"use client";
import { getRequirementById } from "@/api/requirement";
import { useEffect, useState } from "react";
import Requirement from "@/interface/requirement";

export default function Trip({
  params,
}: {
  params: { requirementId: string };
}) {
  const [requirement, setRequirement] = useState<Requirement | null>(null);

  useEffect(() => {
    getRequirementById(params.requirementId).then((item) => {
      setRequirement(item);
    });
  }, [params.requirementId]);

  console.log(requirement?.arrival_location);
  console.log(requirement?.requirementMember[0].member_id);

  return (
    <div>
      <p className="text-xl">Trip</p>
      <p className="text-base">Requirement Id: {params.requirementId}</p>
    </div>
  );
}
