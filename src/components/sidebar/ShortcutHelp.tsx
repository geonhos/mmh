interface ShortcutHelpProps {
  open: boolean;
  onClose: () => void;
}

const shortcuts = [
  { keys: 'Ctrl+Z', desc: '실행취소 (Undo)' },
  { keys: 'Ctrl+Shift+Z / Ctrl+Y', desc: '다시실행 (Redo)' },
  { keys: 'Ctrl+D', desc: '가구 복제' },
  { keys: 'R', desc: '오른쪽 90° 회전' },
  { keys: 'Shift+R', desc: '왼쪽 90° 회전' },
  { keys: 'Delete / Backspace', desc: '선택한 가구 삭제' },
  { keys: 'Escape', desc: '선택 해제' },
  { keys: '?', desc: '단축키 도움말' },
];

export default function ShortcutHelp({ open, onClose }: ShortcutHelpProps) {
  if (!open) return null;

  return (
    <>
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 2000,
      }} />
      <div style={{
        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        background: '#1a1a2e', border: '1px solid #444', borderRadius: 12,
        padding: 24, zIndex: 2001, minWidth: 320, maxWidth: '90vw',
        color: '#e0e0e0',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <h3 style={{ fontSize: 16, margin: 0 }}>키보드 단축키</h3>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', color: '#888', fontSize: 18, cursor: 'pointer',
          }}>✕</button>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            {shortcuts.map(({ keys, desc }) => (
              <tr key={keys}>
                <td style={{ padding: '6px 12px 6px 0', fontSize: 13 }}>
                  <kbd style={{
                    background: '#333', padding: '2px 8px', borderRadius: 4,
                    border: '1px solid #555', fontSize: 12, fontFamily: 'monospace',
                  }}>{keys}</kbd>
                </td>
                <td style={{ padding: '6px 0', fontSize: 13, color: '#bbb' }}>{desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
