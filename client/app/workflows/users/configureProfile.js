

Template.configureProfile.events({
  'click #importGoogleContactsButton': function() {
      Meteor.call('importGoogleContacts');
  }
});
