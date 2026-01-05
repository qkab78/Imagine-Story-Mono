export interface StoryGenerationFailedEmailProps {
  recipientName: string
  errorMessage: string
  retryUrl: string
}

export default function StoryGenerationFailedEmail(props: StoryGenerationFailedEmailProps) {
  return (
    <html>
      <head>
        <title>Problème lors de la génération</title>
        <meta charset="utf-8" />
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">⚠️ Un problème est survenu</h1>
        </div>

        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
          <p style="font-size: 16px; margin-bottom: 20px;">
            Bonjour <strong>{props.recipientName}</strong>,
          </p>

          <p style="font-size: 16px; margin-bottom: 20px;">
            Nous sommes désolés, mais un problème technique est survenu lors de la génération de votre histoire.
          </p>

          <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0; font-size: 14px; color: #856404;">
              <strong>Raison:</strong> {props.errorMessage || 'Erreur technique inconnue'}
            </p>
          </div>

          <p style="font-size: 16px; margin-bottom: 20px;">
            Ne vous inquiétez pas ! Vous pouvez réessayer la génération gratuitement.
          </p>

          <div style="text-align: center; margin: 30px 0;">
            <a
              href={props.retryUrl}
              style="display: inline-block; background: #667eea; color: white; text-decoration: none; padding: 15px 40px; border-radius: 5px; font-weight: bold; font-size: 16px;"
            >
              Réessayer maintenant
            </a>
          </div>

          <p style="font-size: 14px; color: #666; margin-top: 30px;">
            Si le problème persiste, n'hésitez pas à contacter notre support.
          </p>

          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;" />

          <p style="font-size: 12px; color: #999; text-align: center;">
            Imagine Story - Créez des histoires magiques pour vos enfants<br />
            Besoin d'aide ? Répondez à cet email pour contacter notre support.
          </p>
        </div>
      </body>
    </html>
  )
}
