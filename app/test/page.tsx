export default function TestEnv() {
  return (
    <div>
      <h1>Environment Test</h1>
      <p>DATABASE_URL exists: {process.env.DATABASE_URL ? "YES" : "NO"}</p>
      <p>DATABASE_URL length: {process.env.DATABASE_URL?.length || 0}</p>
    </div>
  );
}
