export default function UserRegistrationConfirmation(props: { name: string; verificationUrl: string }) {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Verify your email - ImagineStory</title>
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
            borderRadius: '16px',
            overflow: 'hidden',
            marginTop: '40px',
            marginBottom: '40px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          }}
        >
          {/* Header */}
          <tr>
            <td style={{
              background: 'linear-gradient(135deg, #2F6B4F 0%, #7FB8A0 100%)',
              padding: '40px 20px',
              textAlign: 'center',
            }}>
              <h1 style={{
                color: '#ffffff',
                fontSize: '28px',
                fontWeight: 'bold',
                margin: 0,
              }}>
                ImagineStory
              </h1>
            </td>
          </tr>

          {/* Content */}
          <tr>
            <td style={{ padding: '40px 30px' }}>
              <h2 style={{
                color: '#1F3D2B',
                fontSize: '24px',
                fontWeight: 'bold',
                marginTop: 0,
                marginBottom: '20px',
              }}>
                Hello {props.name}!
              </h2>

              <p style={{
                color: '#4A6B5A',
                fontSize: '16px',
                lineHeight: '1.6',
                marginBottom: '20px',
              }}>
                Thank you for creating your ImagineStory account! To start creating magical stories for your children, please verify your email address by clicking the button below.
              </p>

              {/* CTA Button */}
              <table role="presentation" style={{ margin: '30px auto' }}>
                <tr>
                  <td>
                    <a
                      href={props.verificationUrl}
                      style={{
                        display: 'inline-block',
                        backgroundColor: '#2F6B4F',
                        color: '#ffffff',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        textDecoration: 'none',
                        padding: '16px 40px',
                        borderRadius: '30px',
                        boxShadow: '0 4px 15px rgba(47, 107, 79, 0.3)',
                      }}
                    >
                      Verify my email
                    </a>
                  </td>
                </tr>
              </table>

              <p style={{
                color: '#8BA598',
                fontSize: '14px',
                lineHeight: '1.6',
                marginTop: '30px',
              }}>
                This link will expire in 24 hours. If you didn't create an account on ImagineStory, you can safely ignore this email.
              </p>

              {/* Fallback link */}
              <p style={{
                color: '#8BA598',
                fontSize: '12px',
                lineHeight: '1.6',
                marginTop: '20px',
                wordBreak: 'break-all',
              }}>
                If the button doesn't work, copy and paste this link into your browser:
                <br />
                <a href={props.verificationUrl} style={{ color: '#2F6B4F' }}>
                  {props.verificationUrl}
                </a>
              </p>
            </td>
          </tr>

          {/* Footer */}
          <tr>
            <td style={{
              backgroundColor: '#f8f8f8',
              padding: '20px 30px',
              textAlign: 'center',
            }}>
              <p style={{
                color: '#8BA598',
                fontSize: '12px',
                margin: 0,
              }}>
                ImagineStory - Magical stories for little dreamers
              </p>
            </td>
          </tr>
        </table>
      </body>
    </html>
  )
}
