interface MessageBoxProps {
    message: string;
    variant: 'success' | 'error';
  }
  
  export function MessageBox({ message, variant }: MessageBoxProps) {
    if (!message) return null;
  
    const styles =
      variant === 'success'
        ? 'border-[var(--color-green)]/50 text-[var(--color-green)]'
        : 'border-[var(--color-red)]/50 text-[var(--color-red)]';
  
    return (
      <div className={`mb-4 p-4 bg-gray-50 border rounded-lg ${styles}`}>
        <p className="text-sm font-medium">{message}</p>
      </div>
    );
  }