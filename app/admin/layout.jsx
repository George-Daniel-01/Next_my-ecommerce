export const metadata = { title: "Admin Panel" };

export default function AdminLayout({ children }) {
  return (
    <div style={{
      fontFamily: "'Ubuntu', sans-serif",
      background: "#f3f3f6",
      minHeight: "100vh",
      color: "#344767",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;700&display=swap" rel="stylesheet" />
      {children}
    </div>
  );
}