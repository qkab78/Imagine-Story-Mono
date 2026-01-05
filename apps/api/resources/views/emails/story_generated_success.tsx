export interface StoryGeneratedSuccessEmailProps {
  recipientName: string
  storyTitle: string
  storyUrl: string
}

export default function StoryGeneratedSuccessEmail(props: StoryGeneratedSuccessEmailProps) {
  return (
    <html>
      <head>
        <title>Votre histoire est prête !</title>
        <meta charset="utf-8" />
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">📖 Votre histoire est prête !</h1>
        </div>

        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
          <p style="font-size: 16px; margin-bottom: 20px;">
            Bonjour <strong>{props.recipientName}</strong>,
          </p>

          <p style="font-size: 16px; margin-bottom: 20px;">
            Bonne nouvelle ! Votre histoire <strong>"{props.storyTitle}"</strong> a été générée avec succès et vous attend.
          </p>

          <div style="text-align: center; margin: 30px 0;">
            <a
              href={props.storyUrl}
              style="display: inline-block; background: #667eea; color: white; text-decoration: none; padding: 15px 40px; border-radius: 5px; font-weight: bold; font-size: 16px;"
            >
              Découvrir mon histoire
            </a>
          </div>

          <p style="font-size: 14px; color: #666; margin-top: 30px;">
            Nous espérons que cette histoire enchantera votre enfant !
          </p>

          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;" />

          <p style="font-size: 12px; color: #999; text-align: center;">
            Imagine Story - Créez des histoires magiques pour vos enfants<br />
            Vous recevez cet email car vous avez demandé la génération d'une histoire.
          </p>
        </div>
      </body>
    </html>
  )
}
