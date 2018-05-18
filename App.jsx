const React = require('react');

module.exports = class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			rows: [],
		};
	}

	render() {
		return (
			<div>Hello, World!</div>
		);
	}
};
