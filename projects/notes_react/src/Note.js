var Note = React.createClass({
         getInitialState: function() {
            return {
               editing: false
            }
         },
         componentWillMount: function() {
            this.style = {
               right: this.randomBetween(0, window.innerWidth - 150) + 'px',
               top: this.randomBetween(0, window.innerHeight - 150) + 'px',
               transform: 'rotate(' + this.randomBetween(-10, 10) + 'deg)'
            }
         },
         componentDidMount: function() {
            $(ReactDOM.findDOMNode(this)).draggable();
         },
         randomBetween: function(min, max) {
            return (min + Math.ceil(Math.random() * max));
         },
         edit: function() {
            this.setState({ editing: true });
         },
         save: function() {
            this.props.onChange(this.refs.newText.value, this.props.index);
            this.setState({ editing: false });
         },
         remove: function() {
            this.props.onRemove(this.props.index);
         },
         renderDisplay: function() {
            return (
               <div className="note"
                     style={this.style}>
                  <div className="noteBox">
                     <div className="text">{this.props.children}</div>
                     <div className="actions">
                        <button onClick={this.edit}
                                 className="btn btn-sm btn-primary glyphicon glyphicon-pencil" />
                        <button onClick={this.remove} 
                                 className="btn btn-sm btn-danger glyphicon glyphicon-trash" />
                     </div>
                  </div>
               </div>)
         },
         renderForm: function() {
            return (
               <div className="note"
                     style={this.style}>
                  <div className="noteBox">
                     <textarea ref="newText"
                              defaultValue={this.props.children}
                              className="form-control"></textarea>
                     <div className="actions">
                        <button onClick={this.save}
                                 className="btn btn-sm btn-success glyphicon glyphicon-floppy-disk" />
                     </div>
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