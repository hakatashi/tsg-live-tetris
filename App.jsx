const React = require('react');
const decomp = require('poly-decomp');
window.decomp = decomp;
const Matter = require('matter-js');
const sample = require('lodash/sample');

const data = require('./data.json');

require('./index.pcss');

module.exports = class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			blocks: [],
			frames: 0,
			bodies: [],
			tempBlock: 'T',
		};
	}

	handleTick = () => {
		const bodies = Matter.Composite.allBodies(this.engine.world);
		this.setState({
			bodies,
		});
	};

	handleClick = () => {
		this.world = Matter.World.create({
			gravity: {x: 0, y: 0.1},
		});

		this.engine = Matter.Engine.create({world: this.world});
		const mino = Matter.Bodies.fromVertices(
			50,
			10,
			data.minos[this.state.tempBlock].vertices,
			{
				mino: data.minos[this.state.tempBlock],
			}
		);
		Matter.Body.setVelocity(mino, {x: 1, y: 1});
		Matter.World.add(this.engine.world, [
			mino,
			Matter.Bodies.rectangle(50, 210, 200, 20, {
				isStatic: true,
				label: 'wall',
			}),
			Matter.Bodies.rectangle(110, 0, 20, 400, {
				isStatic: true,
				label: 'wall',
			}),
			Matter.Bodies.rectangle(-10, 0, 20, 400, {
				isStatic: true,
				label: 'wall',
			}),
		]);

		Matter.Engine.run(this.engine);

		this.setState({
			tempBlock: null,
		});

		setInterval(this.handleTick, 33);
	};

	render() {
		return (
			<svg width="100%" height="100%" viewBox="0 0 100 200">
				<rect
					x="0"
					y="0"
					width="100"
					height="200"
					fill="none"
					stroke="grey"
				/>
				{this.state.tempBlock && (
					<path
						d={`M ${data.minos[this.state.tempBlock].vertices
							.map(({x, y}) => `${x} ${y}`)
							.join(' L ')} Z`}
						fill={data.minos[this.state.tempBlock].color}
						transform="translate(50, 10)"
						onClick={this.handleClick}
						style={{
							cursor: 'pointer',
						}}
					/>
				)}
				{this.state.bodies
					.filter(({label}) => label !== 'wall')
					.map((body, index) => (
						<g key={index}>
							{(body.parts.length === 1
								? body.parts
								: body.parts.slice(1)
							).map((part, partIndex) => (
								<path
									key={partIndex}
									d={`M ${part.vertices
										.map(({x, y}) => `${x} ${y}`)
										.join(' L ')} Z`}
									fill={part.mino.color}
								/>
							))}
						</g>
					))}
			</svg>
		);
	}
};
