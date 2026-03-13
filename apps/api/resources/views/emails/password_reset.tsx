export default function PasswordResetEmail(props: { name: string; resetUrl: string }) {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Réinitialiser votre mot de passe - Mon petit Conteur</title>
      </head>
      <body style={{
        margin: 0,
        padding: 0,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        backgroundColor: '#f5f5f5',
      }}>
        <table
          role="presentation"
          style={{
            width: '100%',
            maxWidth: '600px',
            margin: '0 auto',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            overflow: 'hidden',
            marginTop: '40px',
            marginBottom: '40px',
          }}
        >
          <tr>
            <td style={{
              padding: '40px 32px',
              textAlign: 'center',
              backgroundColor: '#2F6B4F',
            }}>
              <h1 style={{
                color: '#ffffff',
                fontSize: '24px',
                fontWeight: '700',
                margin: 0,
              }}>
                Mon petit Conteur
              </h1>
            </td>
          </tr>
          <tr>
            <td style={{ padding: '32px' }}>
              <h2 style={{
                color: '#1F3D2B',
                fontSize: '20px',
                fontWeight: '600',
                marginTop: 0,
              }}>
                Bonjour {props.name} !
              </h2>
              <p style={{
                color: '#555555',
                fontSize: '16px',
                lineHeight: '24px',
              }}>
                Vous avez demandé la réinitialisation de votre mot de passe.
                Cliquez sur le bouton ci-dessous pour en choisir un nouveau :
              </p>
              <table role="presentation" style={{ margin: '32px auto' }}>
                <tr>
                  <td style={{
                    backgroundColor: '#2F6B4F',
                    borderRadius: '8px',
                    textAlign: 'center',
                  }}>
                    <a
                      href={props.resetUrl}
                      style={{
                        display: 'inline-block',
                        padding: '14px 32px',
                        color: '#ffffff',
                        fontSize: '16px',
                        fontWeight: '600',
                        textDecoration: 'none',
                      }}
                    >
                      Réinitialiser mon mot de passe
                    </a>
                  </td>
                </tr>
              </table>
              <p style={{
                color: '#999999',
                fontSize: '14px',
                lineHeight: '20px',
              }}>
                Ce lien expire dans 1 heure. Si vous n'avez pas demandé cette réinitialisation,
                vous pouvez ignorer cet email en toute sécurité.
              </p>
            </td>
          </tr>
        </table>
      </body>
    </html>
  )
}
