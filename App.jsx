const React = require('react');
const Matter = require('matter-js');

const data = require('./data.json');

require('./index.pcss');

module.exports = class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			blocks: [],
			frames: 0,
			bodies: [],
		};

		this.world = Matter.World.create({
			gravity: {x: 0, y: 0.1},
		});
		this.engine = Matter.Engine.create({world: this.world});
		Matter.World.add(this.engine.world, [
			Matter.Bodies.rectangle(50, 50, 10, 10),
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

		setInterval(this.handleTick, 33);
	}

	handleTick = () => {
		const bodies = Matter.Composite.allBodies(this.engine.world);
		this.setState({
			bodies,
		});
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
				{this.state.bodies
					.filter(({label}) => label !== 'wall')
					.map((body) => (
						<path
							d={`M ${body.vertices
								.map(({x, y}) => `${x} ${y}`)
								.join(' L ')} Z`}
							fill="red"
						/>
					))}
			</svg>
		);
	}
};
