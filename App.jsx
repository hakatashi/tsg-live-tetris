const React = require('react');

module.exports = class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			blocks: [{x: 0, y: 0}, {x: 0, y: 1}, {x: 0, y: 2}],
		};
	}

	render() {
		return (
			<svg>
				{this.state.blocks.map((block, index) => (
					<rect
						key={index}
						x={block.x * 10}
						y={block.y * 10}
						width="10"
						height="10"
						fill="red"
					/>
				))}
			</svg>
		);
	}
};
