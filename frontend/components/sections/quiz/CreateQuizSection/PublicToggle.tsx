import { Label } from '@/components/ui/Label';
import { Switch } from '@/components/ui/Switch';
import { useContent } from '@/contexts/LocaleContext';

interface PublicToggleProps {
  isPublic: boolean;
  onToggle: (value: boolean) => void;
}

export function PublicToggle({ isPublic, onToggle }: PublicToggleProps) {
  const { CREATE_QUIZ_TEXT } = useContent();

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-300/30 rounded-lg">
      <div className="flex-1">
        <Label htmlFor="isPublic" className="text-base font-medium">
          {CREATE_QUIZ_TEXT.publicToggle.label}
        </Label>
        <p className="text-sm text-gray-500 mt-1">
          {isPublic
            ? CREATE_QUIZ_TEXT.publicToggle.public
            : CREATE_QUIZ_TEXT.publicToggle.private}
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
