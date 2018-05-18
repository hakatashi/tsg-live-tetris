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
			blocks: [{id: 'hoge'}],
			bodies: [],
		};

		this.world = Matter.World.create({
			gravity: {
				x: 0,
				y: 0.1,
			},
		});
		this.engine = Matter.Engine.create({world: this.world});
		const ground = Matter.Bodies.rectangle(50, 250, 300, 100, {
			isStatic: true,
			label: 'wall',
		});
		const wall1 = Matter.Bodies.rectangle(150, 0, 100, 400, {
			isStatic: true,
			label: 'wall',
		});
		const wall2 = Matter.Bodies.rectangle(-50, 0, 100, 400, {
			isStatic: true,
			label: 'wall',
		});
		Matter.World.add(this.engine.world, [
			...Array(15)
				.fill()
				.map(() => {
					const mino = sample(data.minos);
					return Matter.Bodies.fromVertices(
						Math.random() * 100,
						Math.random() * 200,
						mino.vertices,
						{
							label: 'box',
							mino,
						}
					);
				}),
			ground,
			wall1,
			wall2,
		]);
		Matter.Engine.run(this.engine);

		setInterval(this.handleTick, 16);
	}

	handleTick = () => {
		const bodies = Matter.Composite.allBodies(this.engine.world);
		const box = bodies.find(({label}) => label === 'box');
		this.setState({
			bodies: bodies.filter(({label}) => label !== 'wall'),
		});
	};

	render() {
		return (
			<svg viewBox="0 0 100 200" className="blocks">
				<rect
					fill="none"
					stroke="grey"
					x="0"
					y="0"
					width="100"
					height="200"
				/>
				{this.state.bodies.map((body, index) => (
					<g key={index}>
						{(body.parts.length === 1
							? body.parts
							: body.parts.slice(1)
						).map((part, partIndex) => (
							<path
								key={partIndex}
								fill={part.mino.color}
								d={`M ${part.vertices
									.map(({x, y}) => `${x} ${y}`)
									.join(' L ')} Z`}
							/>
						))}
					</g>
				))}
			</svg>
		);
	}
};
