"use client";

import type {
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AssessmentStep } from "@/components/AssessmentStep";
import { ProgressBar } from "@/components/ProgressBar";
import { PrimaryButton } from "@/components/primary-button";
import type {
  AIFamiliarity,
  AssessmentAnswers,
  CareerGoal,
  EntrepreneurshipInterest,
  RiskTolerance,
  SalaryBand,
} from "@/types/assessment";

const TOTAL_STEPS = 4;

const defaultAnswers: AssessmentAnswers = {
  profile: {
    currentRole: "",
    yearsOfExperience: "",
    industry: "",
    location: "",
    salaryBand: "",
  },
  skills: {
    primarySkills: "",
    secondarySkills: "",
    aiFamiliarity: "",
  },
  positioning: {
    careerGoal: "",
    riskTolerance: "",
    entrepreneurshipInterest: "",
  },
  selfEvaluation: {
    marketDifferentiation: 5,
    leadershipVisibility: 5,
    networkStrength: 5,
    technicalRelevance: 5,
  },
};

type AssessmentFormProps = {
  initialAnswers?: AssessmentAnswers;
  mode: "initial" | "recalibrate";
};

function FieldLabel({ htmlFor, children }: { htmlFor: string; children: string }) {
  return (
    <label className="block text-sm font-medium text-slate-200" htmlFor={htmlFor}>
      {children}
    </label>
  );
}

function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  const { className = "", ...rest } = props;
  return (
    <input
      className={`h-11 w-full rounded-lg border border-white/15 bg-slate-950/50 px-3 text-sm text-slate-100 outline-none transition-all duration-200 ease-in-out placeholder:text-slate-500 focus:border-[#8B5CF6]/60 focus:shadow-[0_0_20px_rgba(139,92,246,0.2)] ${className}`}
      {...rest}
    />
  );
}

function SelectInput(props: SelectHTMLAttributes<HTMLSelectElement>) {
  const { className = "", ...rest } = props;
  return (
    <select
      className={`h-11 w-full rounded-lg border border-white/15 bg-slate-950/50 px-3 text-sm text-slate-100 outline-none transition-all duration-200 ease-in-out focus:border-[#8B5CF6]/60 focus:shadow-[0_0_20px_rgba(139,92,246,0.2)] ${className}`}
      {...rest}
    />
  );
}

function TextAreaInput(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { className = "", ...rest } = props;
  return (
    <textarea
      className={`w-full rounded-lg border border-white/15 bg-slate-950/50 px-3 py-2 text-sm text-slate-100 outline-none transition-all duration-200 ease-in-out placeholder:text-slate-500 focus:border-[#8B5CF6]/60 focus:shadow-[0_0_20px_rgba(139,92,246,0.2)] ${className}`}
      rows={4}
      {...rest}
    />
  );
}

function ScoreInput({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <FieldLabel htmlFor={id}>{label}</FieldLabel>
        <span className="text-sm font-medium text-slate-200">{value}/10</span>
      </div>
      <input
        id={id}
        className="w-full accent-[#4F8CFF]"
        max={10}
        min={1}
        onChange={(event) => onChange(Number(event.target.value))}
        step={1}
        type="range"
        value={value}
      />
    </div>
  );
}

function normalizeInitialAnswers(initialAnswers?: AssessmentAnswers): AssessmentAnswers {
  if (!initialAnswers) return defaultAnswers;

  return {
    profile: {
      ...initialAnswers.profile,
      yearsOfExperience:
        initialAnswers.profile.yearsOfExperience === ""
          ? ""
          : Number(initialAnswers.profile.yearsOfExperience),
    },
    skills: { ...initialAnswers.skills },
    positioning: { ...initialAnswers.positioning },
    selfEvaluation: { ...initialAnswers.selfEvaluation },
  };
}

export function AssessmentForm({ initialAnswers, mode }: AssessmentFormProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<AssessmentAnswers>(
    normalizeInitialAnswers(initialAnswers)
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showStepErrors, setShowStepErrors] = useState(false);

  function validateStep(stepToValidate: number): string | null {
    if (stepToValidate === 1) {
      const { currentRole, yearsOfExperience, industry, location, salaryBand } =
        answers.profile;
      if (
        !currentRole.trim() ||
        yearsOfExperience === "" ||
        yearsOfExperience < 0 ||
        !industry.trim() ||
        !location.trim() ||
        !salaryBand
      ) {
        return "Complete all profile fields before continuing.";
      }
    }

    if (stepToValidate === 2) {
      const { primarySkills, secondarySkills, aiFamiliarity } = answers.skills;
      if (!primarySkills.trim() || !secondarySkills.trim() || !aiFamiliarity) {
        return "Complete all skill stack fields before continuing.";
      }
    }

    if (stepToValidate === 3) {
      const { careerGoal, riskTolerance, entrepreneurshipInterest } =
        answers.positioning;
      if (!careerGoal || !riskTolerance || !entrepreneurshipInterest) {
        return "Complete all career positioning fields before continuing.";
      }
    }

    return null;
  }

  function nextStep() {
    const validationError = validateStep(step);
    if (validationError) {
      setErrorMessage(validationError);
      setShowStepErrors(true);
      return;
    }

    setErrorMessage(null);
    setShowStepErrors(false);
    setStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
  }

  function previousStep() {
    setErrorMessage(null);
    setShowStepErrors(false);
    setStep((prev) => Math.max(prev - 1, 1));
  }

  async function submitAssessment() {
    const validationError =
      validateStep(1) ?? validateStep(2) ?? validateStep(3) ?? null;
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setErrorMessage(null);
    setShowStepErrors(false);
    setIsSubmitting(true);

    try {
      const payload = {
        profile: {
          ...answers.profile,
          yearsOfExperience: Number(answers.profile.yearsOfExperience),
        },
        skills: answers.skills,
        positioning: answers.positioning,
        selfEvaluation: answers.selfEvaluation,
      };

      const response = await fetch("/api/recalibrate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ answers: payload }),
      });

      if (!response.ok) {
        const responsePayload = (await response.json()) as {
          error?: string;
        };
        throw new Error(
          responsePayload.error ?? "Unable to process strategic recalibration."
        );
      }

      router.replace("/dashboard");
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to process strategic recalibration."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="w-full space-y-8 rounded-2xl border border-white/10 bg-white/[0.04] p-8 shadow-xl backdrop-blur-sm sm:p-10">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
          Strategic Position Recalibration
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-100">
          {mode === "recalibrate"
            ? "Recalibrate Strategic Position"
            : "Career Positioning Intake"}
        </h1>
        <ProgressBar currentStep={step} totalSteps={TOTAL_STEPS} />
      </header>

      {step === 1 ? (
        <AssessmentStep
          description="Define your baseline professional profile."
          title="Step 1 - Profile"
        >
          <div className="space-y-2">
            <FieldLabel htmlFor="currentRole">Current Role</FieldLabel>
            <TextInput
              className={
                showStepErrors && !answers.profile.currentRole.trim()
                  ? "border-red-400/60"
                  : undefined
              }
              id="currentRole"
              onChange={(event) =>
                setAnswers((prev) => ({
                  ...prev,
                  profile: { ...prev.profile, currentRole: event.target.value },
                }))
              }
              placeholder="Senior Software Engineer"
              type="text"
              value={answers.profile.currentRole}
            />
          </div>
          <div className="space-y-2">
            <FieldLabel htmlFor="yearsOfExperience">Years of Experience</FieldLabel>
            <TextInput
              className={
                showStepErrors &&
                (answers.profile.yearsOfExperience === "" ||
                  answers.profile.yearsOfExperience < 0)
                  ? "border-red-400/60"
                  : undefined
              }
              id="yearsOfExperience"
              min={0}
              onChange={(event) =>
                setAnswers((prev) => ({
                  ...prev,
                  profile: {
                    ...prev.profile,
                    yearsOfExperience:
                      event.target.value === "" ? "" : Number(event.target.value),
                  },
                }))
              }
              placeholder="8"
              type="number"
              value={answers.profile.yearsOfExperience}
            />
          </div>
          <div className="space-y-2">
            <FieldLabel htmlFor="industry">Industry</FieldLabel>
            <TextInput
              className={
                showStepErrors && !answers.profile.industry.trim()
                  ? "border-red-400/60"
                  : undefined
              }
              id="industry"
              onChange={(event) =>
                setAnswers((prev) => ({
                  ...prev,
                  profile: { ...prev.profile, industry: event.target.value },
                }))
              }
              placeholder="SaaS, FinTech, HealthTech"
              type="text"
              value={answers.profile.industry}
            />
          </div>
          <div className="space-y-2">
            <FieldLabel htmlFor="location">Location</FieldLabel>
            <TextInput
              className={
                showStepErrors && !answers.profile.location.trim()
                  ? "border-red-400/60"
                  : undefined
              }
              id="location"
              onChange={(event) =>
                setAnswers((prev) => ({
                  ...prev,
                  profile: { ...prev.profile, location: event.target.value },
                }))
              }
              placeholder="New York, USA"
              type="text"
              value={answers.profile.location}
            />
          </div>
          <div className="space-y-2">
            <FieldLabel htmlFor="salaryBand">Salary Band</FieldLabel>
            <SelectInput
              className={
                showStepErrors && !answers.profile.salaryBand
                  ? "border-red-400/60"
                  : undefined
              }
              id="salaryBand"
              onChange={(event) =>
                setAnswers((prev) => ({
                  ...prev,
                  profile: {
                    ...prev.profile,
                    salaryBand: event.target.value as SalaryBand | "",
                  },
                }))
              }
              value={answers.profile.salaryBand}
            >
              <option value="">Select a band</option>
              <option value="Under $75k">Under $75k</option>
              <option value="$75k-$100k">$75k-$100k</option>
              <option value="$100k-$150k">$100k-$150k</option>
              <option value="$150k-$200k">$150k-$200k</option>
              <option value="$200k+">$200k+</option>
            </SelectInput>
          </div>
        </AssessmentStep>
      ) : null}

      {step === 2 ? (
        <AssessmentStep
          description="Capture your current skill stack and AI readiness."
          title="Step 2 - Skill Stack"
        >
          <div className="space-y-2">
            <FieldLabel htmlFor="primarySkills">Primary Skills</FieldLabel>
            <TextAreaInput
              className={
                showStepErrors && !answers.skills.primarySkills.trim()
                  ? "border-red-400/60"
                  : undefined
              }
              id="primarySkills"
              onChange={(event) =>
                setAnswers((prev) => ({
                  ...prev,
                  skills: { ...prev.skills, primarySkills: event.target.value },
                }))
              }
              placeholder="TypeScript, React, System Design"
              value={answers.skills.primarySkills}
            />
          </div>
          <div className="space-y-2">
            <FieldLabel htmlFor="secondarySkills">Secondary Skills</FieldLabel>
            <TextAreaInput
              className={
                showStepErrors && !answers.skills.secondarySkills.trim()
                  ? "border-red-400/60"
                  : undefined
              }
              id="secondarySkills"
              onChange={(event) =>
                setAnswers((prev) => ({
                  ...prev,
                  skills: { ...prev.skills, secondarySkills: event.target.value },
                }))
              }
              placeholder="SQL, Product Strategy, Public Speaking"
              value={answers.skills.secondarySkills}
            />
          </div>
          <div className="space-y-2">
            <FieldLabel htmlFor="aiFamiliarity">AI Familiarity</FieldLabel>
            <SelectInput
              className={
                showStepErrors && !answers.skills.aiFamiliarity
                  ? "border-red-400/60"
                  : undefined
              }
              id="aiFamiliarity"
              onChange={(event) =>
                setAnswers((prev) => ({
                  ...prev,
                  skills: {
                    ...prev.skills,
                    aiFamiliarity: event.target.value as AIFamiliarity | "",
                  },
                }))
              }
              value={answers.skills.aiFamiliarity}
            >
              <option value="">Select level</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </SelectInput>
          </div>
        </AssessmentStep>
      ) : null}

      {step === 3 ? (
        <AssessmentStep
          description="Define your strategic direction and appetite for change."
          title="Step 3 - Career Positioning"
        >
          <div className="space-y-2">
            <FieldLabel htmlFor="careerGoal">Career Goal</FieldLabel>
            <SelectInput
              className={
                showStepErrors && !answers.positioning.careerGoal
                  ? "border-red-400/60"
                  : undefined
              }
              id="careerGoal"
              onChange={(event) =>
                setAnswers((prev) => ({
                  ...prev,
                  positioning: {
                    ...prev.positioning,
                    careerGoal: event.target.value as CareerGoal | "",
                  },
                }))
              }
              value={answers.positioning.careerGoal}
            >
              <option value="">Select goal</option>
              <option value="Promotion">Promotion</option>
              <option value="Switch Role">Switch Role</option>
              <option value="Build Side Income">Build Side Income</option>
              <option value="Launch Startup">Launch Startup</option>
            </SelectInput>
          </div>
          <div className="space-y-2">
            <FieldLabel htmlFor="riskTolerance">Risk Tolerance</FieldLabel>
            <SelectInput
              className={
                showStepErrors && !answers.positioning.riskTolerance
                  ? "border-red-400/60"
                  : undefined
              }
              id="riskTolerance"
              onChange={(event) =>
                setAnswers((prev) => ({
                  ...prev,
                  positioning: {
                    ...prev.positioning,
                    riskTolerance: event.target.value as RiskTolerance | "",
                  },
                }))
              }
              value={answers.positioning.riskTolerance}
            >
              <option value="">Select tolerance</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </SelectInput>
          </div>
          <div className="space-y-2">
            <FieldLabel htmlFor="entrepreneurshipInterest">
              Interest in Entrepreneurship
            </FieldLabel>
            <SelectInput
              className={
                showStepErrors && !answers.positioning.entrepreneurshipInterest
                  ? "border-red-400/60"
                  : undefined
              }
              id="entrepreneurshipInterest"
              onChange={(event) =>
                setAnswers((prev) => ({
                  ...prev,
                  positioning: {
                    ...prev.positioning,
                    entrepreneurshipInterest:
                      event.target.value as EntrepreneurshipInterest | "",
                  },
                }))
              }
              value={answers.positioning.entrepreneurshipInterest}
            >
              <option value="">Select interest</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </SelectInput>
          </div>
        </AssessmentStep>
      ) : null}

      {step === 4 ? (
        <AssessmentStep
          description="Rate your current strategic positioning from 1 to 10."
          title="Step 4 - Strategic Self-Evaluation"
        >
          <ScoreInput
            id="marketDifferentiation"
            label="Market Differentiation"
            onChange={(value) =>
              setAnswers((prev) => ({
                ...prev,
                selfEvaluation: { ...prev.selfEvaluation, marketDifferentiation: value },
              }))
            }
            value={answers.selfEvaluation.marketDifferentiation}
          />
          <ScoreInput
            id="leadershipVisibility"
            label="Leadership Visibility"
            onChange={(value) =>
              setAnswers((prev) => ({
                ...prev,
                selfEvaluation: { ...prev.selfEvaluation, leadershipVisibility: value },
              }))
            }
            value={answers.selfEvaluation.leadershipVisibility}
          />
          <ScoreInput
            id="networkStrength"
            label="Network Strength"
            onChange={(value) =>
              setAnswers((prev) => ({
                ...prev,
                selfEvaluation: { ...prev.selfEvaluation, networkStrength: value },
              }))
            }
            value={answers.selfEvaluation.networkStrength}
          />
          <ScoreInput
            id="technicalRelevance"
            label="Technical Relevance"
            onChange={(value) =>
              setAnswers((prev) => ({
                ...prev,
                selfEvaluation: { ...prev.selfEvaluation, technicalRelevance: value },
              }))
            }
            value={answers.selfEvaluation.technicalRelevance}
          />
        </AssessmentStep>
      ) : null}

      {errorMessage ? (
        <p className="rounded-lg border border-red-400/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {errorMessage}
        </p>
      ) : null}

      <footer className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <button
          className="inline-flex h-11 items-center justify-center rounded-lg border border-white/15 bg-white/5 px-4 text-sm font-medium text-slate-100 transition-all duration-200 ease-in-out hover:border-[#8B5CF6]/50 hover:shadow-[0_0_24px_rgba(139,92,246,0.25)] disabled:cursor-not-allowed disabled:opacity-50"
          disabled={step === 1 || isSubmitting}
          onClick={previousStep}
          type="button"
        >
          Back
        </button>

        {step < TOTAL_STEPS ? (
          <PrimaryButton
            className="sm:w-auto sm:px-6"
            disabled={validateStep(step) !== null || isSubmitting}
            onClick={nextStep}
            type="button"
          >
            Next
          </PrimaryButton>
        ) : (
          <PrimaryButton
            className="sm:w-auto sm:px-6"
            loading={isSubmitting}
            loadingText="Processing strategic recalibration..."
            onClick={submitAssessment}
            type="button"
          >
            {mode === "recalibrate" ? "Submit Recalibration" : "Submit Assessment"}
          </PrimaryButton>
        )}
      </footer>
    </section>
  );
}
