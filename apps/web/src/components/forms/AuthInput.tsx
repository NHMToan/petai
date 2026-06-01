import { Icon } from "../ui/Icon";

export function AuthInput({
  label,
  icon,
  type = "text",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  icon: string;
}) {
  return (
    <label className="block">
      <span className="mono-label mb-2 ml-1 block text-on-surface-variant">{label}</span>
      <div className="relative">
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" name={icon} />
        <input {...props} className={`field pl-12 ${props.className ?? ""}`} />
      </div>
    </label>
  );
}
