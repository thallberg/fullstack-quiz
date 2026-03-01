"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { MessageBox } from "@/components/ui/messageBox";
import { useContent } from "@/contexts/LocaleContext";
import { useProfileForm } from "./hooks/useProfileForm";

export function ProfileSection() {
  const { PROFILE_TEXT } = useContent();
  const {
    form,
    updateField,
    isEditing,
    isSubmitting,
    error,
    success,
    startEdit,
    save,
    cancel,
    logoutUser,
  } = useProfileForm();

  const fields = [
    {
      id: "username",
      label: PROFILE_TEXT.fields.username,
      value: form.username,
      type: "text",
    },
    {
      id: "email",
      label: PROFILE_TEXT.fields.email,
      value: form.email,
      type: "email",
    },
  ] as const;

  return (
    <div>
      <MessageBox message={success} variant="success" />
      <MessageBox message={error} variant="error" />

      <div className="space-y-6">
        {fields.map((field) => (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} required>
              {field.label}
            </Label>

            <Input
              id={field.id}
              type={field.type}
              value={field.value}
              onChange={(e) =>
                updateField(field.id, e.target.value)
              }
              disabled={!isEditing}
            />
          </div>
        ))}

        <div className="space-y-4 pt-4">
          {isEditing ? (
            <div className="flex gap-4">
              <Button
                onClick={save}
                isLoading={isSubmitting}
              >
                {PROFILE_TEXT.buttons.save}
              </Button>

              <Button
                variant="secondary"
                onClick={cancel}
              >
                {PROFILE_TEXT.buttons.cancel}
              </Button>
            </div>
          ) : (
            <Button onClick={startEdit}>
              {PROFILE_TEXT.buttons.edit}
            </Button>
          )}

          <Button
            variant="danger"
            onClick={logoutUser}
            className="w-full"
          >
            {PROFILE_TEXT.buttons.logout}
          </Button>
        </div>
      </div>
    </div>
  );
}