var Board = React.createClass({displayName: "Board",
   getInitialState: function() {
      notes: [
         'hello', 
         'hello2',
         'hello33'
      ]
   },
   render: function() {
      var notes = this.state.notes.map(function(note) {
         return (
            React.createElement(Note, {note: note})
         );
      });
      return (
         React.createElement("div", null, 
            notes
         )
      )
   }
});