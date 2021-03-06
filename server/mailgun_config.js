Meteor.startup(function(){
    Meteor.Mailgun.config({
      username: 'noreply@hipyo.net',
      password: 'ya12355'
    });
});

Meteor.methods({
	sendEmail: function (mailFields) {
		// console.log("about to send email...");
		check([mailFields.to, mailFields.from, mailFields.subject, mailFields.text, mailFields.html], [String]);

		// Let other method calls from the same client start running,
		// without waiting for the email sending to complete.
		this.unblock();

		Meteor.Mailgun.send({
			to: mailFields.to,
			from: mailFields.from,
			subject: mailFields.subject,
			text: mailFields.text,
			html: mailFields.html
		});
		// console.log("email sent!");
	}
});
