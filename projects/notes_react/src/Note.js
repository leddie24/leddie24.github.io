var Note = React.createClass({
         getInitialState: function() {
            return {
               editing: false,
               editText: ''
            }
         },
         componentWillMount: function() {
            this.style = {
               right: this.randomBetween(0, window.innerWidth - 200) + 'px',
               top: this.randomBetween(0, window.innerHeight - 200) + 'px',
               transform: 'rotate(' + this.randomBetween(-10, 10) + 'deg)'
            }
         },
         componentDidMount: function() {
            $(ReactDOM.findDOMNode(this)).draggable();
         },
         randomBetween: function(min, max) {
            return (min + Math.ceil(Math.random() * max));
         },
         updateTextState: function(event) {
            this.setState({ editText: event.target.value })
         },
         edit: function(text) {
            this.setState({
               editing: true,
               editText: text
            });
         },
         fixCaret: function(event) { 
            var text = event.target.value;
            event.target.value = '';
            event.target.value = text;
         },
         save: function() {
            this.props.onChange(this.state.editText, this.props.index);
            this.setState({ editing: false });
         },
         remove: function() {
            this.props.onRemove(this.props.index);
         },
         renderDisplay: function() {
            return (
               <div className="note"
                     style={this.style}>
                  <div className="text">{this.props.children}</div>
                  <div className="actions">
                     <button onClick={this.edit.bind(null, this.props.children)}
                              className="btn btn-sm btn-primary glyphicon glyphicon-pencil" />
                     <button onClick={this.remove} 
                              className="btn btn-sm btn-danger glyphicon glyphicon-trash" />
                  </div>
               </div>)
         },
         renderForm: function() {
            return (
               <div className="note"
                     style={this.style}>
                  <textarea autoFocus
                           onFocus={this.fixCaret}
                           onChange={this.updateTextState}
                           defaultValue={this.state.editText}
                           className="form-control"></textarea>
                  <div className="actions">
                     <button onClick={this.save}
                              className="btn btn-sm btn-success glyphicon glyphicon-floppy-disk" />
                  </div>
               </div>
            )
         },
         render: function() {
            if (this.state.editing) {
               return this.renderForm();
            } else {
               return this.renderDisplay();
            }
         }
      });