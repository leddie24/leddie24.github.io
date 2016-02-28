var Board = React.createClass({displayName: "Board",
         getInitialState: function() {
            return {
                  notes: []
            }
         },
         nextId: function() {
            this.uniqueId = this.uniqueId || 0;
            return this.uniqueId++;
         },
         add: function(text) {
            var arr = this.state.notes;
            arr.push({
               id: this.nextId(),
               note: text
            });
            this.setState({notes: arr});
         },
         componentWillMount: function() {
            var self = this;
         },
         update: function(newText, i) {
            var arr = this.state.notes;
            arr[i].note = newText;
            this.setState({notes: arr});
         },
         remove: function(i) {
            var arr = this.state.notes;
            arr.splice(i, 1);
            this.setState({notes: arr});
         },
         eachNote: function(note, i) {
            return (
                  React.createElement(Note, {key: note.id, 
                        index: i, 
                        onChange: this.update, 
                        onRemove: this.remove
                  }, note.note)
            );
         },
         render: function() {
            return (
               React.createElement("div", {className: "board"}, 
                  this.state.notes.map(this.eachNote), 
                  React.createElement("button", {className: "btn btn-sm glyphicon glyphicon-plus", 
                           onClick: this.add.bind(null, '')})
               )
            )
         }
      });