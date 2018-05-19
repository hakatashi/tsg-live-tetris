const React = require('react');

const data = require('./data.json');

require('./index.pcss');

module.exports = class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			blocks: [],
			blockX: 50,
			blockY: 30,
			blockType: 'Z',
		};

		setInterval(this.handleTick, 33);
	}

	handleTick = () => {
		this.setState(({blockY}) => ({
			blockY: blockY + 1,
		}));
	};

	render() {
		return (
			<svg width="100%" height="100%" viewBox="0 0 100 200">
				{this.state.blocks.map((block, index) => (
					<rect
						key={index}
						x={block.x * 10}
						y={block.y * 10}
						width="10"
						height="10"
						fill={['red', 'blue', 'yellow'][block.type]}
					/>
				))}
				{this.state.blockType && (
					<path
						d={`M ${data.minos[this.state.blockType].vertices
							.map(({x, y}) => `${x} ${y}`)
							.join(' L ')} Z`}
						fill={data.minos[this.state.blockType].color}
						transform={`translate(${this.state.blockX}, ${
							this.state.blockY
						})`}
					/>
				)}
			</svg>
		);
	}
};
