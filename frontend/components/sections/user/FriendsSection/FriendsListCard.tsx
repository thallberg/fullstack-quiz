import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import type { FriendshipResponseDto } from '@/types';

interface FriendsListCardProps {
  friends: FriendshipResponseDto[];
  getFriendDisplayName: (friendship: FriendshipResponseDto) => string;
  onRemove: (id: number, name: string) => void;
}

export function FriendsListCard({
  friends,
  getFriendDisplayName,
  onRemove,
}: FriendsListCardProps) {
  return (
    <Card className="border-[var(--color-green)]/50 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-[var(--color-green)] to-[var(--color-emerald)] text-white border-[var(--color-green)] !py-2 !px-3 sm:!py-2.5 sm:!px-4">
        <h3 className="text-xl font-bold">Mina vänner ({friends.length})</h3>
      </CardHeader>
      <CardBody className="p-4 sm:p-6">
        {friends.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Du har inga vänner ännu. Bjud in någon för att komma igång!</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {friends.map((friendship) => {
              const displayName = getFriendDisplayName(friendship);
              return (
                <li key={friendship.id} className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 border border-[var(--color-green)]/50 rounded-lg bg-gray-50">
                  <div className="flex-1">
                    <p className="font-medium text-gray-700">{displayName}</p>
                    {friendship.acceptedAt && (
                      <Badge variant="default" className="mt-1">
                        Vänner sedan {new Date(friendship.acceptedAt).toLocaleDateString('sv-SE')}
                      </Badge>
                    )}
                  </div>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => onRemove(friendship.id, displayName)}
                    className="text-sm w-full sm:w-auto"
                  >
                    Ta bort vän
                  </Button>
                </li>
              );
            })}
          </ul>
        )}
      </CardBody>
    </Card>
  );
}
