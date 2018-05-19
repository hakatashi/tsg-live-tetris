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
			tempBlock: sample(Object.keys(data.minos)),
			flyingBlock: null,
		};
	}

	handleTick = () => {
		const bodies = Matter.Composite.allBodies(this.engine.world);
		const mino = bodies.find(({label}) => label === 'mino');
		const velocity = Math.sqrt(mino.velocity.x ** 2 + mino.velocity.y ** 2);

		if (velocity < 0.00001) {
			if (this.state.flyingBlock === null) {
				return;
			}

			const {
				angle,
				position: {x, y},
			} = mino;

			const fixedX = Math.floor(x / 10 + 0.5);
			const fixedY = Math.floor(y / 10 + 0.5);
			const fixedAngle =
				(Math.floor(angle / (Math.PI / 2) + 0.5) + 4) % 4;

			const rotatedBlocks = data.minos[this.state.flyingBlock].blocks.map(
				({x, y}) => {
					if (fixedAngle === 0) {
						return {x, y};
					} else if (fixedAngle === 1) {
						return {x: -y, y: x};
					} else if (fixedAngle === 2) {
						return {x: -x, y: -y};
					} else if (fixedAngle === 3) {
						return {x: y + 1, y: -x - 1};
					}
				}
			);

			const shiftedBlocks = rotatedBlocks.map((block) => ({
				x: block.x + fixedX,
				y: block.y + fixedY,
			}));

			this.setState(({blocks}) => ({
				tempBlock: sample(Object.keys(data.minos)),
				flyingBlock: null,
				bodies: [],
				blocks: blocks.concat(shiftedBlocks),
			}));
		} else {
			this.setState({
				bodies,
			});
		}
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
				label: 'mino',
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
			...this.state.blocks.map(({x, y}) => Matter.Bodies.rectangle(x * 10 + 5, y * 10 + 5, 10, 10, {
				isStatic: true,
				label: 'wall',
			})),
		]);

		Matter.Engine.run(this.engine);

		this.setState(({tempBlock}) => ({
			tempBlock: null,
			flyingBlock: tempBlock,
		}));

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
