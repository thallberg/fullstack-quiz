import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import type { FriendshipResponseDto } from '@/types';

interface PendingInvitesCardProps {
  pendingInvites: FriendshipResponseDto[];
  onAccept: (id: number) => void;
  onDecline: (id: number) => void;
}

export function PendingInvitesCard({
  pendingInvites,
  onAccept,
  onDecline,
}: PendingInvitesCardProps) {
  if (pendingInvites.length === 0) {
    return null;
  }

  return (
    <Card className="border-[var(--color-yellow)]/50 shadow-2xl ring-4 ring-[var(--color-yellow)]/30">
      <CardHeader className="bg-gradient-to-r from-[var(--color-yellow)] to-[var(--color-orange)] text-white border-[var(--color-yellow)] !py-2 !px-3 sm:!py-2.5 sm:!px-4">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 bg-[var(--color-red)] text-white rounded-full text-lg font-bold animate-pulse">
            !
          </span>
          <h3 className="text-xl font-bold">Ny väninbjudan ({pendingInvites.length})</h3>
        </div>
      </CardHeader>
      <CardBody className="p-4 sm:p-6">
        <ul className="space-y-3">
          {pendingInvites.map((invite) => (
            <li key={invite.id} className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 border border-[var(--color-yellow)]/50 rounded-lg bg-gray-50">
              <div className="flex-1">
                <p className="font-medium text-gray-700">{invite.requesterUsername}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onAccept(invite.id)}
                  className="text-sm"
                >
                  Acceptera
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => onDecline(invite.id)}
                  className="text-sm"
                >
                  Avböj
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </CardBody>
    </Card>
  );
}
