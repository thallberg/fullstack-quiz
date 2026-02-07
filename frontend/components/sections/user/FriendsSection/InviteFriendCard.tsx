import type { FormEvent } from 'react';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';

interface InviteFriendCardProps {
  inviteEmail: string;
  onInviteEmailChange: (value: string) => void;
  onSubmit: (event: FormEvent) => void;
  isSendingInvite: boolean;
  error: string;
  success: string;
}

export function InviteFriendCard({
  inviteEmail,
  onInviteEmailChange,
  onSubmit,
  isSendingInvite,
  error,
  success,
}: InviteFriendCardProps) {
  return (
    <Card className="border-[var(--color-purple)]/50 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-[var(--color-purple)] to-[var(--color-pink)] text-white border-[var(--color-purple)] !py-2 !px-3 sm:!py-2.5 sm:!px-4">
        <h3 className="text-xl font-bold">Bjud in vän</h3>
      </CardHeader>
      <CardBody className="p-4 sm:p-6">
        {success && (
          <div className="mb-4 p-4 bg-gray-50 border border-[var(--color-green)]/50 rounded-lg">
            <p className="text-sm font-medium text-[var(--color-green)]">{success}</p>
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-gray-50 border border-[var(--color-red)]/50 rounded-lg">
            <p className="text-sm font-medium text-[var(--color-red)]">{error}</p>
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label htmlFor="invite-email" required className="text-base">
              E-postadress
            </Label>
            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              <Input
                id="invite-email"
                type="email"
                value={inviteEmail}
                onChange={(e) => onInviteEmailChange(e.target.value)}
                placeholder="vän@epost.se"
                required
                className="flex-1 py-2.5 text-base"
              />
              <Button type="submit" isLoading={isSendingInvite} className="w-full sm:w-auto py-2.5">
                Skicka inbjudan
              </Button>
            </div>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}
