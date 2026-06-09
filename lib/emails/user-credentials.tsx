import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";

export interface UserCredentialsEmailProps {
  userName: string;
  email: string;
  password: string;
  adminUrl: string;
  siteUrl: string;
}

export function UserCredentialsEmail({
  userName,
  email,
  password,
  adminUrl,
  siteUrl,
}: UserCredentialsEmailProps) {
  const previewText = `Tus credenciales de acceso al panel de Thinko Consulting`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Text style={headerTitle}>Thinko Consulting</Text>
            <Text style={headerSubtitle}>Panel de Administración</Text>
          </Section>

          <Hr style={hr} />

          {/* Welcome */}
          <Section style={section}>
            <Text style={heading}>¡Hola {userName}!</Text>
            <Text style={text}>
              Te hemos creado una cuenta en el panel de administración de Thinko Consulting. A continuación encontrarás tus credenciales de acceso.
            </Text>
          </Section>

          {/* Credentials Box */}
          <Section style={credentialsBox}>
            <Text style={credentialsLabel}>Correo electrónico:</Text>
            <Text style={credentialsValue}>{email}</Text>

            <Text style={credentialsLabel} className="mt-4">
              Contraseña temporal:
            </Text>
            <Text style={credentialsValue}>{password}</Text>
          </Section>

          {/* Instructions */}
          <Section style={section}>
            <Text style={heading}>Próximos pasos</Text>
            <Text style={text}>
              1. Accede al panel usando el formulario de inicio de sesión en el siguiente enlace
            </Text>
            <Text style={text} className="ml-4">
              <Link href={`${adminUrl}/login`} style={link}>
                {adminUrl}/login
              </Link>
            </Text>

            <Text style={text}>
              2. Una vez iniciada sesión, deberás cambiar tu contraseña por una más segura. Dirígete a la sección de configuración de tu perfil para hacerlo.
            </Text>

            <Text style={text}>
              3. Desde el panel podrás:
            </Text>
            <Text style={text} className="ml-4">
              • Editar los textos del sitio web<br />
              • Gestionar publicaciones del blog<br />
              • Configurar códigos de seguimiento (Google Analytics, Meta Pixel, etc.)
            </Text>
          </Section>

          <Hr style={hr} />

          {/* Security notice */}
          <Section style={securityBox}>
            <Text style={securityText}>
              <strong>Nota de seguridad:</strong> Esta contraseña es temporal y ha sido generada por el administrador del sistema. Por tu seguridad, cámbiala en tu primer acceso al panel.
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Si no creaste esta cuenta o tienes dudas, contacta directamente con el administrador del sitio.
            </Text>
            <Text style={footerText}>
              © 2024 Thinko Consulting. Todos los derechos reservados.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Estilos
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0",
  marginBottom: "64px",
};

const header = {
  backgroundColor: "#0f172a",
  padding: "32px 0",
  textAlign: "center" as const,
};

const headerTitle = {
  color: "#ffffff",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "0",
  padding: "0",
};

const headerSubtitle = {
  color: "#00b8b4",
  fontSize: "12px",
  textTransform: "uppercase" as const,
  letterSpacing: "0.3em",
  margin: "8px 0 0 0",
  padding: "0",
};

const section = {
  padding: "32px 24px",
};

const heading = {
  color: "#0f172a",
  fontSize: "20px",
  fontWeight: "bold",
  margin: "0 0 16px 0",
  padding: "0",
};

const text = {
  color: "#525252",
  fontSize: "14px",
  lineHeight: "1.6",
  margin: "12px 0",
  padding: "0",
};

const credentialsBox = {
  backgroundColor: "#f3f4f6",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  padding: "24px",
  margin: "24px 24px",
};

const credentialsLabel = {
  color: "#6b7280",
  fontSize: "12px",
  fontWeight: "600",
  textTransform: "uppercase" as const,
  letterSpacing: "0.05em",
  margin: "0 0 8px 0",
  padding: "0",
};

const credentialsValue = {
  color: "#0f172a",
  fontSize: "16px",
  fontWeight: "bold",
  fontFamily: 'Monaco, "Courier New", monospace',
  margin: "0 0 16px 0",
  padding: "12px",
  backgroundColor: "#ffffff",
  borderRadius: "4px",
  border: "1px solid #d1d5db",
  wordBreak: "break-all" as const,
};

const link = {
  color: "#00b8b4",
  textDecoration: "underline",
};

const securityBox = {
  backgroundColor: "#fef3c7",
  border: "1px solid #fcd34d",
  borderRadius: "8px",
  padding: "16px 24px",
  margin: "24px 24px",
};

const securityText = {
  color: "#78350f",
  fontSize: "13px",
  lineHeight: "1.6",
  margin: "0",
  padding: "0",
};

const hr = {
  borderColor: "#e5e7eb",
  margin: "32px 0",
};

const footer = {
  padding: "24px",
  textAlign: "center" as const,
};

const footerText = {
  color: "#9ca3af",
  fontSize: "12px",
  lineHeight: "1.5",
  margin: "8px 0",
  padding: "0",
};
