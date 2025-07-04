
export default function UserRegistrationConfirmation(props: { name: string }) {
  return (
    <html>
      <head>
        <title>User Registration Confirmation</title>
      </head>
      <body>
        <h1>Hello {props.name} 👋🏿</h1>
        <p>
          Thank you for registering on our platform. Please click the button below to confirm your email address.
        </p>
        <button>Confirm Email</button>
      </body>
    </html>
  )
}