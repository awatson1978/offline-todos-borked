


//==============================================================
//  Communication
//  Client controls group to select.
//  Server controls "from" sender as current user.
//  TODO: save subject and message to groupId
//  TODO: security on email to prevent spamming
//  SendEmail is server side only.
//  Logic on the server side.
//  Emails: https://www.discovermeteor.com/blog/wrapping-npm-packages/
//  Spacebars: https://github.com/meteor/meteor/blob/devel/packages/spacebars/README.md
//
//
Template.sendMessages.helpers({
    messages: function() {
	return Messages.findOne({'groupId': Session.get('selectedGroupId')});
    }
});


Template.sendMessages.events({
    'click #sendMessagesButton': function() {

  // In your client code: asynchronously send an email

	var subject = $('#subject').val();
	var message = $('#message').val();
	var groupId = Session.get('selectedGroupId');

	console.log("subject: ", subject);
	console.log("message: ", message);
	
	Meteor.call('sendMessages',
		    groupId,
		    subject,
		    message);
    }
});
