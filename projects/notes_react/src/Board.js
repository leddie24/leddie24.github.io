var Board = React.createClass({
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
                  <Note key={note.id}
                        index={i}
                        onChange={this.update}
                        onRemove={this.remove}
                  >{note.note}</Note>
            );
         },
         render: function() {
            return (
               <div className="board">
                  {this.state.notes.map(this.eachNote)}
                  <button className="btn btn-sm glyphicon glyphicon-plus" 
                           onClick={this.add.bind(null, '')} />
               </div>
            )
         }
      });