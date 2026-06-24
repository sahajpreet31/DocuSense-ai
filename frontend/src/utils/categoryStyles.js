export const CATEGORY_STYLES = {
  contract: "bg-indigo-100 text-indigo-700",
  invoice: "bg-emerald-100 text-emerald-700",
  report: "bg-blue-100 text-blue-700",
  resume: "bg-purple-100 text-purple-700",
  job_description: "bg-blue-100 text-blue-700",
  research_paper: "bg-indigo-100 text-indigo-700",
  study_material: "bg-green-100 text-green-700",
  assignment: "bg-yellow-100 text-yellow-700",
  exam_paper: "bg-orange-100 text-orange-700",
  certificate: "bg-purple-100 text-purple-700",
  other: "bg-gray-100 text-gray-600",
};

export const CATEGORY_LABELS = {
  contract: "Contract",
  invoice: "Invoice",
  report: "Report",
  resume: "Resume",
  job_description: "Job Description",
  research_paper: "Research Paper",
  study_material: "Study Material",
  assignment: "Assignment",
  exam_paper: "Exam Paper",
  certificate: "Certificate",
  other: "Other",
};

export function categoryStyle(category) {
  return CATEGORY_STYLES[category] || "bg-gray-100 text-gray-600";
}

export function categoryLabel(category) {
  return CATEGORY_LABELS[category] || category?.replace(/_/g, " ") || "";
}
