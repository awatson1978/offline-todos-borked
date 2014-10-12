// if the database is empty on server start, create some sample data.
Meteor.startup(function () {
  if (Lists.find().count() === 0) {
    var data = [
      {name: "Grove Installation",
       items: ["Unpack supplies.",
         "Select location for grove appliance.",
         "Connect appliance to water line and electrical outlet.",
         "Fill net pots with hydroton clay.",
         "Place seeds in rock wool.",
         "Put rock wool in net pots with hydroton clay.",
         "Connect lights and sensors."
       ]
      },
      {name: "Grove Maintenance",
       items: ["Check water connections.",
         "Check water connections.",
         "Change water.",
         "Check pH levels",
         "Unpower appliance and power it back on."
         ]
      }
    ];

    var timestamp = (new Date()).getTime();
    _.each(data, function(list) {
      var list_id = Lists.insert({name: list.name,
        incompleteCount: list.items.length});

      _.each(list.items, function(text) {
        Todos.insert({listId: list_id,
                      text: text,
                      createdAt: new Date(timestamp)});
        timestamp += 1; // ensure unique timestamp.
      });
    });
  }
});
