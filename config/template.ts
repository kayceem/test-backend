export const template = {

  EmailTemplate: {
    SendUserNameAndPasswordForAuthor: {
      code: "AUTHORIZE_AUTHOR",
      name: "Horizon School - Update on your account ",
      numOfVariable: 3,
      default: `<p>Dear Author {0},</p>
        <br>
        <p>Welcome to the Horizon School!</p>
        <p>Your account information to login follow bellow:</p>
        <p>- <b>username</b>: {1}</p>
        <p>- <b>password</b>: {2}</p>
        <p>You should change your password after login to secure your account./p>
        <br>
        <p>Best regards,</p>
        <p>Horizon School</p>
        <br>
        <p><i>Note: This email is automatically generated. Please do not reply</i></p>`,
    },
    ReplyToFeedback: {
      code: "ReplyToCustomerFeedback",
      name: "Horizon School - Reply to customer feedback",
      description: "Email template for replying to customer feedback",
      numOfVariable: 1,
      default: `<p>Dear Customer,</p>
        <br>
        <p>Thank you for your feedback.</p>
        <p>Here is our response to your feedback:</p>
        <p>{0}</p>
        <br>
        <p>Best regards,</p>
        <p>Horizon School</p>
        <br>
        <p><i>Please note: This email is automatically generated. Please do not reply.</i></p>`,
    },
    ResetPassword: {
      code: "ResetPassword",
      name: "Horizon School - Reset Password",
      description: "Email template for reset password",
      numOfVariable: 2,
      default: `<p>Dear User,</p>
        <br>
        <p>You requested a password reset!</p>
        <p>Token: <i>{0}<i></p>
        <p>Click this <a href="{1}">Link Here</a> to set a new password.</p>
        <br>
        <p>Best regards,</p>
        <p>Horizon School</p>
        <br>
        <p><i>Please note: This email is automatically generated. Please do not reply.</i></p>`,
    },
  },
};
