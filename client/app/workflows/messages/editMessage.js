Template.editMessage.helpers({
  message: function() {
    return Messages.findOne(Session.get('selectedGroupId'));
  },
  queue: function(){
    return this.queue ? 'checked' : '';
  }
});


Template.editMessage.events = {
    'change [id=queue]': function(event) {
	var queue = $(event.target).is(':checked');
	messages.update(this._id, {$set: {queue: checked}});
    },

  'click input[type=submit]': function(e) {
    e.preventDefault();

    var selectedGroupId = Session.get('selectedGroupId');
    var message = Messages.findOne(selectedGroupId);

    var properties = {
      subject:         $('#subject').val(),
      body:           $('#body').val(),
      queue:          $('#queue').val(),
      delay:         $('#delay').val(),
    };

    Messages.update(selectedGroupId, {$set: properties}, function(error) {
      if (error) {
        alert(error.reason);
      }
    });
  },
  'click .delete-link': function(e) {
    e.preventDefault();
    if(confirm("Are you sure?")) {
      var selectedGroupId = Session.get('selectedGroupId');
      Messages.remove(selectedGroupId);
    }
  }
};
