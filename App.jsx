const React = require('react');

require('./index.pcss');

module.exports = class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			blocks: [{id: 'hoge'}],
		};
	}

	render() {
		return (
			<svg
				viewBox="0 0 100 200"
				className="blocks"
			>
				<rect
					fill="none"
					stroke="grey"
					x="0"
					y="0"
					width="100"
					height="200"
				/>
				{this.state.blocks.map((block) => (
					<rect
						key={block.id}
						fill="red"
						x="0"
						y="0"
						width="10"
						height="10"
					/>
				))}
			</svg>
		);
	}
};
