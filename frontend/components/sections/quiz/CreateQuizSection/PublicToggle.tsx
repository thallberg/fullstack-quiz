import { Label } from '@/components/ui/Label';
import { Switch } from '@/components/ui/Switch';

interface PublicToggleProps {
  isPublic: boolean;
  onToggle: (value: boolean) => void;
}

export function PublicToggle({ isPublic, onToggle }: PublicToggleProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-300/30 rounded-lg">
      <div className="flex-1">
        <Label htmlFor="isPublic" className="text-base font-medium">
          Publikt quiz
        </Label>
        <p className="text-sm text-gray-500 mt-1">
          {isPublic
            ? 'Synligt för alla användare'
            : 'Endast synligt för dig och dina vänner'}
        </p>
      </div>
      <Switch
        id="isPublic"
        checked={isPublic}
        onChange={(e) => onToggle(e.target.checked)}
        label=""
      />
    </div>
  );
}
