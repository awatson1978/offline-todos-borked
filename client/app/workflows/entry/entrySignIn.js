var ERRORS_KEY = 'signinErrors';

Template.entrySignIn.created = function() {
  Session.set(ERRORS_KEY, {});
};

Template.entrySignIn.helpers({
  errorMessages: function() {
    return _.values(Session.get(ERRORS_KEY));
  },
  errorClass: function(key) {
    return Session.get(ERRORS_KEY)[key] && 'error';
  }
});

Template.entrySignIn.events({
  'click #signInWithGoogleButton':function(){
    Meteor.loginWithGoogle(
      {
        requestPermissions: [
          'profile',
          'email',
          'https://www.googleapis.com/auth/plus.login',
          'https://www.googleapis.com/auth/plus.profile.emails.read',
          'https://www.google.com/m8/feeds'],
        requestOfflineToken: 'true'
      }, Router.go('/'));
      // Meteor.loginWithGoogle(
      //   {
      //     requestPermissions: [
      //     'profile',
      //     'email',
      //     'verified_email',
      //     'https://www.googleapis.com/auth/plus.login',
      //     'https://www.googleapis.com/auth/yt-analytics.readonly',
      //     'https://www.googleapis.com/auth/youtube',
      //     'https://picasaweb.google.com/data/'],
      //     requestOfflineToken: 'true'
      //   }, Router.go('/'));
  },
  'submit': function(event, template) {
    event.preventDefault();

    var email = template.$('[name=email]').val();
    var password = template.$('[name=password]').val();

    var errors = {};

    if (! email) {
      errors.email = 'Email is required';
    }

    if (! password) {
      errors.password = 'Password is required';
    }

    Session.set(ERRORS_KEY, errors);
    if (_.keys(errors).length) {
      return;
    }

    Meteor.loginWithPassword(email, password, function(error) {
      if (error) {
        return Session.set(ERRORS_KEY, {'none': error.reason});
      }

      Router.go('home');
    });
    
  }
});
