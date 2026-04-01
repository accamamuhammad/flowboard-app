import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#ede8e0",
        backgroundImage:
          "repeating-linear-gradient(transparent,transparent 27px,rgba(26,23,20,0.08) 27px,rgba(26,23,20,0.08) 28px)",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "'Lora', serif", fontSize: 28, fontWeight: 600, color: "#1a1714", letterSpacing: "-0.5px" }}>
            Flowboard
          </div>
          <div style={{ fontSize: 13, color: "#9c9188", marginTop: 4 }}>
            Create your workspace
          </div>
        </div>

        <SignUp
          appearance={{
            layout: {
              logoPlacement: "none",
            },
            elements: {
              rootBox: {
                boxShadow: "0 4px 32px rgba(26,23,20,0.12)",
                borderRadius: 18,
                overflow: "hidden",
              },
              card: {
                background: "white",
                borderRadius: 18,
                boxShadow: "none",
                border: "1px solid rgba(26,23,20,0.08)",
              },
              headerTitle: {
                fontFamily: "'Lora', serif",
                fontSize: 20,
                color: "#1a1714",
              },
              headerSubtitle: {
                color: "#9c9188",
                fontSize: 13,
              },
              formButtonPrimary: {
                background: "#1a1714",
                borderRadius: 9,
                fontSize: 13.5,
                fontWeight: 600,
              },
              formFieldInput: {
                borderRadius: 9,
                border: "1.5px solid rgba(26,23,20,0.10)",
                background: "#f7f3ee",
                fontSize: 14,
                color: "#1a1714",
              },
              formFieldLabel: {
                fontSize: 12,
                fontWeight: 600,
                color: "#5a5148",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              },
              footerActionLink: {
                color: "#c8862a",
                fontWeight: 600,
              },
              dividerLine: {
                background: "rgba(26,23,20,0.08)",
              },
              dividerText: {
                color: "#9c9188",
                fontSize: 12,
              },
            },
          }}
        />
      </div>
    </div>
  );
}