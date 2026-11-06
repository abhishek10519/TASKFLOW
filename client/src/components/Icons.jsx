const make = (paths) => ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths}</svg>
);
export const GridIcon = make(<><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>);
export const FolderIcon = make(<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />);
export const ListIcon = make(<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />);
export const ClockIcon = make(<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>);
export const CheckIcon = make(<><circle cx="12" cy="12" r="9" /><path d="m8 12 3 3 5-6" /></>);
export const AlertIcon = make(<><path d="M12 3 2 20h20z" /><path d="M12 10v4M12 17h.01" /></>);
export const MoonIcon = make(<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" />);
export const SunIcon = make(<><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M5 19l1.5-1.5M17.5 6.5 19 5" /></>);
export const LogoutIcon = make(<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />);
export const ArrowIcon = make(<path d="M7 17 17 7M8 7h9v9" />);
export const PlusIcon = make(<path d="M12 5v14M5 12h14" />);
