const paths = {
  stock: <><path d="m3 7 9-4 9 4-9 4-9-4Z"/><path d="M3 7v10l9 4 9-4V7M12 11v10M7 5l10 4"/></>,
  printer: <><path d="M6 8V3h12v5M6 17H3V8h18v9h-3M6 14h12v7H6z"/><path d="M17 11h1"/></>,
  chart: <><path d="M3 3v18h18M7 15v-4M12 15V6M17 15v-7"/></>,
  search: <><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></>,
  plus: <path d="M12 5v14M5 12h14"/>,
  edit: <><path d="m15 4 5 5-11 11H4v-5L15 4Z"/><path d="m12 7 5 5"/></>,
  trash: <><path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7M14 10v7"/></>,
  move: <><path d="M4 7h15l-4-4M20 17H5l4 4M19 7l-4 4M5 17l4-4"/></>,
  logout: <><path d="M9 4H4v16h5M9 12h12l-4-4M21 12l-4 4"/></>,
  arrow: <path d="M4 12h16m-6-6 6 6-6 6"/>,
  close: <path d="m6 6 12 12M6 18 18 6"/>,
  refresh: <><path d="M20 7v5h-5M4 17v-5h5"/><path d="M6 6a8 8 0 0 1 13 3M5 15a8 8 0 0 0 13 3"/></>,
  download: <><path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/></>,
  eye: <><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></>,
  menu: <path d="M4 6h16M4 12h16M4 18h16"/>,
};

export default function Icon({ name, size = 18 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name] || paths.stock}</svg>;
}
