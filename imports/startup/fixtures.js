import { Meteor } from 'meteor/meteor';
import { Parties } from '../api/parties';
import { Trans } from '../api/trans';

Meteor.startup(() => {
	//sparkpost config
	/*
	smtp = {
		username: 'SMTP_Injection',
		password: '95be9d025f7ae1a64a47d1ad0dcd46241e02e664',
		server:   'smtp.sparkpostmail.com',
		port: 587
	}
	
	process.env.MAIL_URL = 'smtp://' + encodeURIComponent(smtp.username) + ':' + encodeURIComponent(smtp.password) + '@' + encodeURIComponent(smtp.server) + ':' + smtp.port;
	*/
  
});
