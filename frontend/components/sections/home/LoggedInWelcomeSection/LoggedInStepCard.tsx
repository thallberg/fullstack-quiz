import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { LoggedInStep } from "@/constant/sv/loggedInWelcome";

interface Props {
  step: LoggedInStep;
  index: number;
}

export function LoggedInStepCard({
  step,
  index,
}: Props) {
  return (
    <div
      className={`flex gap-4 p-4 rounded-lg bg-gray-50 border ${step.borderClass}`}
    >
      <div className="shrink-0">
        <div
          className={`w-12 h-12 rounded-full bg-gradient-to-br ${step.gradientClass} text-white flex items-center justify-center font-bold text-lg shadow-md`}
        >
          {index + 1}
        </div>
      </div>

      <div className="flex-1">
        <h3 className="text-xl font-semibold mb-2">
          {step.title}
        </h3>

        <p className="mb-4">{step.description}</p>

        {step.list && (
          <ul className="list-disc list-inside space-y-2 mb-4">
            {step.list.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        )}

        {step.button && (
          <Link href={step.button.href}>
            <Button variant={step.button.variant}>
              {step.button.label}
            </Button>
          </Link>
        )}

        {step.extraButtons && (
          <div className="flex gap-2 flex-wrap mt-3">
            {step.extraButtons.map((btn) => (
              <Link key={btn.label} href={btn.href}>
                <Button
                  variant={btn.variant}
                  size={btn.size}
                >
                  {btn.label}
                </Button>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}