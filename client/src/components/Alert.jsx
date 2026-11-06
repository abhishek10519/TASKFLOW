export default function Alert({ msg, onClose }) {
  if (!msg) return null;
  return <div className={`alert ${msg.type}`} role="alert">{msg.text}<button onClick={onClose} aria-label="Dismiss">×</button></div>;
}
